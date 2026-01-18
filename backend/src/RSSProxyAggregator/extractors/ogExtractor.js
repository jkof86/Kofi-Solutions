// ------------------------------------------------------------
// universalExtractor.js — v3.0
// Hero image + first paragraph extractor (fast + safe)
// ------------------------------------------------------------
//
// Goals:
//   ✓ Fast (regex + heuristics only)
//   ✓ Zero async, zero network
//   ✓ Extract hero images (<figure>, <picture>, <img>)
//   ✓ Support lazy-loaded images (data-src, data-original)
//   ✓ Extract first meaningful paragraph
//   ✓ Safe for malformed HTML
//
// ------------------------------------------------------------

module.exports = async function universalExtractor(html, url) {
  if (!html || typeof html !== "string") {
    return { image: null, description: null };
  }

  let image = null;
  let description = null;

  // ------------------------------------------------------------
  // 1. HERO IMAGE: <figure> → <img>
  // ------------------------------------------------------------
  try {
    const figureMatch = html.match(
      /<figure[\s\S]*?<img[^>]+src=["']([^"']+)["'][\s\S]*?<\/figure>/i
    );
    if (figureMatch && figureMatch[1]) {
      image = figureMatch[1];
    }
  } catch {}

  // ------------------------------------------------------------
  // 2. HERO IMAGE: <picture> → <img>
  // ------------------------------------------------------------
  if (!image) {
    try {
      const pictureMatch = html.match(
        /<picture[\s\S]*?<img[^>]+src=["']([^"']+)["'][^>]*>/i
      );
      if (pictureMatch && pictureMatch[1]) {
        image = pictureMatch[1];
      }
    } catch {}
  }

  // ------------------------------------------------------------
  // 3. FALLBACK IMAGE: first <img> with real src
  // ------------------------------------------------------------
  if (!image) {
    try {
      const imgMatch = html.match(
        /<img[^>]+(?:src|data-src|data-original|data-lazy|data-image)=["']([^"']+)["']/i
      );
      if (imgMatch && imgMatch[1]) {
        image = imgMatch[1];
      }
    } catch {}
  }

  // ------------------------------------------------------------
  // 4. DESCRIPTION: first <p> with meaningful text
  // ------------------------------------------------------------
  try {
    const paragraphs = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);

    if (paragraphs && paragraphs.length > 0) {
      for (const p of paragraphs) {
        const text = p
          .replace(/<[^>]+>/g, "")
          .replace(/\s+/g, " ")
          .trim();

        if (text && text.length > 40) {
          description = text;
          break;
        }
      }
    }
  } catch {}

  // ------------------------------------------------------------
  // 5. FINAL FALLBACKS
  // ------------------------------------------------------------
  if (!description) {
    description = null;
  }

  if (!image) {
    image = null;
  }

  return { image, description };
};
