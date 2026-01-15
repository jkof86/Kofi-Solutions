// ------------------------------------------------------------
// HealthHistory.jsx — v1.210 (Correct Error Buckets)
// ------------------------------------------------------------

import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { FeedStatusContext } from "../../context/FeedStatusContext";

export default function HealthHistory() {
  const { health, lastUpdated } = useContext(FeedStatusContext);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!health || !lastUpdated) return;

    setHistory(prev => {
      const feeds = health.feeds || {};

      const entry = {
        time: lastUpdated.toLocaleTimeString(),

        okCount: Object.values(feeds).filter(s => s === "ok" || s === "json")
          .length,

        fallbackCount: Object.values(feeds).filter(s => s === "fallback")
          .length,

        errorCount: Object.values(feeds).filter(
          s => s === "dead" || s === "blocked" || s === "html_error"
        ).length
      };

      const next = [entry, ...prev];
      return next.slice(0, 10);
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
