// handlers/handleHealth.js — v2.2 (CommonJS, router-aligned)
// Signature: handleHealth({ test, debug })

const FEEDS = require("../config/feedsMap.js");
const { MARKET_SYMBOLS } = require("../market/marketSymbols.js");
const { handleFeed } = require("./handleFeed.js");
const { handleMarket } = require("./handleMarket.js");
const { jsonResponse } = require("../utils/jsonResponse.js");

const FEED_CONCURRENCY = 6;
const MARKET_CONCURRENCY = 4;
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
        results[i] = { error: err.message };
      }
    }
  }

  const workers = Array.from({ length: limit }, worker);
  await Promise.all(workers);
  return results;
}

function normalizeFeedHealth(raw) {
  return {
    status: raw.status,
    ok: raw.status === "ok",
    fallback: raw.status === "fallback",
    json: raw.status === "json",
    dead: raw.status === "dead",
    blocked: raw.status === "blocked",
    html_error: raw.status === "html_error",
    type: raw.type || null,
    count: raw.count || 0,
    error: raw.error || null
  };
}

function normalizeMarketHealth(symbol, raw) {
  return {
    symbol,
    ok: raw?.ok ?? false,
    price: raw?.price ?? null,
    change_24h: raw?.change_24h ?? null,
    history: raw?.history ?? [],
    timestamp: raw?.timestamp ?? null,
    error: raw?.error ?? null
  };
}

async function handleHealth({ test, debug } = {}) {
  const feedIds = Object.keys(FEEDS);

  const feedResults = await runBatched(
    feedIds,
    FEED_CONCURRENCY,
    async feedId => {
      const feedConfig = FEEDS[feedId];

      try {
        const res = await withTimeout(
          handleFeed(feedConfig, { debug: null, test: null })
        );
        const body = JSON.parse(res.body);
        return normalizeFeedHealth(body.health);
      } catch (err) {
        return normalizeFeedHealth({
          status: "dead",
          error: err.message
        });
      }
    }
  );

  const feedSummary = {
    total: feedIds.length,
    ok: feedResults.filter(f => f.ok).length,
    fallback: feedResults.filter(f => f.fallback).length,
    json: feedResults.filter(f => f.json).length,
    dead: feedResults.filter(f => f.dead).length,
    blocked: feedResults.filter(f => f.blocked).length,
    html_error: feedResults.filter(f => f.html_error).length,
    partial_success:
      feedResults.some(f => f.ok || f.fallback || f.json) &&
      feedResults.some(f => f.dead || f.blocked || f.html_error)
  };

  const marketResults = await runBatched(
    MARKET_SYMBOLS,
    MARKET_CONCURRENCY,
    async symbol => {
      try {
        const res = await withTimeout(handleMarket(symbol, {}));
        const body = JSON.parse(res.body);
        return normalizeMarketHealth(symbol, body);
      } catch (err) {
        return normalizeMarketHealth(symbol, { error: err.message });
      }
    }
  );

  const marketSummary = {
    total: MARKET_SYMBOLS.length,
    ok: marketResults.filter(m => m.ok).length,
    failed: marketResults.filter(m => !m.ok).length,
    partial_success:
      marketResults.some(m => m.ok) &&
      marketResults.some(m => !m.ok)
  };

  return jsonResponse(200, {
    timestamp: Date.now(),
    feeds: {
      summary: feedSummary,
      results: Object.fromEntries(
        feedIds.map((id, i) => [id, feedResults[i]])
      )
    },
    markets: {
      summary: marketSummary,
      results: Object.fromEntries(
        MARKET_SYMBOLS.map((s, i) => [s, marketResults[i]])
      )
    }
  });
}

module.exports = { handleHealth };
