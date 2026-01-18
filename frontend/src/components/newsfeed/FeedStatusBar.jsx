// ------------------------------------------------------------
// FeedStatusBar.jsx — v2.0 (Backend-Aligned + Correct Counts)
// ------------------------------------------------------------

import React, { useContext } from "react";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { FeedStatusContext } from "../../context/FeedStatusContext";

const STATUS_COLOR = {
  ok: "success",
  json: "success",

  empty: "warning",
  fallback: "warning",

  dead: "error",
  blocked: "error",
  html_error: "error",
  unknown: "error"
};

export default function FeedStatusBar() {
  const { status, health } = useContext(FeedStatusContext);

  if (!status || !health?.feeds?.results) return null;

  const backendFeeds = health.feeds.results;

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
        boxShadow: 1
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ mb: 1, fontWeight: 600, color: "#555" }}
      >
        Feed Status
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {Object.entries(status).map(([feedId, state]) => {
          const color = STATUS_COLOR[state] || "error";
          const count = backendFeeds[feedId]?.count ?? 0;

          let label = `${feedId} (${count})`;

          if (state === "fallback") {
            label = `${feedId} (fallback)`;
          } else if (state === "empty") {
            label = `${feedId} (empty)`;
          }

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
