// ------------------------------------------------------------
// handleCryptoPanic.js — v1.0
// Normalized JSON handler for CryptoPanic API
// ------------------------------------------------------------

const axios = require("axios");

async function handleCryptoPanic(url, opts = {}) {
  try {
    const { data } = await axios.get(url, { timeout: 8000 });

    if (!data?.results?.length) return [];

    return data.results.map(item => ({
      title: item.title,
      link: item.url,
      date: item.published_at,
      source: "CryptoPanic"
    }));
  } catch (err) {
    console.error("[handleCryptoPanic] ERROR:", err);
    return [];
  }
}

module.exports = handleCryptoPanic;
