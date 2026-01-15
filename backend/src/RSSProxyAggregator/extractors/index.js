// extractors/index.js — v3.0
// ------------------------------------------------------------
// Extraction Pipeline (Balanced Aggressive)
// Priority:
//   1. OG/Twitter/JSON-LD
//   2. Universal (hero-aware)
//   3. DeepScan (aggressive fallback)
// ------------------------------------------------------------

const ogExtractor = require("./ogExtractor");
const universalExtractor = require("./universalExtractor");
const deepScanExtractor = require("./deepScanExtractor");

module.exports = function getExtractor(url) {
  return async function extract(html, url) {
    // 1. OG + Twitter + JSON-LD
    const og = await ogExtractor(html, url);
    if (og.image || og.description) return og;

    // 2. Universal extractor
    const uni = await universalExtractor(html, url);
    if (uni.image || uni.description) return uni;

    // 3. DeepScan fallback
    return await deepScanExtractor(html, url);
  };
};
