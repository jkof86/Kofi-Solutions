// ------------------------------------------------------------
// jsonHandlers.js — v1.0
// Central registry for all JSON feed handlers
// ------------------------------------------------------------

// JSON feed handlers
const handleYahooCrypto = require("./handleYahooCrypto.js");
const handleCryptoPanic = require("./handleCryptoPanic.js");
const handleCoinGeckoNews = require("./handleCoinGeckoNews.js");

// Registry keyed by FEEDS[feedId].handler
const JSON_HANDLERS = {
  yahoo_crypto: handleYahooCrypto,
  cryptopanic_crypto: handleCryptoPanic,
  coingecko_crypto: handleCoinGeckoNews
};

module.exports = { JSON_HANDLERS };
