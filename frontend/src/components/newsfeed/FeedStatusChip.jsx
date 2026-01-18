// ------------------------------------------------------------
// FeedStatusChip.jsx — v1.0 (Reusable Status Chip)
// ------------------------------------------------------------

import React from "react";
import { Chip } from "@mui/material";

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

export default function FeedStatusChip({ status }) {
  if (!status) return null;

  const color = STATUS_COLOR[status] || "default";

  return (
    <Chip
      label={status.toUpperCase()}
      color={color}
      size="small"
      sx={{ fontWeight: 600, textTransform: "uppercase" }}
    />
  );
}
