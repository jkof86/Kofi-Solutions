import React, { useContext } from "react";
import {
  Box,
  Typography,
  Divider,
  Chip,
  Stack
} from "@mui/material";

import { FeedStatusContext } from "../../context/FeedStatusContext";
import FeedStatusLegend from "./FeedStatusLegend";

export default function HealthDashboard() {
  const {
    status,
    markets,
    health,
    lastUpdated,
    apiStage
  } = useContext(FeedStatusContext);

  // Feed status breakdown
  const feedEntries = Object.values(status || {});
  const totalFeeds = feedEntries.length;

  const healthyCount = feedEntries.filter((entry) =>
    ["ok", "json"].includes(entry?.status)
  ).length;

  const fallbackCount = feedEntries.filter((entry) =>
    ["fallback", "empty"].includes(entry?.status)
  ).length;

  const errorCount = feedEntries.filter((entry) =>
    ["dead", "blocked", "html_error"].includes(entry?.status)
  ).length;

  const unknownCount = feedEntries.filter((entry) =>
    entry?.status === "unknown"
  ).length;

  // ------------------------------------------------------------
  // Market count
  // ------------------------------------------------------------
  const marketCount = Object.keys(markets || {}).length;

  // ------------------------------------------------------------
  // Stage label
  // ------------------------------------------------------------
  const stageLabel =
    apiStage === "prod"
      ? "PRODUCTION BUILD"
      : apiStage === "test"
        ? "TESTING ($LATEST)"
        : "UNKNOWN STAGE";

  // ------------------------------------------------------------
  // Timestamp label
  // ------------------------------------------------------------
  const lastUpdatedLabel = lastUpdated
    ? lastUpdated.toLocaleString()
    : "—";


  return (
    <Box sx={{
      display: "flex",
      flexWrap: "wrap",       // ✅ allows wrapping
      gap: 1,                 // optional spacing between items
      alignItems: "center",   // vertical alignment
    }}
    >
      {/* ------------------------------------------------------------
         System Health Summary
      ------------------------------------------------------------ */}
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
        System Health Summary
      </Typography>

      <Stack direction="row" flexWrap="wrap" spacing={2} sx={{ mb: 2 }}>
        <Chip label={`Total Feeds: ${totalFeeds}`} />
        <Chip label={`Healthy: ${healthyCount}`} color="success" />
        <Chip label={`Fallback: ${fallbackCount}`} color="warning" />
        <Chip label={`Error: ${errorCount}`} color="error" />
        <Chip label={`Unknown: ${unknownCount}`} />
        <Chip label={`Markets Tracked: ${marketCount}`} />
      </Stack>

      {/* ------------------------------------------------------------
         Backend Stage + Timestamp
      ------------------------------------------------------------ */}
      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong>Backend Stage:</strong> {stageLabel}
      </Typography>

      <Typography variant="body2" sx={{ mb: 2 }}>
        <strong>Last updated:</strong> {lastUpdatedLabel}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* ------------------------------------------------------------
         Status Legend
      ------------------------------------------------------------ */}
      <FeedStatusLegend />
    </Box>
  );
}
