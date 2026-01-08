// ------------------------------------------------------------
// handleMarket.js — Unified market router (crypto/stocks/ETFs)
// ------------------------------------------------------------

const { fetchCryptoPaprika } = require("../market/cryptoPaprika.js");
const { fetchYahooStock } = require("../market/stockYahoo.js");
const { fetchYahooEtf } = require("../market/etfYahoo.js");
const { jsonResponse } = require("../utils/jsonResponse.js");

async function handleMarket(symbol) {
  const lower = symbol.toLowerCase();

  // Crypto
  const crypto = await fetchCryptoPaprika(lower);
  if (crypto.ok) {
    return jsonResponse(200, {
      status: "ok",
      type: "crypto",
      symbol: lower,
      price: crypto.price,
      change_24h: crypto.change_24h
    });
  }

  // Stocks
  const stock = await fetchYahooStock(lower);
  if (stock.ok) {
    return jsonResponse(200, {
      status: "ok",
      type: "stock",
      symbol: lower,
      price: stock.price,
      change_24h: stock.change_24h
    });
  }

  // ETFs
  const etf = await fetchYahooEtf(lower);
  if (etf.ok) {
    return jsonResponse(200, {
      status: "ok",
      type: "etf",
      symbol: lower,
      price: etf.price,
      change_24h: etf.change_24h
    });
  }

  // All failed
  return jsonResponse(200, {
    status: "error",
    error: `No market data available for symbol: ${symbol}`,
    symbol
  });
}

module.exports = { handleMarket };
