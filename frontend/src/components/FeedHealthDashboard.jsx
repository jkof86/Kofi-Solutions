import React, { useContext } from "react";
import { Box, Chip, Typography, Tooltip } from "@mui/material";
import { FeedStatusContext } from "../context/FeedStatusContext";
import { GlobalRefreshContext } from "../context/GlobalRefreshContext";

export default function FeedHealthDashboard() {
  const { status } = useContext(FeedStatusContext);
  const { latency, lastUpdated } = useContext(GlobalRefreshContext);

  const entries = Object.entries(status);

  return (
    <Box sx={{ mt: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          mb: 1
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Feed Health
        </Typography>

        {lastUpdated && (
          <Typography variant="caption" color="text.secondary">
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </Typography>
        )}
      </Box>

      {entries.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No health data yet. Click Global Refresh to populate.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {entries.map(([feed, state]) => {
            const isOk = state === "ok";
            const label = `${feed}: ${isOk ? "OK" : "Error"}`;
            const ms = latency?.[feed];
            const tooltip = ms ? `${label} (${ms} ms)` : label;

            return (
              <Tooltip key={feed} title={tooltip}>
                <Chip
                  label={label}
                  size="small"
                  sx={{
                    backgroundColor: isOk ? "success.main" : "error.main",
                    color: "white"
                  }}
                />
              </Tooltip>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
