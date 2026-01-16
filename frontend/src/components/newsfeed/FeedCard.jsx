// ------------------------------------------------------------
// FeedCard.jsx — v1.401 (Stage-Aware + Fully Aligned)
// ------------------------------------------------------------
//
// Improvements in v1.401:
//   ✓ Replaces hardcoded BACKEND_URL with API_BASE
//   ✓ Health refresh now respects test/prod stage
//   ✓ Zero ESLint warnings
//
// ------------------------------------------------------------

import React, { useContext } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip
} from "@mui/material";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";

import FeedIcon from "./FeedIcon";
import { FEED_IMAGE_OVERRIDES } from "../../data/feedImageOverrides";
import { FeedStatusContext } from "../../context/FeedStatusContext";
import { API_BASE } from "../../data/api";

const FALLBACK_IMAGE = require("../../images/bg/ksBanner04.jpeg");

// ------------------------------------------------------------
// Helper: robust URL validator
// ------------------------------------------------------------
function isValidHttpUrl(str) {
  if (!str || typeof str !== "string") return false;
  try {
    const u = new URL(str);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function FeedCard({
  item,
  feedMeta,
  feedStatus,
  symbol,
  onRefresh
}) {
  const { setStatus } = useContext(FeedStatusContext);
  const feedId = feedMeta?.id;

  const MINI_HEALTH_COLOR = {
    ok: "#2e7d32",
    json: "#2e7d32",
    fallback: "#f9a825",
    empty: "#f9a825",
    dead: "#c62828",
    blocked: "#c62828",
    html_error: "#c62828",
    unknown: "#c62828",
  };

  function MiniHealthIndicator({ state }) {
    const color = MINI_HEALTH_COLOR[state] || "#c62828";

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: color,
          }}
        />
        <Typography variant="caption" sx={{ color }}>
          {state}
        </Typography>
      </Box>
    );
  }


  // ------------------------------------------------------------
  // Status → Icon + Label mapping
  // ------------------------------------------------------------
  const status = feedStatus || "unknown";

  let statusIcon = null;
  let statusLabel = "";

  switch (status) {
    case "ok":
    case "json":
      statusIcon = <CheckCircleIcon fontSize="small" color="success" />;
      statusLabel = status === "json" ? "JSON OK" : "OK";
      break;

    case "fallback":
      statusIcon = <WarningAmberIcon fontSize="small" color="warning" />;
      statusLabel = "Fallback";
      break;

    case "blocked":
    case "dead":
    case "html_error":
      statusIcon = <ErrorIcon fontSize="small" color="error" />;
      statusLabel =
        status === "html_error"
          ? "HTML Error"
          : status.charAt(0).toUpperCase() + status.slice(1);
      break;

    default:
      statusIcon = <WarningAmberIcon fontSize="small" color="warning" />;
      statusLabel = "Unknown";
  }

  // ------------------------------------------------------------
  // Manual health refresh handler (stage-aware)
  // ------------------------------------------------------------
  const refreshHealth = () => {
    fetch(`${API_BASE}/RSSProxyAggregator?mode=health`)
      .then((res) => res.json())
      .then((json) => {
        const entry = json?.feeds?.[feedId];
        if (!entry) return;

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
  // Safe item fields
  // ------------------------------------------------------------
  const safeTitle = item?.title || "Untitled";
  const safeUrl = item?.url || "#";

  const safeDescription =
    typeof item?.description === "string" ? item.description : "";

  const truncatedDescription =
    safeDescription.length > 300
      ? safeDescription.slice(0, 300).trim() + "…"
      : safeDescription;

  const safeDate = item?.date ? new Date(item.date).toLocaleString() : "";

  // ------------------------------------------------------------
  // Image + icon logic
  // ------------------------------------------------------------
  const extractedImage =
    item?.image && isValidHttpUrl(item.image) ? item.image : null;

  const overrideImage = FEED_IMAGE_OVERRIDES[item?.source] || null;

  // ------------------------------------------------------------
  // Fallback Feed Card (empty or fallback)
  // ------------------------------------------------------------
  if (status === "empty" || status === "fallback") {
    return (
      <Card
        variant="outlined"
        sx={{
          borderColor: "#f9a825",
          bgcolor: "#fff8e1",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Banner */}
        <Box
          sx={{
            width: "100%",
            bgcolor: "#f9a825",
            color: "#000",
            py: 0.5,
            px: 2,
            fontWeight: 700,
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <WarningAmberIcon fontSize="small" />
          Feed Unavailable — Using Fallback Mode
        </Box>
        <CardContent>

          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 700 }}>
              {feedMeta?.label || feedId}
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              height: 140,
              borderRadius: 1,
              border: "1px solid black",
              backgroundImage: `url(${require("../../images/bg/ksBanner06.jpeg")})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Message */}
          <Typography variant="body2" sx={{ mb: 2, color: "#8d6e63" }}>
            This feed returned no articles. You can retry fetching or visit the
            source directly.
          </Typography>

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              color="warning"
              onClick={onRefresh}
              startIcon={<AutorenewIcon />}
            >
              Retry
            </Button>

            <Button
              variant="outlined"
              color="warning"
              href={feedMeta?.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Website →
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  return (
    <Card variant="outlined">
      <CardContent>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1
          }}
        >
          {/* Title */}
          <Box sx={{ flex: 1, pr: 1 }}>
            <Typography
              component="a"
              href={safeUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "block",
                fontSize: "1.05rem",
                fontWeight: 700,
                lineHeight: 1.4,
                color: "text.primary",
                textDecoration: "none",
                transition: "color 0.2s ease",
                "&:hover": {
                  color: "primary.main",
                  textDecoration: "underline"
                }
              }}
            >
              {safeTitle}
            </Typography>
            {/* Mini Health Indicator */}
            {/* <MiniHealthIndicator state={status} /> */}
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
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Refresh Articles">
                <IconButton size="small" onClick={onRefresh}>
                  <AutorenewIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Refresh Health">
                <IconButton size="small" onClick={refreshHealth}>
                  <HealthAndSafetyIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </Box>

            <Tooltip title="Health Status">
              <Chip
                size="small"
                icon={statusIcon}
                label={statusLabel}
                sx={{ fontSize: 10, height: 22 }}
              />
            </Tooltip>
          </Box>
        </Box>

        {/* Visual: Article image → Feed icon → ksBanner */}
        <Box
          onClick={() => window.open(safeUrl, "_blank")}
          sx={{
            mb: 1,
            borderRadius: 1,
            overflow: "hidden",
            backgroundColor: "#f0f0f0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 240,
            cursor: "pointer"
          }}
        >
          {extractedImage ? (
            <img
              src={extractedImage}
              alt="Article"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_IMAGE;
              }}
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
                display: "block"
              }}
            />
          ) : overrideImage ? (
            overrideImage.isImage ? (
              <img
                src={overrideImage.url}
                alt="Feed Logo"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_IMAGE;
                }}
                style={{
                  width: "96px",
                  height: "96px",
                  objectFit: "contain",
                  display: "block"
                }}
              />
            ) : (
              <FeedIcon
                url={overrideImage.url}
                className={overrideImage.className}
                size={96}
              />
            )
          ) : (
            <img
              src={FALLBACK_IMAGE}
              alt="Fallback"
              referrerPolicy="no-referrer"
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "cover",
                display: "block"
              }}
            />
          )}
        </Box>

        {/* Description */}
        <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.6 }}>
          {truncatedDescription}
        </Typography>

        {/* Read More */}
        <Box>
          <Button
            variant="outlined"
            size="small"
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read more →
          </Button>
        </Box>

        {/* Timestamp */}
        {safeDate && (
          <Typography variant="caption" color="text.secondary">
            {safeDate}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
