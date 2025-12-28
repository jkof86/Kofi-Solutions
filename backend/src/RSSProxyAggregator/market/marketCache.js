// ------------------------------------------------------------
// marketCache.js — simple in-memory cache for market lookups
// ------------------------------------------------------------

const CACHE = {};
const TTL_MS = 60 * 1000; // 1 minute

function getCache(key) {
  const entry = CACHE[key];
  if (!entry) return null;

  if (Date.now() - entry.timestamp > TTL_MS) {
    delete CACHE[key];
    return null;
  }

  return entry.value;
}

function setCache(key, value) {
  CACHE[key] = {
    value,
    timestamp: Date.now()
  };
}

module.exports = { getCache, setCache };
