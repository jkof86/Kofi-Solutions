// ------------------------------------------------------------
// cryptoPaprika.js — CoinPaprika market snapshot
// ------------------------------------------------------------

const { CRYPTO_MAP } = require("../config/cryptoMap.js");
const { getCache, setCache } = require("./marketCache.js");

async function fetchCryptoPaprika(symbol) {
  const cacheKey = `paprika_${symbol}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const paprikaId = CRYPTO_MAP[symbol];
  if (!paprikaId) {
    return { ok: false, error: `Unknown crypto symbol: ${symbol}` };
  }

  try {
    const url = `https://api.coinpaprika.com/v1/tickers/${paprikaId}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const json = await res.json();

    const result = {
      ok: true,
      symbol,
      price: json.quotes?.USD?.price || null,
      change_24h: json.quotes?.USD?.percent_change_24h || null
    };

    setCache(cacheKey, result);
    return result;

  } catch (err) {
    console.error("Paprika error:", err);
    return { ok: false, error: err.message };
  }
}

module.exports = { fetchCryptoPaprika };
