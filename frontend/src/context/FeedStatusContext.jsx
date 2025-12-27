// ------------------------------------------------------------
// FeedStatusContext.jsx — v1.180 (Health Polling + Normalization)
// ------------------------------------------------------------
//
// New features:
//   • Automatic health polling (every 60s)
//   • Normalizes backend health → legacy status map
//   • Updates lastUpdated timestamp
//   • Fully aligned with TabsLayout, FeedStatusBar, Health Drawer
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

export function FeedStatusProvider({ children }) {
  // ------------------------------------------------------------
  // Legacy per-feed status map
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
  const normalizeHealthToStatus = useCallback((healthObj) => {
    if (!healthObj?.feeds) return;

    const normalized = {};
    for (const [feedId, entry] of Object.entries(healthObj.feeds)) {
      if (entry.ok) normalized[feedId] = "ok";
      else if (entry.status === "fallback") normalized[feedId] = "fallback";
      else normalized[feedId] = "error";
    }

    setBulkStatus(normalized);
  }, [setBulkStatus]);

  // ------------------------------------------------------------
  // Poll backend health every 60 seconds
  // ------------------------------------------------------------
  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}?mode=health`);
        const json = await res.json();

        setHealth(json);
        setLastUpdated(Date.now());
        normalizeHealthToStatus(json);

        console.log("[FeedStatusContext] Health updated:", json);
      } catch (err) {
        console.error("[FeedStatusContext] Health fetch error:", err);
      }
    };

    // Initial load
    fetchHealth();

    // Polling interval
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
