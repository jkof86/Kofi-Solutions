// ------------------------------------------------------------
// HealthStatusLegend.jsx — Reusable Status Color Legend
// ------------------------------------------------------------
//
// Purpose:
//   • Provides a quick reference for status colors
//   • Can be dropped anywhere in the UI
//
// ------------------------------------------------------------

import { Box, Typography } from "@mui/material";

export default function HealthStatusLegend() {
  return (
    <Box
      sx={{
        mb: 2,
        p: 1.5,
        borderRadius: 1,
        bgcolor: "#222",
        color: "#eee",
        fontSize: "0.85rem",
        fontFamily: "monospace",
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1, color: "#fff" }}>
        Health Status Legend
      </Typography>

      <Box sx={{ lineHeight: 1.8 }}>
        <span style={{ color: "#4caf50" }}>OK</span> — Feed parsed successfully
        <br />
        <span style={{ color: "#ffb300" }}>Fallback/Empty</span> — Inactive or Empty Feed
        <br />
        <span style={{ color: "#e53935" }}>Error/Unknown/Blocked</span> — Feed unreachable or invalid
        <br />
        {/* <span style={{ color: "#81c784" }}>json</span> — JSON feed parsed successfully
        <br /> */}
        {/* <span style={{ color: "#fb8c00" }}>blocked</span> — Feed blocked by server or CORS
        <br />
        <span style={{ color: "#ff7043" }}>html_error</span> — HTML feed parsing failed
        <br />
        <span style={{ color: "#9e9e9e" }}>unknown</span> — No status available */}
      </Box>
    </Box>
  );
}
