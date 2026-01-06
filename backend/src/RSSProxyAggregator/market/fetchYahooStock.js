// ------------------------------------------------------------
// fetchYahooStock.js — v1.205 (Yahoo‑Corrected + Ticker‑Safe)
// ------------------------------------------------------------
//
// Fixes:
//   ✓ Uses latestClose from indicators.quote[0].close
//   ✓ Computes change_24h manually
//   ✓ Handles missing data safely
//   ✓ Fully compatible with handleMarket + handleHealth
//
// ------------------------------------------------------------

const axios = require("axios");
const { STOCK_MAP } = require("../config/stockMap.js");
const { getCache, setCache } = require("./marketCache.js");

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
      change_24h: null,
      history: [],
      source: "yahoo",
      timestamp: Date.now(),
      debug: opts.debug ? { error: "Unknown stock symbol" } : null,
      error: `Unknown stock symbol: ${symbol}`
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
        type: "stock",
        symbol,
        price: null,
        change_24h: null,
        history: [],
        source: "yahoo",
        timestamp: Date.now(),
        debug: opts.debug ? { raw: res.data } : null,
        error: "Invalid Yahoo Finance response"
      };
    }

    const meta = result.meta;
    const quote = result.indicators?.quote?.[0] || {};
    const closes = quote.close || [];

    // ------------------------------------------------------------
    // Extract latest valid close price
    // ------------------------------------------------------------
    const latestClose = [...closes].reverse().find((p) => typeof p === "number") ?? null;

    // Previous close from meta
    const prevClose = meta?.chartPreviousClose ?? null;

    // Compute change %
    let change_24h = null;
    if (latestClose != null && prevClose != null && prevClose !== 0) {
      change_24h = ((latestClose - prevClose) / prevClose) * 100;
    }

    // ------------------------------------------------------------
    // Build history (optional)
    // ------------------------------------------------------------
    let history = [];
    try {
      const timestamps = result.timestamp || [];
      if (Array.isArray(timestamps) && Array.isArray(closes)) {
        history = timestamps
          .map((t, i) => ({
            time: t ? new Date(t * 1000).toISOString() : null,
            price: typeof closes[i] === "number" ? closes[i] : null
          }))
          .filter((p) => p.time && p.price != null);
      }
    } catch (err) {
      console.error("[fetchYahooStock][HISTORY_ERROR]", symbol, err);
      history = [];
    }

    const data = {
      type: "stock",
      symbol,
      price: latestClose,
      change_24h,
      history,
      source: "yahoo",
      timestamp: Date.now(),
      debug: opts.debug ? { meta, quote, closes } : null,
      error: null
    };

    setCache(cacheKey, data);
    return data;

  } catch (err) {
    console.error("[fetchYahooStock][ERROR]", symbol, err.code || err.message);

    return {
      type: "stock",
      symbol,
      price: null,
      change_24h: null,
      history: [],
      source: "yahoo",
      timestamp: Date.now(),
      debug: opts.debug ? { error: String(err) } : null,
      error: String(err)
    };
  }
}

module.exports = { fetchYahooStock };
