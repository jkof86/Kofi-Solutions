// ------------------------------------------------------------
// marketSymbols.js — v1.0 (Canonical Market Symbol List)
// ------------------------------------------------------------
// All symbols are lowercase and normalized.
// Crypto always uses "-usd" suffix.
// Stocks/ETFs use plain tickers.
// ------------------------------------------------------------

module.exports.MARKET_SYMBOLS = [
  // Crypto
  "btc-usd", "eth-usd", "sol-usd", "doge-usd", "xrp-usd", "zec-usd",

  // Tech stocks
  "aapl", "msft", "amzn", "goog", "nvda", "tsla", "meta",

  // ETFs + finance
  "spy", "vti", "voo", "qqq",
  "arkg", "arkk", "arkw",
  "tlt", "bnd", "dia", "gdx", "slv",

  // Enterprise
  "orcl", "ibm", "sap"
];
