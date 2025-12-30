// ------------------------------------------------------------
// handleHealth.js — v1.180 (Stable + Normalized + FEEDS-Safe)
// ------------------------------------------------------------
//
// Improvements:
//   • Symbol normalization for market checks (BRK.B → brk-b)
//   • FEEDS v1.180 integrity logging
//   • Safe health objects for UI
//   • No crashes on malformed feed/market responses
//   • Fully aligned with handleMarket v1.180 + handleFeed v1.180
//
// ------------------------------------------------------------

const { jsonResponse } = require("../utils/jsonResponse.js");
const { MARKET_SYMBOLS } = require("../market/marketSymbols.js");
const feedsModule = require("../config/feedsMap.js");
const { handleMarket } = require("./handleMarket.js");
const { handleFeed } = require("./handleFeed.js");

const FEEDS = feedsModule?.FEEDS;

// Normalize symbols (BRK.B → brk-b)
function normalizeSymbol(sym) {
  return String(sym || "")
    .trim()
    .toLowerCase()
    .replace(/\./g, "-");
}

async function handleHealth(opts = {}) {
  console.log("[handleHealth] Starting health check", opts);

  // ------------------------------------------------------------
  // FEEDS Integrity Check
  // ------------------------------------------------------------
  if (!FEEDS || Object.keys(FEEDS).length === 0) {
    console.error("[handleHealth] FATAL: FEEDS map is empty or undefined:", FEEDS);
    return jsonResponse(200, {
      status: "error",
      error: "FEEDS map is empty — backend misconfigured",
      feeds: {},
      markets: {},
      timestamp: Date.now()
    });
  }

  const feeds = {};
  const markets = {};

  try {
    // ------------------------------------------------------------
    // FEED HEALTH
    // ------------------------------------------------------------
    for (const feedId of Object.keys(FEEDS)) {
      try {
        const result = await handleFeed(feedId, { test: "health" });

        feeds[feedId] = {
          status: result?.status || "error",
          fallback: result?.status === "fallback",
          count: Array.isArray(result?.items) ? result.items.length : 0
        };
      } catch (err) {
        console.error("[handleHealth] Feed error:", feedId, err);
        feeds[feedId] = { status: "error", fallback: true, count: 0 };
      }
    }

    // ------------------------------------------------------------
    // MARKET HEALTH
    // ------------------------------------------------------------
    for (const rawSym of MARKET_SYMBOLS) {
      const sym = normalizeSymbol(rawSym);

      try {
        const result = await handleMarket(sym);

        markets[sym] = {
          status: result?.status || "error",
          type: result?.type || null,
          price: result?.price ?? null
        };
      } catch (err) {
        console.error("[handleHealth] Market error:", sym, err);
        markets[sym] = { status: "error", type: null, price: null };
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
