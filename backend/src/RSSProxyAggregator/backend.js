// ------------------------------------------------------------
// backend.js — v1.208 (Debug + Alias Hardened)
// ------------------------------------------------------------
//
// Goals of v1.208:
//   ✓ Feed mode remains isolated from debug/test flags
//   ✓ Debug routes hardened + alias/version reporting fixed
//   ✓ No accidental env leakage
//   ✓ Router stability + predictable behavior
//   ✓ Clean Lambda export (no double-exports)
// ------------------------------------------------------------


// ------------------------------------------------------------
// DEBUG
// ------------------------------------------------------------
try {
  const resolved = require.resolve("./config/feedsMap.js");
  console.log("[diag] resolved path:", resolved);

  const raw = require("fs").readFileSync(resolved, "utf8");
  console.log("[diag] raw file length:", raw.length);
  console.log("[diag] raw file preview:", raw.slice(0, 200));

  const FEEDS = require("./config/feedsMap.js");
  console.log("[diag] FEEDS keys:", Object.keys(FEEDS));
} catch (err) {
  console.error("[diag] ERROR:", err);
}

// ------------------------------------------------------------


const { jsonResponse } = require("./utils/jsonResponse.js");
const { handleFeed } = require("./handlers/handleFeed.js");
const { handleMarket } = require("./handlers/handleMarket.js");
const { handleHealth } = require("./handlers/handleHealth.js");
const { handleMarketAll } = require("./handlers/handleMarketAll.js");
const { handlePing } = require("./handlers/handlePing.js");
const { handleEcho } = require("./handlers/handleEcho.js");

const FEEDS = require("./config/feedsMap.js");

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
  "health",
  "feeds",
  "market",
  "env"
]);

// ------------------------------------------------------------
// Stage helpers (explicit + safe)
// ------------------------------------------------------------
function getStage() {

}

// ------------------------------------------------------------
// Debug Router — isolated from main routing
// ------------------------------------------------------------

function handleDebug(debug, query, event) {
  switch (debug) {
    case "ping":
      return handlePing();

    case "echo":
      return handleEcho(query);

    case "health":
      return jsonResponse(200, { status: "ok", debug: "health" });

    case "feeds":
      return jsonResponse(200, { status: "ok", debug: "feeds" });

    case "market":
      return jsonResponse(200, { status: "ok", debug: "market" });

    case "env": {
      const clientEnv = (query?.client_env === "test") ? "Testing" : "Production";
      const version = process.env.AWS_LAMBDA_FUNCTION_VERSION || "unknown";
      const backendEnv = clientEnv === "Testing" ?
        "Testing" : "Production";

      return jsonResponse(200, {
        status: "ok",
        lambda: {
          clientEnv,
          backendEnv,
          version
        }
      });
    }

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
    const msg = query.msg || null;

    const opts = { test, debug, force, range, msg };
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
      return handleDebug(debug, query);
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

      // Feed requests must NOT inherit test/debug flags
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
