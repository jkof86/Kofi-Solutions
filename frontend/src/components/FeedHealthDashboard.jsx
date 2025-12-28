// ------------------------------------------------------------
// FeedHealthDashboard.jsx — v1.148 (Global Debug Toggle Integrated)
// ------------------------------------------------------------
//
// Enhancements:
//   • Global debug toggle (URL param + keyboard shortcut)
//   • Global debug indicator chip
//   • Debug mode auto-syncs with global toggle
//   • No breaking changes to existing debugMode dropdown
//
// ------------------------------------------------------------

import React, { useEffect, useContext, useState } from "react";
import {
  Box,
  Chip,
  Typography,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Divider,
  IconButton
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { FeedStatusContext } from "../context/FeedStatusContext";
import { debugRequest } from "../utils/debugApi";
import HealthHistory from "./HealthHistory";

const API =
  "https://jy4i499sj1.execute-api.us-east-1.amazonaws.com/default/RSSProxyAggregator";

export default function FeedHealthDashboard() {
  const {
    strictMode,
    setStrictMode,
    sampleSize,
    setSampleSize,
    debugMode,
    setDebugMode,
    lastUpdated,
    setLastUpdated,
    health,
    setHealth
  } = useContext(FeedStatusContext);

  const [error, setError] = useState(null);

  // ------------------------------------------------------------
  // NEW: Global Debug Toggle (URL param + keyboard shortcut)
  // ------------------------------------------------------------
  const [globalDebug, setGlobalDebug] = useState(() => {
    const urlParam = new URLSearchParams(window.location.search).get("debug");
    return urlParam === "true";
  });

  // Keyboard shortcut: Ctrl + Shift + D
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        setGlobalDebug((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Sync global debug → debugMode dropdown
  useEffect(() => {
    if (globalDebug && debugMode !== "debug_health") {
      setDebugMode("debug_health");
    }
    if (!globalDebug && debugMode === "debug_health") {
      setDebugMode("");
    }
  }, [globalDebug]);

  // ------------------------------------------------------------
  // Load Health
  // ------------------------------------------------------------
  async function load() {
    try {
      const res = await fetch(
        `${API}?mode=health&strict=${strictMode}&sampleSize=${sampleSize}&debug=${debugMode}`
      );
      const json = await res.json();

      if (json.status !== "ok") {
        setError(json.error || "Health error");
        setHealth(null);
      } else {
        setHealth(json);
        setError(null);
        setLastUpdated(new Date());
      }
    } catch (err) {
      setError(err.message);
      setHealth(null);
    }
  }

  // ------------------------------------------------------------
  // Auto-refresh
  // ------------------------------------------------------------
  useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [strictMode, sampleSize, debugMode]);

  // ------------------------------------------------------------
  // Render: Error
  // ------------------------------------------------------------
  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          Health Error
        </Typography>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  // ------------------------------------------------------------
  // Render: Loading
  // ------------------------------------------------------------
  if (!health) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Loading health…</Typography>
      </Box>
    );
  }

  const { feeds = {}, markets = [], debug } = health;

  const formatTime = (d) =>
    d
      ? d.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
      : "";

  // ------------------------------------------------------------
  // Render: Dashboard
  // ------------------------------------------------------------
  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6">System Health</Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          {/* NEW: Global Debug Indicator */}
          {globalDebug && (
            <Chip
              label="Global Debug ON"
              color="secondary"
              size="small"
              sx={{ fontSize: 11 }}
            />
          )}

          <IconButton onClick={load}>
            <RefreshIcon />
          </IconButton>
        </Stack>
      </Stack>

      {/* Debug Controls */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Debug Tools
        </Typography>

        <Stack spacing={1}>
          <Chip
            label="Test Health"
            onClick={() => debugRequest("?mode=health")}
            color="info"
            clickable
          />
          <Chip
            label="Test Market BTC"
            onClick={() => debugRequest("?mode=market&symbol=btc")}
            color="info"
            clickable
          />
          <Chip
            label="Test Router Error"
            onClick={() => debugRequest("?unknown=123")}
            color="warning"
            clickable
          />
        </Stack>
      </Box>

      {/* Debug Mode */}
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Debug Mode</InputLabel>
        <Select
          value={debugMode}
          label="Debug Mode"
          onChange={(e) => setDebugMode(e.target.value)}
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="ping">Ping</MenuItem>
          <MenuItem value="echo">Echo</MenuItem>
          <MenuItem value="debug_feeds">Debug Feeds</MenuItem>
          <MenuItem value="debug_market">Debug Market</MenuItem>
          <MenuItem value="debug_health">Debug Health</MenuItem>
          <MenuItem value="debug_maps">Debug Maps</MenuItem>
          <MenuItem value="debug_env">Debug Env</MenuItem>
        </Select>
      </FormControl>

      {/* Strict/Soft Toggle */}
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Mode
      </Typography>
      <ToggleButtonGroup
        value={strictMode ? "strict" : "soft"}
        exclusive
        onChange={(e, val) => {
          if (val === "strict") setStrictMode(true);
          if (val === "soft") setStrictMode(false);
        }}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="soft">Soft</ToggleButton>
        <ToggleButton value="strict">Strict</ToggleButton>
      </ToggleButtonGroup>

      {/* Sample Size */}
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Sample Size</InputLabel>
        <Select
          value={sampleSize}
          label="Sample Size"
          onChange={(e) => setSampleSize(e.target.value)}
        >
          <MenuItem value={1}>1 (Fastest)</MenuItem>
          <MenuItem value={3}>3 (Balanced)</MenuItem>
          <MenuItem value={5}>5 (Most Accurate)</MenuItem>
        </Select>
      </FormControl>

      {/* Last Updated */}
      <Typography variant="caption" sx={{ display: "block", mb: 2 }}>
        Last updated: {formatTime(lastUpdated)}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Feed Health */}
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Feed Health
      </Typography>
      <Stack spacing={1} sx={{ mb: 2 }}>
        {Object.entries(feeds).map(([feed, status]) => {
          const color =
            status === "ok"
              ? "success"
              : status === "fallback" || status === "json"
              ? "warning"
              : "error";

          return <Chip key={feed} label={`${feed}: ${status}`} color={color} />;
        })}
      </Stack>

      {/* Market Health */}
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Market Health
      </Typography>
      <Stack spacing={1} sx={{ mb: 2 }}>
        {markets.map((m) => {
          const label = `${m.symbol.toUpperCase()} — crypto:${m.crypto.ok}, stock:${m.stock.ok}, etf:${m.etf.ok}`;
          return <Chip key={m.symbol} label={label} color="error" />;
        })}
      </Stack>

      {/* Debug Output */}
      {debugMode && debug && (
        <Box
          sx={{
            mt: 2,
            p: 1,
            bgcolor: "#111",
            color: "#0f0",
            borderRadius: 1
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Debug Output
          </Typography>
          <pre style={{ fontSize: "0.75rem", whiteSpace: "pre-wrap" }}>
            {JSON.stringify(debug, null, 2)}
          </pre>
        </Box>
      )}

      <HealthHistory />
    </Box>
  );
}
