// ------------------------------------------------------------
// handleMarket.js — v1.196 (Full Payload + Stable Contract)
// ------------------------------------------------------------
//
// Standardized market response shape:
//
//   {
//     status: "ok" | "error",
//     type: "crypto" | "stock" | "etf" | null,
//     symbol: "btc",
//     price: 88345.53 | null,
//     change_24h: -1.23 | null,
//     history: [...],
//     debug: {...} | null,
//     timestamp: 1767126734208
//   }
//
// Used by:
//   • TickerBar
//   • FeedHealthDashboard
//   • FeedStatusContext
//   • handleHealth.js (via JSON body parsing)
//
// ------------------------------------------------------------

const { jsonResponse } = require("../utils/jsonResponse.js");
const { CRYPTO_MAP } = require("../config/cryptoMap.js");
const { STOCK_MAP } = require("../config/stockMap.js");
const { ETF_MAP } = require("../config/etfMap.js");

const { fetchCryptoPrice } = require("../market/fetchCryptoPrice.js");
const { fetchYahooStock } = require("../market/stockYahoo.js");
const { fetchYahooEtf } = require("../market/etfYahoo.js");

// Normalize symbols (BRK.B → brk-b)
function normalizeSymbol(sym) {
  return String(sym || "")
    .trim()
    .toLowerCase()
    .replace(/\./g, "-");
}

// ------------------------------------------------------------
// Helper: Build a consistent market payload
// ------------------------------------------------------------
function buildMarketPayload(type, symbol, result) {
  return {
    status: "ok",
    type,
    symbol,
    price: result?.price ?? null,
    change_24h: result?.change_24h ?? null,
    history: Array.isArray(result?.history) ? result.history : [],
    debug: result?.debug ?? null,
    timestamp: result?.timestamp ?? Date.now()
  };
}

// ------------------------------------------------------------
// Helper: Build a consistent error payload
// ------------------------------------------------------------
function buildErrorPayload(type, symbol, errorMessage) {
  return {
    status: "error",
    type: type || null,
    symbol: symbol || null,
    price: null,
    change_24h: null,
    history: [],
    debug: null,
    timestamp: Date.now(),
    error: errorMessage || null
  };
}

async function handleMarket(symbol, opts = {}) {
  console.log("[handleMarket] Incoming symbol:", symbol, opts);

  try {
    if (!symbol || typeof symbol !== "string") {
      return jsonResponse(200, buildErrorPayload(null, null, "Missing symbol parameter"));
    }

    const lower = normalizeSymbol(symbol);
    console.log("[handleMarket] Normalized:", lower);

    const cryptoId = CRYPTO_MAP[lower];
    const stockId = STOCK_MAP[lower];
    const etfId = ETF_MAP[lower];

    // ------------------------------------------------------------
    // 1. CRYPTO
    // ------------------------------------------------------------
    if (cryptoId) {
      try {
        const result = await fetchCryptoPrice(cryptoId, opts);
        return jsonResponse(200, buildMarketPayload("crypto", lower, result));
      } catch (err) {
        console.error("[handleMarket][CRYPTO_ERROR]", lower, err);
        return jsonResponse(200, buildErrorPayload("crypto", lower, String(err.message || err)));
      }
    }

    // ------------------------------------------------------------
    // 2. STOCK
    // ------------------------------------------------------------
    if (stockId) {
      try {
        const result = await fetchYahooStock(stockId, opts);
        return jsonResponse(200, buildMarketPayload("stock", lower, result));
      } catch (err) {
        console.error("[handleMarket][STOCK_ERROR]", lower, err);
        return jsonResponse(200, buildErrorPayload("stock", lower, String(err.message || err)));
      }
    }

    // ------------------------------------------------------------
    // 3. ETF
    // ------------------------------------------------------------
    if (etfId) {
      try {
        const result = await fetchYahooEtf(etfId, opts);
        return jsonResponse(200, buildMarketPayload("etf", lower, result));
      } catch (err) {
        console.error("[handleMarket][ETF_ERROR]", lower, err);
        return jsonResponse(200, buildErrorPayload("etf", lower, String(err.message || err)));
      }
    }

    // ------------------------------------------------------------
    // 4. ALL FAILED / UNKNOWN SYMBOL
    // ------------------------------------------------------------
    console.warn("[handleMarket] No market data for symbol:", lower);

    return jsonResponse(
      200,
      buildErrorPayload(null, lower, `No market data available for symbol: ${lower}`)
    );

  } catch (err) {
    console.error("[handleMarket] FATAL ERROR:", err);

    return jsonResponse(
      200,
      buildErrorPayload(null, symbol, "Market handler crashed")
    );
  }
}

module.exports = { handleMarket };
