// ------------------------------------------------------------
// TickerBar.jsx — v1.195 (Backend‑Aligned + Category‑Safe)
// ------------------------------------------------------------
//
// Improvements in v1.195:
//   ✓ Correct category detection (lowercase symbols)
//   ✓ Correct fallback symbol normalization
//   ✓ Correct price key normalization
//   ✓ Correct fallback recovery logic
//   ✓ Scroll reset triggers on fallback changes
//   ✓ Uses backend change_24h field
//   ✓ Guards against malformed backend responses
//   ✓ Cleaner logging + safer fetch cycle
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

console.log("TickerBar v1.195 loaded");

const API =
  "https://jy4i499sj1.execute-api.us-east-1.amazonaws.com/default/RSSProxyAggregator";

const DEFAULT_CATEGORY = "crypto";

export default function TickerBar({ activeCategory = DEFAULT_CATEGORY }) {
  const [prices, setPrices] = useState({});
  const [lastUpdated, setLastUpdated] = useState("");

  // Always store symbols in lowercase
  const [symbols, setSymbols] = useState(
    (CATEGORY_SYMBOLS.crypto || TICKER_SYMBOLS).map((s) =>
      String(s).toLowerCase()
    )
  );

  const [fallbackSymbols, setFallbackSymbols] = useState([]);
  const [offline, setOffline] = useState(false);

  // ------------------------------------------------------------
  // Smart symbol selection when category changes
  // ------------------------------------------------------------
  useEffect(() => {
    const list = CATEGORY_SYMBOLS[activeCategory];

    if (Array.isArray(list) && list.length > 0) {
      setSymbols(list.map((s) => String(s).toLowerCase()));
    } else {
      console.warn(
        "[Ticker] Invalid or empty category symbols, falling back to crypto:",
        activeCategory
      );
      setSymbols(
        (CATEGORY_SYMBOLS.crypto || TICKER_SYMBOLS).map((s) =>
          String(s).toLowerCase()
        )
      );
    }

    // Reset fallback state when switching categories
    setFallbackSymbols([]);
    setOffline(false);
  }, [activeCategory]);

  // ------------------------------------------------------------
  // Fetch market data for current symbols (Smart Mode)
  // ------------------------------------------------------------
  useEffect(() => {
    const cleanSymbols = (symbols || []).filter(
      (s) => typeof s === "string" && s.trim().length > 0
    );

    if (!cleanSymbols.length) {
      console.warn("[Ticker] No valid symbols to fetch, skipping cycle");
      setPrices({});
      setOffline(true);
      return;
    }

    const fetchTickerData = async () => {
      const results = {};
      let successCount = 0;

      await Promise.all(
        cleanSymbols.map(async (lower) => {
          const url = `${API}?mode=market&symbol=${encodeURIComponent(lower)}`;

          try {
            const res = await fetch(url);
            const json = await res.json();

            if (json?.status === "ok" && json.price != null) {
              successCount++;
              results[lower] = {
                price: json.price,
                change: json.change_24h ?? 0,
                warning: false
              };
            } else {
              results[lower] = { warning: true };
            }
          } catch (err) {
            console.warn("[Ticker] Fetch error for symbol:", lower, err);
            results[lower] = { warning: true };
          }
        })
      );

      const failCount = cleanSymbols.length - successCount;
      const failRatio = failCount / cleanSymbols.length;

      // Smart fallback: if category is failing, show crypto fallback
      if (failRatio > 0.5 && activeCategory !== "crypto") {
        console.warn(
          "[Ticker] Market offline for category:",
          activeCategory,
          "→ Showing crypto fallback"
        );
        setOffline(true);
        setFallbackSymbols(
          CATEGORY_SYMBOLS.crypto.map((s) => String(s).toLowerCase())
        );
        return;
      }

      // Category is healthy
      setOffline(false);
      setFallbackSymbols([]);
      setPrices(results);
      setLastUpdated(new Date().toLocaleTimeString());
    };

    fetchTickerData();
    const interval = setInterval(fetchTickerData, 60000);
    return () => clearInterval(interval);
  }, [symbols, activeCategory]);

  // ------------------------------------------------------------
  // Reset scroll animation when symbol list OR fallback changes
  // ------------------------------------------------------------
  useEffect(() => {
    const el = document.querySelector(".scroll");
    if (el) {
      el.style.animation = "none";
      void el.offsetHeight;
      el.style.animation = "";
    }
  }, [symbols, fallbackSymbols, offline]);

  // ------------------------------------------------------------
  // Render ticker
  // ------------------------------------------------------------
  const renderSymbols = offline ? fallbackSymbols : symbols;

  return (
    <Box
      sx={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        backgroundColor: "#f5f5f5",
        py: 1,
        px: 2,
        position: "relative",
        "&:hover .scroll": {
          animationPlayState: "paused"
        }
      }}
    >
      {offline && (
        <Alert
          severity="warning"
          sx={{
            position: "absolute",
            top: -32,
            left: 0,
            right: 0,
            borderRadius: 0,
            textAlign: "center",
            fontWeight: 600
          }}
        >
          Market data temporarily unavailable — showing crypto fallback
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
        {renderSymbols.map((sym, idx) => {
          const lower = String(sym).toLowerCase();
          const upper = lower.toUpperCase();
          const p = prices[lower];

          // Correct category detection (lowercase)
          const category =
            Object.entries(CATEGORY_SYMBOLS).find(([cat, list]) =>
              list.map((s) => s.toLowerCase()).includes(lower)
            )?.[0] || "misc";

          const icon = SYMBOL_ICONS[upper] || "";

          return (
            <Box
              key={`${upper}-${idx}`}
              sx={{
                display: "flex",
                alignItems: "center",
                mx: 4
              }}
            >
              <Chip
                label={category.toUpperCase()}
                size="small"
                sx={{
                  mr: 1,
                  backgroundColor: CATEGORY_COLORS[category] || "#666",
                  color: "#fff",
                  fontWeight: 600
                }}
              />

              {!p || p.warning ? (
                <Typography
                  variant="body2"
                  sx={{ color: "warning.main", fontWeight: 600 }}
                >
                  {icon} {upper}:{" "}
                  <WarningAmberIcon
                    fontSize="small"
                    sx={{ verticalAlign: "middle" }}
                  />
                </Typography>
              ) : (
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
              )}

              <Box
                sx={{
                  width: 60,
                  height: 20,
                  ml: 1,
                  background: "linear-gradient(to right, #ccc, #eee)",
                  borderRadius: 1,
                  opacity: 0.4
                }}
              />
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
