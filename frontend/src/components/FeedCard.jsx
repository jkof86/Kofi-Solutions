import React from "react";
import { Box, Typography, Card, CardContent, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function FeedCard({ item, feedMeta, onRefresh }) {
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {feedMeta.label}
          </Typography>

          <IconButton size="small" onClick={onRefresh}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Box>

        <Typography variant="body1" sx={{ mb: 1 }}>
          {item.title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {item.summary}
        </Typography>
      </CardContent>
    </Card>
  );
}
