// ------------------------------------------------------------
// backend.js — v1.205 (Hardened Routing + Explicit Debug Isolation)
// ------------------------------------------------------------
//
// Goals of v1.205:
//   ✓ Debug routing is fully isolated and cannot hijack feed/market
//   ✓ Health mode ignores stray debug params unless explicitly allowed
//   ✓ Mode routing is explicit, ordered, and crash‑proof
//   ✓ All handlers return standardized jsonResponse()
//   ✓ Bundle debug preserved for AWS Lambda cold starts
//
// This router is the single entrypoint for:
//   • Feed requests
//   • Market requests
//   • Market-all aggregation
//   • System health
//   • Debug utilities
//
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
// Bundle Debug (executed once per cold start)
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
// Allowed debug commands (strict allowlist)
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
// Debug Router — isolated from main routing
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
      return jsonResponse(200, { status: "ok", env: "AWS_LAMBDA_FUNCTION_VERSION: $LATEST, AWS_EXECUTION_ENV: AWS_Lambda_nodejs24.x" });

    default:
      return jsonResponse(200, {
        status: "error",
        error: `Unknown debug command: ${debug}`
      });
  }
}

// ------------------------------------------------------------
// Main Lambda Handler
// ------------------------------------------------------------
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
    // OPTIONS preflight (CORS)
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
    // Only allowed when:
    //   • mode is missing
    //   • AND debug is a known command
    //
    // Prevents "?debug=ping" from hijacking feed/market requests.
    // ------------------------------------------------------------
    if (!mode && typeof debug === "string" && DEBUG_COMMANDS.has(debug)) {
      return handleDebug(debug);
    }

    // ------------------------------------------------------------
    // MODE REQUIRED FOR ALL NON-DEBUG ROUTES
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
    // HEALTH MODE
    // Immune to stray debug params unless explicitly allowed.
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
