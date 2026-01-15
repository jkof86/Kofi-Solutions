// ------------------------------------------------------------
// tickerConfig.js — v1.301 (Fully Normalized, Lowercase Everywhere)
// ------------------------------------------------------------
// This version ensures 100% alignment with backend normalized keys.
// All symbols are lowercase, Yahoo-style crypto included.
// ------------------------------------------------------------

// ------------------------------------------------------------
// 1. Category → Symbols (all lowercase, normalized)
// ------------------------------------------------------------
export const CATEGORY_SYMBOLS = {
  crypto: [
    "btc-usd",
    "eth-usd",
    "sol-usd",
    "doge-usd",
    "xrp-usd",
    "zec-usd"
  ],

  tech: [
    "aapl",
    "msft",
    "amzn",
    "goog",
    "nvda",
    "tsla",
    "meta"
  ],

  finance: [
    "spy",
    "vti",
    "voo",
    "ibit",
    "arkg",
    "blok"
  ]
};

// ------------------------------------------------------------
// 2. Flatten + dedupe (all lowercase)
// ------------------------------------------------------------
export const ALL_MARKET_SYMBOLS = [
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
// 4. Symbol Icons (lowercase keys)
// ------------------------------------------------------------
export const SYMBOL_ICONS = {
  // Crypto
  "btc-usd": "₿",
  "eth-usd": "◆",
  "sol-usd": "◎",
  "doge-usd": "🐶",
  "xrp-usd": "✦",
  "zec-usd": "ⓩ",

  // Tech
  aapl: "🍎",
  msft: "🪟",
  amzn: "🛒",
  goog: "🔍",
  nvda: "🎮",
  tsla: "⚡",
  meta: "∞",

  // Finance / ETFs
  spy: "📈",
  vti: "📊",
  voo: "📘",
  ibit: "🟦",
  arkg: "🧬",
  blok: "🧱"
};

// ------------------------------------------------------------
// 5. Lowercase icon map (redundant now, but kept for compatibility)
// ------------------------------------------------------------
export const SYMBOL_ICONS_LOWER = SYMBOL_ICONS;

// ------------------------------------------------------------
// 6. Normalized symbol list (already normalized)
// ------------------------------------------------------------
export const NORMALIZED_SYMBOLS = ALL_MARKET_SYMBOLS;
