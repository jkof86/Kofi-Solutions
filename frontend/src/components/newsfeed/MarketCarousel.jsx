// ------------------------------------------------------------
// MarketCarousel.jsx — v1.0 (Arrow-Driven Chart Carousel)
// ------------------------------------------------------------

import React, { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { ALL_MARKET_SYMBOLS } from "../../data/tickerConfig";
import MarketChart from "./MarketChart";

export default function MarketCarousel() {
  const [index, setIndex] = useState(0);
  const symbol = ALL_MARKET_SYMBOLS[index];

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? ALL_MARKET_SYMBOLS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === ALL_MARKET_SYMBOLS.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: "#f5f5f5",
        border: "1px solid #ddd",
        boxShadow: 1,
        height: 300,
        minWidth: 320,
        maxWidth: 400,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {/* Header with arrows */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <IconButton onClick={handlePrev} size="small">
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {symbol.toUpperCase()} — Market Chart
        </Typography>

        <IconButton onClick={handleNext} size="small">
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Chart */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <MarketChart symbol={symbol} />
      </Box>
    </Box>
  );
}
