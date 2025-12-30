// ------------------------------------------------------------
// FeedStatusContext.jsx — v1.190 (Corrected + Fully Normalized)
// ------------------------------------------------------------
//
// Responsibilities:
//   ✓ Poll backend health every 60s
//   ✓ Store full health object (feeds + markets)
//   ✓ Maintain legacy per‑feed status map for UI components
//   ✓ Normalize backend → UI statuses consistently
//   ✓ Expose strictMode, sampleSize, debugMode
//
// Architectural Notes:
//   • This is the single source of truth for feed health
//   • TabsLayout + FeedCard + FeedHealthDashboard all depend on it
//   • JSON feeds must normalize as "json" (healthy)
//   • Fallback, blocked, dead, html_error must all be preserved
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

export const FeedStatusContext = createContext({
  status: {},
  setStatus: () => {},
  setBulkStatus: () => {},

  health: null,
  setHealth: () => {},

  strictMode: true,
  setStrictMode: () => {},

  sampleSize: 1,
  setSampleSize: () => {},

  debugMode: "",
  setDebugMode: () => {},

  lastUpdated: null,
  setLastUpdated: () => {}
});

console.log("FeedStatusContext v1.190 active");

export function FeedStatusProvider({ children }) {
  // ------------------------------------------------------------
  // Legacy per-feed status map (UI-friendly)
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
  // Modes + settings
  // ------------------------------------------------------------
  const [strictMode, setStrictMode] = useState(true);
  const [sampleSize, setSampleSize] = useState(1);
  const [debugMode, setDebugMode] = useState("");

  // ------------------------------------------------------------
  // Timestamp
  // ------------------------------------------------------------
  const [lastUpdated, setLastUpdated] = useState(null);

  // ------------------------------------------------------------
  // Normalize backend health → legacy status map
  // ------------------------------------------------------------
  const normalizeHealthToStatus = useCallback(
    (healthObj) => {
      if (!healthObj?.feeds) return;

      const normalized = {};

      for (const [feedId, entry] of Object.entries(healthObj.feeds)) {
        // Backend contract:
        //   entry.ok → boolean
        //   entry.type → "rss" | "json"
        //   entry.status → "fallback" | "dead" | "blocked" | "html_error" | "ok"
        //
        if (entry.ok) {
          // JSON feeds must normalize as "json"
          normalized[feedId] = entry.type === "json" ? "json" : "ok";
          continue;
        }

        // Non-OK statuses
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
        const url = `${BACKEND_URL}?mode=health&strict=${strictMode}&sampleSize=${sampleSize}&debug=${debugMode}`;
        const res = await fetch(url);
        const json = await res.json();

        console.log("[FeedStatusContext] Raw health:", json);

        // Always store full health object
        setHealth(json);
        setLastUpdated(Date.now());

        // Normalize feed statuses for UI
        normalizeHealthToStatus(json);
      } catch (err) {
        console.error("[FeedStatusContext] Health fetch error:", err);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 60000);
    return () => clearInterval(interval);
  }, [strictMode, sampleSize, debugMode, normalizeHealthToStatus]);

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

      sampleSize,
      setSampleSize,

      debugMode,
      setDebugMode,

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
      sampleSize,
      debugMode,
      lastUpdated
    ]
  );

  return (
    <FeedStatusContext.Provider value={value}>
      {children}
    </FeedStatusContext.Provider>
  );
}
