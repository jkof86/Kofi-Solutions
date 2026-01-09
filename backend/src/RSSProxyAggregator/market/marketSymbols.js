// ------------------------------------------------------------
// marketSymbols.js — v1.205 (Validated + Map‑Aligned)
// IMPORTANT:
// Do NOT use MARKET_SYMBOLS inside handleHealth.js.
// It will cause 70+ Yahoo calls → Lambda timeout → 503 errors.
// handleHealth must use a curated list instead.

// ------------------------------------------------------------

const MARKET_SYMBOLS = [
  // -------------------------
  // CRYPTO (from CRYPTO_MAP)
  // -------------------------
  "ada", "avax", "bch", "bonk", "btc", "doge",
  "eth", "icp", "ltc", "shib", "sol", "trx",
  "xrp", "zec",

  // -------------------------
  // STOCKS (from STOCK_MAP)
  // -------------------------
  "aapl", "amzn", "bac", "brk-b", "dis", "gme",
  "goog", "gs", "ibm", "intc", "jpm", "ma",
  "meta", "msft", "nflx", "nvo", "nvda",
  "orcl", "pfe", "qcom", "sap", "stm",
  "tsla", "txn", "v", "xom",

  // -------------------------
  // ETFs (from ETF_MAP)
  // -------------------------
  "arkg", "arkk", "arkw", "bnd", "dia", "gdx",
  "ijr", "iwd", "iwf", "qqq", "schd", "slv",
  "spy", "tlt", "vgt", "vht", "vti", "vnq",
  "voo", "vym", "xlb", "xlc", "xle", "xlf",
  "xli", "xlk", "xlp", "xlu", "xlv", "xly"
];

module.exports = { MARKET_SYMBOLS };
