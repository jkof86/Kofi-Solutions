// ------------------------------------------------------------
// FeedStatusExport.jsx — v1.0 (Download Health Snapshot)
// ------------------------------------------------------------

import React, { useContext } from "react";
import { Button, Paper, Typography } from "@mui/material";
import { FeedStatusContext } from "../../context/FeedStatusContext";

export default function FeedStatusExport() {
  const { health } = useContext(FeedStatusContext);

  const download = () => {
    const blob = new Blob([JSON.stringify(health, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `feed-health-${Date.now()}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 2, mb: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Export Feed Health
      </Typography>

      <Button variant="contained" onClick={download}>
        Download Snapshot
      </Button>
    </Paper>
  );
}
