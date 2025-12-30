// ------------------------------------------------------------
// marketSymbols.js — v1.180 (Aligned + Stable)
// ------------------------------------------------------------
//
// This file defines the full list of symbols that the health
// checker will test using handleMarket().
//
// Requirements:
//   • All symbols must be lowercase
//   • All symbols must exist in CRYPTO_MAP, STOCK_MAP, or ETF_MAP
//   • No undefined, empty, or invalid entries
//   • No dots (BRK.B → brk-b handled by handleMarket)
//   • Must be stable for health checks
//
// ------------------------------------------------------------

const MARKET_SYMBOLS = [
  // -------------------------
  // CRYPTO (from CRYPTO_MAP)
  // -------------------------
  "ada",
  "avax",
  "bch",
  "bonk",
  "btc",
  "doge",
  "eth",
  "icp",
  "ltc",
  "shib",
  "sol",
  "trx",
  "xrp",
  "zec",

  // -------------------------
  // STOCKS (from STOCK_MAP)
  // -------------------------
  "amzn",
  "brk-b",
  "djt",
  "gme",
  "goog",
  "intc",
  "meta",
  "nflx",
  "nvo",
  "pfe",
  "rum",
  "tsla",
  "xom",

  // -------------------------
  // ETFs (from ETF_MAP)
  // -------------------------
  "arkg",
  "arkk",
  "arkw",
  "bnd",
  "dia",
  "gdx",
  "ijr",
  "iwd",
  "iwf",
  "qqq",
  "schd",
  "slv",
  "spy",
  "tlt",
  "vgt",
  "vht",
  "vti",
  "vnq",
  "voo",
  "vym",
  "xlb",
  "xlc",
  "xle",
  "xlf",
  "xli",
  "xlk",
  "xlp",
  "xlu",
  "xlv",
  "xly"
];

module.exports = { MARKET_SYMBOLS };
