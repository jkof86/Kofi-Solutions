// ------------------------------------------------------------
// stocksMap.js — v1.180 (Yahoo Finance Stock Symbols, Alphabetized)
// ------------------------------------------------------------
//
// Notes:
//   • Keys must be lowercase ticker symbols
//   • Values must be EXACT Yahoo Finance tickers
//   • Fully compatible with symbol normalization (BRK.B → brk-b)
//   • Used by handleMarket → fetchYahooStock
//   • Alphabetized for maintainability
//
// ------------------------------------------------------------

const STOCK_MAP = {
  amzn: "AMZN",
  "brk-b": "BRK-B",   // normalized (BRK.B → BRK-B)
  djt: "DJT",
  gme: "GME",
  goog: "GOOG",
  intc: "INTC",
  meta: "META",
  nflx: "NFLX",
  nvo: "NVO",
  pfe: "PFE",
  rum: "RUM",
  tsla: "TSLA",
  xom: "XOM"
};

// ------------------------------------------------------------
// Optional future additions (commented for now)
// ------------------------------------------------------------
// amd: "AMD",
// arm: "ARM",
// baba: "BABA",
// coin: "COIN",
// pltr: "PLTR",

module.exports = { STOCK_MAP };
