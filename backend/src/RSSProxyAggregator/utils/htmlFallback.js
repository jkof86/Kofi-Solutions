// ------------------------------------------------------------
// htmlFallback.js — v2.2 (Normalized + Image Extraction + Safe HTML)
// ------------------------------------------------------------
//
// Purpose:
//   Provide a resilient HTML scraping fallback when RSS/JSON parsing fails.
//   Extracts title, URL, description, and image from common article layouts.
//
// Standardized return shape:
//   {
//     status: "fallback",
//     fallback: true,
//     count: Number,
//     items: [ normalizedItem, ... ],
//     debug: { ... } | null
//   }
//
// Improvements in v2.2:
//   ✓ Normalizes ALL fallback items using normalizeItem()
//   ✓ Extracts <img> tags from article blocks
//   ✓ Hardened selectors for modern news layouts
//   ✓ Safe URL resolution for relative links
//   ✓ Debug passthrough for handleFeed debug mode
//   ✓ Fully compatible with normalize.js v1.200
//   ✓ Fully compatible with handleFeed v1.208
//
// ------------------------------------------------------------

const cheerio = require("cheerio");
const axios = require("axios");
const { normalizeItem } = require("./normalize.js");

// ------------------------------------------------------------
// Resolve relative URLs safely
// ------------------------------------------------------------
function resolveUrl(base, href) {
  try {
    return new URL(href, base).href;
  } catch {
    return base;
  }
}

// ------------------------------------------------------------
// Extract first <img> from an element
// ------------------------------------------------------------
function extractImageFromEl($, el) {
  const img = $(el).find("img").first().attr("src");
  if (!img) return null;
  return img.startsWith("http") ? img : null;
}

// ------------------------------------------------------------
// HTML Fallback Scraper
// ------------------------------------------------------------
async function htmlFallback(url, label = "", opts = {}) {
  const debug = opts.debug ? {} : null;

  try {
    // --------------------------------------------------------
    // Fetch HTML
    // --------------------------------------------------------
    const res = await axios.get(url, { timeout: 5000 });
    const html = res.data;

    if (debug) debug.rawLength = html?.length ?? 0;

    const $ = cheerio.load(html);
    const items = [];

    // --------------------------------------------------------
    // Target common article containers
    // --------------------------------------------------------
    const selectors = [
      "article",
      ".post",
      ".entry",
      ".story",
      ".news-item",
      ".article",
      ".card",
      "li"
    ];

    $(selectors.join(",")).each((i, el) => {
      // Title
      const title =
        $(el).find("h1, h2, h3, a").first().text().trim() ||
        $(el).find("header").text().trim();

      // URL
      const href = $(el).find("a").first().attr("href");

      // Description
      const description =
        $(el).find("p").first().text().trim() ||
        $(el).text().trim().slice(0, 200);

      // Image
      const image = extractImageFromEl($, el);

      if (!title || !href) return;

      // ------------------------------------------------------
      // Normalize using normalizeItem() for consistent shape
      // ------------------------------------------------------
      const normalized = normalizeItem(
        {
          title,
          link: resolveUrl(url, href),
          description,
          enclosure: image ? { url: image } : null
        },
        label
      );

      items.push(normalized);
    });

    if (debug) debug.itemCount = items.length;

    // --------------------------------------------------------
    // Final normalized fallback response
    // --------------------------------------------------------
    return {
      status: "fallback",
      fallback: true,
      count: items.length,
      items: items.slice(0, 20),
      debug
    };

  } catch (err) {
    console.error("[htmlFallback] ERROR:", err);

    return {
      status: "error",
      fallback: false,
      count: 0,
      items: [],
      debug: opts.debug ? { error: String(err) } : null
    };
  }
}

module.exports = { htmlFallback };
