// ------------------------------------------------------------
// fetchCryptoPrice.js — v1.180 (CoinPaprika + History-Safe)
// ------------------------------------------------------------
//
// Returns:
//   {
//     price: Number,
//     change_24h: Number,
//     history: [ { time, price } ],
//     type: "crypto",
//     symbol: coinId,
//     source: "coinpaprika",
//     timestamp: Number
//   }
//
// Notes:
//   • Fully AWS-safe (axios only)
//   • Never throws — always returns a safe object
//   • History is optional
//   • Compatible with handleMarket v1.180
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
    const change24h = tickerRes?.data?.quotes?.USD?.percent_change_24h ?? 0;

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
            time: p.timestamp || p.time_open || "",
            price: typeof p.price === "number" ? p.price : null
          }))
          .filter((p) => p.time && p.price != null);
      }
    } catch (err) {
      console.error("[fetchCryptoPrice][HISTORY_ERROR]", coinId, err.code || err.message);
      history = [];
    }

    return {
      type: "crypto",
      symbol: coinId,
      price,
      change_24h: change24h,
      history,
      source: "coinpaprika",
      timestamp: Date.now()
    };

  } catch (err) {
    console.error("[fetchCryptoPrice][ERROR]", coinId, err.code || err.message);

    return {
      type: "crypto",
      symbol: coinId,
      price: null,
      change_24h: 0,
      history: [],
      source: "coinpaprika",
      timestamp: Date.now(),
      error: String(err)
    };
  }
}

module.exports = { fetchCryptoPrice };
