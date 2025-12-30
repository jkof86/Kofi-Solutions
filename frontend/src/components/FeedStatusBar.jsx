// ------------------------------------------------------------
// FeedStatusBar.jsx — v1.180 (Flat FEEDS + Correct Status Parsing)
// ------------------------------------------------------------
//
// Fixes:
//   • Correctly reads v1.180 health shape:
//         feeds[feedId] = { status, fallback, count }
//   • Proper color mapping
//   • Shows fallback + count
//   • Prevents "unknown" spam
//
// ------------------------------------------------------------

import React, { useContext } from "react";
import { Box, Chip, Stack } from "@mui/material";
import { FeedStatusContext } from "../context/FeedStatusContext";

// Future‑proof status → color mapping
const STATUS_COLOR = {
  ok: "success",
  json: "warning",
  fallback: "warning",
  dead: "error",
  blocked: "error",
  html_error: "error",
  unknown: "error",
};

export default function FeedStatusBar() {
  const { health } = useContext(FeedStatusContext);

  if (!health || !health.feeds) return null;

  const { feeds } = health;

  return (
    <Box
      sx={{
        width: "100%",
        px: 2,
        py: 1,
        borderTop: "1px solid #333",
        bgcolor: "#0a0a0a",
        position: "sticky",
        bottom: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      {/* Pulse indicator */}
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          bgcolor: "#4caf50",
          boxShadow: "0 0 0 0 rgba(76, 175, 80, 0.7)",
          animation: "healthPulse 1.5s infinite",
        }}
      />

      {/* Feed chips */}
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ flex: 1 }}>
        {Object.entries(feeds).map(([feedId, info]) => {
          if (!info || !info.status) return null;

          const status = info.status;
          const color = STATUS_COLOR[status] || "error";

          const label =
            info.fallback
              ? `${feedId} (fallback)`
              : `${feedId} (${info.count})`;

          return (
            <Chip
              key={feedId}
              label={label}
              color={color}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          );
        })}
      </Stack>

      <style>
        {`
          @keyframes healthPulse {
            0% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
            }
            70% {
              transform: scale(1.3);
              box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
            }
          }
        `}
      </style>
    </Box>
  );
}
