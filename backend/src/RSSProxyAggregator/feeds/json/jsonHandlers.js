// ------------------------------------------------------------
// jsonHandlers.js — v1.190 (Normalized + Safe + Debug-Aware)
// ------------------------------------------------------------
//
// Responsibilities:
//   ✓ Provide a stable registry for all JSON feed handlers
//   ✓ Normalize handler output into a consistent shape:
//        {
//          status: "ok" | "error",
//          ok: Boolean,
//          count: Number,
//          items: Array,
//          type: "json",
//          error: String | null,
//          debug: Object | null
//        }
//   ✓ Ensure all handlers are AWS-safe and never throw
//   ✓ Support debug passthrough for health dashboard
//
// ------------------------------------------------------------

const handleYahooCrypto = require("./handleYahooCrypto.js");
const handleCryptoPanic = require("./handleCryptoPanic.js");
const handleCoinGeckoNews = require("./handleCoinGeckoNews.js");

// ------------------------------------------------------------
// Normalizer wrapper for all JSON handlers
// ------------------------------------------------------------
async function wrapJsonHandler(handler, feedId, opts = {}) {
  try {
    const raw = await handler(opts);

    const items = Array.isArray(raw?.items)
      ? raw.items
      : Array.isArray(raw?.data)
      ? raw.data
      : [];

    return {
      status: "ok",
      ok: true,
      type: "json",
      count: items.length,
      items,
      error: null,
      debug: opts.debug ? { raw } : null
    };
  } catch (err) {
    console.error(`[jsonHandlers][ERROR] ${feedId}:`, err);

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

// ------------------------------------------------------------
// Registry keyed by FEEDS[feedId].handler
// ------------------------------------------------------------
const JSON_HANDLERS = {
  yahoo_crypto: (opts) => wrapJsonHandler(handleYahooCrypto, "yahoo_crypto", opts),
  cryptopanic_crypto: (opts) => wrapJsonHandler(handleCryptoPanic, "cryptopanic_crypto", opts),
  coingecko_crypto: (opts) => wrapJsonHandler(handleCoinGeckoNews, "coingecko_crypto", opts)
};

module.exports = { JSON_HANDLERS };
