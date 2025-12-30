// ------------------------------------------------------------
// handleFeed.js — v1.180 (FEEDS Integrity + Fast-Fail)
// ------------------------------------------------------------

const { jsonResponse } = require("../utils/jsonResponse.js");
const feedsModule = require("../config/feedsMap.js");
const { rssParser } = require("../utils/rssParser.js");
const { JSON_HANDLERS } = require("../feeds/json/jsonHandlers.js");

// FEEDS integrity check
const FEEDS = feedsModule?.FEEDS;
if (!FEEDS || typeof FEEDS !== "object" || Object.keys(FEEDS).length === 0) {
  console.error("[handleFeed] FATAL: FEEDS map is empty or undefined:", FEEDS);
}

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
  // FEEDS missing → global failure
  if (!FEEDS || Object.keys(FEEDS).length === 0) {
    return jsonResponse(200, {
      status: "error",
      feed: feedId,
      items: [],
      error: "FEEDS map is empty — backend misconfigured"
    });
  }

  const meta = FEEDS[feedId];
  if (!meta) {
    console.error("[handleFeed] Unknown feedId:", feedId, "FEEDS keys:", Object.keys(FEEDS));
    return fastFail(feedId, new Error("Unknown feed"));
  }

  try {
    // JSON handler
    if (meta.type === "json" && JSON_HANDLERS[feedId]) {
      try {
        const items = await JSON_HANDLERS[feedId](meta.url, opts);
        return jsonResponse(200, { status: "ok", feed: feedId, items });
      } catch (err) {
        return fastFail(feedId, err);
      }
    }

    // RSS parser
    try {
      const rss = await rssParser(meta.url, meta.label || feedId);
      if (rss?.items?.length > 0) {
        return jsonResponse(200, { status: "ok", feed: feedId, items: rss.items });
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
