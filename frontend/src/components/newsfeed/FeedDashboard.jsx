import React, { useContext, useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Chip,
  Stack,
  Divider
} from "@mui/material";

import { FeedStatusContext } from "../../context/FeedStatusContext";
import FeedStatusSummary from "./FeedStatusSummary";
import FeedStatusLegend from "./FeedStatusLegend";
import FeedStatusExport from "./FeedStatusExport";
import { FEEDS } from "../../data/feedsMap";
import { feedLabelMap } from "../../data/labelMap";

export default function FeedDashboard() {
  const { status, strictMode } = useContext(FeedStatusContext);
  const [search, setSearch] = useState("");

  // ------------------------------------------------------------
  // Build feed list with metadata
  // ------------------------------------------------------------
  const feedEntries = useMemo(() => {
    return Object.entries(FEEDS).map(([feedId, meta]) => ({
      feedId,
      label: feedLabelMap[feedId] || meta.label || feedId,
      category: meta.category || "other",
      status: status[feedId] || "unknown"
    }));
  }, [status]);

  // ------------------------------------------------------------
  // Apply search + strictMode filters
  // ------------------------------------------------------------
  const filteredFeeds = useMemo(() => {
    return feedEntries.filter((f) => {
      if (strictMode) {
        const s = f.status;
        if (!["ok", "json", "fallback", "empty"].includes(s)) return false;
      }
      if (!search.trim()) return true;
      return f.label.toLowerCase().includes(search.toLowerCase());
    });
  }, [feedEntries, search, strictMode]);

  // ------------------------------------------------------------
  // Status breakdown for summary chart
  // ------------------------------------------------------------
  const summary = useMemo(() => {
    const values = filteredFeeds.map((f) => f.status);

    return {
      total: values.length,
      healthy: values.filter((s) => s === "ok" || s === "json").length,
      fallback: values.filter((s) => s === "fallback" || s === "empty").length,
      error: values.filter((s) =>
        ["dead", "blocked", "html_error"].includes(s)
      ).length,
      unknown: values.filter((s) => s === "unknown").length
    };
  }, [filteredFeeds]);

  return (
    <Box sx={{ width: "100%" }}>
      {/* ------------------------------------------------------------
         Header
      ------------------------------------------------------------ */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Feed Dashboard
      </Typography>

      {/* ------------------------------------------------------------
         Status Summary Chips
      ------------------------------------------------------------ */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Chip label={`Total: ${summary.total}`} />
        <Chip label={`Healthy: ${summary.healthy}`} color="success" />
        <Chip label={`Fallback: ${summary.fallback}`} color="warning" />
        <Chip label={`Error: ${summary.error}`} color="error" />
        <Chip label={`Unknown: ${summary.unknown}`} />
      </Stack>

      {/* ------------------------------------------------------------
         Summary Chart
      ------------------------------------------------------------ */}
      <FeedStatusSummary
        healthy={summary.healthy}
        fallback={summary.fallback}
        error={summary.error}
        unknown={summary.unknown}
      />

      <Divider sx={{ my: 2 }} />

      {/* ------------------------------------------------------------
         Search
      ------------------------------------------------------------ */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search feeds…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* ------------------------------------------------------------
         Legend + Export
      ------------------------------------------------------------ */}
      <FeedStatusLegend />

      <Box sx={{ mt: 2 }}>
        <FeedStatusExport />
      </Box>
    </Box>
  );
}
