// ------------------------------------------------------------
// handleYahooCrypto.js — v2.1 (Normalized + Debug + Safe)
// ------------------------------------------------------------
//
// Standardized return shape:
//
//   {
//     status: "ok",
//     ok: true,
//     type: "json",
//     count: Number,
//     items: [ { title, link, date, source, price, changePercent } ],
//     error: null,
//     debug: { ... } | null
//   }
//
// Improvements in v2.1:
//   • Always returns normalized object (never raw array)
//   • Added debug passthrough
//   • Hardened Yahoo Finance parsing
//   • Fully compatible with jsonHandlers.js v1.190
//   • Fully compatible with handleFeed.js v1.190
//
// ------------------------------------------------------------

const axios = require("axios");

async function handleYahooCrypto(url, opts = {}) {
  const debug = opts.debug ? {} : null;

  try {
    const { data } = await axios.get(url, { timeout: 8000 });

    const results = data?.quoteResponse?.result;
    if (debug) debug.raw = data;

    if (!Array.isArray(results) || results.length === 0) {
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

    const items = results.map((item) => ({
      title: `${item.symbol} — $${item.regularMarketPrice}`,
      link: `https://finance.yahoo.com/quote/${item.symbol}`,
      date: new Date().toISOString(),
      source: "Yahoo Finance",
      price: item.regularMarketPrice ?? null,
      changePercent: item.regularMarketChangePercent ?? null
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
    console.error("[handleYahooCrypto] ERROR:", err);

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

module.exports = handleYahooCrypto;
