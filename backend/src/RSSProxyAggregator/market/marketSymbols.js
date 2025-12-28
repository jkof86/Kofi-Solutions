// ------------------------------------------------------------
// marketSymbols.js — v1.160 (Recreated)
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
  "btc",
  "eth",
  "sol",
  "xrp",
  "ada",
  "avax",
  "bch",
  "doge",
  "ltc",
  "shib",
  "trx",
  "icp",
  "zec",
  "bonk",

  // -------------------------
  // STOCKS (from STOCK_MAP)
  // -------------------------
  "amzn",
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
  "spy",
  "qqq",
  "dia",
  "vti",
  "voo",
  "iwf",
  "iwd",
  "ijr",
  "xlf",
  "xle",
  "xlk",
  "xlv",
  "xly",
  "xlp",
  "xli",
  "xlb",
  "xlc",
  "xlu",
  "arkk",
  "arkw",
  "arkg",
  "schd",
  "vym",
  "vgt",
  "vht",
  "vnq",
  "gdx",
  "slv",
  "tlt",
  "bnd"
];

module.exports = { MARKET_SYMBOLS };
