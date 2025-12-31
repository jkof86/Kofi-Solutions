// ------------------------------------------------------------
// MarketStatusBar.jsx — v1.200 (Market Health Bar)
// ------------------------------------------------------------

import React, { useContext } from "react";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { FeedStatusContext } from "../context/FeedStatusContext";

const STATUS_COLOR = {
  ok: "success",
  json: "warning",
  fallback: "warning",
  error: "error",
  unknown: "error",
};

export default function MarketStatusBar() {
  const { health } = useContext(FeedStatusContext);

  if (!health || !health.markets) return null;

  const { markets } = health;

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
        boxShadow: 1,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ mb: 1, fontWeight: 600, color: "#555" }}
      >
        Market Status
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {Object.entries(markets).map(([symbol, m]) => {
          if (!m || !m.status) return null;

          const color = STATUS_COLOR[m.status] || "error";
          const label = `${symbol.toUpperCase()} — ${
            m.type || "unknown"
          }: ${m.price != null ? `$${m.price.toFixed(2)}` : "no data"}`;

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
