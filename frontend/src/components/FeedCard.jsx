// ------------------------------------------------------------
// FeedCard.jsx — v1.146 FINAL
// ------------------------------------------------------------

import React, { useContext } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import { FeedStatusContext } from "../context/FeedStatusContext";

export default function FeedCard({ item, feedMeta, onRefresh }) {
  const { status: feedHealth } = useContext(FeedStatusContext);
  const feedId = feedMeta?.id;
  const status = feedHealth[feedId] || "unknown";

  let statusIcon = null;
  let statusLabel = "";

 // ------------------------------------------------------------
// FeedCard.jsx — v1.181 (JSON OK Label)
// ------------------------------------------------------------

if (status === "ok") {
  statusIcon = <CheckCircleIcon fontSize="small" color="success" />;
  statusLabel = "OK";
} else if (status === "json") {
  statusIcon = <CheckCircleIcon fontSize="small" color="success" />;
  statusLabel = "JSON OK";
}


  return (
    <Card variant="outlined">
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1
          }}
        >
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

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5 }}>
            <IconButton size="small" onClick={onRefresh}>
              <RefreshIcon fontSize="small" />
            </IconButton>

            <Chip
              size="small"
              icon={statusIcon}
              label={statusLabel}
              sx={{ fontSize: 10, height: 22 }}
            />
          </Box>
        </Box>

        {item.description && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            {item.description}
          </Typography>
        )}

        {item.date && (
          <Typography variant="caption" color="text.secondary">
            {new Date(item.date).toLocaleString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
