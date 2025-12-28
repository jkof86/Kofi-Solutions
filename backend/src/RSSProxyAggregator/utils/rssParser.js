// ------------------------------------------------------------
// rssParser.js — v2.0 (Compatible With handleFeed.js)
// ------------------------------------------------------------

const Parser = require("rss-parser");
const parser = new Parser();

function normalizeItem(raw, sourceLabel) {
  return {
    title: raw.title || "Untitled",
    url: raw.link || raw.guid || "#",
    date: raw.isoDate || raw.pubDate || null,
    source: sourceLabel,
    summary: raw.contentSnippet || raw.content || ""
  };
}

async function rssParser(url, sourceLabel = "") {
  if (!url) throw new Error("Missing RSS URL");

  try {
    const feed = await parser.parseURL(url);

    const items = (feed.items || []).map(item =>
      normalizeItem(item, sourceLabel || feed.title || "")
    );

    return { items };
  } catch (err) {
    console.error("[rssParser] ERROR:", err);
    return { items: [] };
  }
}

module.exports = { rssParser };
