// ------------------------------------------------------------
// FeedHealthDashboard.jsx — v1.205 (Stable + StrictMode Global)
// ------------------------------------------------------------
//
// Fixes:
//   ✓ Uses global strictMode from FeedStatusContext
//   ✓ Strict Mode toggle moved inside Debug tab only
//   ✓ Added Feed Status Legend
//   ✓ Debug runner cleaned + safe
//   ✓ Health loader stable with backend v1.204
//   ✓ Clear button resets console cleanly
//
// ------------------------------------------------------------
import React, {
  useEffect,
  useContext,
  useState,
  useCallback,
  useRef
} from "react";
import {
  Box,
  Chip,
  Typography,
  Stack,
  Divider,
  IconButton,
  TextField,
  Button,
  Paper,
  Tabs,
  Tab,
  Tooltip,
  FormControlLabel,
  Switch
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import { FeedStatusContext } from "../../context/FeedStatusContext";
import { API_BASE } from "../../data/api";
import HealthHistory from "./HealthHistory";
import HealthStatusLegend from "./HealthStatusLegend";
import DebugBanner from "./DebugBanner";
import DebugTab from "../layouts/DebugTab";

export default function HealthDashboard() {

  //------------------------------------------------------------
  // Context values
  //------------------------------------------------------------
  const {
    status,
    health,
    setHealth,
    lastUpdated,
    setLastUpdated,
    strictMode,
    setStrictMode,
    apiStage
  } = useContext(FeedStatusContext);

  //------------------------------------------------------------
  // Debug: what dashboard receives
  //------------------------------------------------------------
  // console.log("[DASH] Status received:", status);
  // console.log("[DASH] Raw health object:", health);

  //------------------------------------------------------------
  // Compute summary counts
  //------------------------------------------------------------
  const values = Object.values(status || {});

  // Log the distinct states we actually see
  const uniqueStates = Array.from(new Set(values));
  // console.log("[DASH] Unique status states:", uniqueStates);

  const okCount = values.filter(s => s === "ok" || s === "json").length;

  // Treat both "fallback" and "flaky" as fallback-ish
  const fallbackCount = values.filter(s => s === "fallback" || s === "empty").length;

  // Treat anything explicitly bad as error
  const errorCount = values.filter(s =>
    ["dead", "blocked", "html_error", "failed", "error"].includes(s)
  ).length;

  // console.log("[DASH] Computed counts:", {
  //   okCount,
  //   fallbackCount,
  //   errorCount
  // });

  //------------------------------------------------------------
  // Local UI state
  //------------------------------------------------------------
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(0);
  const [debugOutput, setDebugOutput] = useState("");
  const [customQuery, setCustomQuery] = useState("?debug=echo&msg=hello");
  const debugRef = useRef(null);

  const API = `${API_BASE}`;

  //------------------------------------------------------------
  // Fetch backend health (manual + auto)
  //------------------------------------------------------------
  const fetchHealth = useCallback(async () => {
    try {
      const url = `${API_BASE}?mode=health`;
      const res = await fetch(url);
      const json = await res.json();

      if (json?.status !== "ok") {
        console.warn("[FeedHealthDashboard] Health returned error:", json);
        return;
      }

      json.feeds = json.feeds || {};
      json.markets = json.markets || {};

      // console.log("[CTX] Raw backend feeds:", json.feeds);

      setHealth(json);
      setLastUpdated(new Date());

    } catch (err) {
      console.error("[FeedHealthDashboard] Health fetch error:", err);
    }
  }, [setHealth, setLastUpdated]);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${API}?mode=health`);
      const json = await res.json();

      if (json.status !== "ok") {
        setError(json.error || "Health error");
        return;
      }

      setHealth(json);
      setError(null);
      setLastUpdated(new Date());

    } catch (err) {
      setError(err.message || "Health fetch failed");
    }
  }, [setHealth, setLastUpdated]);

  //------------------------------------------------------------
  // Initial load
  //------------------------------------------------------------
  useEffect(() => {
    if (!health) {
      load();
    }
  }, [health, load]);

  // ------------------------------------------------------------
  // Debug runner — fetch + pretty-print JSON into console panel
  // ------------------------------------------------------------
  const runDebug = async (query) => {
    try {
      const q = query.startsWith("?") ? query : `?${query}`;

      const res = await fetch(`${API_BASE}${q}`);
      const json = await res.json();

      setDebugOutput(
        `REQUEST: ${API_BASE}${q}\n\n` +
        JSON.stringify(json, null, 2)
      );
      setTab(1);
    } catch (err) {
      setDebugOutput(`ERROR: ${err.message}`);
      setTab(1);
    }
  };

  // Auto-scroll debug console
  useEffect(() => {
    if (debugRef.current) {
      debugRef.current.scrollTop = debugRef.current.scrollHeight;
    }
  }, [debugOutput]);

  const copyDebug = () => {
    if (!debugOutput) return;
    navigator.clipboard.writeText(debugOutput).catch(() => { });
  };

  const formatTime = (d) => {
    if (!d) return "";
    const date = typeof d === "number" ? new Date(d) : d;
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  if (error && !health) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          Health Error
        </Typography>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  if (!health) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Loading health…</Typography>
      </Box>
    );
  }

  const { feeds = {}, markets = {} } = health;

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  return (


    <Box sx={{ p: 1 }}>
      <HealthStatusLegend />

      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1 }}
      >
        <div style={{ marginBottom: "10px", opacity: 0.7 }}>
          Backend Stage: <strong>{apiStage === "test" ? "TESTING ($LATEST)" : "PRODUCTION BUILD"}</strong>
        </div>

        <Tooltip title="Refresh System Health">
          <IconButton onClick={load} size="small">
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
        Last updated: {formatTime(lastUpdated) || "—"}
      </Typography>

      <Divider sx={{ mb: 1 }} />

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="fullWidth"
        sx={{ mb: 1 }}
      >
        <Tab label="Health" />
        <Tab label="Debug" />
        <Tab label="History" />
      </Tabs>

      {/* ------------------------------------------------------------
    HEALTH TAB — v1.301 (Unified Classification + Proper Tab Switching)
------------------------------------------------------------ */}
      {tab === 0 && (
        <Box sx={{ p: 2 }}>

          {/* Summary counts */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Chip
              label={`Healthy: ${Object.values(status).filter((s) => s === "ok" || s === "json").length
                }`}
              color="success"
            />
            <Chip
              label={`Fallback: ${Object.values(status).filter((s) => s === "fallback" || s === "empty").length
                }`}
              color="warning"
            />
            <Chip
              label={`Error: ${Object.values(status).filter((s) =>
                ["dead", "blocked", "html_error", "unknown"].includes(s)
              ).length
                }`}
              color="error"
            />
          </Stack>

          {/* Feed list */}
          <Stack spacing={1}>
            {Object.entries(status).map(([feedId, state]) => {
              const color =
                state === "ok" || state === "json"
                  ? "success"
                  : state === "fallback" || state === "empty"
                    ? "warning"
                    : "error";

              const count = health?.feeds?.[feedId]?.count ?? 0;

              return (
                <Chip
                  key={feedId}
                  label={`${feedId} — ${state.toUpperCase()} (${count})`}
                  color={color}
                  sx={{ fontWeight: 600 }}
                />
              );
            })}
          </Stack>
        </Box>
      )}

      {/* DEBUG TAB */}
      {tab === 1 && (
        <Box sx={{ mt: 1 }}>

          {/* Strict Mode Toggle (Global) */}
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={strictMode}
                  onChange={(e) => setStrictMode(e.target.checked)}
                  color="warning"
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Strict Mode (Filter Unhealthy Feeds)
                </Typography>
              }
            />
            <Typography variant="caption" sx={{ ml: 1, opacity: 0.7 }}>
              When enabled, only ok/json/fallback feeds appear in category tabs.
            </Typography>
          </Box>

          {/* Stage Banner */}
          <Box sx={{ mb: 2 }}>
            <DebugBanner />
          </Box>

          {/* Debug Tools */}
          <DebugTab />
        </Box>
      )}


      {/* HISTORY TAB */}
      {tab === 2 && (
        <Box sx={{ mt: 1 }}>
          <HealthHistory />
        </Box>
      )};
    </Box>
  )
}





