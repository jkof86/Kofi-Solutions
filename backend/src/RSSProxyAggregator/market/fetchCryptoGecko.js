// ------------------------------------------------------------
// fetchCryptoGecko.js — v1.205 (Crypto Fix)
// ------------------------------------------------------------

const axios = require("axios");
const { CRYPTO_MAP } = require("../config/cryptoMap.js");
const { getCache, setCache } = require("./marketCache.js");

async function fetchCryptoGecko(symbol, opts = {}) {
  const cacheKey = `gecko_${symbol}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const geckoId = CRYPTO_MAP[symbol];
  if (!geckoId) {
    return {
      ok: false,
      error: `Unknown crypto symbol: ${symbol}`
    };
  }

  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${geckoId}&vs_currencies=usd&include_24hr_change=true`;

    const res = await axios.get(url, {
      timeout: opts.timeout || 5000,
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const data = res.data?.[geckoId];

    const result = {
      ok: true,
      symbol,
      price: data?.usd ?? null,
      change_24h: data?.usd_24h_change ?? null,
      history: [],
      source: "coingecko",
      timestamp: Date.now(),
      debug: opts.debug ? data : null
    };

    setCache(cacheKey, result);
    return result;

  } catch (err) {
    return {
      ok: false,
      error: String(err)
    };
  }
}

module.exports = { fetchCryptoGecko };
