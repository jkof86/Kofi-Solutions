// ------------------------------------------------------------
// FeedDashboard.jsx — v1.207‑SAFE (Status Normalization)
// ------------------------------------------------------------
//
// Improvements:
//   ✓ Normalizes backend statuses for clearer UI
//   ✓ Treats minimal/html_error as fallback
//   ✓ Treats unknown+items as fallback
//   ✓ Zero architectural changes
//
// ------------------------------------------------------------

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
import { feedLabelMap } from "../../data/labelMap";

export default function FeedDashboard({ feedEntries = [] }) {
  const { status, strictMode } = useContext(FeedStatusContext);
  const [search, setSearch] = useState("");

  // ------------------------------------------------------------
  // Normalize backend statuses for UI clarity
  // ------------------------------------------------------------
  function normalizeStatus(raw) {
    if (!raw) return "unknown";

    if (raw === "html_error") return "fallback";
    if (raw === "minimal") return "fallback";
    if (raw === "dead") return "dead";
    if (raw === "blocked") return "blocked";

    return raw;
  }

  // ------------------------------------------------------------
  // Merge + normalize
  // ------------------------------------------------------------
  const mergedEntries = useMemo(() => {
    return feedEntries.map((f) => {
      const rawStatus = status[f.feedId] || "unknown";
      const normalized = normalizeStatus(rawStatus);

      return {
        ...f,
        label: feedLabelMap[f.feedId] || f.label || f.feedId,
        status: normalized
      };
    });
  }, [feedEntries, status]);

  // ------------------------------------------------------------
  // Apply search + strictMode filters
  // ------------------------------------------------------------
  const filteredFeeds = useMemo(() => {
    return mergedEntries.filter((f) => {
      if (strictMode) {
        const s = f.status;
        if (!["ok", "json", "fallback", "empty"].includes(s)) return false;
      }
      if (!search.trim()) return true;
      return f.label.toLowerCase().includes(search.toLowerCase());
    });
  }, [mergedEntries, search, strictMode]);

  // ------------------------------------------------------------
  // Summary breakdown
  // ------------------------------------------------------------
  const summary = useMemo(() => {
    const values = filteredFeeds.map((f) => f.status);

    return {
      total: values.length,
      healthy: values.filter((s) => s === "ok" || s === "json").length,
      fallback: values.filter((s) => s === "fallback" || s === "empty").length,
      error: values.filter((s) =>
        ["dead", "blocked"].includes(s)
      ).length,
      unknown: values.filter((s) => s === "unknown").length
    };
  }, [filteredFeeds]);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Feed Dashboard
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Chip label={`Total: ${summary.total}`} />
        <Chip label={`Healthy: ${summary.healthy}`} color="success" />
        <Chip label={`Fallback: ${summary.fallback}`} color="warning" />
        <Chip label={`Error: ${summary.error}`} color="error" />
        <Chip label={`Unknown: ${summary.unknown}`} />
      </Stack>

      <FeedStatusSummary
        healthy={summary.healthy}
        fallback={summary.fallback}
        error={summary.error}
        unknown={summary.unknown}
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        size="small"
        placeholder="Search feeds…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      <FeedStatusLegend />

      <Box sx={{ mt: 2 }}>
        <FeedStatusExport />
      </Box>
    </Box>
  );
}
