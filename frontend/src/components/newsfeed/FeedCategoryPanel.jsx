// ------------------------------------------------------------
// FeedCategoryPanel.jsx — v1.0 (Grouped Feed Panel)
// ------------------------------------------------------------

import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import FeedList from "./FeedList";

export default function FeedCategoryPanel({ category, feeds, symbol }) {
  if (!feeds || feeds.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {category.toUpperCase()}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <FeedList feeds={feeds} categoryLabel={category} symbol={symbol} />
    </Box>
  );
}
