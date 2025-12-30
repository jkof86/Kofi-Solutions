// ------------------------------------------------------------
// fetchCryptoPrice.js — v1.180 (CoinPaprika + History-Safe)
// ------------------------------------------------------------
//
// Returns:
//   {
//     price: Number,
//     change_24h: Number,
//     history: [ { time, price } ],
//     source: "coinpaprika"
//   }
//
// Notes:
//   • Fully AWS-safe (no fetch, uses axios)
//   • Never throws — always returns a safe object
//   • History is optional (MarketChart handles empty arrays)
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
      // History is optional — never fail the whole call
      history = [];
    }

    return {
      price,
      change_24h: change24h,
      history,
      source: "coinpaprika"
    };

  } catch (err) {
    console.error("[fetchCryptoPrice] ERROR:", coinId, err);

    // Always return a safe object
    return {
      price: null,
      change_24h: 0,
      history: [],
      source: "coinpaprika",
      error: String(err)
    };
  }
}

module.exports = { fetchCryptoPrice };
