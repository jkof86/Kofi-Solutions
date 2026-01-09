// ------------------------------------------------------------
// fetchYahooStock.js — v2.1 (Universal Range Mode)
// ------------------------------------------------------------
//
// WHY THIS VERSION:
//   • Yahoo's `period=` mode is inconsistent across assets.
//   • Crypto 1D cannot return full 1m history (Yahoo truncates).
//   • Range mode is the ONLY mode Yahoo treats consistently.
//   • Using one mapping table eliminates all asset-specific quirks.
//
// KEY FIX:
//   • Crypto 1D now uses interval=2m (the smallest interval that
//     returns a full 24 hours for crypto).
//
// RESULT:
//   • Crypto: full 1D, 1W, 1M, 1Y
//   • Stocks: full 1D, 1W, 1M, 1Y
//   • ETFs: full 1D, 1W, 1M, 1Y
//
// ------------------------------------------------------------

const axios = require("axios");
const { STOCK_MAP } = require("../config/stockMap.js");
const { ETF_MAP } = require("../config/etfMap.js");
const { getCache, setCache } = require("./marketCache.js");

// ------------------------------------------------------------
// UNIVERSAL RANGE MAP (works for crypto, stocks, ETFs)
// ------------------------------------------------------------
// These combinations are accepted by Yahoo for ALL asset types.
// ------------------------------------------------------------
const RANGE_MAP = {
  "1D": { range: "24h", interval: "2m" },     // 2m = smallest stable full-day interval
  "1W": { range: "5d", interval: "15m" },
  "1M": { range: "1mo", interval: "1d" },
  "1Y": { range: "1y", interval: "1wk" }
};

async function fetchYahooStock(symbol, opts = {}) {
  console.log("[fetchYahooStock] incoming opts:", opts);

  const lower = String(symbol).trim().toLowerCase();
  const uiRange = opts.range || "1W";
  const cacheKey = `market_${lower}_${uiRange}`;

  // ------------------------------------------------------------
  // 1. Cache check
  // ------------------------------------------------------------
  const cached = getCache(cacheKey);
  if (cached) {
    console.log("[fetchYahooStock] CACHE HIT:", cacheKey);
    return cached;
  }

  // ------------------------------------------------------------
  // 2. Determine Yahoo symbol
  // ------------------------------------------------------------
  const yahooSymbol =
    STOCK_MAP[lower] ||
    ETF_MAP[lower] ||
    lower.toUpperCase(); // crypto or unknown → uppercase

  // ------------------------------------------------------------
  // 3. Universal range mapping
  // ------------------------------------------------------------
  const mapped = RANGE_MAP[uiRange] || RANGE_MAP["1W"];
  const { range, interval } = mapped;

  console.log("[fetchYahooStock] UNIVERSAL params:", {
    uiRange,
    yahooRange: range,
    yahooInterval: interval
  });

  // ------------------------------------------------------------
  // 4. Universal Yahoo URL (range mode for everything)
// ------------------------------------------------------------
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=${interval}&range=${range}`;
  console.log("[fetchYahooStock] Yahoo URL:", url);

  try {
    const res = await axios.get(url, {
      timeout: opts.timeout || 5000,
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const result = res.data?.chart?.result?.[0];
    if (!result) {
      const payload = {
        type: "market",
        symbol: lower,
        price: null,
        change_24h: null,
        history: [],
        source: "yahoo",
        timestamp: Date.now(),
        error: "Invalid Yahoo Finance response",
        debug: opts.debug ? res.data : null
      };
      setCache(cacheKey, payload);
      return payload;
    }

    const meta = result.meta;
    const quote = result.indicators?.quote?.[0] || {};
    const closes = quote.close || [];
    const timestamps = result.timestamp || [];

    // Latest close
    const latestClose =
      [...closes].reverse().find((p) => typeof p === "number") ?? null;

    // 24h change
    const prevClose = meta?.chartPreviousClose ?? null;
    let change_24h = null;
    if (latestClose != null && prevClose != null && prevClose !== 0) {
      change_24h = ((latestClose - prevClose) / prevClose) * 100;
    }

    // Build history
    const history = timestamps
      .map((t, i) => ({
        time: new Date(t * 1000).toISOString(),
        price: typeof closes[i] === "number" ? closes[i] : null
      }))
      .filter((p) => p.price != null);

    console.log("[fetchYahooStock] History summary:", {
      uiRange,
      count: history.length,
      first: history[0]?.time,
      last: history[history.length - 1]?.time
    });

    const data = {
      type: "market",
      symbol: lower,
      price: latestClose != null ? Number(latestClose) : null,
      change_24h: change_24h != null ? Number(change_24h) : null,
      history,
      source: "yahoo",
      timestamp: Date.now(),
      error: null,
      debug: opts.debug ? { meta, quote, closes } : null
    };

    setCache(cacheKey, data);
    return data;

  } catch (err) {
    const payload = {
      type: "market",
      symbol: lower,
      price: null,
      change_24h: null,
      history: [],
      source: "yahoo",
      timestamp: Date.now(),
      error: String(err.message || err),
      debug: opts.debug ? { error: String(err) } : null
    };
    setCache(cacheKey, payload);
    return payload;
  }
}

module.exports = { fetchYahooStock };
