// ------------------------------------------------------------
// handleYahooCrypto.js — v2.0 (Correct Yahoo Finance Parser)
// ------------------------------------------------------------

const axios = require("axios");

async function handleYahooCrypto(url, opts = {}) {
  try {
    const { data } = await axios.get(url, { timeout: 8000 });

    const results = data?.quoteResponse?.result;
    if (!Array.isArray(results) || results.length === 0) return [];

    return results.map(item => ({
      title: `${item.symbol} — $${item.regularMarketPrice}`,
      link: `https://finance.yahoo.com/quote/${item.symbol}`,
      date: new Date().toISOString(),
      source: "Yahoo Finance",
      price: item.regularMarketPrice,
      changePercent: item.regularMarketChangePercent
    }));

  } catch (err) {
    console.error("[handleYahooCrypto] ERROR:", err);
    return [];
  }
}

module.exports = handleYahooCrypto;
