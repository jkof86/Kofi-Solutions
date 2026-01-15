// ------------------------------------------------------------
// fetchYahooUnified.js — v1.000 (Unified Market Fetcher)
// ------------------------------------------------------------
//
// Purpose:
//   Single entry point for market data, wrapping:
//     • fetchYahooStock (crypto + stocks)
//     • fetchYahooEtf   (ETFs)
//
// NOT YET INTEGRATED — safe to keep on disk for later.
//
// Features:
//   ✓ Range-aware (1D / 1W / 1M / 1Y)
//   ✓ Type routing (crypto / stock / etf)
//   ✓ Consistent payload shape
//
// ------------------------------------------------------------

const { fetchYahooStock } = require("./fetchYahooStock.js");
const { fetchYahooEtf } = require("./fetchYahooEtf.js");
const { ETF_MAP } = require("../config/etfMap.js");

async function fetchYahooUnified(symbol, opts = {}) {
  const lower = String(symbol).trim().toLowerCase();

  // ------------------------------------------------------------
  // 1. Determine type
  // ------------------------------------------------------------
  const isCrypto = lower.endsWith("-usd");
  const isEtf = !!ETF_MAP[lower];

  // ------------------------------------------------------------
  // 2. Route to correct fetcher
  // ------------------------------------------------------------
  if (isEtf) {
    return fetchYahooEtf(symbol, {
      range: opts.range || "1W",
      timeout: opts.timeout,
      debug: opts.debug
    });
  }

  // Crypto + stocks both go through fetchYahooStock
  return fetchYahooStock(symbol, {
    range: opts.range || "1W",
    timeout: opts.timeout,
    debug: opts.debug
  });
}

module.exports = { fetchYahooUnified };
