// ------------------------------------------------------------
// GlobalRefreshContext.jsx — Phase 4.1 Stable
//
// Fixes:
// ✅ Prevents infinite refresh loops
// ✅ Ensures isRefreshing resets properly
// ✅ Makes refreshAll fully stable + re-entrant safe
// ✅ Makes triggerRefresh safe (no feedback loops)
// ✅ Preserves Phase 3 streaming + per-feed updates
// ✅ Adds cache detection and "cached" status
// ------------------------------------------------------------

import React, {
  createContext,
  useState,
  useCallback,
  useContext
} from "react";

import { FeedStatusContext } from "./FeedStatusContext";
import { feedCategories } from "../lambda/feedCategories";

export const GlobalRefreshContext = createContext({
  refreshVersion: 0,
  triggerRefresh: () => { },
  refreshAll: () => { },
  loadFeed: () => { },
  lastUpdated: null,
  isRefreshing: false
});

const LAMBDA_URL =
  "https://jy4i499sj1.execute-api.us-east-1.amazonaws.com/default/RSSProxyAggregator";

const allFeedNames = Object.values(feedCategories)
  .flat()
  .map(f => f.name);

export function GlobalRefreshProvider({ children }) {
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { updateStatus } = useContext(FeedStatusContext);

  // ------------------------------------------------------------
  // ✅ Per-feed loader with cache detection
  // ------------------------------------------------------------
  const loadFeed = useCallback(
    async (feedName) => {
      updateStatus(feedName, "loading");

      try {
        const url = `${LAMBDA_URL}?source=${feedName}`;
        const res = await fetch(url);
        const json = await res.json();

        const ok = res.ok && json.status === "ok";
        const cached = json.cached === true || (json.age && json.age < 60);

        if (ok) {
          updateStatus(feedName, cached ? "cached" : "ok");
        } else {
          updateStatus(feedName, "error");
        }

        // ✅ bump refreshVersion to trigger RSSFeed re-render
        setRefreshVersion(v => v + 1);

      } catch {
        updateStatus(feedName, "error");
      }
    },
    [updateStatus]
  );

  // ------------------------------------------------------------
  // ✅ Global refresh (Phase 4 stable)
  // ------------------------------------------------------------
  const refreshAll = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    try {
      allFeedNames.forEach(feed => updateStatus(feed, "loading"));

      for (const feed of allFeedNames) {
        await loadFeed(feed);
      }

      setLastUpdated(Date.now());
    } catch (err) {
      console.error("Global refresh error:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, loadFeed, updateStatus]);

  // ------------------------------------------------------------
  // ✅ triggerRefresh — safe version bump
  // ------------------------------------------------------------
  const triggerRefresh = useCallback(() => {
    setRefreshVersion(v => v + 1);
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
