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

  // ------------------------------------------------------------
  // Feed status breakdown
  // ------------------------------------------------------------
  const statusValues = Object.values(status || {});
  const totalFeeds = statusValues.length;

  const healthyCount = statusValues.filter((s) => s === "ok" || s === "json").length;
  const fallbackCount = statusValues.filter((s) => s === "fallback" || s === "empty").length;
  const errorCount = statusValues.filter((s) =>
    ["dead", "blocked", "html_error"].includes(s)
  ).length;
  const unknownCount = statusValues.filter((s) => s === "unknown").length;

  const marketCount = Object.keys(markets || {}).length;

  const stageLabel = apiStage === "prod"
    ? "PRODUCTION BUILD"
    : apiStage === "test"
    ? "TESTING ($LATEST)"
    : "UNKNOWN STAGE";

  const lastUpdatedLabel = lastUpdated
    ? lastUpdated.toLocaleString()
    : "—";

  return (
    <Box sx={{ width: "100%" }}>
      {/* ------------------------------------------------------------
         System Health Summary
      ------------------------------------------------------------ */}
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
        System Health Summary
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
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
