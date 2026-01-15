/**
 * deepScanExtractor.js — v1.0
 *
 * LAST-RESORT aggressive extractor.
 * Used only when OG + Universal fail.
 *
 * Extracts:
 *   ✓ Best image from ALL <img> tags (size + position scoring)
 *   ✓ Best text block from <p>, <div>, <section>
 */

const cheerio = require("cheerio");

module.exports = async function deepScanExtractor(html, url) {
  const $ = cheerio.load(html);

  const normalizeUrl = (src) => {
    if (!src) return null;
    if (src.startsWith("//")) return `https:${src}`;
    if (src.startsWith("/")) {
      try {
        return new URL(url).origin + src;
      } catch {
        return null;
      }
    }
    return src;
  };

  // ------------------------------------------------------------
  // IMAGE SCAN (Aggressive)
  // ------------------------------------------------------------
  let bestImage = null;
  let bestScore = 0;

  $("img").each((i, el) => {
    const src =
      el.attribs?.src ||
      el.attribs?.["data-src"] ||
      el.attribs?.["data-original"] ||
      el.attribs?.["data-lazy-src"];

    if (!src) return;

    const width = parseInt(el.attribs?.width || 0, 10);
    const height = parseInt(el.attribs?.height || 0, 10);

    // Score: prefer large images + early DOM position
    const score = (width * height) + (10000 / (i + 1));

    if (score > bestScore) {
      bestScore = score;
      bestImage = src;
    }
  });

  bestImage = normalizeUrl(bestImage);

  // ------------------------------------------------------------
  // DESCRIPTION SCAN (Aggressive)
  // ------------------------------------------------------------
  let bestText = null;

  const textBlocks = $("p, div, section")
    .map((i, el) => $(el).text().trim())
    .get()
    .filter((t) => t.length > 60 && !t.match(/(cookie|privacy|advert)/i));

  if (textBlocks.length > 0) {
    bestText = textBlocks[0];
  }

  return {
    image: bestImage || null,
    description: bestText || null,
    author: null,
    published: null,
    tags: []
  };
};
