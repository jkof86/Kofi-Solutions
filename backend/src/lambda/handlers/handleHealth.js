// ------------------------------------------------------------
// handleHealth.js — v1.170 (No fetchFeed, Unified Feed Checks)
// ------------------------------------------------------------

const { jsonResponse } = require("../utils/jsonResponse.js");
const { MARKET_SYMBOLS } = require("../market/marketSymbols.js");
const { FEEDS } = require("../config/feedsMap.js");
const { handleMarket } = require("./handleMarket.js");
const { handleFeed } = require("./handleFeed.js");

async function handleHealth(opts = {}) {
  console.log("[handleHealth] Starting health check", opts);

  const feeds = {};
  const markets = [];

  try {
    // ------------------------------------------------------------
    // FEED HEALTH (via handleFeed)
    // ------------------------------------------------------------
    for (const feedId of Object.keys(FEEDS)) {
      try {
        const result = await handleFeed(feedId, { test: "health" });

        feeds[feedId] = {
          ok: result?.status === "ok" || result?.status === "fallback",
          status: result?.status || "error",
          count: result?.items?.length || 0
        };
      } catch (err) {
        console.error("[Health] Feed error:", feedId, err);
        feeds[feedId] = { ok: false, status: "error", error: String(err) };
      }
    }

    // ------------------------------------------------------------
    // MARKET HEALTH
    // ------------------------------------------------------------
    for (const sym of MARKET_SYMBOLS) {
      if (!sym || typeof sym !== "string") {
        console.warn("[Health] Skipping invalid market symbol:", sym);
        continue;
      }

      try {
        const result = await handleMarket(sym);

        markets.push({
          symbol: sym,
          ok: result?.status === "ok",
          type: result?.type || null
        });
      } catch (err) {
        console.error("[Health] Market error:", sym, err);
        markets.push({
          symbol: sym,
          ok: false,
          type: null,
          error: String(err)
        });
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
