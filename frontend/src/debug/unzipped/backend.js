// ------------------------------------------------------------
// backend.js — v1.145 (Modular Router, CommonJS)
// ------------------------------------------------------------

const { jsonResponse } = require("./utils/jsonResponse.js");
const { handleHealth } = require("./routes/handleHealth.js");
const { handleMarket } = require("./routes/handleMarket.js");
const { handleFeedRequest } = require("./routes/handleFeedRequest.js");

exports.handler = async function (event) {
  try {
    const qs = event.queryStringParameters || {};
    const mode = qs.mode || "rss";

    if (event.httpMethod === "OPTIONS") {
      return jsonResponse(200, { status: "ok" });
    }

    if (mode === "health") {
      return await handleHealth(qs);
    }

    if (mode === "market") {
      if (!qs.symbol) {
        return jsonResponse(400, {
          status: "error",
          error: "Missing 'symbol' parameter"
        });
      }
      return await handleMarket(qs.symbol);
    }

    const feedKey =
      qs.feed ||
      qs.source ||
      (event && event.pathParameters && event.pathParameters.feed) ||
      null;

    if (!feedKey) {
      return jsonResponse(400, {
        status: "error",
        error: "Missing 'feed' or 'source' parameter",
        items: []
      });
    }

    return await handleFeedRequest(feedKey);
  } catch (err) {
    console.error("Lambda exception:", err);
    return jsonResponse(500, {
      status: "error",
      error: err.message
    });
  }
};
