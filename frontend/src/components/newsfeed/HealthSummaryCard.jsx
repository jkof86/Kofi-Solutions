// ------------------------------------------------------------
// HealthSummaryCard.jsx — v1.203 (Unified Classification)
// ------------------------------------------------------------

import React, { useContext, useMemo } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { FeedStatusContext } from "../../context/FeedStatusContext";

export default function HealthSummaryCard() {
  const { status, health, lastUpdated } = useContext(FeedStatusContext);

  const summary = useMemo(() => {
    const values = Object.values(status || {});

    const isHealthy = (s) => s === "ok" || s === "json";
    const isFallback = (s) => s === "fallback" || s === "empty";
    const isError = (s) =>
      ["dead", "blocked", "html_error", "unknown"].includes(s);

    return {
      totalFeeds: values.length,
      okFeeds: values.filter(isHealthy).length,
      fallbackFeeds: values.filter(isFallback).length,
      deadFeeds: values.filter(isError).length,
      totalMarkets: health?.markets
        ? Object.keys(health.markets).length
        : 0,
    };
  }, [status, health]);

  const formatTime = (d) => {
    if (!d) return "";
    const date = typeof d === "number" ? new Date(d) : d;
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <Paper
      elevation={2}
      sx={{
        mb: 3,
        px: 3,
        py: 2,
        borderRadius: 2,
        bgcolor: "#fafafa",
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        System Health Summary
      </Typography>

      <Typography variant="caption" sx={{ display: "block", mb: 2 }}>
        Last updated: {formatTime(lastUpdated) || "—"}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <Typography variant="body2" sx={{ color: "#555" }}>
            Total Feeds
          </Typography>
          <Typography variant="h6">{summary.totalFeeds}</Typography>
        </Grid>

        <Grid item xs={6} md={3}>
          <Typography variant="body2" sx={{ color: "#2e7d32" }}>
            Healthy
          </Typography>
          <Typography variant="h6" sx={{ color: "#2e7d32" }}>
            {summary.okFeeds}
          </Typography>
        </Grid>

        <Grid item xs={6} md={3}>
          <Typography variant="body2" sx={{ color: "#f9a825" }}>
            Fallback
          </Typography>
          <Typography variant="h6" sx={{ color: "#f9a825" }}>
            {summary.fallbackFeeds}
          </Typography>
        </Grid>

        <Grid item xs={6} md={3}>
          <Typography variant="body2" sx={{ color: "#c62828" }}>
            Error
          </Typography>
          <Typography variant="h6" sx={{ color: "#c62828" }}>
            {summary.deadFeeds}
          </Typography>
        </Grid>

        <Grid item xs={6} md={3}>
          <Typography variant="body2" sx={{ color: "#555" }}>
            Markets Tracked
          </Typography>
          <Typography variant="h6">{summary.totalMarkets}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
