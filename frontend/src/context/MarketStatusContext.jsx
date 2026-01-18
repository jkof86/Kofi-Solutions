// ------------------------------------------------------------
// MarketStatusContext.jsx — v1.0 (Continuous Market Updates)
// ------------------------------------------------------------

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo
} from "react";

import { MARKET_SYMBOLS } from "../data/tickerConfig";
import { API_BASE } from "../data/api";

const BACKEND_URL = `${API_BASE}`;
const POLL_INTERVAL = 15000;

export const MarketStatusContext = createContext({
  market: {},
  lastUpdated: null
});

export function MarketStatusProvider({ children }) {
  const [market, setMarket] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchMarket = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}?mode=market_all`);
      const json = await res.json();

      if (!json?.results) return;

      const normalized = {};

      for (const symbol of MARKET_SYMBOLS) {
        normalized[symbol] = json.results[symbol] || {
          ok: false,
          price: null,
          change_24h: null,
          timestamp: null,
          error: "missing"
        };
      }

      setMarket(normalized);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("[MarketStatusContext] Error:", err);
    }
  }, []);

  useEffect(() => {
    fetchMarket();
    const id = setInterval(fetchMarket, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchMarket]);

  const value = useMemo(
    () => ({ market, lastUpdated }),
    [market, lastUpdated]
  );

  return (
    <MarketStatusContext.Provider value={value}>
      {children}
    </MarketStatusContext.Provider>
  );
}
