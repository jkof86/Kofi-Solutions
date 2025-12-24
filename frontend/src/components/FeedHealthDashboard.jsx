import React from "react";
import { Box, Typography, Stack, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import { FEEDS } from "../data/feedsMap";

function statusToChip(status) {
  switch (status) {
    case "ok":
    case "json":
      return {
        label: "OK",
        color: "success",
        icon: <CheckCircleIcon fontSize="small" />
      };
    case "error":
      return {
        label: "Error",
        color: "error",
        icon: <ErrorIcon fontSize="small" />
      };
    case "degraded":
    case "fallback":
      return {
        label: "Degraded",
        color: "warning",
        icon: <WarningAmberIcon fontSize="small" />
      };
    default:
      return {
        label: "Unknown",
        color: "default",
        icon: <HelpOutlineIcon fontSize="small" />
      };
  }
}

export default function FeedHealthDashboard({ healthMap }) {
  const hasData = healthMap && Object.keys(healthMap).length > 0;

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: 2,
        boxShadow: 2,
        p: 3,
        mt: 2
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Feed Health Status
      </Typography>

      {hasData ? (
        <Stack spacing={1}>
          {Object.entries(FEEDS).map(([key, meta]) => {
            const rawStatus = healthMap?.[key];
            const chip = statusToChip(rawStatus || "unknown");

            return (
              <Stack
                key={key}
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="body2">
                  {meta.label}
                  {meta.legacy && " (Legacy)"}
                </Typography>
                <Chip
                  size="small"
                  label={chip.label}
                  color={chip.color}
                  icon={chip.icon}
                  variant={chip.color === "success" ? "filled" : "outlined"}
                />
              </Stack>
            );
          })}
        </Stack>
      ) : (
        <Typography color="error">No feed health data available.</Typography>
      )}
    </Box>
  );
}
