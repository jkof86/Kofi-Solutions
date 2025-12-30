// ------------------------------------------------------------
// handleHealth.js — v1.190 (Batched + Stable + FEEDS-Safe)
// ------------------------------------------------------------

const { jsonResponse } = require("../utils/jsonResponse.js");
const { MARKET_SYMBOLS } = require("../market/marketSymbols.js");
const feedsModule = require("../config/feedsMap.js");
const { handleMarket } = require("./handleMarket.js");
const { handleFeed } = require("./handleFeed.js");

const FEEDS = feedsModule?.FEEDS;

function normalizeSymbol(sym) {
  return String(sym || "")
    .trim()
    .toLowerCase()
    .replace(/\./g, "-");
}

// simple concurrency limiter (batch size 3)
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
    console.log("[health] Starting feed processing");

    // FEED HEALTH (batched, concurrency 3)
    const feedIds = Object.keys(FEEDS);

    const feedResults = await runBatched(
      feedIds,
      async (feedId) => {
        const feedConfig = FEEDS[feedId];
        const result = await handleFeed(feedConfig, { test: "health" });

        return {
          status: result?.status || "error",
          fallback: result?.status === "fallback",
          count: result?.count ?? 0,
        };
      },
      3
    );

    for (const feedId of feedIds) {
      feeds[feedId] = feedResults[feedId] || {
        status: "error",
        fallback: true,
        count: 0,
      };
    }

    console.log("[health] Starting market processing");

    // MARKET HEALTH (batched, concurrency 3)
    const symbols = MARKET_SYMBOLS.map(normalizeSymbol);

    const marketResults = await runBatched(
      symbols,
      async (sym) => {
        const res = await handleMarket(sym, { test: "health" });

        // handleMarket returns jsonResponse; parse body if needed
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
        };
      },
      3
    );

    for (const sym of symbols) {
      markets[sym] = marketResults[sym] || {
        status: "error",
        type: null,
        price: null,
      };
    }

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
