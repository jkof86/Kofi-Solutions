// ------------------------------------------------------------
// FeedStatusContext.jsx
// Tracks per-feed status: "ok", "error", or "loading".
// Used for error badges, dashboard icons, and health metrics.
// ------------------------------------------------------------

import React, { createContext, useState } from "react";

export const FeedStatusContext = createContext({
  status: {},
  updateStatus: () => {}
});

export function FeedStatusProvider({ children }) {
  const [status, setStatus] = useState({});

  const updateStatus = (feedName, state) => {
    setStatus(prev => ({ ...prev, [feedName]: state }));
  };

  return (
    <FeedStatusContext.Provider value={{ status, updateStatus }}>
      {children}
    </FeedStatusContext.Provider>
  );
}
