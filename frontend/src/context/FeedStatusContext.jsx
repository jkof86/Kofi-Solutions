// ------------------------------------------------------------
// FeedStatusContext.jsx — v2.0
// Stable health loader for feeds + markets
// ------------------------------------------------------------

import React, { createContext, useState, useEffect, useCallback } from "react";
import { API_BASE } from "../data/api";

export const FeedStatusContext = createContext({
  status: {},
  markets: {},
  health: null,
  lastUpdated: null,
  apiStage: null,
  strictMode: false,
  setStrictMode: () => {},
  refreshHealth: () => {}
});

export function FeedStatusProvider({ children }) {
  const [status, setStatus] = useState({});
  const [markets, setMarkets] = useState({});
  const [health, setHealth] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [apiStage, setApiStage] = useState(null);
  const [strictMode, setStrictMode] = useState(false);

  // ------------------------------------------------------------
  // Fetch health from backend (feeds + markets)
  // ------------------------------------------------------------
  const loadHealth = useCallback(async () => {
    try {
      const url = `${API_BASE}?mode=health`;
      const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) {
        console.warn("[FeedStatusContext] Health fetch failed:", res.status);
        return;
      }

      const json = await res.json();

      // Expected payload:
      // {
      //   stage: "test",
      //   timestamp: 1705580000000,
      //   feeds: { cnn_top: { status, count, ... }, ... },
      //   markets: { BTC: { status, last, change, ... }, ... }
      // }

      const feedStatuses = {};
      for (const [feedId, entry] of Object.entries(json.feeds || {})) {
        feedStatuses[feedId] = entry.status || "unknown";
      }

      setStatus(feedStatuses);
      setMarkets(json.markets || {});
      setHealth(json);
      setLastUpdated(json.timestamp ? new Date(json.timestamp) : new Date());
      setApiStage(json.stage || "unknown");
    } catch (err) {
      console.error("[FeedStatusContext] Error loading health:", err);
    }
  }, []);

  // ------------------------------------------------------------
  // Manual refresh (used by FeedDashboard + HealthDrawer)
  // ------------------------------------------------------------
  const refreshHealth = useCallback(() => {
    loadHealth();
  }, [loadHealth]);

  // ------------------------------------------------------------
  // Initial load + periodic refresh
  // ------------------------------------------------------------
  useEffect(() => {
    loadHealth();

    // Refresh every 60 seconds
    const interval = setInterval(() => {
      loadHealth();
    }, 60000);

    return () => clearInterval(interval);
  }, [loadHealth]);

  // ------------------------------------------------------------
  // Context value
  // ------------------------------------------------------------
  const value = {
    status,
    markets,
    health,
    lastUpdated,
    apiStage,
    strictMode,
    setStrictMode,
    refreshHealth
  };

  return (
    <FeedStatusContext.Provider value={value}>
      {children}
    </FeedStatusContext.Provider>
  );
}
