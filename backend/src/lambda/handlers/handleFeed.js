// ------------------------------------------------------------
// handleFeed.js — v1.173 (Feeds/ Rebuild Compatible)
// ------------------------------------------------------------

const { jsonResponse } = require("../utils/jsonResponse.js");
const { FEEDS } = require("../config/feedsMap.js");
const { rssParser } = require("../utils/rssParser.js");
const { htmlFallback } = require("../utils/htmlFallback.js");

// JSON handlers registry (from /feeds/jsonHandlers.js)
const { JSON_HANDLERS } = require("../feeds/jsonHandlers.js");

async function handleFeed(feedId, opts = {}) {
  console.log("[handleFeed] Incoming:", feedId, opts);

  try {
    const feed = FEEDS[feedId];

    if (!feed) {
      console.warn("[handleFeed] Unknown feed:", feedId);
      return jsonResponse(200, {
        status: "error",
        feed: feedId,
        error: `Unknown feed: ${feedId}`,
        items: []
      });
    }

    const { url, handler, fallback, label } = feed;

    // ------------------------------------------------------------
    // 1. JSON HANDLER
    // ------------------------------------------------------------
    if (handler && JSON_HANDLERS[handler]) {
      try {
        const jsonItems = await JSON_HANDLERS[handler](url, opts);

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
      const rss = await rssParser(url, label || feedId);

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
        const htmlItems = await htmlFallback(url, label || feedId);

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
    console.warn("[handleFeed] All methods failed:", feedId);
    return jsonResponse(200, {
      status: "error",
      feed: feedId,
      error: `Failed to load feed: ${feedId}`,
      items: []
    });

  } catch (err) {
    console.error("[handleFeed] FATAL ERROR:", feedId, err);
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
