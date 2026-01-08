// ------------------------------------------------------------
// handleHealth.js — v1.205 (Per‑Symbol Market + Fully Fixed)
// ------------------------------------------------------------
//
// Responsibilities:
//   ✓ Run batched feed health checks
//   ✓ Run per‑symbol market checks using handleMarket
//   ✓ Parse JSON body from handleMarket correctly
//   ✓ Preserve full market payload (price, change_24h, history, debug)
//   ✓ Preserve feed status + count
//   ✓ Never throw — always return stable JSON
//   ✓ Fully compatible with handleFeed v1.204
//   ✓ Fully compatible with handleMarket v1.196
//   ✓ Fully compatible with FeedStatusContext v1.204
//
// ------------------------------------------------------------

const { jsonResponse } = require("../utils/jsonResponse.js");
const feedsModule = require("../config/feedsMap.js");
const { MARKET_SYMBOLS } = require("../market/marketSymbols.js");
const { handleFeed } = require("./handleFeed.js");
const { handleMarket } = require("./handleMarket.js");

const FEEDS = feedsModule?.FEEDS || {};

// Normalize symbols (BRK.B → brk-b)
function normalizeSymbol(sym) {
  return String(sym || "")
    .trim()
    .toLowerCase()
    .replace(/\./g, "-");
}

// Simple concurrency limiter (batch size 3)
async function runBatched(items, worker, batchSize = 3) {
  const results = {};
  const keys = [...items];

  for (let i = 0; i < keys.length; i += batchSize) {
    const slice = keys.slice(i, i + batchSize);
    const promises = slice.map(async (key) => {
      try {
        const res = await worker(key);
        results[key] = res;
      } catch (err) {
        results[key] = { error: String(err) };
      }
    });
    await Promise.all(promises);
  }

  return results;
}

async function handleHealth(opts = {}) {
  console.log("[handleHealth] Starting health check", opts);

  if (!FEEDS || Object.keys(FEEDS).length === 0) {
    console.error("[handleHealth] FATAL: FEEDS map is empty or undefined:", FEEDS);
    return jsonResponse(200, {
      status: "error",
      error: "FEEDS map is empty — backend misconfigured",
      feeds: {},
      markets: {},
      timestamp: Date.now(),
    });
  }

  const feeds = {};
  const markets = {};

  try {
    // ------------------------------------------------------------
    // FEED HEALTH
    // ------------------------------------------------------------
    console.log("[health] Starting feed processing");

    const feedIds = Object.keys(FEEDS);

    const feedResults = await runBatched(
      feedIds,
      async (feedId) => {
        const feedConfig = FEEDS[feedId];
        const result = await handleFeed(feedConfig, { test: "health" });

        const status = result?.status || "error";
        const fallback = status === "fallback";

        return {
          status,
          fallback,
          count: result?.count ?? 0,
          ok: status === "ok" || status === "fallback",
          type: feedConfig?.type || "rss"
        };
      },
      3
    );

    for (const feedId of feedIds) {
      feeds[feedId] = feedResults[feedId] || {
        status: "error",
        fallback: false,
        count: 0,
        ok: false,
        type: FEEDS[feedId]?.type || "rss"
      };
    }

    // ------------------------------------------------------------
    // MARKET HEALTH — per‑symbol using handleMarket
    // ------------------------------------------------------------
    console.log("[health] Starting per‑symbol market processing");

    const symbols = MARKET_SYMBOLS.map(normalizeSymbol);

    const marketResults = await runBatched(
      symbols,
      async (sym) => {
        const res = await handleMarket(sym);

        // handleMarket returns { statusCode, body }
        let body = res;
        if (res && typeof res.body === "string") {
          try {
            body = JSON.parse(res.body);
          } catch {
            body = res;
          }
        }

        return {
          status: body?.status || "error",
          type: body?.type || null,
          price: body?.price ?? null,
          change_24h: body?.change_24h ?? null,
          history: Array.isArray(body?.history) ? body.history : [],
          debug: body?.debug ?? null,
          timestamp: body?.timestamp ?? Date.now()
        };
      },
      3
    );

    for (const sym of symbols) {
      markets[sym] = marketResults[sym] || {
        status: "error",
        type: null,
        price: null,
        change_24h: null,
        history: [],
        debug: null,
        timestamp: Date.now()
      };
    }

    // ------------------------------------------------------------
    // FINAL RESPONSE
    // ------------------------------------------------------------
    return jsonResponse(200, {
      status: "ok",
      feeds,
      markets,
      timestamp: Date.now(),
    });

  } catch (err) {
    console.error("[handleHealth] FATAL ERROR:", err);

    return jsonResponse(200, {
      status: "error",
      error: "Health handler crashed",
      detail: String(err),
    });
  }
}

module.exports = { handleHealth };
