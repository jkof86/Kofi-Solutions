// ------------------------------------------------------------
// handleMarketAll.js — v1.202
// ------------------------------------------------------------
// Polls ALL market symbols (crypto + stocks + ETFs) in parallel
// and returns a unified market health object.
// ------------------------------------------------------------

const { jsonResponse } = require("../utils/jsonResponse.js");
const { CRYPTO_MAP } = require("../config/cryptoMap.js");
const { STOCK_MAP } = require("../config/stockMap.js");
const { ETF_MAP } = require("../config/etfMap.js");
const { handleMarket } = require("./handleMarket.js");

function normalize(symbol) {
  return symbol.trim().toLowerCase().replace(/\./g, "-");
}

exports.handleMarketAll = async ({ test, debug, force }) => {
  const start = Date.now();

  // 1. Collect all symbols from all maps
  const allSymbols = [
    ...Object.keys(CRYPTO_MAP),
    ...Object.keys(STOCK_MAP),
    ...Object.keys(ETF_MAP)
  ];

  // 2. Parallel fetches
  const requests = allSymbols.map(async (sym) => {
    try {
      const result = await handleMarket(sym, { test, debug, force });
      return { symbol: sym, result };
    } catch (err) {
      return {
        symbol: sym,
        result: {
          status: "error",
          error: err.message || "market fetch failed"
        }
      };
    }
  });

  const results = await Promise.all(requests);

  // 3. Convert array → object
  const markets = {};
  for (const { symbol, result } of results) {
    markets[symbol] = result;
  }

  // 4. Return unified response
  return jsonResponse(200, {
    status: "ok",
    count: allSymbols.length,
    latencyMs: Date.now() - start,
    markets
  });
};
