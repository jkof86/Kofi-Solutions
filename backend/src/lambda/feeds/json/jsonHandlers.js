// ------------------------------------------------------------
// jsonHandlers.js — v1.0
// Central registry for all JSON feed handlers
// ------------------------------------------------------------

// JSON feed handlers
const handleYahooCrypto = require("./json/handleYahooCrypto.js");
const handleCryptoPanic = require("./json/handleCryptoPanic.js");
const handleCoinGeckoCrypto = require("./json/handleCoinGeckoCrypto.js");

// Registry keyed by FEEDS[feedId].handler
const JSON_HANDLERS = {
  yahoo_crypto: handleYahooCrypto,
  cryptopanic_crypto: handleCryptoPanic,
  coingecko_crypto: handleCoinGeckoCrypto
};

module.exports = { JSON_HANDLERS };
