// ------------------------------------------------------------
// FeedStatusContext.jsx — v1.204 (Production‑Ready)
// ------------------------------------------------------------
//
// Improvements in v1.204:
//   ✓ Fully aligned with backend router v1.204
//   ✓ Supports market_all payload (feeds + markets)
//   ✓ Ensures health.feeds + health.markets ALWAYS exist
//   ✓ Ignores stray debug params (backend-safe)
//   ✓ Never wipes state on backend error
//   ✓ Timestamp ALWAYS a Date object
//   ✓ Normalizes feed statuses safely
//
// Architectural Notes:
//   • This context is the SINGLE source of truth for:
//       - feed health
//       - market health
//       - normalized feed status map
//       - strict/soft mode
//       - lastUpdated timestamp
//
//   • UI components MUST NOT fetch /health except manual refresh.
//     They rely on this context for all state.
//
// ------------------------------------------------------------

import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect
} from "react";

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

console.log("FeedStatusContext v1.204 active");

export function FeedStatusProvider({ children }) {
  // ------------------------------------------------------------
  // Legacy per-feed status map (normalized from backend)
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
  // Full backend health object (feeds + markets)
  // ------------------------------------------------------------
  const [health, setHealth] = useState(null);

  // ------------------------------------------------------------
  // Strict mode toggle
  // ------------------------------------------------------------
  const [strictMode, setStrictMode] = useState(true);

  // ------------------------------------------------------------
  // Timestamp (ALWAYS a Date object)
  // ------------------------------------------------------------
  const [lastUpdated, setLastUpdated] = useState(null);

  // ------------------------------------------------------------
  // Normalize backend health → UI status map
  // ------------------------------------------------------------
  const normalizeHealthToStatus = useCallback(
    (healthObj) => {
      const feeds = healthObj?.feeds;
      if (!feeds || typeof feeds !== "object") {
        console.warn("[FeedStatusContext] Missing feeds object in health");
        return;
      }

      const normalized = {};

      for (const [feedId, entry] of Object.entries(feeds)) {
        if (!entry) {
          normalized[feedId] = "unknown";
          continue;
        }

        // Backend marks ok feeds with ok: true
        if (entry.ok === true) {
          normalized[feedId] =
            entry.type === "json" ? "json" : "ok";
          continue;
        }

        // Otherwise rely on backend status field
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
        // FIX: No unsupported params
        const url = `${BACKEND_URL}?mode=health`;

        const res = await fetch(url);
        const json = await res.json();

        // Validate backend response
        if (json?.status !== "ok") {
          console.warn("[FeedStatusContext] Health returned error:", json);
          return; // Do NOT overwrite state
        }

        // Ensure feeds + markets always exist
        json.feeds = json.feeds || {};
        json.markets = json.markets || {};

        // Store full health object
        setHealth(json);

        // Always store a REAL Date object
        setLastUpdated(new Date());

        // Normalize feed statuses
        normalizeHealthToStatus(json);
      } catch (err) {
        console.error("[FeedStatusContext] Health fetch error:", err);
      }
    };

    // Initial fetch
    fetchHealth();

    // Poll every 60s
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
      setLastUpdated // used by manual refresh in dashboard
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
