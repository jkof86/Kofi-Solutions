// ------------------------------------------------------------
// tickerConfig.js — Kofi Solutions v1.205
// ------------------------------------------------------------
// Frontend ticker config aligned with backend v1.205
// ------------------------------------------------------------

// ------------------------------------------------------------
// 1. Category → Symbols (UI-facing, uppercase)
// ------------------------------------------------------------
export const CATEGORY_SYMBOLS = {
  crypto: ["BTC", "ETH", "SOL", "XRP", "ADA", "AVAX", "DOGE", "SHIB", "LTC", "BCH", "ICP", "TRX", "ZEC", "BONK"],

  finance: ["JPM", "GS", "BAC", "V", "MA", "BRK-B", "PFE", "NVO"],

  tech: ["AAPL", "MSFT", "AMZN", "GOOG", "META", "NVDA", "NFLX", "INTC"],

  iot: ["QCOM", "TXN", "STM"],

  spring: ["ORCL", "IBM", "SAP"],

  sports: ["DIS"] // Only symbol supported in backend
};

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
  finance: "#1976d2",
  tech: "#4caf50",
  iot: "#9c27b0",
  spring: "#795548",
  sports: "#e91e63"
};

// ------------------------------------------------------------
// 4. Symbol Icons (UI-facing)
// ------------------------------------------------------------
export const SYMBOL_ICONS = {
  // Crypto
  BTC: "₿", ETH: "◆", SOL: "◎", XRP: "✦", ADA: "◈", AVAX: "▲",
  DOGE: "🐶", SHIB: "🐕", LTC: "Ł", BCH: "Ƀ", ICP: "∞", TRX: "🔺", ZEC: "ⓩ", BONK: "🐕‍🦺",

  // Finance / Tech
  JPM: "🏦", GS: "💼", BAC: "🏛️", V: "💳", MA: "💳", "BRK-B": "🐂",
  PFE: "💉", NVO: "💊",

  AAPL: "", MSFT: "🪟", AMZN: "🛒", META: "∞", NVDA: "🎮",
  GOOG: "🔍", NFLX: "📺", INTC: "💾",

  // IoT
  QCOM: "📡", TXN: "🔌", STM: "⚙️",

  // Spring / Enterprise
  ORCL: "🧱", IBM: "💾", SAP: "📊",

  // Sports / Media
  DIS: "🎬"
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
