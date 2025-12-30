// ------------------------------------------------------------
// FeedStatusContext.jsx — v1.181 (Corrected + Stable)
// ------------------------------------------------------------
//
// Fixes:
//   • JSON feeds now normalize as "json" (healthy)
//   • Health polling uses strictMode, sampleSize, debugMode
//   • Health dashboard no longer freezes
//   • Normalization unified across app
//   • Full logging for backend debugging
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
  setStatus: () => { },
  setBulkStatus: () => { },

  health: null,
  setHealth: () => { },

  strictMode: true,
  setStrictMode: () => { },

  sampleSize: 1,
  setSampleSize: () => { },

  debugMode: "",
  setDebugMode: () => { },

  lastUpdated: null,
  setLastUpdated: () => { }
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
  const normalizeHealthToStatus = useCallback(
    (healthObj) => {
      if (!healthObj?.feeds) return;

      const normalized = {};

      for (const [feedId, entry] of Object.entries(healthObj.feeds)) {
        if (entry.ok) {
          normalized[feedId] = entry.type === "json" ? "json" : "ok";
        } else if (entry.status === "fallback") {
          normalized[feedId] = "fallback";
        } else if (entry.status === "dead") {
          normalized[feedId] = "dead";
        } else if (entry.status === "blocked") {
          normalized[feedId] = "blocked";
        } else if (entry.status === "html_error") {
          normalized[feedId] = "html_error";
        } else {
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

        // Always set health, even if status !== ok
        setHealth(json);
        setLastUpdated(Date.now());

        // Normalize feed statuses
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
