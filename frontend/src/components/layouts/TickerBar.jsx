// ------------------------------------------------------------
// TickerBar.jsx — v1.200 (No Crypto Lock + True Multi‑Category)
// ------------------------------------------------------------
//
// Major Fixes:
//   ✓ NEVER falls back to crypto unless explicitly selected
//   ✓ Category validation is strict — no silent fallback
//   ✓ If a category has no valid symbols → show “No symbols”
//   ✓ If backend errors for all symbols → show “Offline”
//   ✓ Supports ANY category defined in CATEGORY_SYMBOLS
//   ✓ Clean logging to identify category/symbol issues
//
// ------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { Box, Typography, Chip, Alert } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import {
  TICKER_SYMBOLS,
  CATEGORY_SYMBOLS,
  CATEGORY_COLORS,
  SYMBOL_ICONS
} from "../../data/tickerConfig";

console.log("TickerBar v1.200 loaded");

const API =
  "https://jy4i499sj1.execute-api.us-east-1.amazonaws.com/default/RSSProxyAggregator";

export default function TickerBar({ activeCategory }) {
  const [prices, setPrices] = useState({});
  const [lastUpdated, setLastUpdated] = useState("");
  const [offline, setOffline] = useState(false);
  const [symbols, setSymbols] = useState([]);

  // ------------------------------------------------------------
  // Validate category + load symbols
  // ------------------------------------------------------------
  useEffect(() => {
    if (!activeCategory) {
      console.warn("[Ticker] No activeCategory provided");
      setSymbols([]);
      return;
    }

    const list = CATEGORY_SYMBOLS[activeCategory];

    if (!Array.isArray(list)) {
      console.warn(`[Ticker] Category '${activeCategory}' not found`);
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
    setOffline(false);
  }, [activeCategory]);

  // ------------------------------------------------------------
  // Fetch market data
  // ------------------------------------------------------------
  useEffect(() => {
    if (symbols.length === 0) {
      setPrices({});
      setOffline(true);
      return;
    }

    const fetchTickerData = async () => {
      const results = {};
      let okCount = 0;

      await Promise.all(
        symbols.map(async (lower) => {
          const url = `${API}?mode=market&symbol=${encodeURIComponent(lower)}`;

          try {
            const res = await fetch(url);
            const json = await res.json();

            const isOk =
              json?.status === "ok" &&
              (json.type === "crypto" ? json.price != null : true);

            if (isOk) {
              okCount++;
              results[lower] = {
                type: json.type,
                price: json.price,
                change: json.change_24h ?? null,
                warning: false
              };
            } else {
              results[lower] = { warning: true };
            }
          } catch (err) {
            results[lower] = { warning: true };
          }
        })
      );

      if (okCount === 0) {
        console.warn(`[Ticker] All symbols failed for category '${activeCategory}'`);
        setOffline(true);
        setPrices({});
        return;
      }

      setOffline(false);
      setPrices(results);
      setLastUpdated(new Date().toLocaleTimeString());
    };

    fetchTickerData();
    const interval = setInterval(fetchTickerData, 60000);
    return () => clearInterval(interval);
  }, [symbols, activeCategory]);

  // ------------------------------------------------------------
  // Reset scroll animation
  // ------------------------------------------------------------
  useEffect(() => {
    const el = document.querySelector(".scroll");
    if (el) {
      el.style.animation = "none";
      void el.offsetHeight;
      el.style.animation = "";
    }
  }, [symbols, offline]);

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
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
      {symbols.length === 0 && (
        <Alert severity="info" sx={{ mb: 1 }}>
          No symbols defined for category: {activeCategory}
        </Alert>
      )}

      {offline && symbols.length > 0 && (
        <Alert severity="warning" sx={{ mb: 1 }}>
          Market data unavailable for category: {activeCategory}
        </Alert>
      )}

      <Box
        className="scroll"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          animation: "scrollTicker 25s linear infinite"
        }}
      >
        {symbols.map((sym, idx) => {
          const lower = sym.toLowerCase();
          const upper = lower.toUpperCase();
          const p = prices[lower];
          const icon = SYMBOL_ICONS[upper] || "";

          return (
            <Box
              key={`${upper}-${idx}`}
              sx={{ display: "flex", alignItems: "center", mx: 4 }}
            >
              <Chip
                label={activeCategory.toUpperCase()}
                size="small"
                sx={{
                  mr: 1,
                  backgroundColor: CATEGORY_COLORS[activeCategory] || "#666",
                  color: "#fff",
                  fontWeight: 600
                }}
              />

              {!p || p.warning ? (
                <Typography
                  variant="body2"
                  sx={{ color: "warning.main", fontWeight: 600 }}
                >
                  {icon} {upper}: <WarningAmberIcon fontSize="small" />
                </Typography>
              ) : p.type === "crypto" ? (
                <Typography
                  variant="body2"
                  sx={{
                    color: p.change >= 0 ? "success.main" : "error.main",
                    fontWeight: 600
                  }}
                >
                  {icon} {upper}: ${p.price.toFixed(2)} (
                  {p.change >= 0 ? "+" : ""}
                  {p.change.toFixed(2)}%)
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  sx={{ color: "text.primary", fontWeight: 600 }}
                >
                  {icon} {upper}: N/A
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
