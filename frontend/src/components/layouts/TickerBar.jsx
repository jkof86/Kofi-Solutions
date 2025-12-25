// TickerBar.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { TICKER_SYMBOLS } from "../../data/tickerSymbols";

export default function TickerBar() {
  const [prices, setPrices] = useState({});
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("/api/market-prices"); // your endpoint
        const data = await res.json();
        setPrices(data);

        const now = new Date();
        setLastUpdated(now.toLocaleTimeString());
      } catch (err) {
        console.error("Ticker fetch failed", err);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        backgroundColor: "#f5f5f5",
        py: 1,
        px: 2,
        position: "relative"
      }}
    >
      {/* Scrolling container */}
      <Box
        sx={{
          display: "inline-block",
          animation: "scrollTicker 25s linear infinite"
        }}
      >
        {TICKER_SYMBOLS.map((sym, idx) => {
          const p = prices[sym];
          const change = p?.change ?? 0;
          return (
            <Typography
              key={idx}
              variant="body2"
              sx={{
                display: "inline-block",
                mx: 3,
                color: change >= 0 ? "success.main" : "error.main",
                fontWeight: 500
              }}
            >
              {sym}: ${p?.price?.toFixed(2) || "—"} (
              {change >= 0 ? "+" : ""}
              {change?.toFixed?.(2) || "0.00"}%)
            </Typography>
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

      {/* Keyframes */}
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
