// ------------------------------------------------------------
// tickerConfig.js — Kofi Solutions v1.300
// ------------------------------------------------------------
// Fully updated to support:
//   ✓ Crypto (Yahoo format: BTC-USD, ETH-USD, etc.)
//   ✓ Tech stocks
//   ✓ Finance ETFs
//   ✓ New additions: DOGE, XRP, ZEC, GOOG, NVDA, TSLA, META,
//                    IBIT, ARKG, BLOK
// ------------------------------------------------------------


// ------------------------------------------------------------
// 1. Category → Symbols (UI-facing, Yahoo-compatible)
// ------------------------------------------------------------
// IMPORTANT:
// Crypto *must* use Yahoo symbols (BTC-USD, ETH-USD, etc.)
// Stocks/ETFs use uppercase tickers as usual.
// ------------------------------------------------------------

export const CATEGORY_SYMBOLS = {
  crypto: [
    "BTC-USD",
    "ETH-USD",
    "SOL-USD",
    "DOGE-USD",
    "XRP-USD",
    "ZEC-USD"
  ],

  tech: [
    "AAPL",
    "MSFT",
    "AMZN",
    "GOOG",
    "NVDA",
    "TSLA",
    "META"
  ],

  finance: [
    "SPY",
    "VTI",
    "VOO",
    "IBIT",
    "ARKG",
    "BLOK"
  ]
};

export const ALL_MARKET_SYMBOLS = [
  // Crypto (Yahoo format)
  "BTC-USD",
  "ETH-USD",
  "SOL-USD",
  "DOGE-USD",
  "XRP-USD",
  "ZEC-USD",

  // Tech
  "AAPL",
  "MSFT",
  "AMZN",
  "GOOG",
  "NVDA",
  "TSLA",
  "META",

  // Finance / ETFs
  "SPY",
  "VTI",
  "VOO",
  "IBIT",
  "ARKG",
  "BLOK"
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
// Clean, readable, emoji-safe icons for all active symbols.
// ------------------------------------------------------------

export const SYMBOL_ICONS = {
  // Crypto (Yahoo format)
  "BTC-USD": "₿",
  "ETH-USD": "◆",
  "SOL-USD": "◎",
  "DOGE-USD": "🐶",
  "XRP-USD": "✦",
  "ZEC-USD": "ⓩ",

  // Tech
  AAPL: "",
  MSFT: "🪟",
  AMZN: "🛒",
  GOOG: "🔍",
  NVDA: "🎮",
  TSLA: "⚡",
  META: "∞",

  // Finance / ETFs
  SPY: "📈",
  VTI: "📊",
  VOO: "📘",
  IBIT: "🟦",
  ARKG: "🧬",
  BLOK: "🧱"
};

// ------------------------------------------------------------
// 5. Lowercase icon map (backend-safe)
// ------------------------------------------------------------
export const SYMBOL_ICONS_LOWER = Object.fromEntries(
  Object.entries(SYMBOL_ICONS).map(([k, v]) => [
    k.toLowerCase(),
    v
  ])
);


// ------------------------------------------------------------
// 6. Normalized symbol list (backend-safe)
// ------------------------------------------------------------
// Converts:
//   BTC-USD → btc-usd
//   AAPL    → aapl
//   IBIT    → ibit
// ------------------------------------------------------------

export const NORMALIZED_SYMBOLS = TICKER_SYMBOLS.map((s) =>
  s.toLowerCase().replace(/\./g, "-")
);
