// ------------------------------------------------------------
// etfsYahoo.js — Yahoo Finance ETF snapshot
// ------------------------------------------------------------

const { ETF_MAP } = require("../config/etfMap.js");
const { getCache, setCache } = require("./marketCache.js");

async function fetchYahooEtf(symbol) {
  const cacheKey = `etf_${symbol}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const yahooSymbol = ETF_MAP[symbol];
  if (!yahooSymbol) {
    return { ok: false, error: `Unknown ETF symbol: ${symbol}` };
  }

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const json = await res.json();
    const result = json.chart?.result?.[0];

    if (!result) {
      return { ok: false, error: "Invalid Yahoo Finance response" };
    }

    const meta = result.meta;

    const data = {
      ok: true,
      symbol,
      price: meta.regularMarketPrice || null,
      change_24h: meta.regularMarketChangePercent || null
    };

    setCache(cacheKey, data);
    return data;

  } catch (err) {
    console.error("Yahoo ETF error:", err);
    return { ok: false, error: err.message };
  }
}

module.exports = { fetchYahooEtf };
