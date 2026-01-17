// ------------------------------------------------------------
// HealthHistory.jsx — v1.203 (Unified Classification)
// ------------------------------------------------------------

import React, { useContext, useMemo } from "react";
import { Box, Typography, Stack, Chip } from "@mui/material";
import { FeedStatusContext } from "../../context/FeedStatusContext";

export default function HealthHistory() {
  const { status, lastUpdated } = useContext(FeedStatusContext);

  const summary = useMemo(() => {
    const values = Object.values(status || {});

    const isHealthy = (s) => s === "ok" || s === "json";
    const isFallback = (s) => s === "fallback" || s === "empty";
    const isError = (s) =>
      ["dead", "blocked", "html_error", "unknown"].includes(s);

    return {
      ok: values.filter(isHealthy).length,
      fallback: values.filter(isFallback).length,
      error: values.filter(isError).length,
    };
  }, [status]);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Health History (latest)
      </Typography>

      <Stack direction="row" spacing={2}>
        <Chip label={`Healthy: ${summary.ok}`} color="success" />
        <Chip label={`Fallback: ${summary.fallback}`} color="warning" />
        <Chip label={`Dead: ${summary.error}`} color="error" />
      </Stack>

      <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
        Last updated: {lastUpdated?.toLocaleTimeString() || "—"}
      </Typography>
    </Box>
  );
}
