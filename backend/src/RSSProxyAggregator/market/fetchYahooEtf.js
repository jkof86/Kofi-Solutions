// ------------------------------------------------------------
// fetchYahooEtf.js — v1.190 (Cloudflare Proxy + History-Safe)
// ------------------------------------------------------------

const axios = require("axios");
const { ETF_MAP } = require("../config/etfMap.js");
const { getCache, setCache } = require("./marketCache.js");

const YAHOO_PROXY_BASE = "https://your-yahoo-proxy.workers.dev/api/yahoo";

async function fetchYahooEtf(symbol, opts = {}) {
  const cacheKey = `etf_${symbol}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const yahooSymbol = ETF_MAP[symbol];
  if (!yahooSymbol) {
    return {
      type: "etf",
      symbol,
      price: null,
      change_24h: 0,
      history: [],
      error: `Unknown ETF symbol: ${symbol}`,
      timestamp: Date.now(),
    };
  }

  try {
    const url = `${YAHOO_PROXY_BASE}?symbol=${encodeURIComponent(yahooSymbol)}`;
    const res = await axios.get(url, {
      timeout: opts.timeout || 5000,
    });

    const data = {
      type: "etf",
      symbol,
      price: res.data?.price ?? null,
      change_24h: res.data?.change_24h ?? 0,
      history: Array.isArray(res.data?.history) ? res.data.history : [],
      timestamp: res.data?.timestamp || Date.now(),
    };

    setCache(cacheKey, data);
    return data;
  } catch (err) {
    console.error("[fetchYahooEtf][ERROR]", symbol, err.code || err.message);

    return {
      type: "etf",
      symbol,
      price: null,
      change_24h: 0,
      history: [],
      error: String(err),
      timestamp: Date.now(),
    };
  }
}

module.exports = { fetchYahooEtf };
