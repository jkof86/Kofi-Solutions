// FeedHealthDashboard.jsx — Kofi Solutions 1.142
//
// - Calls /RSSProxyAggregator?mode=health
// - Uses universal backend health handler
// - Shows feed statuses + market failures
// - Never crashes on missing fields

import React, { useEffect, useState } from "react";
import { Box, Typography, Tooltip, Chip, Stack } from "@mui/material";

export default function FeedHealthDashboard() {
  const [feeds, setFeeds] = useState({});
  const [markets, setMarkets] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch("/RSSProxyAggregator?mode=health");
        const data = await res.json();

        if (data?.status === "ok") {
          setFeeds(data.feeds || {});
          setMarkets(data.markets || []);
          setError(false);
        } else {
          console.error("Health response not ok:", data);
          setError(true);
        }
      } catch (err) {
        console.error("Health fetch failed", err);
        setError(true);
      }
    };

    fetchHealth();
  }, []);

  const getColor = (status) => {
    if (status === "ok" || status === "json") return "success.main";
    if (status === "fallback" || status === "degraded") return "warning.main";
    return "error.main";
  };

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Feed Health
      </Typography>

      {error ? (
        <Typography color="error">Health error</Typography>
      ) : (
        <>
          {/* Feed statuses */}
          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
            {Object.entries(feeds).map(([key, status]) => (
              <Tooltip key={key} title={`Status: ${status}`}>
                <Chip
                  label={key}
                  size="small"
                  sx={{
                    backgroundColor: getColor(status),
                    color: "#000",
                    fontWeight: 600
                  }}
                />
              </Tooltip>
            ))}
          </Stack>

          {/* Market failures */}
          {markets.length > 0 && (
            <>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Market Snapshot Failures
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {markets.map((sym) => (
                  <Chip
                    key={sym}
                    label={sym.toUpperCase()}
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </>
          )}
        </>
      )}
    </Box>
  );
}
