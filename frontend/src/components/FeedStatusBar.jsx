// ------------------------------------------------------------
// FeedStatusBar.jsx — Bottom Status Drawer (Pulse + Health)
// ------------------------------------------------------------

import React, { useContext } from "react";
import { Box, Chip, Stack } from "@mui/material";
import { FeedStatusContext } from "../context/FeedStatusContext";

export default function FeedStatusBar() {
  const { health, lastUpdated } = useContext(FeedStatusContext);

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
        gap: 1
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
          animation: "healthPulse 1.5s infinite"
        }}
      />

      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ flex: 1 }}>
        {Object.entries(feeds).map(([feed, status]) => {
          const color =
            status === "ok"
              ? "success"
              : status === "fallback" || status === "json"
              ? "warning"
              : "error";

          return (
            <Chip
              key={feed}
              label={feed}
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
