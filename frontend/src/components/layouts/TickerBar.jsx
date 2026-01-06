import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Chip } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import {
  CATEGORY_SYMBOLS,
  CATEGORY_COLORS,
  SYMBOL_ICONS
} from "../../data/tickerConfig";

import { FeedStatusContext } from "../../context/FeedStatusContext";

console.log("TickerBar v1.9 loaded");

export default function TickerBar({ activeCategory }) {

  console.log("TICKER ACTIVE CATEGORY:", activeCategory);
  console.log("TICKER SYMBOLS:", CATEGORY_SYMBOLS[activeCategory?.toLowerCase()]);

  const { health } = useContext(FeedStatusContext);
  const [symbols, setSymbols] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");

  // ------------------------------------------------------------
  // Validate category + load symbols
  // ------------------------------------------------------------
  useEffect(() => {
    if (!activeCategory) {
      console.warn("[Ticker] No activeCategory provided");
      setSymbols([]);
      return;
    }

    const key = activeCategory.toLowerCase(); // normalize
    const list = CATEGORY_SYMBOLS[key];

    if (!Array.isArray(list)) {
      console.warn(`[Ticker] Category '${activeCategory}' not found in CATEGORY_SYMBOLS`);
      setSymbols([]);
      return;
    }

    if (list.length === 0) {
      console.warn(`[Ticker] Category '${activeCategory}' has no symbols`);
      setSymbols([]);
      return;
    }

    const cleaned = list
      .map((s) => String(s).trim().toLowerCase())
      .filter(Boolean);

    setSymbols(cleaned);
    setLastUpdated(new Date().toLocaleTimeString());
  }, [activeCategory]);

  // ------------------------------------------------------------
  // Reset scroll animation on symbol change
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
  // Render
  // ------------------------------------------------------------
  const markets = health?.markets || {};

  // If markets haven't loaded yet, show loading state
  if (!health || !health.markets || Object.keys(health.markets).length === 0) {
    return (
      <Box sx={{ py: 1, px: 2 }}>
        <Typography variant="body2" sx={{ opacity: 0.6 }}>
          Loading market data…
        </Typography>
      </Box>
    );
  }

  // Filter: only show symbols with valid price + status
  const visible = symbols.filter((sym) => {
    const m = markets[sym];
    return (
      m &&
      m.status === "ok" &&
      typeof m.price === "number" &&
      m.price > 0
    );
  });

  console.log("MARKETS:", markets);
  console.log("SYMBOLS:", symbols);
  console.log("VISIBLE:", visible);

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
          No valid market data for category: {activeCategory}
        </Typography>
      )}

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
          const upper = sym.toUpperCase();
          const icon = SYMBOL_ICONS[upper] || "";

          return (
            <Box
              key={`${upper}-${idx}`}
              sx={{ display: "flex", alignItems: "center", mx: 4 }}
            >
              {/* Category Chip */}
              <Chip
                label={activeCategory.toUpperCase()}
                size="small"
                sx={{
                  mr: 1,
                  backgroundColor: CATEGORY_COLORS[activeCategory.toLowerCase()] || "#666",
                  color: "#fff",
                  fontWeight: 600
                }}
              />

              {/* Market Data */}
              {m.type === "crypto" ? (
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
                    ? `${m.change_24h >= 0 ? "+" : ""}${m.change_24h.toFixed(2)}%`
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
