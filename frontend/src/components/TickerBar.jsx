// TickerBar.jsx
import React from "react";
import { Box, Typography, Stack } from "@mui/material";

const TICKER_DATA = [
  { label: "BITCOIN", value: 87841.0, change: -0.95 },
  { label: "ETHEREUM", value: 2940.71, change: -1.95 },
  { label: "SOLANA", value: 124.08, change: -1.45 },
  { label: "AAPL", value: 190.12, change: 0.8 },
  { label: "MSFT", value: 410.55, change: -0.3 },
  { label: "AMZN", value: 175.44, change: 1.2 }
];

export default function TickerBar() {
  return (
    <Box sx={{ backgroundColor: "#f5f5f5", py: 1, px: 2 }}>
      <Stack direction="row" spacing={4} justifyContent="center">
        {TICKER_DATA.map((item, idx) => (
          <Typography
            key={idx}
            variant="body2"
            sx={{
              color: item.change >= 0 ? "success.main" : "error.main",
              fontWeight: 500
            }}
          >
            {item.label}: ${item.value.toFixed(2)} (
            {item.change >= 0 ? "+" : ""}
            {item.change.toFixed(2)}%)
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}
