// ------------------------------------------------------------
// fetchYahooStock.js — v1.190 (Cloudflare Proxy + History-Safe)
// ------------------------------------------------------------

const axios = require("axios");
const { STOCK_MAP } = require("../config/stockMap.js");
const { getCache, setCache } = require("./marketCache.js");

const YAHOO_PROXY_BASE = "https://your-yahoo-proxy.workers.dev/api/yahoo";

async function fetchYahooStock(symbol, opts = {}) {
  const cacheKey = `stock_${symbol}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const yahooSymbol = STOCK_MAP[symbol];
  if (!yahooSymbol) {
    return {
      type: "stock",
      symbol,
      price: null,
      change_24h: 0,
      history: [],
      error: `Unknown stock symbol: ${symbol}`,
      timestamp: Date.now(),
    };
  }

  try {
    const url = `${YAHOO_PROXY_BASE}?symbol=${encodeURIComponent(yahooSymbol)}`;
    const res = await axios.get(url, {
      timeout: opts.timeout || 5000,
    });

    const data = {
      type: "stock",
      symbol,
      price: res.data?.price ?? null,
      change_24h: res.data?.change_24h ?? 0,
      history: Array.isArray(res.data?.history) ? res.data.history : [],
      timestamp: res.data?.timestamp || Date.now(),
    };

    setCache(cacheKey, data);
    return data;
  } catch (err) {
    console.error("[fetchYahooStock][ERROR]", symbol, err.code || err.message);

    return {
      type: "stock",
      symbol,
      price: null,
      change_24h: 0,
      history: [],
      error: String(err),
      timestamp: Date.now(),
    };
  }
}

module.exports = { fetchYahooStock };
