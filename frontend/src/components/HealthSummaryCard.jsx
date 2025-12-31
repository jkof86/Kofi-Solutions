// ------------------------------------------------------------
// HealthSummaryCard.jsx — v1.200 (Health Summary)
// ------------------------------------------------------------

import React, { useContext, useMemo } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { FeedStatusContext } from "../context/FeedStatusContext";

export default function HealthSummaryCard() {
  const { health, lastUpdated } = useContext(FeedStatusContext);

  const summary = useMemo(() => {
    if (!health || !health.feeds) {
      return {
        totalFeeds: 0,
        okFeeds: 0,
        fallbackFeeds: 0,
        deadFeeds: 0,
        totalMarkets: health?.markets ? Object.keys(health.markets).length : 0,
      };
    }

    const feeds = Object.values(health.feeds);

    const totalFeeds = feeds.length;
    const okFeeds = feeds.filter((f) => f.status === "ok" || f.status === "json").length;
    const fallbackFeeds = feeds.filter((f) => f.status === "fallback").length;
    const deadFeeds = feeds.filter((f) => f.status === "dead").length;

    const totalMarkets = health.markets
      ? Object.keys(health.markets).length
      : 0;

    return { totalFeeds, okFeeds, fallbackFeeds, deadFeeds, totalMarkets };
  }, [health]);

  const formatTime = (d) => {
    if (!d) return "";
    const date = typeof d === "number" ? new Date(d) : d;
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
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
            Dead
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
