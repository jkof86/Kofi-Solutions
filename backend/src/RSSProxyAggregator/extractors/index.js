// ------------------------------------------------------------
// extractors/index.js — v3.0
// Universal Extractor Pipeline (OG → Universal → RSS Fallback)
// ------------------------------------------------------------
//
// Goals:
//   ✓ Fast, safe, zero-hang extraction
//   ✓ OG + Twitter + JSON-LD support
//   ✓ <figure>, <picture>, <img> hero detection
//   ✓ Lazy-loaded image support (data-src, data-original)
//   ✓ Clean fallback chain
//   ✓ Fully compatible with handleFeed v2.2
//
// ------------------------------------------------------------

const ogExtractor = require("./ogExtractor");
const universalExtractor = require("./universalExtractor");

// ------------------------------------------------------------
// getExtractor(url)
// Returns an async extractor(html, url) function
// ------------------------------------------------------------
module.exports = function getExtractor(url) {
  return async function extract(html, url) {
    // ------------------------------------------------------------
    // 1. OG / Twitter / JSON-LD extractor
    // ------------------------------------------------------------
    try {
      const og = await ogExtractor(html, url);

      const hasOG =
        (og?.image && og.image.length > 0) ||
        (og?.description && og.description.length > 0);

      if (hasOG) {
        return og;
      }
    } catch (err) {
      console.warn("[extractor] OG extractor error:", String(err));
    }

    // ------------------------------------------------------------
    // 2. Universal HTML extractor (hero image + body text)
    // ------------------------------------------------------------
    try {
      const uni = await universalExtractor(html, url);

      const hasUniversal =
        (uni?.image && uni.image.length > 0) ||
        (uni?.description && uni.description.length > 0);

      if (hasUniversal) {
        return uni;
      }
    } catch (err) {
      console.warn("[extractor] universal extractor error:", String(err));
    }

    // ------------------------------------------------------------
    // 3. Fallback — return empty object
    // (handleFeed will apply RSS fallback + final fallback)
    // ------------------------------------------------------------
    return {
      image: null,
      description: null
    };
  };
};
