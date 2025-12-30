// ------------------------------------------------------------
// GlobalRefreshContext.jsx — v1.190 (Corrected + Safe)
// ------------------------------------------------------------
//
// • Uses new backend contract
// • No more entry.ok or entry.type
// • No more ?feed= (now uses ?mode=feed&feedId=)
// • Delegates normalization to FeedStatusContext
// • Never overwrites correct status with "error"
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
  // Per-feed refresh (v1.190)
  // ------------------------------------------------------------
  const loadFeed = useCallback(
    async (feedId) => {
      setStatus(feedId, "loading");

      try {
        const url = `${API}?mode=feed&feedId=${encodeURIComponent(feedId)}`;
        const res = await fetch(url);
        const json = await res.json();

        if (json.status === "ok") {
          setStatus(feedId, "ok");
        } else if (json.status === "fallback") {
          setStatus(feedId, "fallback");
        } else {
          setStatus(feedId, "dead");
        }

        setRefreshVersion((v) => v + 1);
      } catch (err) {
        setStatus(feedId, "dead");
      }
    },
    [setStatus]
  );

  // ------------------------------------------------------------
  // Global refresh (v1.190)
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
        const normalized = {};

        for (const [feedId, entry] of Object.entries(json.feeds)) {
          const s = entry.status;

          if (s === "ok") normalized[feedId] = "ok";
          else if (s === "fallback") normalized[feedId] = "fallback";
          else if (s === "dead") normalized[feedId] = "dead";
          else normalized[feedId] = "unknown";
        }

        setBulkStatus(normalized);
      } else {
        const errMap = {};
        allFeedNames.forEach((f) => (errMap[f] = "dead"));
        setBulkStatus(errMap);
      }

      setLastUpdated(Date.now());
      setRefreshVersion((v) => v + 1);
    } catch (err) {
      console.error("Global refresh error:", err);

      const errMap = {};
      allFeedNames.forEach((f) => (errMap[f] = "dead"));
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
