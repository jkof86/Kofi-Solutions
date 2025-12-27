// ------------------------------------------------------------
// handleHealth.js — v1.171 (Frontend-Aligned Normalized Health)
// ------------------------------------------------------------

const { jsonResponse } = require("../utils/jsonResponse.js");
const { MARKET_SYMBOLS } = require("../market/marketSymbols.js");
const { FEEDS } = require("../config/feedsMap.js");
const { handleMarket } = require("./handleMarket.js");
const { handleFeed } = require("./handleFeed.js");

async function handleHealth(opts = {}) {
  console.log("[handleHealth] Starting health check", opts);

  const feeds = {};
  const markets = {};

  try {
    // ------------------------------------------------------------
    // FEED HEALTH (via handleFeed)
    // ------------------------------------------------------------
    for (const feedId of Object.keys(FEEDS)) {
      try {
        const result = await handleFeed(feedId, { test: "health" });

        feeds[feedId] = {
          status: result?.status || "error",
          fallback: result?.status === "fallback",
          count: result?.items?.length || 0
        };
      } catch (err) {
        console.error("[Health] Feed error:", feedId, err);
        feeds[feedId] = {
          status: "error",
          fallback: true,
          count: 0
        };
      }
    }

    // ------------------------------------------------------------
    // MARKET HEALTH
    // ------------------------------------------------------------
    for (const sym of MARKET_SYMBOLS) {
      if (!sym || typeof sym !== "string") continue;

      try {
        const result = await handleMarket(sym);

        markets[sym] = {
          status: result?.status || "error",
          type: result?.type || null,
          price: result?.price ?? null
        };
      } catch (err) {
        console.error("[Health] Market error:", sym, err);
        markets[sym] = {
          status: "error",
          type: null,
          price: null
        };
      }
    }

    // ------------------------------------------------------------
    // FINAL RESPONSE
    // ------------------------------------------------------------
    return jsonResponse(200, {
      status: "ok",
      feeds,
      markets,
      timestamp: Date.now()
    });

  } catch (err) {
    console.error("[handleHealth] FATAL ERROR:", err);

    return jsonResponse(200, {
      status: "error",
      error: "Health handler crashed",
      detail: String(err)
    });
  }
}

module.exports = { handleHealth };
