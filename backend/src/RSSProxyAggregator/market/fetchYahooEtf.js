// ------------------------------------------------------------
// fetchYahooEtf.js — v1.400 (Range-Aware Yahoo ETF Fetcher)
// ------------------------------------------------------------
//
// Supports:
//   ✓ SPY, VTI, VOO
//   ✓ IBIT, ARKG, BLOK
//   ✓ Any Yahoo ETF ticker
//
// Features:
//   ✓ Range-aware Yahoo queries (1D / 1W / 1M / 1Y)
//   ✓ Full history reconstruction
//   ✓ Numeric-safe parsing
//   ✓ Caching
//   ✓ Minimal branching
//
// ------------------------------------------------------------

const axios = require("axios");
const { ETF_MAP } = require("../config/etfMap.js");
const { getCache, setCache } = require("./marketCache.js");

const RANGE_MAP = {
  "1D": { range: "1d", interval: "5m" },
  "1W": { range: "5d", interval: "30m" },
  "1M": { range: "1mo", interval: "1d" },
  "1Y": { range: "1y", interval: "1wk" }
};

async function fetchYahooEtf(symbol, opts = {}) {
  console.log('[fetchYahooStock] opts.range:', opts.range, 'opts.interval:', opts.interval);


  const lower = String(symbol).trim().toLowerCase();
  const cacheKey = `etf_${lower}_${opts.range || "1W"}`;

  // ------------------------------------------------------------
  // 1. Cache check
  // ------------------------------------------------------------
  const cached = getCache(cacheKey);
  if (cached) return cached;

  // ------------------------------------------------------------
  // 2. Resolve Yahoo symbol
  // ------------------------------------------------------------
  const yahooSymbol = ETF_MAP[lower] || lower.toUpperCase();

  // ------------------------------------------------------------
  // 3. Yahoo interval (range-aware)
  // ------------------------------------------------------------
  const uiRange = opts.range || "1W";
  const mapped = RANGE_MAP[uiRange] || RANGE_MAP["1W"];
  const { range, interval } = mapped;

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?range=${range}&interval=${interval}`;

  try {
    const res = await axios.get(url, {
      timeout: opts.timeout || 5000,
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const result = res.data?.chart?.result?.[0];
    if (!result) {
      const payload = {
        type: "etf",
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

    // ------------------------------------------------------------
    // 4. Latest close
    // ------------------------------------------------------------
    const latestClose =
      [...closes].reverse().find((p) => typeof p === "number") ?? null;

    // ------------------------------------------------------------
    // 5. Previous close → % change
    // ------------------------------------------------------------
    const prevClose = meta?.chartPreviousClose ?? null;

    let change_24h = null;
    if (latestClose != null && prevClose != null && prevClose !== 0) {
      change_24h = ((latestClose - prevClose) / prevClose) * 100;
    }

    // ------------------------------------------------------------
    // 6. Build history array
    // ------------------------------------------------------------
    const history = timestamps
      .map((t, i) => ({
        time: t ? new Date(t * 1000).toISOString() : null,
        price: typeof closes[i] === "number" ? closes[i] : null
      }))
      .filter((p) => p.time && p.price != null);

    // ------------------------------------------------------------
    // 7. Final payload
    // ------------------------------------------------------------
    const data = {
      type: "etf",
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
      type: "etf",
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

module.exports = { fetchYahooEtf };
