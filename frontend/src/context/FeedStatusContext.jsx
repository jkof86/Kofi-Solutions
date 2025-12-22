// ------------------------------------------------------------
// FeedStatusContext.jsx — Phase 4 Stable
// Tracks per-feed status: "ok", "error", or "loading".
// ------------------------------------------------------------

import React, { createContext, useState, useCallback, useMemo } from "react";

export const FeedStatusContext = createContext({
  status: {},
  updateStatus: () => {}
});

export function FeedStatusProvider({ children }) {
  const [status, setStatus] = useState({});

  // ✅ Stable identity + prevents useless re-renders
  const updateStatus = useCallback((feedName, state) => {
    setStatus(prev => {
      if (prev[feedName] === state) return prev; // no-op if unchanged
      return { ...prev, [feedName]: state };
    });
  }, []);

  // ✅ Stable context value
  const value = useMemo(
    () => ({ status, updateStatus }),
    [status, updateStatus]
  );

  return (
    <FeedStatusContext.Provider value={value}>
      {children}
    </FeedStatusContext.Provider>
  );
}
