// TickerBar.jsx — Kofi Solutions 1.142
//
// - Horizontally scrolling marquee
// - Auto-fetches market data from backend
// - Uses backend market cache + expanded symbols
// - Shows WarningAmberIcon when fetch fails
// - Category chips + icons + sparkline placeholder
// - Ready for auto-sync with activeCategory

import React, { useEffect, useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import {
  TICKER_SYMBOLS,
  CATEGORY_SYMBOLS,
  CATEGORY_COLORS,
  SYMBOL_ICONS
} from "../../data/tickerConfig";

// If you wire a UI context, pass activeCategory as prop
const DEFAULT_CATEGORY = "crypto";

export default function TickerBar({ activeCategory = DEFAULT_CATEGORY }) {
  const [prices, setPrices] = useState({});
  const [lastUpdated, setLastUpdated] = useState("");
  const [symbols, setSymbols] = useState(TICKER_SYMBOLS);

  const getCategory = (symbol) => {
    return Object.entries(CATEGORY_SYMBOLS).find(([cat, list]) =>
      list.includes(symbol)
    )?.[0];
  };

  // Auto-sync symbols with active category
  useEffect(() => {
    if (activeCategory && CATEGORY_SYMBOLS[activeCategory]) {
      setSymbols(CATEGORY_SYMBOLS[activeCategory]);
    } else {
      setSymbols(TICKER_SYMBOLS);
    }
  }, [activeCategory]);

  // Fetch ticker data from backend (RSSProxyAggregator)
  useEffect(() => {
    const SUPPORTED_SYMBOLS = [
      "btc",
      "eth",
      "sol",
      "xrp",
      "ada",
      "avax",
      "aapl",
      "msft",
      "amzn",
      "jpm",
      "gs",
      "bac",
      "v",
      "ma",
      "brk.b",
      "nvda",
      "meta",
      "goog",
      "qcom",
      "txn",
      "stm",
      "orcl",
      "ibm",
      "sap",
      "dis",
      "wbd",
      "manu"
    ];

    const fetchTickerData = async () => {
      const results = {};

      await Promise.all(
        SUPPORTED_SYMBOLS.map(async (symbol) => {
          try {
            const res = await fetch(
              `/RSSProxyAggregator?mode=market&symbol=${encodeURIComponent(
                symbol
              )}`
            );
            const json = await res.json();

            if (json?.status === "ok" && json.data?.prices?.length > 0) {
              const pricesArr = json.data.prices;
              const latest = pricesArr[pricesArr.length - 1][1];
              const previous = pricesArr[0][1];
              const change = ((latest - previous) / previous) * 100;

              results[symbol.toUpperCase()] = {
                price: latest,
                change,
                warning: false
              };
            } else {
              results[symbol.toUpperCase()] = { warning: true };
            }
          } catch (err) {
            console.error(`Ticker fetch failed for ${symbol}`, err);
            results[symbol.toUpperCase()] = { warning: true };
          }
        })
      );

      setPrices(results);
      setLastUpdated(new Date().toLocaleTimeString());
    };

    fetchTickerData();
    const interval = setInterval(fetchTickerData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Restart animation when symbols change
  useEffect(() => {
    const el = document.querySelector(".scroll");
    if (el) {
      el.style.animation = "none";
      void el.offsetHeight;
      el.style.animation = "";
    }
  }, [symbols]);

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
      {/* Scrolling container */}
      <Box
        className="scroll"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          animation: "scrollTicker 25s linear infinite"
        }}
      >
        {symbols.map((sym, idx) => {
          const p = prices[sym];
          const change = p?.change ?? 0;
          const category = getCategory(sym) || "tech";
          const icon = SYMBOL_ICONS[sym] || "";

          return (
            <Box
              key={idx}
              sx={{
                display: "flex",
                alignItems: "center",
                mx: 4
              }}
            >
              {/* Category chip */}
              <Chip
                label={category.toUpperCase()}
                size="small"
                sx={{
                  mr: 1,
                  backgroundColor: CATEGORY_COLORS[category],
                  color: "#fff",
                  fontWeight: 600
                }}
              />

              {/* Symbol + price or warning */}
              {p?.warning ? (
                <Typography
                  variant="body2"
                  sx={{ color: "warning.main", fontWeight: 600 }}
                >
                  {icon} {sym}:{" "}
                  <WarningAmberIcon
                    fontSize="small"
                    sx={{ verticalAlign: "middle" }}
                  />
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    color: change >= 0 ? "success.main" : "error.main",
                    fontWeight: 600
                  }}
                >
                  {icon} {sym}: ${p?.price?.toFixed(2)} (
                  {change >= 0 ? "+" : ""}
                  {change.toFixed(2)}%)
                </Typography>
              )}

              {/* Sparkline placeholder (ready for charts) */}
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

      {/* Keyframes for marquee */}
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
