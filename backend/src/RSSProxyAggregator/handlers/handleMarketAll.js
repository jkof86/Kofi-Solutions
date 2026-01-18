// handlers/handleMarketAll.js — v2.2 (CommonJS, router-aligned)
// Signature: handleMarketAll({ test, debug, force, range })

const { MARKET_SYMBOLS } = require("../config/marketSymbols.js");
const { handleMarket } = require("./handleMarket.js");
const { jsonResponse } = require("../utils/jsonResponse.js");

const CONCURRENCY = 6;
const TIMEOUT_MS = 7000;

function withTimeout(promise, ms = TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise
      .then(v => {
        clearTimeout(timer);
        resolve(v);
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

async function runBatched(items, limit, fn) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const i = index++;
      try {
        const r = await fn(items[i]);
        results[i] = r;
      } catch (err) {
        results[i] = {
          ok: false,
          price: null,
          change_24h: null,
          history: [],
          timestamp: Date.now(),
          error: err.message
        };
      }
    }
  }

  const workers = Array.from({ length: limit }, worker);
  await Promise.all(workers);
  return results;
}

async function handleMarketAll({ test, debug, force, range } = {}) {
  const symbols = MARKET_SYMBOLS;

  const results = await runBatched(
    symbols,
    CONCURRENCY,
    async symbol => {
      try {
        const res = await withTimeout(handleMarket(symbol, { range }));
        const body = JSON.parse(res.body);
        return body;
      } catch (err) {
        return {
          ok: false,
          price: null,
          change_24h: null,
          history: [],
          timestamp: Date.now(),
          error: err.message
        };
      }
    }
  );

  const summary = {
    total: symbols.length,
    ok: results.filter(r => r.ok).length,
    failed: results.filter(r => !r.ok).length,
    partial_success:
      results.some(r => r.ok) && results.some(r => !r.ok)
  };

  const payload = {
    summary,
    results: Object.fromEntries(
      symbols.map((s, i) => [s, results[i]])
    )
  };

  return jsonResponse(200, payload);
}

module.exports = { handleMarketAll };
