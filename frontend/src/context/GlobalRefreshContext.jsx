// ------------------------------------------------------------
// GlobalRefreshContext.jsx — v1.146 FINAL
//
// Fixes:
// ✅ Uses new FeedStatusContext API (setStatus + setBulkStatus)
// ✅ Uses ?feed= instead of deprecated ?source=
// ✅ Removes unsupported "cached" logic
// ✅ Global refresh now uses health endpoint (correct source of truth)
// ✅ Per-feed refresh uses feed endpoint
// ✅ Prevents infinite loops + re-entrant refresh
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
        // Push backend truth into context
        setBulkStatus(json.feeds);
      } else {
        // If health fails, mark all feeds as error
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
