// ------------------------------------------------------------
// FeedStatusContext.jsx — v2.1
// Normalized health loader for feeds + markets
// ------------------------------------------------------------
//
// Improvements in v2.1:
//   ✓ Normalizes backend statuses for consistent UI
//   ✓ Treats minimal/html_error as fallback
//   ✓ Treats unknown+count>0 as fallback
//   ✓ Keeps dead/blocked as true errors
//   ✓ Fully compatible with RSSFeed v1.222 + FeedDashboard v1.207
//
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
  // Status normalization
  // ------------------------------------------------------------
  function normalizeStatus(rawStatus, feedData) {
    if (!rawStatus) return "unknown";

    // True errors
    if (rawStatus === "dead" || rawStatus === "blocked") return "dead";

    // HTML errors → fallback
    if (rawStatus === "html_error") return "fallback";

    // Minimal fallback → fallback
    if (rawStatus === "minimal") return "fallback";

    // Unknown but items exist → fallback
    if (rawStatus === "unknown" && feedData?.count > 0) return "fallback";

    return rawStatus;
  }

  // ------------------------------------------------------------
  // Fetch health from backend (feeds + markets)
  // ------------------------------------------------------------
  const loadHealth = useCallback(async () => {
    try {
      const url = `${API_BASE}?mode=health_feeds`;
      const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) {
        console.warn("[FeedStatusContext] Health fetch failed:", res.status);
        return;
      }

      const json = await res.json();

      const rawFeeds = json.feeds || {};
      const normalizedFeeds = {};

      // Normalize each feed status
      for (const feedId of Object.keys(rawFeeds)) {
        const feedData = rawFeeds[feedId];
        const rawStatus = feedData?.status || "unknown";
        normalizedFeeds[feedId] = normalizeStatus(rawStatus, feedData);
      }

      setStatus(normalizedFeeds);
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
