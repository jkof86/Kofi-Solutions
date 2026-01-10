/**
 * universalExtractor.js — Option 3
 * Extracts:
 *   ✓ First meaningful image
 *   ✓ First meaningful paragraph (4–5 sentences)
 */

const cheerio = require("cheerio");

module.exports = async function extractUniversal(html, url) {
  const $ = cheerio.load(html);

  // ------------------------------------------------------------
  // IMAGE — first meaningful <img>
  // ------------------------------------------------------------
  let image = null;

  $("img").each((i, el) => {
    const src = $(el).attr("src") || $(el).attr("data-src");

    if (!src) return;

    // Skip tiny icons, logos, tracking pixels
    const width = parseInt($(el).attr("width") || 0, 10);
    const height = parseInt($(el).attr("height") || 0, 10);
    if (width && height && (width < 100 || height < 100)) return;

    // Skip SVGs, placeholders
    if (src.endsWith(".svg")) return;

    image = src;
    return false; // stop loop
  });

  // Normalize relative URLs
  if (image) {
    if (image.startsWith("//")) image = `https:${image}`;
    else if (image.startsWith("/")) {
      try {
        const domain = new URL(url).origin;
        image = `${domain}${image}`;
      } catch {}
    }
  }

  // ------------------------------------------------------------
  // DESCRIPTION — first meaningful <p>
  // ------------------------------------------------------------
  let description = null;

  $("p").each((i, el) => {
    const text = $(el).text().trim();

    // Skip empty or tiny paragraphs
    if (!text || text.length < 40) return;

    // Skip nav/footer/legal text
    if (text.match(/(subscribe|cookie|privacy|sign up|advert)/i)) return;

    const sentences = text.split(/(?<=[.!?])\s+/);
    description = sentences.slice(0, 5).join(" ");
    return false; // stop loop
  });

  return {
    image: image || null,
    description: description || null,
    author: null,
    published: null,
    tags: []
  };
};
