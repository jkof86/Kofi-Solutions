// ------------------------------------------------------------
// backend.js — v1.145 (Modular Router)
// ------------------------------------------------------------
// This file ONLY routes requests. All logic lives in modules.
// ------------------------------------------------------------

import { jsonResponse } from "./utils/jsonResponse.js";
import { handleHealth } from "./routes/handleHealth.js";
import { handleMarket } from "./routes/handleMarket.js";
import { handleFeedRequest } from "./routes/handleFeedRequest.js";

export async function handler(event) {
  try {
    const qs = event.queryStringParameters || {};
    const mode = qs.mode || "rss";

    // OPTIONS preflight
    if (event.httpMethod === "OPTIONS") {
      return jsonResponse(200, { status: "ok" });
    }

    // -----------------------------
    // HEALTH (strict by default)
    // -----------------------------
    if (mode === "health") {
      return await handleHealth(qs);
    }

    // -----------------------------
    // MARKET (crypto, stocks, ETFs)
    // -----------------------------
    if (mode === "market") {
      if (!qs.symbol) {
        return jsonResponse(400, {
          status: "error",
          error: "Missing 'symbol' parameter"
        });
      }
      return await handleMarket(qs.symbol);
    }

    // -----------------------------
    // FEEDS (RSS / JSON)
    // -----------------------------
    const feedKey =
      qs.feed ||
      qs.source ||
      event?.pathParameters?.feed ||
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
}
