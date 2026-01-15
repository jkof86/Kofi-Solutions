// ------------------------------------------------------------
// rssParser.js — v2.4 (FAST MODE + FULL MODE)
// ------------------------------------------------------------
//
// Purpose:
//   Parse RSS feeds using rss-parser, then normalize items into
//   the unified backend shape used by handleFeed + normalize.js.
//
// Modes:
//   • fast = true  → raw items only (for health checks)
//   • fast = false → full normalizeItem pipeline (for feed mode)
//
// ------------------------------------------------------------

const Parser = require("rss-parser");
const { normalizeItem } = require("./normalize.js");

const parser = new Parser();

// ------------------------------------------------------------
// rssParser(url, sourceLabel, fast)
// ------------------------------------------------------------
async function rssParser(url, sourceLabel = "", fast = false) {
  if (!url) throw new Error("Missing RSS URL");

  try {
    const feed = await parser.parseURL(url);
    const items = Array.isArray(feed.items) ? feed.items : [];

    // FAST MODE → return raw items only (no normalizeItem, no heavy work)
    if (fast) {
      return { items };
    }

    // FULL MODE → normalize each item
    const normalized = items.map((item) =>
      normalizeItem(item, sourceLabel || feed.title || "")
    );

    return { items: normalized };

  } catch (err) {
    console.error("[rssParser] ERROR:", err.message || err);
    return { items: [] };
  }
}

module.exports = { rssParser };
