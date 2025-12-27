// ------------------------------------------------------------
// StatusLegend.jsx — Reusable Status Color Legend
// ------------------------------------------------------------
//
// Purpose:
//   • Provides a quick reference for status colors
//   • Can be dropped anywhere in the UI
//
// ------------------------------------------------------------

import { Box, Chip, Stack, Typography } from "@mui/material";

export default function StatusLegend() {
  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Status Legend
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        <Chip label="OK" color="success" />
        <Chip label="Fallback" color="warning" />
        <Chip label="JSON" color="warning" />
        <Chip label="Error" color="error" />
      </Stack>
    </Box>
  );
}
