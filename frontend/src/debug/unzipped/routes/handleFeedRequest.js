// ------------------------------------------------------------
// routes/handleFeedRequest.js — FEEDS router (RSS / JSON)
// ------------------------------------------------------------

const { FEEDS } = require("../config/feedsMap.js");
const { jsonResponse } = require("../utils/jsonResponse.js");
const { handleRss } = require("../feeds/rss/handleRss.js");
const { handleYahooCrypto } = require("../feeds/json/handleYahooCrypto.js");
const { handleCryptoPanic } = require("../feeds/json/handleCryptoPanic.js");
const { handleCoinGeckoCrypto } = require("../feeds/json/handleCoinGeckoCrypto.js");

async function handleFeedRequest(feedKey) {
  const target = FEEDS[feedKey];

  if (!target) {
    return jsonResponse(404, {
      status: "error",
      error: `Unknown feed key: ${feedKey}`,
      items: []
    });
  }

  // JSON feeds
  if (target.startsWith("json:")) {
    const key = target.slice(5);

    if (key === "yahoo_crypto") return await handleYahooCrypto();
    if (key === "cryptopanic_crypto") return await handleCryptoPanic();
    if (key === "coingecko_crypto") return await handleCoinGeckoCrypto();

    return jsonResponse(200, {
      status: "error",
      error: `No JSON handler implemented for ${key}`,
      items: []
    });
  }

  // RSS feeds
  if (/^https?:\/\//.test(target)) {
    return await handleRss(target, feedKey);
  }

  return jsonResponse(200, {
    status: "error",
    error: `Unrecognized FEEDS mapping for ${feedKey}`,
    items: []
  });
}

module.exports = { handleFeedRequest };
