// ------------------------------------------------------------
// tickerConfig.js — Kofi Solutions v1.206
// ------------------------------------------------------------
// Frontend ticker config aligned with backend curated symbols:
//   Crypto:  btc, eth, sol
//   Tech:    aapl, msft, amzn
//   Finance: spy, vti, voo
// ------------------------------------------------------------


// ------------------------------------------------------------
// 1. Category → Symbols (UI-facing, uppercase)
// ------------------------------------------------------------
// These are the ONLY symbols the backend tracks in v1.205+.
// All other symbols are commented out below in Section B.
//

export const CATEGORY_SYMBOLS = {
  crypto: ["BTC", "ETH", "SOL"],
  finance: ["SPY", "VTI", "VOO"],
  tech: ["AAPL", "MSFT", "AMZN"]
};

export const ALL_MARKET_SYMBOLS = [
  "BTC", "ETH", "SOL",
  "AAPL", "MSFT", "AMZN",
  "SPY", "VTI", "VOO"
];


// ------------------------------------------------------------
// 2. Flatten + dedupe
// ------------------------------------------------------------
export const TICKER_SYMBOLS = [
  ...new Set(Object.values(CATEGORY_SYMBOLS).flat())
];


// ------------------------------------------------------------
// 3. Category Colors
// ------------------------------------------------------------
export const CATEGORY_COLORS = {
  crypto: "#ff9800",
  tech: "#4caf50",
  finance: "#1976d2"
};


// ------------------------------------------------------------
// 4. Symbol Icons (UI-facing)
// ------------------------------------------------------------
// Only icons for active symbols are included.
// Full icon set is preserved in Section B.
//
export const SYMBOL_ICONS = {
  // Crypto
  BTC: "₿",
  ETH: "◆",
  SOL: "◎",

  // Tech
  AAPL: "",
  MSFT: "🪟",
  AMZN: "🛒",

  // Finance (ETFs)
  SPY: "📈",
  VTI: "📊",
  VOO: "📘"
};


// ------------------------------------------------------------
// 5. Lowercase icon map (backend-safe)
// ------------------------------------------------------------
export const SYMBOL_ICONS_LOWER = Object.fromEntries(
  Object.entries(SYMBOL_ICONS).map(([k, v]) => [k.toLowerCase(), v])
);


// ------------------------------------------------------------
// 6. Normalized symbol list (backend-safe)
// ------------------------------------------------------------
export const NORMALIZED_SYMBOLS = TICKER_SYMBOLS.map((s) =>
  s.toLowerCase().replace(/\./g, "-")
);



// ============================================================================
// B. FULL ORIGINAL CATEGORY SET (COMMENTED OUT)
// ============================================================================
// These symbols are NOT tracked by the backend in v1.205+.
// Keeping them here for future expansion or UI reference.
// ----------------------------------------------------------------------------
//
// export const CATEGORY_SYMBOLS = {
//   crypto: ["BTC", "ETH", "SOL", "XRP", "ADA", "AVAX", "DOGE", "SHIB", "LTC", "BCH", "ICP", "TRX", "ZEC", "BONK"],
//
//   finance: ["JPM", "GS", "BAC", "V", "MA", "BRK-B", "PFE", "NVO"],
//
//   tech: ["AAPL", "MSFT", "AMZN", "GOOG", "META", "NVDA", "NFLX", "INTC"],
//
//   iot: ["QCOM", "TXN", "STM"],
//
//   spring: ["ORCL", "IBM", "SAP"],
//
//   sports: ["DIS"]
// };
//
//
//