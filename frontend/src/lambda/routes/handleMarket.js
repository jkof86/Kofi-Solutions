// ------------------------------------------------------------
// routes/handleMarket.js — Market router (crypto, stocks, ETFs)
// ------------------------------------------------------------

import { jsonResponse } from "../utils/jsonResponse.js";
import { getCached, setCached } from "../market/marketCache.js";
import { fetchCryptoPaprika } from "../market/cryptoPaprika.js";
import { fetchStockYahoo } from "../market/stocksYahoo.js";
import { fetchEtfYahoo } from "../market/etfsYahoo.js";
import { CRYPTO_MAP } from "../config/cryptoMap.js";
import { STOCK_MAP } from "../config/stockMap.js";
import { ETF_MAP } from "../config/etfMap.js";

// Track failures for health dashboard
export const MARKET_FAILURES = new Set();

export async function handleMarket(symbol) {
  const key = symbol.toLowerCase();

  // 1) Serve from cache if fresh
  const cached = getCached(key);
  if (cached) {
    return jsonResponse(200, { status: "ok", data: cached });
  }

  try {
    let data;

    // 2) Crypto (CoinPaprika)
    if (CRYPTO_MAP[key]) {
      data = await fetchCryptoPaprika(key);
    }
    // 3) Stocks (Yahoo Finance)
    else if (STOCK_MAP[key]) {
      data = await fetchStockYahoo(key);
    }
    // 4) ETFs (Yahoo Finance)
    else if (ETF_MAP[key]) {
      data = await fetchEtfYahoo(key);
    } else {
      MARKET_FAILURES.add(key);
      return jsonResponse(400, {
        status: "error",
        error: `Unknown symbol: ${symbol}`
      });
    }

    // 5) Cache + success
    setCached(key, data);
    MARKET_FAILURES.delete(key);

    return jsonResponse(200, { status: "ok", data });

  } catch (err) {
    console.error(`Market error for ${symbol}:`, err);
    MARKET_FAILURES.add(key);
    return jsonResponse(502, {
      status: "error",
      error: `Market failed for ${symbol}: ${err.message}`
    });
  }
}
