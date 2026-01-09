/**
 * coindesk.js — Article Metadata Extractor
 * ------------------------------------------------------------
 * Extracts:
 *   ✓ Hero image
 *   ✓ First-paragraph description (4–5 sentences)
 *   ✓ Author (if available)
 *   ✓ Published date (if available)
 *   ✓ Tags (if available)
 *
 * All fields are optional. The backend will only use what it needs.
 */

const cheerio = require("cheerio");

module.exports = async function extractArticle(html, url) {
  const $ = cheerio.load(html);

  // ------------------------------------------------------------
  // IMAGE EXTRACTION
  // ------------------------------------------------------------
  
  let image =
    $("figure img").first().attr("src") ||
    $("article img").first().attr("src") ||
    null;

  // Normalize relative URLs
  if (image && image.startsWith("/")) {
    image = `https://www.coindesk.com${image}`;
  }

  // ------------------------------------------------------------
  // DESCRIPTION (FIRST PARAGRAPH, 4–5 SENTENCES)
  // ------------------------------------------------------------
  let description = null;

  const firstPara = $("article p").first().text().trim();
  if (firstPara) {
    const sentences = firstPara.split(/(?<=[.!?])\s+/);
    description = sentences.slice(0, 5).join(" ");
  }

  // ------------------------------------------------------------
  // AUTHOR
  // ------------------------------------------------------------
  let author =
    $('[rel="author"]').first().text().trim() ||
    $(".article-author-name").first().text().trim() ||
    null;

  // ------------------------------------------------------------
  // PUBLISHED DATE
  // ------------------------------------------------------------
  let published =
    $('time[datetime]').attr("datetime") ||
    $("time").first().attr("datetime") ||
    null;

  // ------------------------------------------------------------
  // TAGS
  // ------------------------------------------------------------
  let tags = [];
  $(".article-tags a").each((i, el) => {
    const tag = $(el).text().trim();
    if (tag) tags.push(tag);
  });

  return {
    image,
    description,
    author,
    published,
    tags
  };
};
