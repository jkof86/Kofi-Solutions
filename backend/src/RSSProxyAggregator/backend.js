// ------------------------------------------------------------
// backend.js — v1.207 (Feed Routing Fix + Hardened Modes)
// ------------------------------------------------------------
//
// Goals of v1.207:
//   ✓ Feed mode no longer inherits test/debug flags
//   ✓ Extractors now run for real feed requests
//   ✓ Health/debug modes remain isolated and safe
//   ✓ Range-aware market routing preserved
//   ✓ All handlers return standardized jsonResponse()
//   ✓ Bundle debug preserved for AWS Lambda cold starts
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
      return jsonResponse(200, {
        status: "ok",
        env: "AWS_LAMBDA_FUNCTION_VERSION: $LATEST, AWS_EXECUTION_ENV: AWS_Lambda_nodejs24.x"
      });

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
    const range = query.range || null;

    const opts = { test, debug, force, range };
    console.log("[Router] opts:", opts);

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
    // FEED MODE (FIXED IN v1.207)
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

      // ------------------------------------------------------------
      // CRITICAL FIX:
      // Feed requests must NOT inherit test/debug flags.
      // These flags are ONLY for health/debug routes.
      //
      // This ensures:
      //   ✓ Extractors run normally
      //   ✓ raw:true is never injected accidentally
      //   ✓ Health checks remain isolated
      // ------------------------------------------------------------
      return await handleFeed(feedConfig, {
        debug: null,
        test: null
      });
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

      return await handleMarket(symbol, opts);
    }

    // ------------------------------------------------------------
    // HEALTH MODE
    // ------------------------------------------------------------
    if (mode === "health") {
      const safeDebug = DEBUG_COMMANDS.has(debug) ? debug : null;
      return await handleHealth({ test, debug: safeDebug });
    }

    // ------------------------------------------------------------
    // MARKET_ALL MODE
    // ------------------------------------------------------------
    if (mode === "market_all") {
      return await handleMarketAll({ test, debug, force, range });
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
