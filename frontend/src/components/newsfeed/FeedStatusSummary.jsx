import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

export default function FeedStatusSummary({
  healthy = 0,
  fallback = 0,
  error = 0,
  unknown = 0
}) {
  const total = healthy + fallback + error + unknown;

  const pct = (count) => (total > 0 ? (count / total) * 100 : 0);

  const sections = [
    { label: "Healthy", value: healthy, color: "#4caf50" },
    { label: "Fallback", value: fallback, color: "#ff9800" },
    { label: "Error", value: error, color: "#f44336" },
    { label: "Unknown", value: unknown, color: "#9e9e9e" }
  ];

  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
        Feed Status Summary
      </Typography>

      {/* Horizontal stacked bar */}
      <Box
        sx={{
          display: "flex",
          height: 18,
          width: "100%",
          borderRadius: 1,
          overflow: "hidden",
          mb: 1,
          border: "1px solid #ddd"
        }}
      >
        {sections.map((s) =>
          s.value > 0 ? (
            <Box
              key={s.label}
              sx={{
                width: `${pct(s.value)}%`,
                backgroundColor: s.color,
                transition: "width 0.3s ease"
              }}
            />
          ) : null
        )}
      </Box>

      {/* Labels */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {sections.map((s) => (
          <Box key={s.label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: "3px",
                backgroundColor: s.color
              }}
            />
            <Typography variant="body2">
              {s.label}: {s.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
