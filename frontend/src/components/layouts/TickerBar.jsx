// ------------------------------------------------------------
// TickerBar.jsx — v3.0 (Unified Market Payload Compatible)
// ------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import { MARKET_SYMBOLS, SYMBOL_ICONS } from "../../data/tickerConfig";
import { useMarketStatus } from "../../hooks/useMarketStatus";

console.log("TickerBar v3.0 loaded");

export default function TickerBar() {
  const { market, lastUpdated } = useMarketStatus();

  const [symbols, setSymbols] = useState([]);

  // Load canonical symbol list
  useEffect(() => {
    setSymbols(MARKET_SYMBOLS);
  }, []);

  // Reset scroll animation when symbols change
  useEffect(() => {
    const el = document.querySelector(".scroll");
    if (el) {
      el.style.animation = "none";
      void el.offsetHeight;
      el.style.animation = "";
    }
  }, [symbols]);

  // Render
  if (!market || Object.keys(market).length === 0) {
    return (
      <Box sx={{ py: 1, px: 2 }}>
        <Typography variant="body2" sx={{ opacity: 0.6 }}>
          Loading market data…
        </Typography>
      </Box>
    );
  }

  // Only show valid entries (Unified payload)
  const visible = symbols.filter((sym) => {
    const m = market[sym];
    return (
      m &&
      m.status === "ok" &&
      typeof m.last === "number" &&
      m.last > 0
    );
  });

  // Duplicate for seamless scroll
  const doubled = [...visible, ...visible];

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
          animation: "scrollTicker 60s linear infinite"
        }}
      >
        {doubled.map((sym, idx) => {
          const m = market[sym];
          const icon = SYMBOL_ICONS[sym] || "";

          const price = m?.last ?? 0;
          const change = m?.change ?? 0;

          return (
            <Box
              key={`${sym}-${idx}`}
              sx={{ display: "flex", alignItems: "center", mx: 4 }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: change >= 0 ? "success.main" : "error.main",
                  fontWeight: 600
                }}
              >
                {icon} {sym.toUpperCase()}: ${price.toFixed(2)} (
                {change >= 0 ? "+" : ""}
                {change.toFixed(2)}%)
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
        Updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "--"}
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
