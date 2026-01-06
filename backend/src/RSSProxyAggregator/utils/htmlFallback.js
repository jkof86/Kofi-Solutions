// ------------------------------------------------------------
// htmlFallback.js — v2.1 (Normalized + Debug + Safe)
// ------------------------------------------------------------
//
// Standardized return shape:
//
//   {
//     status: "fallback",
//     fallback: true,
//     count: Number,
//     items: [ { title, link, description, source } ],
//     debug: { ... } | null
//   }
//
// Improvements in v2.1:
//   • Always returns normalized object (never raw array)
//   • Added debug passthrough
//   • Hardened selectors + URL resolution
//   • Safe guards for malformed HTML
//   • Fully compatible with handleFeed v1.190
//
// ------------------------------------------------------------

const cheerio = require("cheerio");
const axios = require("axios");

function resolveUrl(base, href) {
  try {
    return new URL(href, base).href;
  } catch {
    return base;
  }
}

async function htmlFallback(url, label, opts = {}) {
  const debug = opts.debug ? {} : null;

  try {
    const res = await axios.get(url, { timeout: 5000 });
    const html = res.data;

    if (debug) debug.rawLength = html?.length ?? 0;

    const $ = cheerio.load(html);
    const items = [];

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
      const title = $(el).find("h1, h2, h3, a").first().text().trim();
      const href = $(el).find("a").first().attr("href");
      const description = $(el).find("p").first().text().trim() || "";

      if (!title || !href) return;

      items.push({
        title,
        link: resolveUrl(url, href),
        description,
        source: label
      });
    });

    if (debug) debug.itemCount = items.length;

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