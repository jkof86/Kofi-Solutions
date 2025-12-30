// ------------------------------------------------------------
// tickerConfig.js — Kofi Solutions v1.180
// ------------------------------------------------------------
// Fully aligned with FEEDS v1.180 + TickerBar v1.180
// Includes symbol normalization + complete icon set
// ------------------------------------------------------------

export const CATEGORY_SYMBOLS = {
  crypto: ["BTC", "ETH", "SOL", "XRP", "ADA", "AVAX"],
  finance: ["JPM", "GS", "BAC", "V", "MA", "BRK-B"],   // normalized
  tech: ["AAPL", "MSFT", "AMZN", "GOOG", "META", "NVDA"],
  iot: ["QCOM", "TXN", "STM"],
  spring: ["ORCL", "IBM", "SAP"],
  sports: ["DIS", "WBD", "MANU"]
};

// Flatten + dedupe
export const TICKER_SYMBOLS = [
  ...new Set(Object.values(CATEGORY_SYMBOLS).flat())
];

export const CATEGORY_COLORS = {
  crypto: "#ff9800",
  finance: "#1976d2",
  tech: "#4caf50",
  iot: "#9c27b0",
  spring: "#795548",
  sports: "#e91e63"
};

export const SYMBOL_ICONS = {
  // Crypto
  BTC: "₿",
  ETH: "◆",
  SOL: "◎",
  XRP: "✦",
  ADA: "◈",
  AVAX: "▲",

  // Tech
  AAPL: "",
  MSFT: "🪟",
  AMZN: "🛒",
  META: "∞",
  NVDA: "🎮",
  GOOG: "🔍",

  // Finance
  JPM: "🏦",
  GS: "💼",
  BAC: "🏛️",
  V: "💳",
  MA: "💳",
  "BRK-B": "🐂",

  // IoT
  QCOM: "📡",
  TXN: "🔌",
  STM: "⚙️",

  // Spring / Enterprise
  ORCL: "🧱",
  IBM: "💾",
  SAP: "📊",

  // Sports / Media
  DIS: "🎬",
  WBD: "📺",
  MANU: "⚽"
};
