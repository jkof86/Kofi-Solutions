// ------------------------------------------------------------
// backend.js — v1.180 (Unified Router + Crash-Proof + Bundle Debug)
// ------------------------------------------------------------
//
// Routes:
//   • ?mode=feed&feed=ID
//   • ?mode=market&symbol=btc
//   • ?mode=health
//
// Features:
//   • Full parameter validation
//   • Crash-proof routing
//   • Clean logging
//   • Debug/test passthrough
//   • OPTIONS preflight
//   • jsonResponse everywhere
//   • Bundle inspection (to confirm correct deployment)
// ------------------------------------------------------------

const { jsonResponse } = require("./utils/jsonResponse.js");
const { handleFeed } = require("./handlers/handleFeed.js");
const { handleMarket } = require("./handlers/handleMarket.js");
const { handleHealth } = require("./handlers/handleHealth.js");

// ------------------------------------------------------------
// Bundle Debug — confirms which code Lambda is actually running
// ------------------------------------------------------------
console.log("[bundle] __dirname:", __dirname);
console.log("[bundle] handler loaded from:", __filename);

try {
  const fs = require("fs");
  console.log("[bundle] files:", fs.readdirSync(__dirname));
} catch (err) {
  console.error("[bundle] fs error:", err);
}

exports.handler = async (event) => {
  console.log("EVENT:", JSON.stringify(event));

  try {
    const query = event.queryStringParameters || {};
    console.log("QUERY:", query);

    const mode = query.mode;
    const test = query.test || null;
    const debug = query.debug || null;
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
    // MODE REQUIRED
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

      return await handleFeed(feedId, { test, debug });
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
    // ------------------------------------------------------------
    if (mode === "health") {
      return await handleHealth({ test, debug });
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
