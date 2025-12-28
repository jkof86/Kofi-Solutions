// ------------------------------------------------------------
// handleCryptoPanic.js — v2.0 (Robust Normalized Handler)
// ------------------------------------------------------------

const axios = require("axios");

async function handleCryptoPanic(url, opts = {}) {
  try {
    const { data } = await axios.get(url, { timeout: 8000 });

    const results = data?.results;
    if (!Array.isArray(results) || results.length === 0) return [];

    return results
      .filter(item => item.title && item.url) // ensure valid items
      .map(item => ({
        title: item.title,
        link: item.url,
        date: item.published_at || item.created_at || new Date().toISOString(),
        source: "CryptoPanic"
      }));

  } catch (err) {
    console.error("[handleCryptoPanic] ERROR:", err);
    return [];
  }
}

module.exports = handleCryptoPanic;
