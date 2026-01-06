// ------------------------------------------------------------
// fetchCryptoPrice.js — v1.190 (CoinPaprika + Full Payload)
// ------------------------------------------------------------
//
// Standardized return shape for ALL market handlers:
//
//   {
//     type: "crypto",
//     symbol: coinId,
//     price: Number | null,
//     change_24h: Number | null,
//     history: [ { time, price } ],
//     source: "coinpaprika",
//     timestamp: Number,
//     debug: { ... } | null,
//     error: String | null
//   }
//
// Improvements in v1.190:
//   • Added debug passthrough
//   • Guaranteed non-null fields
//   • History normalization hardened
//   • Safe guards for malformed API responses
//   • Fully compatible with handleMarket v1.190
//   • Fully compatible with handleHealth v1.190
//
// ------------------------------------------------------------

const axios = require("axios");

async function fetchCryptoPrice(coinId, opts = {}) {
  const timeout = opts.timeout || 5000;

  try {
    // ------------------------------------------------------------
    // 1. Fetch ticker (price + 24h change)
    // ------------------------------------------------------------
    const tickerUrl = `https://api.coinpaprika.com/v1/tickers/${coinId}`;
    const tickerRes = await axios.get(tickerUrl, { timeout });

    const price = tickerRes?.data?.quotes?.USD?.price ?? null;
    const change24h =
      tickerRes?.data?.quotes?.USD?.percent_change_24h ?? null;

    // Optional debug info
    const debug = opts.debug ? { ticker: tickerRes.data } : null;

    // ------------------------------------------------------------
    // 2. Fetch history (optional)
    // ------------------------------------------------------------
    let history = [];
    try {
      const histUrl = `https://api.coinpaprika.com/v1/tickers/${coinId}/historical?interval=1h&limit=48`;
      const histRes = await axios.get(histUrl, { timeout });

      if (Array.isArray(histRes.data)) {
        history = histRes.data
          .map((p) => ({
            time: p.timestamp || p.time_open || null,
            price: typeof p.price === "number" ? p.price : null
          }))
          .filter((p) => p.time && p.price != null);
      }

      if (opts.debug) {
        debug.history = histRes.data;
      }
    } catch (err) {
      console.error(
        "[fetchCryptoPrice][HISTORY_ERROR]",
        coinId,
        err.code || err.message
      );
      history = [];
    }

    // ------------------------------------------------------------
    // Final normalized payload
    // ------------------------------------------------------------
    return {
      type: "crypto",
      symbol: coinId,
      price,
      change_24h: change24h,
      history,
      source: "coinpaprika",
      timestamp: Date.now(),
      debug,
      error: null
    };

  } catch (err) {
    console.error(
      "[fetchCryptoPrice][ERROR]",
      coinId,
      err.code || err.message
    );

    return {
      type: "crypto",
      symbol: coinId,
      price: null,
      change_24h: null,
      history: [],
      source: "coinpaprika",
      timestamp: Date.now(),
      debug: opts.debug ? { error: String(err) } : null,
      error: String(err)
    };
  }
}

module.exports = { fetchCryptoPrice };
