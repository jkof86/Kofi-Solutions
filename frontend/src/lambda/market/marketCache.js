export const MARKET_CACHE = {};
export const MARKET_CACHE_TTL_MS = 60 * 1000;

export function getCached(key) {
  const now = Date.now();
  const cached = MARKET_CACHE[key];
  if (cached && now - cached.timestamp < MARKET_CACHE_TTL_MS) {
    return cached.data;
  }
  return null;
}

export function setCached(key, data) {
  MARKET_CACHE[key] = {
    timestamp: Date.now(),
    data
  };
}
