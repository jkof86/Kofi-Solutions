// ------------------------------------------------------------
// TickerBar.jsx — Kofi Solutions 1.145 (FINAL)
// ------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import {
  TICKER_SYMBOLS,
  CATEGORY_SYMBOLS,
  CATEGORY_COLORS,
  SYMBOL_ICONS
} from "../../data/tickerConfig";

const API =
  "https://jy4i499sj1.execute-api.us-east-1.amazonaws.com/default/RSSProxyAggregator";

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

  useEffect(() => {
    if (activeCategory && CATEGORY_SYMBOLS[activeCategory]) {
      setSymbols(CATEGORY_SYMBOLS[activeCategory]);
    } else {
      setSymbols(TICKER_SYMBOLS);
    }
  }, [activeCategory]);

  useEffect(() => {
    const SUPPORTED = TICKER_SYMBOLS.map((s) => s.toLowerCase());

    const fetchTickerData = async () => {
      const results = {};

      await Promise.all(
        SUPPORTED.map(async (lower) => {
          const upper = lower.toUpperCase();

          try {
            const res = await fetch(
              `${API}?mode=market&symbol=${encodeURIComponent(lower)}`
            );
            const json = await res.json();

            if (json?.status === "ok" && json.price != null) {
              const latest = json.price;
              const change = json.change_24h ?? 0;

              results[upper] = {
                price: latest,
                change,
                warning: false
              };
            } else {
              results[upper] = { warning: true };
            }
          } catch {
            results[upper] = { warning: true };
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

              {!p || p.warning ? (
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
                    color: p.change >= 0 ? "success.main" : "error.main",
                    fontWeight: 600
                  }}
                >
                  {icon} {sym}: ${p.price.toFixed(2)} (
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
