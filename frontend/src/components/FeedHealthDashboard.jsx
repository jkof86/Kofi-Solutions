import React, { useEffect, useState } from "react";
import { Box, Chip, Typography, Stack } from "@mui/material";

const API =
  "https://jy4i499sj1.execute-api.us-east-1.amazonaws.com/default/RSSProxyAggregator";

export default function FeedHealthDashboard() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}?mode=health`);
        const json = await res.json();

        if (json.status !== "ok") {
          setError(json.error || "Health error");
        } else {
          setHealth(json);
        }
      } catch (err) {
        setError(err.message);
      }
    }

    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <Typography color="error">Health Error: {error}</Typography>;
  }

  if (!health) {
    return <Typography>Loading health…</Typography>;
  }

  const { feeds = {}, markets = [], strict } = health;

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        System Health {strict ? "(Strict)" : "(Soft)"}
      </Typography>
      <Stack spacing={1} sx={{ mb: 2 }}>
        {Object.entries(feeds).map(([feed, status]) => (
          <Chip
            key={feed}
            label={`${feed}: ${status}`}
            color={
              status === "ok"
                ? "success"
                : status === "fallback" || status === "json"
                ? "warning"
                : "error"
            }
          />
        ))}
      </Stack>

      {markets.length > 0 && (
        <>
          <Typography variant="subtitle2">Market Failures</Typography>
          <Stack spacing={1}>
            {markets.map((m) => (
              <Chip key={m} label={m} color="error" />
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
}
