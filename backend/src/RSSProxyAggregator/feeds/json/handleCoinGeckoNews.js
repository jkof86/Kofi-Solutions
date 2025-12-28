// ------------------------------------------------------------
// handleCoinGeckoNews.js — v3.0
// Normalized handler for CoinGecko Status Updates
// ------------------------------------------------------------

const axios = require("axios");

async function handleCoinGeckoNews(url, opts = {}) {
  try {
    const { data } = await axios.get(url, { timeout: 8000 });

    // CoinGecko returns: { status_updates: [...] }
    const updates = data?.status_updates;
    if (!Array.isArray(updates) || updates.length === 0) return [];

    return updates.map(item => ({
      title: `${item.project?.name || "Crypto"} — ${item.category || "update"}`,
      link: "https://www.coingecko.com/en/news", // CoinGecko does NOT provide per-item URLs
      date: item.created_at || new Date().toISOString(),
      source: "CoinGecko",
      description: item.description || ""
    }));

  } catch (err) {
    console.error("[handleCoinGeckoNews] ERROR:", err);
    return [];
  }
}

module.exports = handleCoinGeckoNews;
