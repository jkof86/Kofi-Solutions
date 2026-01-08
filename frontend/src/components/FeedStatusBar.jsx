// ------------------------------------------------------------
// FeedStatusBar.jsx — v1.201 (Feed Health Bar)
// ------------------------------------------------------------

import React, { useContext } from "react";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { FeedStatusContext } from "../context/FeedStatusContext";

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
        mt: 2,
        mb: 1,
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
        Feed Status
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {Object.entries(feeds).map(([feedId, info]) => {
          if (!info || !info.status) return null;

          const color = STATUS_COLOR[info.status] || "error";
          const label = info.fallback
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
    </Box>
  );
}
