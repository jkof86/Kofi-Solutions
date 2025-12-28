// ------------------------------------------------------------
// GlobalRefreshContext.jsx — v1.181 (Corrected + Unified Normalization)
// ------------------------------------------------------------
//
// Fixes:
//   • Global refresh now uses same normalization as FeedStatusContext
//   • JSON feeds marked as "json" (healthy)
//   • Strict/soft mode preserved
//   • No more ticker false warnings
//
// ------------------------------------------------------------

import React, {
  createContext,
  useState,
  useCallback,
  useContext
} from "react";

import { FeedStatusContext } from "./FeedStatusContext";
import { FEEDS } from "../data/feedsMap";

export const GlobalRefreshContext = createContext({
  refreshVersion: 0,
  triggerRefresh: () => {},
  refreshAll: () => {},
  loadFeed: () => {},
  lastUpdated: null,
  isRefreshing: false
});

const API =
  "https://jy4i499sj1.execute-api.us-east-1.amazonaws.com/default/RSSProxyAggregator";

const allFeedNames = Object.keys(FEEDS);

export function GlobalRefreshProvider({ children }) {
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { setStatus, setBulkStatus } = useContext(FeedStatusContext);

  // ------------------------------------------------------------
  // Per-feed refresh (uses ?feed=)
  // ------------------------------------------------------------
  const loadFeed = useCallback(
    async (feedName) => {
      setStatus(feedName, "loading");

      try {
        const url = `${API}?feed=${encodeURIComponent(feedName)}`;
        const res = await fetch(url);
        const json = await res.json();

        if (json.status === "ok") {
          setStatus(feedName, "ok");
        } else if (json.status === "fallback") {
          setStatus(feedName, "fallback");
        } else {
          setStatus(feedName, "error");
        }

        setRefreshVersion((v) => v + 1);
      } catch (err) {
        setStatus(feedName, "error");
      }
    },
    [setStatus]
  );

  // ------------------------------------------------------------
  // Global refresh (uses ?mode=health)
  // ------------------------------------------------------------
  const refreshAll = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    try {
      // Mark all feeds as loading
      allFeedNames.forEach((f) => setStatus(f, "loading"));

      const url = `${API}?mode=health&strict=true&sampleSize=1`;
      const res = await fetch(url);
      const json = await res.json();

      if (json.status === "ok" && json.feeds) {
        // Normalize using same logic as FeedStatusContext
        const normalized = {};
        for (const [feedId, entry] of Object.entries(json.feeds)) {
          if (entry.ok) {
            normalized[feedId] = entry.type === "json" ? "json" : "ok";
          } else if (entry.status === "fallback") {
            normalized[feedId] = "fallback";
          } else {
            normalized[feedId] = "error";
          }
        }
        setBulkStatus(normalized);
      } else {
        const errMap = {};
        allFeedNames.forEach((f) => (errMap[f] = "error"));
        setBulkStatus(errMap);
      }

      setLastUpdated(Date.now());
      setRefreshVersion((v) => v + 1);
    } catch (err) {
      console.error("Global refresh error:", err);

      const errMap = {};
      allFeedNames.forEach((f) => (errMap[f] = "error"));
      setBulkStatus(errMap);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, setStatus, setBulkStatus]);

  // ------------------------------------------------------------
  // Manual refresh bump
  // ------------------------------------------------------------
  const triggerRefresh = useCallback(() => {
    setRefreshVersion((v) => v + 1);
  }, []);

  return (
    <GlobalRefreshContext.Provider
      value={{
        refreshVersion,
        triggerRefresh,
        refreshAll,
        loadFeed,
        lastUpdated,
        isRefreshing
      }}
    >
      {children}
    </GlobalRefreshContext.Provider>
  );
}
