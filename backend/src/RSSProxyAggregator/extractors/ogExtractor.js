/**
 * ogExtractor.js — Option 1
 * Extracts:
 *   ✓ og:image
 *   ✓ og:description
 *   ✓ twitter:image
 *   ✓ twitter:description
 */

const cheerio = require("cheerio");

module.exports = async function extractOG(html, url) {
  const $ = cheerio.load(html);

  const image =
    $('meta[property="og:image"]').attr("content") ||
    $('meta[name="twitter:image"]').attr("content") ||
    null;

  const description =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="twitter:description"]').attr("content") ||
    null;

  return {
    image: image || null,
    description: description || null,
    author: null,
    published: null,
    tags: []
  };
};
