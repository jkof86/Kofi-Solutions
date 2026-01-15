// ------------------------------------------------------------
// FeedStatusContext.jsx — v1.205 (Fully Normalized + Stable)
// ------------------------------------------------------------
//
// Key Fixes in v1.205:
//   ✓ FEEDS is now the source of truth for all feed IDs
//   ✓ Health normalization guarantees ALL feedIds exist in status
//   ✓ Missing backend entries default to "unknown" (never undefined)
//   ✓ strictMode can no longer wipe out feeds due to missing keys
//   ✓ Markets preserved exactly as returned
//
// ------------------------------------------------------------

import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect
} from "react";

import { FEEDS } from "../data/feedsMap";   // ⭐ NEW: FEEDS imported

const BACKEND_URL =
  "https://jy4i499sj1.execute-api.us-east-1.amazonaws.com/default/RSSProxyAggregator";

// ------------------------------------------------------------
// Default context shape
// ------------------------------------------------------------
export const FeedStatusContext = createContext({
  status: {},
  setStatus: () => {},
  setBulkStatus: () => {},

  health: null,
  setHealth: () => {},

  strictMode: true,
  setStrictMode: () => {},

  lastUpdated: null,
  setLastUpdated: () => {}
});

console.log("FeedStatusContext v1.205 active");

export function FeedStatusProvider({ children }) {
  // ------------------------------------------------------------
  // Per-feed status map (normalized)
  // ------------------------------------------------------------
  const [status, setStatusMap] = useState({});

  const setStatus = useCallback((feedId, value) => {
    setStatusMap((prev) => {
      if (prev[feedId] === value) return prev;
      return { ...prev, [feedId]: value };
    });
  }, []);

  const setBulkStatus = useCallback((statusObj) => {
    if (!statusObj || typeof statusObj !== "object") return;
    setStatusMap(statusObj);
  }, []);

  // ------------------------------------------------------------
  // Full backend health object
  // ------------------------------------------------------------
  const [health, setHealth] = useState(null);

  // ------------------------------------------------------------
  // Strict mode toggle
  // ------------------------------------------------------------
  const [strictMode, setStrictMode] = useState(true);

  // ------------------------------------------------------------
  // Timestamp
  // ------------------------------------------------------------
  const [lastUpdated, setLastUpdated] = useState(null);

  // ------------------------------------------------------------
  // Normalize backend health → UI status map
  // ------------------------------------------------------------
  const normalizeHealthToStatus = useCallback(
    (healthObj) => {
      const backendFeeds = healthObj?.feeds || {};

      const normalized = {};

      // ⭐ FEEDS is the source of truth
      for (const feedId of Object.keys(FEEDS)) {
        const entry = backendFeeds[feedId];

        if (!entry) {
          normalized[feedId] = "unknown";
          continue;
        }

        if (entry.ok === true) {
          normalized[feedId] =
            entry.type === "json" ? "json" : "ok";
          continue;
        }

        switch (entry.status) {
          case "fallback":
            normalized[feedId] = "fallback";
            break;
          case "dead":
            normalized[feedId] = "dead";
            break;
          case "blocked":
            normalized[feedId] = "blocked";
            break;
          case "html_error":
            normalized[feedId] = "html_error";
            break;
          case "ok":
            normalized[feedId] =
              entry.type === "json" ? "json" : "ok";
            break;
          default:
            normalized[feedId] = "unknown";
        }
      }

      setBulkStatus(normalized);
    },
    [setBulkStatus]
  );

  // ------------------------------------------------------------
  // Poll backend health every 60 seconds
  // ------------------------------------------------------------
  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const url = `${BACKEND_URL}?mode=health`;

        const res = await fetch(url);
        const json = await res.json();

        if (json?.status !== "ok") {
          console.warn("[FeedStatusContext] Health returned error:", json);
          return;
        }

        json.feeds = json.feeds || {};
        json.markets = json.markets || {};

        setHealth(json);
        setLastUpdated(new Date());

        normalizeHealthToStatus(json);
      } catch (err) {
        console.error("[FeedStatusContext] Health fetch error:", err);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 60000);
    return () => clearInterval(interval);
  }, [normalizeHealthToStatus]);

  // ------------------------------------------------------------
  // Memoized context value
  // ------------------------------------------------------------
  const value = useMemo(
    () => ({
      status,
      setStatus,
      setBulkStatus,

      health,
      setHealth,

      strictMode,
      setStrictMode,

      lastUpdated,
      setLastUpdated
    }),
    [
      status,
      setStatus,
      setBulkStatus,
      health,
      setHealth,
      strictMode,
      lastUpdated
    ]
  );

  return (
    <FeedStatusContext.Provider value={value}>
      {children}
    </FeedStatusContext.Provider>
  );
}
