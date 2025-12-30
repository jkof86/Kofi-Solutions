// ------------------------------------------------------------
// handleMarket.js — v1.180 (Normalized + History-Safe)
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

        return jsonResponse(200, {
          status: "ok",
          type: "crypto",
          symbol: lower,
          price: result?.price ?? null,
          history: result?.history ?? []
        });
      } catch (err) {
        console.error("[handleMarket][CRYPTO_ERROR]", lower, err.code || err.message);
        return jsonResponse(200, {
          status: "error",
          type: null,
          symbol: lower,
          price: null
        });
      }
    }

    // ------------------------------------------------------------
    // 2. STOCK
    // ------------------------------------------------------------
    if (stockId) {
      try {
        const result = await fetchYahooStock(stockId, opts);

        return jsonResponse(200, {
          status: "ok",
          type: "stock",
          symbol: lower,
          price: result?.price ?? null,
          history: result?.history ?? []
        });
      } catch (err) {
        console.error("[handleMarket][STOCK_ERROR]", lower, err.code || err.message);
        return jsonResponse(200, {
          status: "error",
          type: null,
          symbol: lower,
          price: null
        });
      }
    }

    // ------------------------------------------------------------
    // 3. ETF
    // ------------------------------------------------------------
    if (etfId) {
      try {
        const result = await fetchYahooEtf(etfId, opts);

        return jsonResponse(200, {
          status: "ok",
          type: "etf",
          symbol: lower,
          price: result?.price ?? null,
          history: result?.history ?? []
        });
      } catch (err) {
        console.error("[handleMarket][ETF_ERROR]", lower, err.code || err.message);
        return jsonResponse(200, {
          status: "error",
          type: null,
          symbol: lower,
          price: null
        });
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
