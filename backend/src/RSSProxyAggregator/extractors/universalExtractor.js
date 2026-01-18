// extractors/universalExtractor.js (CommonJS)

const cheerio = require("cheerio");
const { normalizeItem } = require("../utils/normalize.js");

function universalExtract(htmlText, baseUrl) {
  if (!htmlText || typeof htmlText !== "string") return [];

  let $;
  try {
    $ = cheerio.load(htmlText);
  } catch {
    return [];
  }

  const items = [];

  const ogTitle = $('meta[property="og:title"]').attr("content");
  const ogUrl = $('meta[property="og:url"]').attr("content");
  const ogDesc = $('meta[property="og:description"]').attr("content");

  if (ogTitle && ogUrl) {
    items.push(
      normalizeItem(
        { title: ogTitle, link: absolutize(ogUrl, baseUrl), description: ogDesc || null },
        { sourceType: "universal_og" }
      )
    );
  }

  const twTitle = $('meta[name="twitter:title"]').attr("content");
  const twUrl = $('meta[name="twitter:url"]').attr("content");
  const twDesc = $('meta[name="twitter:description"]').attr("content");

  if (twTitle && twUrl) {
    items.push(
      normalizeItem(
        { title: twTitle, link: absolutize(twUrl, baseUrl), description: twDesc || null },
        { sourceType: "universal_twitter" }
      )
    );
  }

  const pageTitle = $("title").text().trim();
  const metaDesc = $('meta[name="description"]').attr("content");

  if (pageTitle) {
    items.push(
      normalizeItem(
        { title: pageTitle, link: baseUrl, description: metaDesc || null },
        { sourceType: "universal_title" }
      )
    );
  }

  const deepLinks = [];
  $("a").each((_, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr("href");
    if (!href || !text) return;
    if (text.length > 25 && /[A-Za-z]/.test(text)) {
      deepLinks.push({ text, href });
    }
  });

  deepLinks.slice(0, 20).forEach(linkObj => {
    items.push(
      normalizeItem(
        { title: linkObj.text, link: absolutize(linkObj.href, baseUrl), description: null },
        { sourceType: "universal_deepscan" }
      )
    );
  });

  const seen = new Set();
  const unique = [];

  for (const item of items) {
    if (!item?.link) continue;
    if (seen.has(item.link)) continue;
    seen.add(item.link);
    unique.push(item);
  }

  return unique;
}

function absolutize(link, baseUrl) {
  try {
    return new URL(link, baseUrl).toString();
  } catch {
    return link;
  }
}

module.exports = { universalExtract };
