// tickerConfig.js — Kofi Solutions 1.142

export const CATEGORY_SYMBOLS = {
  crypto: ["BTC", "ETH", "SOL", "XRP", "ADA", "AVAX"],
  finance: ["JPM", "GS", "BAC", "V", "MA", "BRK.B"],
  tech: ["AAPL", "MSFT", "AMZN", "GOOG", "META", "NVDA"],
  iot: ["QCOM", "TXN", "STM"],
  spring: ["ORCL", "IBM", "SAP"],
  sports: ["DIS", "WBD", "MANU"]
};

export const TICKER_SYMBOLS = Object.values(CATEGORY_SYMBOLS).flat();

export const CATEGORY_COLORS = {
  crypto: "#ff9800",
  finance: "#1976d2",
  tech: "#4caf50",
  iot: "#9c27b0",
  spring: "#795548",
  sports: "#e91e63"
};

export const SYMBOL_ICONS = {
  BTC: "₿",
  ETH: "◆",
  SOL: "◎",
  AAPL: "",
  MSFT: "🪟",
  AMZN: "🛒",
  META: "∞",
  NVDA: "🎮",
  JPM: "🏦",
  DIS: "🎬",
  MANU: "⚽"
};
