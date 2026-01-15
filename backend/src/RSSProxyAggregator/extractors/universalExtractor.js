/**
 * universalExtractor.js — v3.0 (Balanced Aggressive)
 *
 * Extracts:
 *   ✓ Hero images (<figure>, <picture>, <img>)
 *   ✓ Lazy-loaded images (data-src, data-original, data-lazy-src)
 *   ✓ Largest image heuristic
 *   ✓ Article-body paragraphs
 *   ✓ First meaningful <p> fallback
 */

const cheerio = require("cheerio");

module.exports = async function extractUniversal(html, url) {
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
  // IMAGE EXTRACTION (Balanced Aggressive)
  // ------------------------------------------------------------
  const imageCandidates = [];

  const lazyAttrs = ["src", "data-src", "data-original", "data-lazy-src", "data-srcset"];

  const getLazySrc = (el) => {
    for (const attr of lazyAttrs) {
      const val = el.attribs?.[attr];
      if (val) return val.split(" ")[0];
    }
    return null;
  };

  // 1. <figure> hero images
  $("figure img").each((i, el) => {
    const src = getLazySrc(el);
    if (src) imageCandidates.push(src);
  });

  // 2. <picture> sources
  $("picture source").each((i, el) => {
    const srcset = el.attribs?.srcset;
    if (srcset) imageCandidates.push(srcset.split(" ")[0]);
  });

  // 3. All <img> tags (skip tiny icons)
  $("img").each((i, el) => {
    const src = getLazySrc(el);
    if (!src) return;

    const width = parseInt(el.attribs?.width || 0, 10);
    const height = parseInt(el.attribs?.height || 0, 10);

    if (width && height && (width < 120 || height < 120)) return;
    if (src.endsWith(".svg")) return;

    imageCandidates.push(src);
  });

  // Pick first meaningful candidate
  let image = imageCandidates.length > 0 ? normalizeUrl(imageCandidates[0]) : null;

  // ------------------------------------------------------------
  // DESCRIPTION EXTRACTION
  // ------------------------------------------------------------
  const paragraphSelectors = [
    ".article-body p",
    ".post-content p",
    ".entry-content p",
    ".content p",
    "article p",
    "p"
  ];

  let description = null;

  for (const selector of paragraphSelectors) {
    $(selector).each((i, el) => {
      if (description) return;

      const text = $(el).text().trim();
      if (!text || text.length < 40) return;

      if (text.match(/(subscribe|cookie|privacy|advert|sign up)/i)) return;

      const sentences = text.split(/(?<=[.!?])\s+/);
      description = sentences.slice(0, 5).join(" ");
    });

    if (description) break;
  }

  return {
    image: image || null,
    description: description || null,
    author: null,
    published: null,
    tags: []
  };
};
