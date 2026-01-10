/**
 * coindesk.js — Hardened Extractor (2023–2026)
 * Supports:
 *   ✓ 2025–2026 React/Next.js layout (data-module-name="article-*")
 *   ✓ 2023–2024 legacy layout (article-hero, article-body)
 *   ✓ AMP/mobile fallback layout
 */

const cheerio = require("cheerio");

module.exports = async function extractArticle(html, url) {
  const $ = cheerio.load(html);

  // ------------------------------------------------------------
  // IMAGE EXTRACTION (multiple fallbacks)
  // ------------------------------------------------------------
  let image =
    // 2025–2026 React/Next.js hero image
    $('img[data-testid="HeroImage"]').attr("src") ||

    // 2025–2026 module-based hero
    $('[data-module-name="article-hero"] img').attr("src") ||

    // Legacy 2023–2024 hero
    $(".article-hero img").attr("src") ||
    $("figure img").first().attr("src") ||

    // AMP/mobile fallback
    $('meta[property="og:image"]').attr("content") ||
    $('meta[name="twitter:image"]').attr("content") ||
    null;

  // Normalize relative URLs
  if (image) {
    if (image.startsWith("//")) image = `https:${image}`;
    else if (image.startsWith("/")) image = `https://www.coindesk.com${image}`;
  }

  // ------------------------------------------------------------
  // DESCRIPTION (first paragraph, 4–5 sentences)
  // ------------------------------------------------------------
  let description = null;

  const firstPara =
    // 2025–2026 React/Next.js body
    $('[data-module-name="article-body"] p').first().text().trim() ||

    // Legacy 2023–2024 body
    $(".article-body p").first().text().trim() ||

    // AMP/mobile fallback
    $("article p").first().text().trim() ||
    null;

  if (firstPara) {
    const sentences = firstPara.split(/(?<=[.!?])\s+/);
    description = sentences.slice(0, 5).join(" ");
  }

  // ------------------------------------------------------------
  // AUTHOR(S)
  // ------------------------------------------------------------
  let author = null;

  const authors =
    // 2025–2026 React/Next.js header
    $('[data-module-name="article-header"] a[href^="/author"]')
      .map((i, el) => $(el).text().trim())
      .get();

  if (authors.length > 0) {
    author = authors.join(", ");
  } else {
    // Legacy fallback
    const legacyAuthor =
      $('[rel="author"]').first().text().trim() ||
      $(".article-author-name").first().text().trim() ||
      null;

    if (legacyAuthor) author = legacyAuthor;
  }

  // ------------------------------------------------------------
  // PUBLISHED DATE
  // ------------------------------------------------------------
  let published =
    // 2025–2026 React/Next.js header
    $('[data-module-name="article-header"] span')
      .filter((i, el) => $(el).text().match(/\d{4}/))
      .first()
      .text()
      .trim() ||

    // Legacy fallback
    $('time[datetime]').attr("datetime") ||
    $("time").first().attr("datetime") ||
    null;

  // ------------------------------------------------------------
  // TAGS (category chips)
  // ------------------------------------------------------------
  let tags = [];

  // 2025–2026 React/Next.js
  $('[data-module-name="article-header"] a[href*="/tag/"]').each((i, el) => {
    const tag = $(el).text().trim();
    if (tag) tags.push(tag);
  });

  // Legacy fallback
  if (tags.length === 0) {
    $(".article-tags a").each((i, el) => {
      const tag = $(el).text().trim();
      if (tag) tags.push(tag);
    });
  }

  return {
    image: image || null,
    description: description || null,
    author: author || null,
    published: published || null,
    tags: tags || []
  };
};
