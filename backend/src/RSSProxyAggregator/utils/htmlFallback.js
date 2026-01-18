// utils/htmlFallback.js (CommonJS)

const cheerio = require("cheerio");
const { normalizeItem } = require("./normalize.js");

function parseHtmlFallback(htmlText, baseUrl) {
  if (!htmlText || typeof htmlText !== "string") return [];

  let $;
  try {
    $ = cheerio.load(htmlText);
  } catch {
    return [];
  }

  const items = [];

  $("article").each((_, el) => {
    const node = $(el);
    const title =
      node.find("h1, h2, h3").first().text().trim() ||
      node.find("a").first().text().trim();

    const link = node.find("a").first().attr("href") || null;
    const description = node.find("p").first().text().trim() || null;

    if (title && link) {
      items.push(
        normalizeItem(
          { title, link: absolutize(link, baseUrl), description },
          { sourceType: "html" }
        )
      );
    }
  });

  if (items.length > 0) return items;

  const headlineLinks = [];
  $("a").each((_, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr("href");
    if (!href || !text) return;
    if (text.length > 30 && /[A-Za-z]/.test(text)) {
      headlineLinks.push({ text, href });
    }
  });

  if (headlineLinks.length > 0) {
    return headlineLinks.slice(0, 20).map(h =>
      normalizeItem(
        { title: h.text, link: absolutize(h.href, baseUrl), description: null },
        { sourceType: "html_headline" }
      )
    );
  }

  const ogTitle = $('meta[property="og:title"]').attr("content");
  const ogUrl = $('meta[property="og:url"]').attr("content");
  const ogDesc = $('meta[property="og:description"]').attr("content");

  if (ogTitle && ogUrl) {
    return [
      normalizeItem(
        { title: ogTitle, link: absolutize(ogUrl, baseUrl), description: ogDesc || null },
        { sourceType: "html_og" }
      )
    ];
  }

  return [];
}

function absolutize(link, baseUrl) {
  try {
    return new URL(link, baseUrl).toString();
  } catch {
    return link;
  }
}

module.exports = { parseHtmlFallback };
