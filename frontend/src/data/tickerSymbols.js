export const TICKER_SYMBOLS = [
  // -------------------------
  // CRYPTO (exists in CRYPTO_MAP)
  // -------------------------
  "BTC", "ETH", "SOL", "XRP", "ADA", "AVAX",
  "DOGE", "SHIB", "LTC", "BCH", "ICP", "TRX", "ZEC", "BONK",

  // -------------------------
  // STOCKS (exists in STOCK_MAP)
  // -------------------------
  "AMZN", "AAPL", "MSFT", "GOOG", "META", "NVDA",
  "TSLA", "INTC", "NFLX", "XOM", "GME", "NVO", "PFE",
  "BRK-B",   // normalized by backend (BRK.B → brk-b)

  // -------------------------
  // ETFs (exists in ETF_MAP)
  // -------------------------
  "QQQ", "SPY", "VTI", "VOO", "VGT", "VHT", "VNQ", "VYM",
  "ARKK", "ARKG", "ARKW",
  "TLT", "BND", "DIA", "GDX", "SLV",
  "IWF", "IWD", "IJR",
  "XLB", "XLC", "XLE", "XLF", "XLI", "XLK", "XLP", "XLU", "XLV", "XLY",

  // -------------------------
  // ENTERPRISE / SPRING (mapped as stocks)
  // -------------------------
  "ORCL", "IBM", "SAP",

  // -------------------------
  // SPORTS / MEDIA (only include if mapped)
  // -------------------------
  // "DIS"  // include only if STOCK_MAP["dis"] exists
];
