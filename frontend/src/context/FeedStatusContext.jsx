// ------------------------------------------------------------
// FeedStatusContext.jsx — v1.198 (Stable + Timestamp‑Correct)
// ------------------------------------------------------------
//
// Improvements in v1.198:
//   ✓ Ensures lastUpdated is ALWAYS a Date object
//     (fixes .toLocaleTimeString crash in dashboard)
//   ✓ Calls /health with NO unsupported params
//   ✓ Validates backend response before updating state
//   ✓ Never wipes status/health on backend failure
//   ✓ Normalizes only when json.status === "ok"
//   ✓ Stable strictMode behavior
//   ✓ Stable memoization
//
// Architectural Notes:
//   • This context is the SINGLE source of truth for:
//       - feed health
//       - market health
//       - normalized feed status map
//       - strict/soft mode
//       - lastUpdated timestamp
//
//   • FeedHealthDashboard and other components MUST NOT
//     fetch /health directly except for manual refresh.
//     They should rely on this context for all state.
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

console.log("FeedStatusContext v1.198 active");

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
  // Full backend health object
  // ------------------------------------------------------------
  const [health, setHealth] = useState(null);

  // ------------------------------------------------------------
  // Strict mode toggle
  // ------------------------------------------------------------
  const [strictMode, setStrictMode] = useState(true);

  // ------------------------------------------------------------
  // Timestamp (ALWAYS a Date object in v1.198)
  // ------------------------------------------------------------
  const [lastUpdated, setLastUpdated] = useState(null);

  // ------------------------------------------------------------
  // Normalize backend health → UI status map
  // ------------------------------------------------------------
  const normalizeHealthToStatus = useCallback(
    (healthObj) => {
      if (!healthObj?.feeds || typeof healthObj.feeds !== "object") {
        console.warn("[FeedStatusContext] Missing feeds object in health");
        return;
      }

      const normalized = {};

      for (const [feedId, entry] of Object.entries(healthObj.feeds)) {
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
        // ⭐ FIX: No unsupported params
        const url = `${BACKEND_URL}?mode=health`;

        const res = await fetch(url);
        const json = await res.json();

        // ⭐ Validate backend response
        if (json?.status !== "ok") {
          console.warn("[FeedStatusContext] Health returned error:", json);
          return; // Do NOT overwrite state
        }

        // Store full health object
        setHealth(json);

        // ⭐ CRITICAL FIX:
        // Always store a REAL Date object to prevent UI crashes
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
