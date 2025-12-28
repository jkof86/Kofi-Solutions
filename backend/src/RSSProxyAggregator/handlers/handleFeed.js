// ------------------------------------------------------------
// handleFeed.js — v1.174 (Fast-Fail Edition)
// ------------------------------------------------------------

const { jsonResponse } = require("../utils/jsonResponse.js");
const { FEEDS } = require("../config/feedsMap.js");
const { rssParser } = require("../utils/rssParser.js");
const { JSON_HANDLERS } = require("../feeds/json/jsonHandlers.js");

// ------------------------------------------------------------
// DEAD FEED CIRCUIT BREAKER (v3.0)
// ------------------------------------------------------------
function fastFail(feedId, error) {
  console.warn(`[fastFail] Dead feed detected: ${feedId}`, error?.message);
  return jsonResponse(200, {
    status: "dead",
    feed: feedId,
    items: [],
    error: error?.message || "dead feed"
  });
}

async function handleFeed(feedId, opts = {}) {
  const meta = FEEDS[feedId];
  if (!meta) return fastFail(feedId, new Error("Unknown feed"));

  try {
    // ------------------------------------------------------------
    // 1. JSON HANDLER
    // ------------------------------------------------------------
    if (meta.type === "json" && JSON_HANDLERS[feedId]) {
      try {
        const items = await JSON_HANDLERS[feedId](meta.url, opts);
        return jsonResponse(200, {
          status: "ok",
          feed: feedId,
          items
        });
      } catch (err) {
        return fastFail(feedId, err);
      }
    }

    // ------------------------------------------------------------
    // 2. RSS PARSER (fast fail)
    // ------------------------------------------------------------
    try {
      const rss = await rssParser(meta.url, meta.label || feedId);
      if (rss?.items?.length > 0) {
        return jsonResponse(200, {
          status: "ok",
          feed: feedId,
          items: rss.items
        });
      }
      return fastFail(feedId, new Error("Empty RSS feed"));
    } catch (err) {
      return fastFail(feedId, err);
    }

  } catch (err) {
    return fastFail(feedId, err);
  }
}

module.exports = { handleFeed };
