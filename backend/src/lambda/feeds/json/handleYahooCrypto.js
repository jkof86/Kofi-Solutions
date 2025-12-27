// ------------------------------------------------------------
// handleYahooCrypto.js — v1.0
// ------------------------------------------------------------

const axios = require("axios");

async function handleYahooCrypto(url, opts = {}) {
  try {
    const { data } = await axios.get(url, { timeout: 8000 });

    if (!data?.items?.length) return [];

    return data.items.map(item => ({
      title: item.title,
      link: item.link,
      date: item.pubDate || item.isoDate,
      source: "Yahoo Crypto"
    }));
  } catch (err) {
    console.error("[handleYahooCrypto] ERROR:", err);
    return [];
  }
}

module.exports = handleYahooCrypto;
