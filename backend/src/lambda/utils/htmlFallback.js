// ------------------------------------------------------------
// htmlFallback.js — Cheerio Version (Fast, Lightweight)
// ------------------------------------------------------------

const cheerio = require("cheerio");

// Extracts <title>, <a>, <p>, etc. from HTML pages
async function fetchHtmlFallback(url, label) {
  try {
    const res = await fetch(url);
    const html = await res.text();

    const $ = cheerio.load(html);

    const items = [];

    $("article, .post, .story, .news, li, div").each((i, el) => {
      const title =
        $(el).find("h1, h2, h3, a").first().text().trim() ||
        $(el).find("title").text().trim();

      const link =
        $(el).find("a").first().attr("href") ||
        url;

      const description =
        $(el).find("p").first().text().trim() ||
        "";

      if (title && link) {
        items.push({
          title,
          link,
          description,
          source: label
        });
      }
    });

    return items.slice(0, 20); // keep it tight
  } catch (err) {
    console.error("Cheerio fallback error:", err);
    return [];
  }
}

module.exports = { fetchHtmlFallback };
