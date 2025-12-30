// ------------------------------------------------------------
// FeedCard.jsx — v1.190 (Health‑Aware Feed Item Card)
// ------------------------------------------------------------
//
// Responsibilities:
//   ✓ Render a single feed item (title, source, date, description)
//   ✓ Show feed health status (OK, JSON OK, Fallback, Dead, etc.)
//   ✓ Allow manual refresh of feed content
//   ✓ Allow manual refresh of feed health (per‑feed health check)
//
// Architectural Notes:
//   • FeedStatusContext supplies health + setStatus()
//   • feedMeta.id is the canonical feedId
//   • onRefresh() triggers RSSFeed → fetchFeed()
//   • Health refresh calls backend: ?mode=health&feed=<id>
//
// ------------------------------------------------------------

import React, { useContext } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import { FeedStatusContext } from "../context/FeedStatusContext";

const BACKEND_URL =
  "https://jy4i499sj1.execute-api.us-east-1.amazonaws.com/default/RSSProxyAggregator";

export default function FeedCard({ item, feedMeta, onRefresh }) {
  const { status: feedHealth, setStatus } = useContext(FeedStatusContext);

  // Feed identifier from metadata
  const feedId = feedMeta?.id;

  // Current health status from context
  const status = feedHealth[feedId] || "unknown";

  // ------------------------------------------------------------
  // Status → Icon + Label mapping
  // ------------------------------------------------------------
  let statusIcon = null;
  let statusLabel = "";

  switch (status) {
    case "ok":
      statusIcon = <CheckCircleIcon fontSize="small" color="success" />;
      statusLabel = "OK";
      break;

    case "json":
      statusIcon = <CheckCircleIcon fontSize="small" color="success" />;
      statusLabel = "JSON OK";
      break;

    case "fallback":
      statusIcon = <WarningAmberIcon fontSize="small" color="warning" />;
      statusLabel = "Fallback";
      break;

    case "blocked":
      statusIcon = <ErrorIcon fontSize="small" color="error" />;
      statusLabel = "Blocked";
      break;

    case "dead":
      statusIcon = <ErrorIcon fontSize="small" color="error" />;
      statusLabel = "Dead";
      break;

    case "html_error":
      statusIcon = <ErrorIcon fontSize="small" color="error" />;
      statusLabel = "HTML Error";
      break;

    default:
      statusIcon = <WarningAmberIcon fontSize="small" color="warning" />;
      statusLabel = "Unknown";
  }

  // ------------------------------------------------------------
  // Manual health refresh handler
  // ------------------------------------------------------------
  const refreshHealth = () => {
    if (!feedId) return;

    fetch(`${BACKEND_URL}?mode=health&feed=${feedId}`)
      .then((res) => res.json())
      .then((json) => {
        const entry = json?.feeds?.[feedId];
        if (!entry) return;

        // Normalize backend → UI status
        const newStatus = entry.ok
          ? entry.type === "json"
            ? "json"
            : "ok"
          : entry.status || "unknown";

        setStatus(feedId, newStatus);
      })
      .catch((err) => console.error("Retry health error:", err));
  };

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  return (
    <Card variant="outlined">
      <CardContent>
        {/* ------------------------------------------------------------
            Header: Title + Source + Action Buttons + Status Chip
           ------------------------------------------------------------ */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1
          }}
        >
          {/* Title + Source */}
          <Box sx={{ flex: 1, pr: 1 }}>
            <Typography
              variant="subtitle1"
              component="a"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textDecoration: "none", color: "primary.main" }}
            >
              {item.title}
            </Typography>

            {item.source && (
              <Typography variant="caption" color="text.secondary">
                {item.source}
              </Typography>
            )}
          </Box>

          {/* Actions + Status */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 0.5
            }}
          >
            {/* Refresh feed content */}
            <Tooltip title="Refresh Feed Content">
              <IconButton size="large" onClick={onRefresh}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Refresh feed health */}
            <Tooltip title="Refresh Feed Health">
              <IconButton size="large" onClick={refreshHealth}>
                <RefreshIcon fontSize="small" color="primary" />
              </IconButton>
            </Tooltip>

            {/* Health status chip */}
            <Chip
              size="small"
              icon={statusIcon}
              label={statusLabel}
              sx={{ fontSize: 10, height: 22 }}
            />
          </Box>
        </Box>

        {/* ------------------------------------------------------------
            Description
           ------------------------------------------------------------ */}
        {item.description && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            {item.description}
          </Typography>
        )}

        {/* ------------------------------------------------------------
            Timestamp
           ------------------------------------------------------------ */}
        {item.date && (
          <Typography variant="caption" color="text.secondary">
            {new Date(item.date).toLocaleString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
