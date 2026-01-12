/**
 * ogExtractor.js — v3.0 (Balanced Aggressive)
 *
 * Extracts:
 *   ✓ og:image, og:image:url, og:image:secure_url
 *   ✓ twitter:image, twitter:image:src
 *   ✓ meta[name="image"], meta[itemprop="image"]
 *   ✓ link[rel="image_src"]
 *   ✓ JSON-LD (Article, NewsArticle, BlogPosting)
 *
 *   ✓ og:description, twitter:description
 *   ✓ meta[name="description"], meta[itemprop="description"]
 *   ✓ meta[property="article:summary"]
 */

const cheerio = require("cheerio");

module.exports = async function extractOG(html, url) {
  const $ = cheerio.load(html);

  const imageCandidates = [];
  const descriptionCandidates = [];

  // ------------------------------------------------------------
  // IMAGE META TAGS
  // ------------------------------------------------------------
  const imageMetaSelectors = [
    'meta[property="og:image"]',
    'meta[property="og:image:url"]',
    'meta[property="og:image:secure_url"]',
    'meta[name="twitter:image"]',
    'meta[name="twitter:image:src"]',
    'meta[name="image"]',
    'meta[itemprop="image"]',
    'link[rel="image_src"]'
  ];

  for (const sel of imageMetaSelectors) {
    const val = $(sel).attr("content") || $(sel).attr("href");
    if (val) imageCandidates.push(val);
  }

  // ------------------------------------------------------------
  // DESCRIPTION META TAGS
  // ------------------------------------------------------------
  const descMetaSelectors = [
    'meta[property="og:description"]',
    'meta[name="twitter:description"]',
    'meta[name="description"]',
    'meta[itemprop="description"]',
    'meta[property="article:summary"]'
  ];

  for (const sel of descMetaSelectors) {
    const val = $(sel).attr("content");
    if (val) descriptionCandidates.push(val);
  }

  // ------------------------------------------------------------
  // JSON-LD (Article Schema)
  // ------------------------------------------------------------
  $('script[type="application/ld+json"]').each((i, el) => {
    try {
      const json = JSON.parse($(el).contents().text());
      const data = Array.isArray(json) ? json[0] : json;

      if (data?.image) {
        if (typeof data.image === "string") imageCandidates.push(data.image);
        if (Array.isArray(data.image)) imageCandidates.push(data.image[0]);
      }

      if (data?.description) {
        descriptionCandidates.push(data.description);
      }
    } catch {}
  });

  return {
    image: imageCandidates[0] || null,
    description: descriptionCandidates[0] || null,
    author: null,
    published: null,
    tags: []
  };
};
