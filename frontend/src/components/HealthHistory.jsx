// ------------------------------------------------------------
// HealthHistory.jsx — Rolling Health Snapshot History
// ------------------------------------------------------------

import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { FeedStatusContext } from "../context/FeedStatusContext";

export default function HealthHistory() {
  const { health, lastUpdated } = useContext(FeedStatusContext);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!health || !lastUpdated) return;

    setHistory(prev => {
      const entry = {
        time: lastUpdated.toLocaleTimeString(),
        okCount: Object.values(health.feeds || {}).filter(s => s === "ok").length,
        fallbackCount: Object.values(health.feeds || {}).filter(
          s => s === "fallback" || s === "json"
        ).length,
        errorCount: Object.values(health.feeds || {}).filter(
          s => s !== "ok" && s !== "fallback" && s !== "json"
        ).length
      };

      const next = [entry, ...prev];
      return next.slice(0, 10); // keep last 10
    });
  }, [health, lastUpdated]);

  if (!history.length) return null;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Health History (last {history.length} checks)
      </Typography>
      <List dense>
        {history.map((h, idx) => (
          <ListItem key={idx} sx={{ py: 0.25 }}>
            <ListItemText
              primary={`${h.time} — OK: ${h.okCount}, Fallback: ${h.fallbackCount}, Error: ${h.errorCount}`}
              primaryTypographyProps={{ variant: "caption" }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
