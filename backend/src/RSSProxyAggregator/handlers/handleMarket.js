// handlers/handleMarket.js — v2.2 (CommonJS, router-aligned)
// Signature: handleMarket(symbol, opts)

const { getCache, setCache } = require("../market/marketCache.js");
const { fetchCryptoPrice } = require("../market/fetchCryptoPrice.js");
const { fetchCryptoGecko } = require("../market/fetchCryptoGecko.js");
const { fetchYahooStock } = require("../market/fetchYahooStock.js");
const { fetchYahooEtf } = require("../market/fetchYahooEtf.js");
const { fetchYahooUnified } = require("../market/fetchYahooUnified.js");
const { jsonResponse } = require("../utils/jsonResponse.js");

function normalizeSymbol(symbol) {
  if (!symbol) return null;
  return symbol.toLowerCase().replace(/\./g, "-");
}

function detectType(symbol) {
  return symbol.endsWith("-usd") ? "crypto" : "stock";
}

async function handleMarket(symbol, opts = {}) {
  const normalized = normalizeSymbol(symbol);
  if (!normalized) {
    return jsonResponse(200, {
      ok: false,
      price: null,
      change_24h: null,
      history: [],
      timestamp: Date.now(),
      error: "Invalid symbol"
    });
  }

  const cached = getCache(normalized);
  if (cached) {
    return jsonResponse(200, cached);
  }

  const type = detectType(normalized);
  let result = null;

  try {
    if (type === "crypto") {
      result = await fetchCryptoGecko(normalized);
      if (!result?.ok) result = await fetchCryptoPrice(normalized);
    }

    if (type === "stock") {
      result = await fetchYahooUnified(normalized);
      if (!result?.ok) result = await fetchYahooStock(normalized);
      if (!result?.ok) result = await fetchYahooEtf(normalized);
    }
  } catch (err) {
    result = { ok: false, error: err.message };
  }

  const final = {
    ok: result?.ok ?? false,
    price: result?.price ?? null,
    change_24h: result?.change_24h ?? null,
    history: result?.history ?? [],
    timestamp: Date.now(),
    error: result?.error ?? null
  };

  if (final.ok) setCache(normalized, final);

  return jsonResponse(200, final);
}

module.exports = { handleMarket };
