// ------------------------------------------------------------
// handleMarket.js — v1.171 (Symbol-Aware + History-Safe)
// ------------------------------------------------------------

const { jsonResponse } = require("../utils/jsonResponse.js");
const { CRYPTO_MAP } = require("../market/cryptoMap.js");
const { STOCK_MAP } = require("../market/stocksMap.js");
const { ETF_MAP } = require("../market/etfMap.js");
const { fetchCryptoPrice } = require("../market/fetchCryptoPrice.js");
const { fetchYahooPrice } = require("../market/fetchYahooPrice.js");

async function handleMarket(symbol, opts = {}) {
  console.log("[handleMarket] Incoming symbol:", symbol, opts);

  try {
    if (!symbol || typeof symbol !== "string") {
      return jsonResponse(200, {
        status: "error",
        error: "Missing symbol parameter",
        symbol: null
      });
    }

    const lower = symbol.toLowerCase();
    const cryptoId = CRYPTO_MAP[lower];
    const stockSymbol = STOCK_MAP[lower];
    const etfSymbol = ETF_MAP[lower];

    // ------------------------------------------------------------
    // 1. CRYPTO
    // ------------------------------------------------------------
    if (cryptoId) {
      try {
        const result = await fetchCryptoPrice(cryptoId, opts);
        return jsonResponse(200, {
          status: "ok",
          type: "crypto",
          symbol: lower,
          ...result
        });
      } catch (err) {
        console.error("[handleMarket] Crypto error:", lower, err);
      }
    }

    // ------------------------------------------------------------
    // 2. STOCK
    // ------------------------------------------------------------
    if (stockSymbol) {
      try {
        const result = await fetchYahooPrice(stockSymbol, opts);
        return jsonResponse(200, {
          status: "ok",
          type: "stock",
          symbol: lower,
          ...result
        });
      } catch (err) {
        console.error("[handleMarket] Stock error:", lower, err);
      }
    }

    // ------------------------------------------------------------
    // 3. ETF
    // ------------------------------------------------------------
    if (etfSymbol) {
      try {
        const result = await fetchYahooPrice(etfSymbol, opts);
        return jsonResponse(200, {
          status: "ok",
          type: "etf",
          symbol: lower,
          ...result
        });
      } catch (err) {
        console.error("[handleMarket] ETF error:", lower, err);
      }
    }

    // ------------------------------------------------------------
    // 4. ALL FAILED
    // ------------------------------------------------------------
    console.warn("[handleMarket] No market data for symbol:", lower);
    return jsonResponse(200, {
      status: "error",
      error: `No market data available for symbol: ${lower}`,
      symbol: lower
    });

  } catch (err) {
    console.error("[handleMarket] FATAL ERROR:", err);
    return jsonResponse(200, {
      status: "error",
      error: "Market handler crashed",
      detail: String(err),
      symbol
    });
  }
}

module.exports = { handleMarket };
