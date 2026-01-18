// ------------------------------------------------------------
// FeedStatusLegend.jsx — v1.0 (Status Legend)
// ------------------------------------------------------------

import React from "react";
import { Box, Chip, Stack, Typography } from "@mui/material";

const LEGEND_ITEMS = [
  { label: "ok", color: "success", desc: "Feed loaded successfully" },
  { label: "json", color: "success", desc: "Feed served via JSON API" },
  { label: "empty", color: "warning", desc: "Feed responded but had no items" },
  { label: "fallback", color: "warning", desc: "Fallback parser used" },
  { label: "dead", color: "error", desc: "Feed unreachable or permanently failing" },
  { label: "blocked", color: "error", desc: "Access blocked (e.g., 403, robots)" },
  { label: "html_error", color: "error", desc: "HTML parsing failed" },
  { label: "unknown", color: "default", desc: "No data yet / not seen" }
];

export default function FeedStatusLegend() {
  return (
    <Box sx={{ mb: 1 }}>
      <Typography
        variant="subtitle2"
        sx={{ mb: 1, fontWeight: 600, color: "#555" }}
      >
        Feed Status Legend
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {LEGEND_ITEMS.map((item) => (
          <Chip
            key={item.label}
            label={item.label}
            color={item.color}
            size="small"
            sx={{ fontWeight: 600, textTransform: "uppercase" }}
          />
        ))}
      </Stack>

      <Box sx={{ mt: 1 }}>
        {LEGEND_ITEMS.map((item) => (
          <Typography
            key={item.label}
            variant="caption"
            sx={{ display: "block", color: "#777" }}
          >
            <strong>{item.label}</strong>: {item.desc}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
