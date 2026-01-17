// ------------------------------------------------------------
// TickerBar.jsx — v1.25 (Stage-Aware, Lowercase-Aligned)
// ------------------------------------------------------------

import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Chip } from "@mui/material";

import {
  ALL_MARKET_SYMBOLS,
  CATEGORY_COLORS,
  SYMBOL_ICONS
} from "../../data/tickerConfig";

import { FeedStatusContext } from "../../context/FeedStatusContext";
import { API_BASE } from "../../data/api";

console.log("TickerBar v1.25 loaded");

// ------------------------------------------------------------
// Symbol → Category mapping (normalized keys)
// ------------------------------------------------------------
const SYMBOL_CATEGORY = {
  // Crypto
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
  // 1. Load all symbols (already lowercase)
  // ------------------------------------------------------------
  useEffect(() => {
    setSymbols(ALL_MARKET_SYMBOLS);
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);

  // ------------------------------------------------------------
  // 2. Fetch ticker data (1D range)
  // ------------------------------------------------------------
  const [tickerMarkets, setTickerMarkets] = useState({});

  useEffect(() => {
    const fetchTicker = async () => {
      try {
        const url = `${API_BASE}?mode=market_all&range=1D`;
        const res = await fetch(url);
        const json = await res.json();
        setTickerMarkets(json.markets || {});
      } catch (err) {
        console.error("Ticker fetch error:", err);
      }
    };

    fetchTicker();
    const interval = setInterval(fetchTicker, 30000);
    return () => clearInterval(interval);
  }, []);

  // ------------------------------------------------------------
  // 3. Reset scroll animation when symbols change
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
  // 4. Render
  // ------------------------------------------------------------
  const markets = tickerMarkets;

  if (!markets || Object.keys(markets).length === 0) {
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
    return (
      m &&
      m.status === "ok" &&
      typeof m.price === "number" &&
      m.price > 0
    );
  });

  // ------------------------------------------------------------
  // 5. Sort by category (crypto → tech → finance)
  // ------------------------------------------------------------
  const sorted = [...visible].sort((a, b) => {
    const catA = SYMBOL_CATEGORY[a] || "finance";
    const catB = SYMBOL_CATEGORY[b] || "finance";
    return catA.localeCompare(catB);
  });

  // ------------------------------------------------------------
  // 6. Duplicate content for seamless infinite scroll
  // ------------------------------------------------------------
  const doubled = [...sorted, ...sorted];

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
      {sorted.length === 0 && (
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
          animation: "scrollTicker 60s linear infinite"
        }}
      >
        {doubled.map((sym, idx) => {
          const m = markets[sym];
          const icon = SYMBOL_ICONS[sym] || "";
          const cat = SYMBOL_CATEGORY[sym] || "finance";

          return (
            <Box
              key={`${sym}-${idx}`}
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
                {icon} {sym.toUpperCase()}: ${m.price.toFixed(2)} (
                {typeof m.change_24h === "number"
                  ? `${m.change_24h >= 0 ? "+" : ""}${m.change_24h.toFixed(
                      2
                    )}%`
                  : "0.00%"}
                )
              </Typography>
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
