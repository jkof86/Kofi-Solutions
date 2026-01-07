// ------------------------------------------------------------
// TickerBar.jsx — v1.21 (Fully Patched + Yahoo-Safe Symbols)
// ------------------------------------------------------------
// Fixes:
//   ✓ Crypto symbols now match backend keys (btc-usd, doge-usd, etc.)
//   ✓ Category mapping uses normalized keys
//   ✓ Icon lookup uses uppercase Yahoo symbols
//   ✓ All symbols display correctly in ticker
//   ✓ Scroll animation resets cleanly
// ------------------------------------------------------------

import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Chip } from "@mui/material";

import {
  ALL_MARKET_SYMBOLS,
  CATEGORY_COLORS,
  SYMBOL_ICONS
} from "../../data/tickerConfig";

import { FeedStatusContext } from "../../context/FeedStatusContext";

console.log("TickerBar v1.21 loaded");

// ------------------------------------------------------------
// Symbol → Category mapping (normalized keys)
// ------------------------------------------------------------
const SYMBOL_CATEGORY = {
  // Crypto (Yahoo normalized)
  "btc-usd": "crypto",
  "eth-usd": "crypto",
  "sol-usd": "crypto",
  "doge-usd": "crypto",
  "xrp-usd": "crypto",
  "zec-usd": "crypto",

  // Tech
  aapl: "tech",
  msft: "tech",
  amzn: "tech",
  goog: "tech",
  nvda: "tech",
  tsla: "tech",
  meta: "tech",

  // Finance / ETFs
  spy: "finance",
  vti: "finance",
  voo: "finance",
  ibit: "finance",
  arkg: "finance",
  blok: "finance"
};

export default function TickerBar() {
  const { health } = useContext(FeedStatusContext);

  const [symbols, setSymbols] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");

  // ------------------------------------------------------------
  // 1. Load all symbols (normalized)
  // ------------------------------------------------------------
  useEffect(() => {
    const cleaned = ALL_MARKET_SYMBOLS.map((s) =>
      String(s).trim().toLowerCase()
    );

    setSymbols(cleaned);
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);

  // ------------------------------------------------------------
  // 2. Reset scroll animation when symbols change
  // ------------------------------------------------------------
  useEffect(() => {
    const el = document.querySelector(".scroll");
    if (el) {
      el.style.animation = "none";
      void el.offsetHeight;
      el.style.animation = "";
    }
  }, [symbols]);

  // ------------------------------------------------------------
  // 3. Render
  // ------------------------------------------------------------
  const markets = health?.markets || {};

  if (!health || !health.markets || Object.keys(markets).length === 0) {
    return (
      <Box sx={{ py: 1, px: 2 }}>
        <Typography variant="body2" sx={{ opacity: 0.6 }}>
          Loading market data…
        </Typography>
      </Box>
    );
  }

  // Only show valid market entries
  const visible = symbols.filter((sym) => {
    const m = markets[sym];
    // const m = markets[sym] || markets[sym.toUpperCase()];
    return (
      m &&
      m.status === "ok" &&
      typeof m.price === "number" &&
      m.price > 0
    );
  });

  return (
    <Box
      sx={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        backgroundColor: "#f5f5f5",
        py: 1,
        px: 2,
        position: "relative",
        "&:hover .scroll": { animationPlayState: "paused" }
      }}
    >
      {visible.length === 0 && (
        <Typography variant="body2" color="warning.main">
          No valid market data available
        </Typography>
      )}

      {/* Scrolling ticker */}
      <Box
        className="scroll"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          animation: "scrollTicker 25s linear infinite"
        }}
      >
        {visible.map((sym, idx) => {
          const m = markets[sym];
          const upper = sym.toUpperCase(); // e.g., "DOGE-USD"
          const icon = SYMBOL_ICONS[upper] || "";

          // Determine chip color category
          const cat = SYMBOL_CATEGORY[sym] || "finance";

          return (
            <Box
              key={`${upper}-${idx}`}
              sx={{ display: "flex", alignItems: "center", mx: 4 }}
            >
              {/* Category Chip */}
              <Chip
                label={cat.toUpperCase()}
                size="small"
                sx={{
                  mr: 1,
                  backgroundColor: CATEGORY_COLORS[cat] || "#666",
                  color: "#fff",
                  fontWeight: 600
                }}
              />

              {/* Market Data */}
              {["crypto", "stock", "etf"].includes(m.type) ? (
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      typeof m.change_24h === "number" && m.change_24h >= 0
                        ? "success.main"
                        : "error.main",
                    fontWeight: 600
                  }}
                >
                  {icon} {upper}: ${m.price.toFixed(2)} (
                  {typeof m.change_24h === "number"
                    ? `${m.change_24h >= 0 ? "+" : ""}${m.change_24h.toFixed(
                      2
                    )}%`
                    : "0.00%"}
                  )
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  sx={{ color: "text.primary", fontWeight: 600 }}
                >
                  {icon} {upper}: ${m.price.toFixed(2)}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>

      {/* Timestamp */}
      <Typography
        variant="caption"
        sx={{
          position: "absolute",
          right: 12,
          bottom: 2,
          opacity: 0.6
        }}
      >
        Updated: {lastUpdated}
      </Typography>

      {/* Animation */}
      <style>
        {`
          @keyframes scrollTicker {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
    </Box>
  );
}
