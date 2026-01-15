// ------------------------------------------------------------
// handleMarket.js — v1.302 (Final, Stable, Crypto-Safe)
// ------------------------------------------------------------
//
// PURPOSE:
//   Fetch market data for a single symbol (crypto, stock, ETF),
//   normalize symbols, unwrap responses, and return a clean,
//   consistent payload for frontend + health + ticker.
//
// FIXES IN THIS VERSION:
//   ✓ Universal unwrap() to avoid double-wrapped Lambda responses
//   ✓ Built-in Yahoo crypto mapping (no extra file needed)
//   ✓ Normalizes input symbols (BRK.B → brk-b)
//   ✓ Clean, stable payloads for ticker + health
//   ✓ Fully compatible with handleMarketAll v1.208
//
// ------------------------------------------------------------

const { jsonResponse } = require("../utils/jsonResponse.js");
const { CRYPTO_MAP } = require("../config/cryptoMap.js");
const { STOCK_MAP } = require("../config/stockMap.js");
const { ETF_MAP } = require("../config/etfMap.js");

const { fetchYahooStock } = require("../market/fetchYahooStock.js");
const { fetchYahooEtf } = require("../market/fetchYahooEtf.js");

// ------------------------------------------------------------
// Normalize symbols (BRK.B → brk-b)
// ------------------------------------------------------------
function normalizeSymbol(sym) {
  return String(sym || "")
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

// ------------------------------------------------------------
// Payload builders
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

// ------------------------------------------------------------
// Main handler
// ------------------------------------------------------------
async function handleMarket(symbol, opts = {}) {
  console.log("[handleMarket] Incoming symbol:", symbol, opts);

  try {
    if (!symbol || typeof symbol !== "string") {
      console.warn("[handleMarket] Missing or invalid symbol:", symbol);
      return jsonResponse(200, buildErrorPayload(null, null, "Missing symbol parameter"));
    }

    const range = opts.range || "1W";
    const lower = normalizeSymbol(symbol);

    console.log("[handleMarket] Using range:", range);
    console.log("[handleMarket] Normalized symbol:", lower);

    // Yahoo crypto override
    const yahooSymbol = YAHOO_CRYPTO[lower] || lower;

    const cryptoId = CRYPTO_MAP[lower];
    const stockId = STOCK_MAP[lower];
    const etfId = ETF_MAP[lower];

    // ------------------------------------------------------------
    // 1. CRYPTO (Yahoo-based)
    // ------------------------------------------------------------
    if (YAHOO_CRYPTO[lower] || cryptoId || lower.endsWith("-usd")) {
      try {
        const raw = await fetchYahooStock(yahooSymbol, { range, debug: opts.debug || null });
        const result = unwrap(raw);
        return jsonResponse(200, buildMarketPayload("crypto", lower, result));
      } catch (err) {
        console.error("[handleMarket] Crypto fetch error:", err);
        return jsonResponse(
          200,
          buildErrorPayload("crypto", lower, String(err.message || err))
        );
      }
    }

    // ------------------------------------------------------------
    // 2. STOCK
    // ------------------------------------------------------------
    if (stockId) {
      try {
        const raw = await fetchYahooStock(lower, { range, debug: opts.debug || null });
        const result = unwrap(raw);
        return jsonResponse(200, buildMarketPayload("stock", lower, result));
      } catch (err) {
        console.error("[handleMarket] Stock fetch error:", err);
        return jsonResponse(
          200,
          buildErrorPayload("stock", lower, String(err.message || err))
        );
      }
    }

    // ------------------------------------------------------------
    // 3. ETF
    // ------------------------------------------------------------
    if (etfId) {
      try {
        const raw = await fetchYahooEtf(lower, { range, debug: opts.debug || null });
        const result = unwrap(raw);
        return jsonResponse(200, buildMarketPayload("etf", lower, result));
      } catch (err) {
        console.error("[handleMarket] ETF fetch error:", err);
        return jsonResponse(
          200,
          buildErrorPayload("etf", lower, String(err.message || err))
        );
      }
    }

    // ------------------------------------------------------------
    // 4. UNKNOWN SYMBOL
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

// ------------------------------------------------------------
// CommonJS export
// ------------------------------------------------------------
module.exports = { handleMarket };
