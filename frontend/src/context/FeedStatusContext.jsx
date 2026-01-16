// ------------------------------------------------------------
// FeedStatusContext.jsx — v1.2.0.8 (Safe Init)
// ------------------------------------------------------------
//
// Stable + battle‑tested:
//   ✓ FEEDS is the source of truth
//   ✓ Normalization guarantees all feedIds exist
//   ✓ Missing backend entries default to "unknown"
//   ✓ No double-path issues
//   ✓ Stage detection is safe + automatic
//   ✓ BACKEND_URL is clean and correct
//
// ------------------------------------------------------------

import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect
} from "react";

import { FEEDS } from "../data/feedsMap";
import { API_BASE } from "../data/api";

// Determine stage based on API_BASE
const API_STAGE =
  typeof API_BASE === "string" && API_BASE.includes("/test")
    ? "test"
    : "prod";

// Build backend URL safely (NO double append)
const BACKEND_URL = `${API_BASE}`;

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
  setLastUpdated: () => {},

  apiStage: API_STAGE
});

console.log("FeedStatusContext v1.2.0.8 active");

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
      setLastUpdated,

      apiStage: API_STAGE
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
