// ------------------------------------------------------------
// safeRssFetch.js — Never crashes, always returns { ok, items }
// ------------------------------------------------------------

const { parseFeed } = require("./parseFeed.js");
const { buildFallbackCard } = require("../../utils/fallback.js");

async function safeRssFetch(url, feedKey) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/rss+xml, application/xml, text/xml;q=0.9,*/*;q=0.8"
      }
    });

    const text = await res.text();

    // HTML returned instead of RSS
    if (text.trim().startsWith("<!DOCTYPE html") || text.includes("<html")) {
      throw new Error("HTML returned instead of RSS");
    }

    const items = parseFeed(text, feedKey);
    return { ok: true, items };

  } catch (err) {
    console.error(`RSS error for ${feedKey}:`, err.message);
    return {
      ok: false,
      items: [buildFallbackCard(feedKey)]
    };
  }
}

module.exports = { safeRssFetch };
