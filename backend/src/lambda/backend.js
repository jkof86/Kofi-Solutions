// ------------------------------------------------------------
// backend.js — v1.170 (Unified Router + Crash-Proof)
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
//   • jsonResponse everywhere
//
// ------------------------------------------------------------

const { jsonResponse } = require("./utils/jsonResponse.js");
const { handleFeed } = require("./handlers/handleFeed.js");
const { handleMarket } = require("./handlers/handleMarket.js");
const { handleHealth } = require("./handlers/handleHealth.js");

exports.handler = async (event) => {
  console.log("EVENT:", JSON.stringify(event));

  try {
    const query = event.queryStringParameters || {};
    console.log("QUERY:", query);

    const mode = query.mode;
    const test = query.test || null;
    const debug = query.debug || null;
    const force = query.force || null;

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
