// ------------------------------------------------------------
// routes/handleFeedRequest.js — FEEDS router (RSS / JSON)
// ------------------------------------------------------------

import { FEEDS } from "../config/feedsMap.js";
import { jsonResponse } from "../utils/jsonResponse.js";
import { handleRss } from "../feeds/rss/handleRss.js";
import { handleYahooCrypto } from "../feeds/json/handleYahooCrypto.js";
import { handleCryptoPanic } from "../feeds/json/handleCryptoPanic.js";
import { handleCoinGeckoCrypto } from "../feeds/json/handleCoinGeckoCrypto.js";

export async function handleFeedRequest(feedKey) {
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
