// ------------------------------------------------------------
// FeedStatusPanel.jsx — v1.0 (Full Feed Dashboard)
// ------------------------------------------------------------

import React from "react";
import { Box, Stack, Typography, Divider } from "@mui/material";

import HealthSummaryCard from "./HealthSummaryCard";
import FeedStatusBar from "./FeedStatusBar";
import FeedStatusGrid from "./FeedStatusGrid";
import FeedStatusLegend from "./FeedStatusLegend";
import FeedStatusDebug from "./FeedStatusDebug";

export default function FeedStatusPanel() {
  return (
    <Box sx={{ width: "100%", mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Feed Health Dashboard
      </Typography>

      <Stack spacing={2}>
        <HealthSummaryCard />
        <FeedStatusBar />

        <Divider />

        <FeedStatusLegend />
        <FeedStatusGrid />

        <Divider />

        <FeedStatusDebug />
      </Stack>
    </Box>
  );
}
