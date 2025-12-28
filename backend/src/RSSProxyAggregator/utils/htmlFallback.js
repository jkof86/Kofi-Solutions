// ------------------------------------------------------------
// htmlFallback.js — v2.0 (Cheerio, Safe, Normalized)
// ------------------------------------------------------------

const cheerio = require("cheerio");

function resolveUrl(base, href) {
  try {
    return new URL(href, base).href;
  } catch {
    return base;
  }
}

async function htmlFallback(url, label) {
  try {
    const res = await fetch(url);
    const html = await res.text();

    const $ = cheerio.load(html);
    const items = [];

    // Target real article containers
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
      const title =
        $(el).find("h1, h2, h3, a").first().text().trim();

      const href =
        $(el).find("a").first().attr("href");

      const description =
        $(el).find("p").first().text().trim() || "";

      if (!title || !href) return;

      items.push({
        title,
        link: resolveUrl(url, href),
        description,
        source: label
      });
    });

    return items.slice(0, 20);
  } catch (err) {
    console.error("[htmlFallback] ERROR:", err);
    return [];
  }
}

module.exports = { htmlFallback };
