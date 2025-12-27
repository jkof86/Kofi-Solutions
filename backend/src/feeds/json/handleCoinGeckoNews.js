// ------------------------------------------------------------
// handleCoinGeckoCrypto.js — v1.0
// Normalized JSON handler for CoinGecko Crypto News
// ------------------------------------------------------------

const axios = require("axios");

async function handleCoinGeckoCrypto(url, opts = {}) {
  try {
    const { data } = await axios.get(url, { timeout: 8000 });

    if (!data?.data?.length) return [];

    return data.data.map(item => ({
      title: item.title,
      link: item.url,
      date: item.updated_at || item.created_at,
      source: "CoinGecko"
    }));
  } catch (err) {
    console.error("[handleCoinGeckoCrypto] ERROR:", err);
    return [];
  }
}

module.exports = handleCoinGeckoCrypto;
