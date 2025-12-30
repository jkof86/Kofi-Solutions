// ------------------------------------------------------------
// etfMap.js — v1.180 (Yahoo Finance ETF Symbols, Alphabetized)
// ------------------------------------------------------------
//
// Notes:
//   • Keys must be lowercase ticker symbols
//   • Values must be EXACT Yahoo Finance tickers
//   • Used by handleMarket → fetchYahooEtf
//   • Fully compatible with symbol normalization (BRK.B → brk-b)
//   • Alphabetized for maintainability
//
// ------------------------------------------------------------

const ETF_MAP = {
  arkg: "ARKG",
  arkk: "ARKK",
  arkw: "ARKW",
  bnd: "BND",
  dia: "DIA",
  gdx: "GDX",
  ijr: "IJR",
  iwd: "IWD",
  iwf: "IWF",
  schd: "SCHD",
  slv: "SLV",
  spy: "SPY",
  tlt: "TLT",
  vgt: "VGT",
  vht: "VHT",
  vti: "VTI",
  voo: "VOO",
  vym: "VYM",
  vnq: "VNQ",
  xlb: "XLB",
  xlc: "XLC",
  xle: "XLE",
  xlf: "XLF",
  xli: "XLI",
  xlk: "XLK",
  xlp: "XLP",
  xlu: "XLU",
  xly: "XLY"
};

// ------------------------------------------------------------
// Optional future additions (commented for now)
// ------------------------------------------------------------
// jeq: "JEQ",      // Japan Equity Fund
// eem: "EEM",      // Emerging Markets
// xbi: "XBI",      // Biotech
// tan: "TAN",      // Solar
// soxx: "SOXX",    // Semiconductors

module.exports = { ETF_MAP };
