// ------------------------------------------------------------
// handleFeed.js — v1.171 (Crash-Proof + Fallback-Aware)
// ------------------------------------------------------------

const { jsonResponse } = require("../utils/jsonResponse.js");
const { FEEDS } = require("../feeds/feedsMap.js");
const { rssParser } = require("../utils/rssParser.js");
const { htmlFallback } = require("../utils/htmlFallback.js");

async function handleFeed(feedId, opts = {}) {
  console.log("[handleFeed] Incoming:", feedId, opts);

  try {
    const feed = FEEDS[feedId];

    if (!feed) {
      console.warn("[handleFeed] Unknown feed:", feedId);
      return jsonResponse(200, {
        status: "error",
        error: `Unknown feed: ${feedId}`,
        items: []
      });
    }

    const { url, handler, fallback } = feed;

    // ------------------------------------------------------------
    // 1. JSON HANDLER
    // ------------------------------------------------------------
    if (handler) {
      try {
        const jsonItems = await handler(url, opts);
        if (Array.isArray(jsonItems) && jsonItems.length > 0) {
          return jsonResponse(200, {
            status: "ok",
            feed: feedId,
            items: jsonItems
          });
        }
      } catch (err) {
        console.error("[handleFeed] JSON handler error:", feedId, err);
      }
    }

    // ------------------------------------------------------------
    // 2. RSS PARSER
    // ------------------------------------------------------------
    try {
      const rss = await rssParser(url);
      if (rss?.items?.length > 0) {
        return jsonResponse(200, {
          status: "ok",
          feed: feedId,
          items: rss.items
        });
      }
    } catch (err) {
      console.error("[handleFeed] RSS error:", feedId, err);
    }

    // ------------------------------------------------------------
    // 3. HTML FALLBACK
    // ------------------------------------------------------------
    if (fallback) {
      try {
        const htmlItems = await htmlFallback(url, fallback);
        if (Array.isArray(htmlItems) && htmlItems.length > 0) {
          return jsonResponse(200, {
            status: "fallback",
            feed: feedId,
            items: htmlItems
          });
        }
      } catch (err) {
        console.error("[handleFeed] HTML fallback error:", feedId, err);
      }
    }

    // ------------------------------------------------------------
    // 4. ALL FAILED
    // ------------------------------------------------------------
    return jsonResponse(200, {
      status: "error",
      feed: feedId,
      error: `Failed to load feed: ${feedId}`,
      items: []
    });

  } catch (err) {
    console.error("[handleFeed] FATAL ERROR:", err);
    return jsonResponse(200, {
      status: "error",
      feed: feedId,
      error: "Feed handler crashed",
      detail: String(err),
      items: []
    });
  }
}

module.exports = { handleFeed };
