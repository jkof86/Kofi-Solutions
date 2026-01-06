// ------------------------------------------------------------
// TickerBar.jsx — v1.20 (Cleaned + 3‑Category Routing)
// ------------------------------------------------------------
// This version:
//   ✓ Maps ANY incoming feed category → crypto | finance | tech
//   ✓ Loads symbols safely
//   ✓ Removes broken setActiveCategory calls
//   ✓ Removes duplicate switch cases
//   ✓ Adds clean comments + stable logic
// ------------------------------------------------------------

import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Chip } from "@mui/material";

import {
  CATEGORY_SYMBOLS,
  CATEGORY_COLORS,
  SYMBOL_ICONS
} from "../../data/tickerConfig";

import { FeedStatusContext } from "../../context/FeedStatusContext";

console.log("TickerBar v1.20 loaded");

export default function TickerBar({ activeCategory }) {
  const { health } = useContext(FeedStatusContext);

  const [symbols, setSymbols] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");

  // ------------------------------------------------------------
  // 1. Map ANY feed category → one of the 3 master categories
  // ------------------------------------------------------------
  const resolveMasterCategory = (cat) => {
    switch (cat) {
      case "crypto":
        return "crypto";

      // Finance umbrella
      case "finance":
      case "alternative_news":
      case "news":
      case "sports":
        return "finance";

      // Tech umbrella
      case "tech":
      case "aws":
      case "react":
      case "spring":
      case "java":
        return "tech";

      default:
        return "finance"; // fallback
    }
  };

  // ------------------------------------------------------------
  // 2. Load symbols whenever activeCategory changes
  // ------------------------------------------------------------
  useEffect(() => {
    if (!activeCategory) {
      console.warn("[Ticker] No activeCategory provided");
      setSymbols([]);
      return;
    }

    const master = resolveMasterCategory(activeCategory);
    const list = CATEGORY_SYMBOLS[master];

    if (!Array.isArray(list)) {
      console.warn(`[Ticker] No symbol list for category '${master}'`);
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
  // 3. Reset scroll animation when symbols change
  // ------------------------------------------------------------
  useEffect(() => {
    const el = document.querySelector(".scroll");
    if (el) {
      el.style.animation = "none";
      void el.offsetHeight; // force reflow
      el.style.animation = "";
    }
  }, [symbols]);

  // ------------------------------------------------------------
  // 4. Render
  // ------------------------------------------------------------
  const markets = health?.markets || {};

  // Loading state
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
    return (
      m &&
      m.status === "ok" &&
      typeof m.price === "number" &&
      m.price > 0
    );
  });

  const masterCategory = resolveMasterCategory(activeCategory);

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
          No valid market data for category: {masterCategory}
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
          const upper = sym.toUpperCase();
          const icon = SYMBOL_ICONS[upper] || "";

          return (
            <Box
              key={`${upper}-${idx}`}
              sx={{ display: "flex", alignItems: "center", mx: 4 }}
            >
              {/* Category Chip */}
              <Chip
                label={masterCategory.toUpperCase()}
                size="small"
                sx={{
                  mr: 1,
                  backgroundColor:
                    CATEGORY_COLORS[masterCategory] || "#666",
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
