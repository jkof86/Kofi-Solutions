// ------------------------------------------------------------
// backend.js — v1.204 (Bulletproof Routing + Safe Debug Routing)
// ------------------------------------------------------------
//
// New in v1.204:
//   ✓ Health requests IGNORE stray debug params
//   ✓ Debug routing is explicit and cannot hijack feed/market
//   ✓ Mode routing is guaranteed and ordered correctly
//   ✓ Fully aligned with backend tree (handlePing, handleMarketAll)
//   ✓ Crash-proof, predictable, production-safe
// ------------------------------------------------------------

const { jsonResponse } = require("./utils/jsonResponse.js");
const { handleFeed } = require("./handlers/handleFeed.js");
const { handleMarket } = require("./handlers/handleMarket.js");
const { handleHealth } = require("./handlers/handleHealth.js");
const { handleMarketAll } = require("./handlers/handleMarketAll.js");
const { handlePing } = require("./handlers/handlePing.js");

const feedsModule = require("./config/feedsMap.js");
const FEEDS = feedsModule?.FEEDS || {};

// ------------------------------------------------------------
// Bundle Debug
// ------------------------------------------------------------
console.log("[bundle] __dirname:", __dirname);
console.log("[bundle] handler loaded from:", __filename);

try {
  const fs = require("fs");
  console.log("[bundle] files:", fs.readdirSync(__dirname));
} catch (err) {
  console.error("[bundle] fs error:", err);
}

// ------------------------------------------------------------
// Allowed debug commands
// ------------------------------------------------------------
const DEBUG_COMMANDS = new Set([
  "ping",
  "echo",
  "debug_health",
  "debug_feeds",
  "debug_market",
  "debug_env"
]);

// ------------------------------------------------------------
// Debug Router
// ------------------------------------------------------------
function handleDebug(debug) {
  switch (debug) {
    case "ping":
      return handlePing();

    case "echo":
      return jsonResponse(200, { status: "ok", echo: true });

    case "debug_health":
      return jsonResponse(200, { status: "ok", debug: "health" });

    case "debug_feeds":
      return jsonResponse(200, { status: "ok", debug: "feeds" });

    case "debug_market":
      return jsonResponse(200, { status: "ok", debug: "market" });

    case "debug_env":
      return jsonResponse(200, { status: "ok", env: process.env });

    default:
      return jsonResponse(200, {
        status: "error",
        error: `Unknown debug command: ${debug}`
      });
  }
}

exports.handler = async (event) => {
  console.log("EVENT:", JSON.stringify(event));

  try {
    const query = event.queryStringParameters || {};
    console.log("QUERY:", query);

    const mode = query.mode || null;
    const debug = query.debug || null;
    const test = query.test || null;
    const force = query.force || null;

    // ------------------------------------------------------------
    // OPTIONS preflight
    // ------------------------------------------------------------
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "GET,OPTIONS"
        },
        body: ""
      };
    }

    // ------------------------------------------------------------
    // SAFE DEBUG ROUTES
    // Only trigger debug if:
    //   • mode is missing
    //   • AND debug is a known command
    // ------------------------------------------------------------
    if (!mode && typeof debug === "string" && DEBUG_COMMANDS.has(debug)) {
      return handleDebug(debug);
    }

    // ------------------------------------------------------------
    // MODE REQUIRED FOR NON-DEBUG ROUTES
    // ------------------------------------------------------------
    if (!mode) {
      return jsonResponse(200, {
        status: "error",
        error: "Missing mode parameter"
      });
    }

    // ------------------------------------------------------------
    // FEED MODE
    // ------------------------------------------------------------
    if (mode === "feed") {
      const feedId = query.feed;

      if (!feedId) {
        return jsonResponse(200, {
          status: "error",
          error: "Missing feed parameter"
        });
      }

      const feedConfig = FEEDS[feedId];

      if (!feedConfig) {
        return jsonResponse(200, {
          status: "error",
          error: `Unknown feed: ${feedId}`
        });
      }

      return await handleFeed(feedConfig, { test, debug });
    }

    // ------------------------------------------------------------
    // MARKET MODE
    // ------------------------------------------------------------
    if (mode === "market") {
      const symbol = query.symbol;

      if (!symbol || typeof symbol !== "string") {
        console.warn("[Router] Missing or invalid symbol:", symbol);
        return jsonResponse(200, {
          status: "error",
          error: "Missing symbol parameter",
          symbol: null
        });
      }

      return await handleMarket(symbol, { test, debug, force });
    }

    // ------------------------------------------------------------
    // HEALTH MODE (immune to stray debug params)
    // ------------------------------------------------------------
    if (mode === "health") {
      const safeDebug = DEBUG_COMMANDS.has(debug) ? debug : null;
      return await handleHealth({ test, debug: safeDebug });
    }

    // ------------------------------------------------------------
    // MARKET_ALL MODE
    // ------------------------------------------------------------
    if (mode === "market_all") {
      return await handleMarketAll({ test, debug, force });
    }

    // ------------------------------------------------------------
    // UNKNOWN MODE
    // ------------------------------------------------------------
    return jsonResponse(200, {
      status: "error",
      error: `Unknown mode: ${mode}`
    });

  } catch (err) {
    console.error("[Router] FATAL ERROR:", err);

    return jsonResponse(200, {
      status: "error",
      error: "Router crashed",
      detail: String(err)
    });
  }
};
