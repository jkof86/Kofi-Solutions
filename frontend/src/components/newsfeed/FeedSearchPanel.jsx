// ------------------------------------------------------------
// FeedSearchPanel.jsx — v1.0 (Live Feed Search + Filter)
// ------------------------------------------------------------

import React, { useContext, useMemo, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Stack,
  Chip,
  Paper
} from "@mui/material";

import { FeedStatusContext } from "../../context/FeedStatusContext";
import FeedStatusChip from "./FeedStatusChip";

export default function FeedSearchPanel() {
  const { status, health, strictMode } = useContext(FeedStatusContext);
  const [query, setQuery] = useState("");

  const backendFeeds = health?.feeds?.results || {};

  const filtered = useMemo(() => {
    const q = query.toLowerCase();

    return Object.entries(status)
      .filter(([feedId, state]) => {
        if (strictMode && !["ok", "json", "fallback"].includes(state)) {
          return false;
        }

        const meta = backendFeeds[feedId] || {};
        const label = meta.label || feedId;

        return (
          feedId.toLowerCase().includes(q) ||
          label.toLowerCase().includes(q) ||
          state.toLowerCase().includes(q)
        );
      })
      .map(([feedId, state]) => ({
        feedId,
        state,
        count: backendFeeds[feedId]?.count ?? 0,
        label: backendFeeds[feedId]?.label || feedId
      }));
  }, [query, status, backendFeeds, strictMode]);

  return (
    <Paper sx={{ p: 2, borderRadius: 2, mb: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Search Feeds
      </Typography>

      <TextField
        fullWidth
        size="small"
        placeholder="Search by feed ID, label, or status…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Stack spacing={1}>
        {filtered.map((f) => (
          <Paper
            key={f.feedId}
            sx={{
              p: 1,
              borderRadius: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {f.label} ({f.count})
            </Typography>

            <FeedStatusChip status={f.state} />
          </Paper>
        ))}

        {filtered.length === 0 && (
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            No feeds match your search.
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
