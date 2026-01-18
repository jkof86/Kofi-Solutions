// ------------------------------------------------------------
// marketCache.js — v1.180 (Stable + Debug-Safe + TTL-Correct)
// ------------------------------------------------------------
//
// Features:
//   • Simple in-memory TTL cache (1 minute default)
//   • Safe for AWS Lambda ephemeral runtime
//   • Optional debug logging
//   • clearCache() + touchCache() helpers
//
// ------------------------------------------------------------

const CACHE = {};
const TTL_MS = 60 * 1000; // 1 minute
const DEBUG = false;      // set true for verbose cache logs

function getCache(key) {
  const entry = CACHE[key];
  if (!entry) {
    if (DEBUG) console.log("[cache] MISS:", key);
    return null;
  }

  const age = Date.now() - entry.timestamp;

  if (age > TTL_MS || age < 0) {
    // age < 0 protects against clock drift
    if (DEBUG) console.log("[cache] EXPIRED:", key);
    delete CACHE[key];
    return null;
  }

  if (DEBUG) console.log("[cache] HIT:", key);
  return entry.value;
}

function setCache(key, value) {
  CACHE[key] = {
    value,
    timestamp: Date.now()
  };

  if (DEBUG) console.log("[cache] SET:", key);
}

function touchCache(key) {
  if (CACHE[key]) {
    CACHE[key].timestamp = Date.now();
    if (DEBUG) console.log("[cache] TOUCH:", key);
  }
}

function clearCache() {
  for (const key of Object.keys(CACHE)) {
    delete CACHE[key];
  }
  if (DEBUG) console.log("[cache] CLEARED");
}

module.exports = {
  getCache,
  setCache,
  touchCache,
  clearCache
};


