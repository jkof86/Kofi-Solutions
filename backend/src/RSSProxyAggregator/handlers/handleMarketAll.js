// ------------------------------------------------------------
// handleMarketAll.js — v1.208 (Final, Stable, Crypto-Safe)
// ------------------------------------------------------------
//
// PURPOSE:
//   Poll ALL market symbols (crypto + stocks + ETFs) in parallel,
//   unwrap handleMarket() responses, normalize keys, forward range,
//   and return a clean markets object compatible with TickerBar.
//
// FIXES IN THIS VERSION:
//   ✓ Universal unwrap() to fix double-wrapped Lambda responses
//   ✓ Yahoo crypto mapping built-in (no extra file needed)
//   ✓ Normalizes input + output keys
//   ✓ Correctly forwards { test, debug, force, range }
//   ✓ Ensures crypto appears in ticker
//   ✓ Prevents "Loading market data…" forever
//
// ------------------------------------------------------------

const { jsonResponse } = require("../utils/jsonResponse.js");
const { CRYPTO_MAP } = require("../config/cryptoMap.js");
const { STOCK_MAP } = require("../config/stockMap.js");
const { ETF_MAP } = require("../config/etfMap.js");
const { handleMarket } = require("./handleMarket.js");

// ------------------------------------------------------------
// Normalize symbols (BRK.B → brk-b)
// ------------------------------------------------------------
function normalize(symbol) {
  return String(symbol || "")
    .trim()
    .toLowerCase()
    .replace(/\./g, "-");
}

// ------------------------------------------------------------
// Universal unwrap() — ALWAYS returns the real payload
// ------------------------------------------------------------
function unwrap(raw) {
  if (!raw) return raw;

  // Case 1: Lambda wrapper with string body
  if (typeof raw.body === "string") {
    try {
      return JSON.parse(raw.body);
    } catch {
      return raw;
    }
  }

  // Case 2: Lambda wrapper with already-parsed body
  if (raw.body && typeof raw.body === "object") {
    return raw.body;
  }

  // Case 3: Already a clean object
  return raw;
}

// ------------------------------------------------------------
// Built-in Yahoo crypto symbol mapping
// ------------------------------------------------------------
const YAHOO_CRYPTO = {
  "btc-usd": "BTC-USD",
  "eth-usd": "ETH-USD",
  "sol-usd": "SOL-USD",
  "doge-usd": "DOGE-USD",
  "xrp-usd": "XRP-USD",
  "zec-usd": "ZEC-USD"
};

exports.handleMarketAll = async ({ test, debug, force, range }) => {
  const start = Date.now();

  // ------------------------------------------------------------
  // 1. Collect all symbols from all maps (normalized)
  // ------------------------------------------------------------
  const allSymbols = [
    ...Object.keys(CRYPTO_MAP).map(normalize),
    ...Object.keys(STOCK_MAP).map(normalize),
    ...Object.keys(ETF_MAP).map(normalize),

    // Explicit Yahoo crypto symbols
    ...Object.keys(YAHOO_CRYPTO)
  ];

  console.log("[handleMarketAll] Total symbols:", allSymbols.length);
  console.log("[handleMarketAll] Incoming opts:", { test, debug, force, range });

  // ------------------------------------------------------------
  // 2. Parallel fetches for each symbol
  // ------------------------------------------------------------
  const requests = allSymbols.map(async (rawSym) => {
    const sym = normalize(rawSym);

    try {
      // Yahoo crypto override
      const yahooSymbol = YAHOO_CRYPTO[sym] || sym;

      const raw = await handleMarket(yahooSymbol, {
        test,
        debug,
        force,
        range: range || "1W"
      });

      const parsed = unwrap(raw);

      return { symbol: sym, result: parsed };

    } catch (err) {
      console.error("[handleMarketAll] Fetch error for", sym, err);

      return {
        symbol: sym,
        result: {
          status: "error",
          error: err.message || "market fetch failed",
          price: null,
          change_24h: null,
          history: []
        }
      };
    }
  });

  const results = await Promise.all(requests);

  // ------------------------------------------------------------
  // 3. Convert array → object keyed by normalized symbol
  // ------------------------------------------------------------
  const markets = {};
  for (const { symbol, result } of results) {
    markets[symbol] = result;
  }

  // ------------------------------------------------------------
  // 4. Return unified response
  // ------------------------------------------------------------
  return jsonResponse(200, {
    status: "ok",
    count: allSymbols.length,
    latencyMs: Date.now() - start,
    markets
  });
};
