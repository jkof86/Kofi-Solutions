// ------------------------------------------------------------
// GlobalRefreshContext.jsx
//
// Phase 3 upgrade:
// - Adds per-feed loadFeed() for real-time updates
// - Removes Promise.all batching
// - Streams feed updates one-by-one
// - Updates FeedStatusContext immediately per feed
// - Exposes loadFeed so RSSFeed and Home can trigger loads
// - Auto-loads first feed on login (handled in Home/RSSFeed)
// ------------------------------------------------------------

import React, {
  createContext,
  useState,
  useCallback,
  useContext
} from "react";

import { FeedStatusContext } from "./FeedStatusContext";
import { feedCategories } from "../data/feedCategories";

export const GlobalRefreshContext = createContext({
  refreshVersion: 0,
  triggerRefresh: () => {},
  refreshAll: () => {},
  loadFeed: () => {},
  lastUpdated: null
});

const LAMBDA_URL =
  "https://jy4i499sj1.execute-api.us-east-1.amazonaws.com/default/RSSProxyAggregator";

const allFeedNames = Object.values(feedCategories)
  .flat()
  .map(f => f.name);

export function GlobalRefreshProvider({ children }) {
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);

  const { updateStatus } = useContext(FeedStatusContext);

  // ------------------------------------------------------------
  // ✅ Per-feed loader (Phase 3)
  // Called by RSSFeed and refreshAll()
  // ------------------------------------------------------------
  const loadFeed = useCallback(
    async (feedName) => {
      updateStatus(feedName, "loading");

      try {
        const url = `${LAMBDA_URL}?source=${feedName}`;
        const res = await fetch(url);
        const json = await res.json();

        const ok = res.ok && json.status === "ok";
        updateStatus(feedName, ok ? "ok" : "error");
      } catch (err) {
        updateStatus(feedName, "error");
      }
    },
    [updateStatus]
  );

  // ------------------------------------------------------------
  // ✅ Global refresh (Phase 3)
  // Streams updates one-by-one instead of batching
  // ------------------------------------------------------------
  const refreshAll = useCallback(async () => {
    try {
      // Mark all feeds as loading immediately
      allFeedNames.forEach(feed => updateStatus(feed, "loading"));

      // Load feeds sequentially so UI updates per feed
      for (const feed of allFeedNames) {
        await loadFeed(feed);
      }

      setLastUpdated(Date.now());
    } catch (err) {
      console.error("Global refresh error:", err);
    }
  }, [loadFeed, updateStatus]);

  const triggerRefresh = useCallback(() => {
    setRefreshVersion(v => v + 1);
  }, []);

  return (
    <GlobalRefreshContext.Provider
      value={{
        refreshVersion,
        triggerRefresh,
        refreshAll,
        loadFeed,      // ✅ NEW
        lastUpdated
      }}
    >
      {children}
    </GlobalRefreshContext.Provider>
  );
}
