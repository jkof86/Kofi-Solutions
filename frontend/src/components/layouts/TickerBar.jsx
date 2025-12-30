// ------------------------------------------------------------
// TickerBar.jsx — v1.180 (Stable Mode + Non‑Sticky Fallback)
// ------------------------------------------------------------
//
// Improvements in v1.180:
//   • Smart Mode preserved
//   • Fallback no longer overwrites category symbols
//   • Fallback resets on tab switch
//   • Category switching fully respected
//   • Clean separation:
//         symbols         → category symbols
//         fallbackSymbols → crypto-only fallback
//   • Guards preserved
//   • Scroll reset preserved
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

console.log("TickerBar v1.190 loaded");


const API =
  "https://jy4i499sj1.execute-api.us-east-1.amazonaws.com/default/RSSProxyAggregator";

const DEFAULT_CATEGORY = "crypto";

export default function TickerBar({ activeCategory = DEFAULT_CATEGORY }) {
  const [prices, setPrices] = useState({});
  const [lastUpdated, setLastUpdated] = useState("");

  // Category symbols (primary)
  const [symbols, setSymbols] = useState(
    CATEGORY_SYMBOLS.crypto || TICKER_SYMBOLS
  );

  // Crypto fallback symbols (only used when offline)
  const [fallbackSymbols, setFallbackSymbols] = useState([]);

  const [offline, setOffline] = useState(false);

  // ------------------------------------------------------------
  // Smart symbol selection with guard
  // ------------------------------------------------------------
  useEffect(() => {
    const list = CATEGORY_SYMBOLS[activeCategory];

    if (Array.isArray(list) && list.length > 0) {
      setSymbols(list);
    } else {
      console.warn(
        "[Ticker] Invalid or empty category symbols, falling back to crypto:",
        activeCategory
      );
      setSymbols(CATEGORY_SYMBOLS.crypto || TICKER_SYMBOLS);
    }

    // Reset fallback when switching tabs
    setFallbackSymbols([]);
    setOffline(false);
  }, [activeCategory]);

  // ------------------------------------------------------------
  // Debug logging
  // ------------------------------------------------------------
  useEffect(() => {
    console.log("Ticker activeCategory:", activeCategory);
    console.log("Ticker symbols:", symbols);
    console.log("Ticker fallbackSymbols:", fallbackSymbols);
  }, [activeCategory, symbols, fallbackSymbols]);

  // ------------------------------------------------------------
  // Fetch market data for current symbols (guarded)
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

    const SUPPORTED = cleanSymbols.map((s) => s.toLowerCase());

    const fetchTickerData = async () => {
      const results = {};
      let successCount = 0;

      await Promise.all(
        SUPPORTED.map(async (lower) => {
          if (!lower || typeof lower !== "string") {
            console.warn("[Ticker] Skipping invalid symbol:", lower);
            return;
          }

          const upper = lower.toUpperCase();
          const url = `${API}?mode=market&symbol=${encodeURIComponent(lower)}`;

          // Guard against malformed URLs
          if (!url.includes("symbol=") || url.endsWith("symbol=")) {
            console.error("[Ticker] BLOCKED EMPTY SYMBOL CALL:", url);
            return;
          }

          try {
            const res = await fetch(url);
            const json = await res.json();

            if (json?.status === "ok" && json.price != null) {
              successCount++;
              results[upper] = {
                price: json.price,
                change: json.change_24h ?? 0,
                warning: false
              };
            } else {
              results[upper] = { warning: true };
            }
          } catch (err) {
            console.warn("[Ticker] Fetch error for symbol:", lower, err);
            results[upper] = { warning: true };
          }
        })
      );

      const failCount = SUPPORTED.length - successCount;
      const failRatio = failCount / SUPPORTED.length;

      // Smart fallback: if category is failing, show crypto fallback
      if (failRatio > 0.5 && activeCategory !== "crypto") {
        console.warn(
          "[Ticker] Market offline for category:",
          activeCategory,
          "→ Showing crypto fallback"
        );
        setOffline(true);
        setFallbackSymbols(CATEGORY_SYMBOLS.crypto || TICKER_SYMBOLS);
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
  // Reset scroll animation when symbols change
  // ------------------------------------------------------------
  useEffect(() => {
    const el = document.querySelector(".scroll");
    if (el) {
      el.style.animation = "none";
      void el.offsetHeight;
      el.style.animation = "";
    }
  }, [symbols, fallbackSymbols]);

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
      {/* MARKET OFFLINE BANNER */}
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
          const upper = String(sym || "").toUpperCase();
          const p = prices[upper];

          const category =
            Object.entries(CATEGORY_SYMBOLS).find(([cat, list]) =>
              list.includes(upper)
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
