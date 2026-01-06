// ------------------------------------------------------------
// handleCryptoPanic.js — v2.1 (Normalized + Debug + Safe)
// ------------------------------------------------------------
//
// Standardized return shape:
//
//   {
//     status: "ok",
//     ok: true,
//     type: "json",
//     count: Number,
//     items: [ { title, link, date, source } ],
//     error: null,
//     debug: { ... } | null
//   }
//
// Improvements in v2.1:
//   • Always returns normalized object (never raw array)
//   • Added debug passthrough
//   • Hardened CryptoPanic parsing
//   • Fully compatible with jsonHandlers.js v1.190
//   • Fully compatible with handleFeed.js v1.190
//
// ------------------------------------------------------------

const axios = require("axios");

async function handleCryptoPanic(url, opts = {}) {
  const debug = opts.debug ? {} : null;

  try {
    const { data } = await axios.get(url, { timeout: 8000 });

    if (debug) debug.raw = data;

    const results = data?.results;
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

    const items = results
      .filter((item) => item.title && item.url)
      .map((item) => ({
        title: item.title,
        link: item.url,
        date:
          item.published_at ||
          item.created_at ||
          new Date().toISOString(),
        source: "CryptoPanic"
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
    console.error("[handleCryptoPanic] ERROR:", err);

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

module.exports = handleCryptoPanic;
