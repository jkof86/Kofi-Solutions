// ------------------------------------------------------------
// handleHealth.js — Universal health checker (strict/soft)
// v1.145 — FIXED for normalized FEEDS map
// ------------------------------------------------------------

const { FEEDS } = require("../config/feedsMap.js");
const { CRYPTO_MAP } = require("../config/cryptoMap.js");
const { STOCK_MAP } = require("../config/stockMap.js");
const { ETF_MAP } = require("../config/etfMap.js");

const { fetchCryptoPaprika } = require("../market/cryptoPaprika.js");
const { fetchYahooStock } = require("../market/stockYahoo.js");
const { fetchYahooEtf } = require("../market/etfYahoo.js");

const { jsonResponse } = require("../utils/jsonResponse.js");

async function handleHealth(qs) {
  const strict = qs.strict === "false" ? false : true;

  const feedStatuses = {};
  const marketFailures = [];

  // -----------------------------
  // FEED HEALTH (FIXED)
  // -----------------------------
  for (const key of Object.keys(FEEDS)) {
    const target = FEEDS[key];

    try {
      // FEEDS[key] is now an object, not a string.
      if (target.type === "json") {
        feedStatuses[key] = strict ? "json" : "ok";
      } else if (target.legacy) {
        feedStatuses[key] = strict ? "fallback" : "ok";
      } else {
        feedStatuses[key] = "ok";
      }
    } catch {
      feedStatuses[key] = strict ? "error" : "fallback";
    }
  }

  // -----------------------------
  // MARKET HEALTH
  // -----------------------------
  const cryptoSymbols = Object.keys(CRYPTO_MAP);
  const stockSymbols = Object.keys(STOCK_MAP);
  const etfSymbols = Object.keys(ETF_MAP);

  const allSymbols = [...cryptoSymbols, ...stockSymbols, ...etfSymbols];

  for (const sym of allSymbols) {
    const lower = sym.toLowerCase();

    const crypto = await fetchCryptoPaprika(lower);
    if (crypto.ok) continue;

    const stock = await fetchYahooStock(lower);
    if (stock.ok) continue;

    const etf = await fetchYahooEtf(lower);
    if (etf.ok) continue;

    marketFailures.push(lower);
  }

  return jsonResponse(200, {
    status: "ok",
    strict,
    feeds: feedStatuses,
    markets: marketFailures
  });
}

module.exports = { handleHealth };
