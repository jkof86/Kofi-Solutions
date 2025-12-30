// ------------------------------------------------------------
// fetchYahooEtf.js — v1.180 (Axios + History-Safe)
// ------------------------------------------------------------

const axios = require("axios");
const { ETF_MAP } = require("../config/etfMap.js");
const { getCache, setCache } = require("./marketCache.js");

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
      timestamp: Date.now()
    };
  }

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`;
    const res = await axios.get(url, {
      timeout: opts.timeout || 5000,
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const result = res.data?.chart?.result?.[0];
    if (!result) {
      return {
        type: "etf",
        symbol,
        price: null,
        change_24h: 0,
        history: [],
        error: "Invalid Yahoo Finance response",
        timestamp: Date.now()
      };
    }

    const meta = result.meta;

    const data = {
      type: "etf",
      symbol,
      price: meta.regularMarketPrice ?? null,
      change_24h: meta.regularMarketChangePercent ?? 0,
      history: [],
      timestamp: Date.now()
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
      timestamp: Date.now()
    };
  }
}

module.exports = { fetchYahooEtf };
