// ------------------------------------------------------------
// handleCoinGeckoNews.js — v3.1 (Normalized + Debug + Safe)
// ------------------------------------------------------------
//
// Standardized return shape:
//
//   {
//     status: "ok",
//     ok: true,
//     type: "json",
//     count: Number,
//     items: [ { title, link, date, source, description } ],
//     error: null,
//     debug: { ... } | null
//   }
//
// Improvements in v3.1:
//   • Always returns normalized object (never raw array)
//   • Added debug passthrough
//   • Hardened CoinGecko parsing
//   • Fully compatible with jsonHandlers.js v1.190
//   • Fully compatible with handleFeed.js v1.190
//
// ------------------------------------------------------------

const axios = require("axios");

async function handleCoinGeckoNews(url, opts = {}) {
  const debug = opts.debug ? {} : null;

  try {
    const { data } = await axios.get(url, { timeout: 8000 });

    if (debug) debug.raw = data;

    const updates = data?.status_updates;
    if (!Array.isArray(updates) || updates.length === 0) {
      return {
        status: "ok",
        ok: true,
        type: "json",
        count: 0,
        items: [],
        error: null,
        debug
      };
    }

    const items = updates.map((item) => ({
      title: `${item.project?.name || "Crypto"} — ${item.category || "update"}`,
      link: "https://www.coingecko.com/en/news",
      date: item.created_at || new Date().toISOString(),
      source: "CoinGecko",
      description: item.description || ""
    }));

    return {
      status: "ok",
      ok: true,
      type: "json",
      count: items.length,
      items,
      error: null,
      debug
    };

  } catch (err) {
    console.error("[handleCoinGeckoNews] ERROR:", err);

    return {
      status: "error",
      ok: false,
      type: "json",
      count: 0,
      items: [],
      error: String(err),
      debug: opts.debug ? { error: String(err) } : null
    };
  }
}

module.exports = handleCoinGeckoNews;
