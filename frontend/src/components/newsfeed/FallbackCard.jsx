import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

export default function FallbackCard({ feedId, feedMeta }) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: "#f9a825",
        bgcolor: "#fff8e1",
        mb: 2,
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {feedMeta.label || feedId}
        </Typography>

        <Typography variant="body2" sx={{ mb: 1, color: "#8d6e63" }}>
          Feed unavailable — view the source directly
        </Typography>

        <Button
          variant="contained"
          color="warning"
          size="small"
          href={feedMeta.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit Website
        </Button>
      </CardContent>
    </Card>
  );
}
