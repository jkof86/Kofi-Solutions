// ------------------------------------------------------------
// MarketStatusBar.jsx — v2.0 (Context-Integrated Market Health)
// ------------------------------------------------------------

import React from "react";
import { Box, Chip, Stack, Typography } from "@mui/material";

import { useMarketStatus } from "../../hooks/useMarketStatus";
import { MARKET_SYMBOLS } from "../../data/tickerConfig";

const STATUS_COLOR = {
  ok: "success",
  error: "error",
  unknown: "warning"
};

export default function MarketStatusBar() {
  const { market } = useMarketStatus();

  if (!market || Object.keys(market).length === 0) return null;

  return (
    <Box
      sx={{
        width: "100%",
        mt: 1,
        mb: 2,
        px: 2,
        py: 1.5,
        borderRadius: 2,
        bgcolor: "#f5f5f5",
        boxShadow: 1
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ mb: 1, fontWeight: 600, color: "#555" }}
      >
        Market Status
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {MARKET_SYMBOLS.map((symbol) => {
          const m = market[symbol];

          if (!m) return null;

          const status = m.ok ? "ok" : m.error ? "error" : "unknown";
          const color = STATUS_COLOR[status] || "warning";

          const label = `${symbol.toUpperCase()} — ${
            m.price != null ? `$${m.price.toFixed(2)}` : "no data"
          }`;

          return (
            <Chip
              key={symbol}
              label={label}
              color={color}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
