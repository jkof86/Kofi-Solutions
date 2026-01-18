// ------------------------------------------------------------
// FeedStatusGrid.jsx — v1.0 (Per-Feed Detail Grid)
// ------------------------------------------------------------

import React, { useContext, useMemo } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Typography,
  Chip
} from "@mui/material";

import { FeedStatusContext } from "../../context/FeedStatusContext";

const STATUS_COLOR = {
  ok: "success",
  json: "success",
  empty: "warning",
  fallback: "warning",
  dead: "error",
  blocked: "error",
  html_error: "error",
  unknown: "default"
};

export default function FeedStatusGrid() {
  const { status, health } = useContext(FeedStatusContext);

  const rows = useMemo(() => {
    if (!status || !health?.feeds?.results) return [];

    const backendFeeds = health.feeds.results;

    return Object.entries(status).map(([feedId, state]) => {
      const backend = backendFeeds[feedId] || {};
      return {
        feedId,
        state,
        count: backend.count ?? 0,
        lastError: backend.error || backend.status || null,
        lastChecked: backend.lastChecked || backend.last_checked || null
      };
    });
  }, [status, health]);

  if (!rows.length) {
    return (
      <Typography variant="body2" sx={{ opacity: 0.7 }}>
        No feed status data available.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Feed ID</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Items</TableCell>
            <TableCell>Last Error / Status</TableCell>
            <TableCell>Last Checked</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.feedId}>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {row.feedId}
                </Typography>
              </TableCell>

              <TableCell>
                <Chip
                  label={row.state}
                  color={STATUS_COLOR[row.state] || "default"}
                  size="small"
                  sx={{ fontWeight: 600, textTransform: "uppercase" }}
                />
              </TableCell>

              <TableCell align="right">
                <Typography variant="body2">{row.count}</Typography>
              </TableCell>

              <TableCell>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}
                >
                  {row.lastError || "—"}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                  {row.lastChecked || "—"}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
