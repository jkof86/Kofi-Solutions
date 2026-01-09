// ------------------------------------------------------------
// rssParser.js — v2.2 (Normalized + CDATA‑Safe + Image Extraction)
// ------------------------------------------------------------
//
// Purpose:
//   Parse RSS feeds using rss-parser, then normalize items into
//   the unified backend shape used by handleFeed + normalize.js.
//
// Standardized item shape:
//   {
//     title,
//     url,
//     description,
//     image,
//     date,
//     source,
//     raw
//   }
//
// Improvements in v2.2:
//   ✓ Uses normalizeItem() from normalize.js
//   ✓ Extracts images from enclosure/media/content
//   ✓ Handles CDATA + HTML safely
//   ✓ Safe fallback for malformed RSS fields
//   ✓ Fully compatible with handleFeed.js v1.208
//
// ------------------------------------------------------------

const Parser = require("rss-parser");
const { normalizeItem } = require("./normalize.js");

const parser = new Parser();

// ------------------------------------------------------------
// rssParser(url, sourceLabel)
// ------------------------------------------------------------
async function rssParser(url, sourceLabel = "") {
  if (!url) throw new Error("Missing RSS URL");

  try {
    const feed = await parser.parseURL(url);

    const items = Array.isArray(feed.items) ? feed.items : [];

    // Normalize each RSS item using your global normalization logic
    const normalized = items.map((item) =>
      normalizeItem(item, sourceLabel || feed.title || "")
    );

    return { items: normalized };

  } catch (err) {
    console.error("[rssParser] ERROR:", err);
    return { items: [] };
  }
}

module.exports = { rssParser };
