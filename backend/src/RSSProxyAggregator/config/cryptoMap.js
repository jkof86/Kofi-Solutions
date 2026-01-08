// ------------------------------------------------------------
// cryptoMap.js — v1.205 (Validated)
// ------------------------------------------------------------
//
// Maps normalized crypto symbols → CoinGecko IDs
// All keys lowercase, dash-safe
//
// ------------------------------------------------------------

const CRYPTO_MAP = {
  ada: "cardano",
  avax: "avalanche-2",
  bch: "bitcoin-cash",
  bonk: "bonk",
  btc: "bitcoin",
  doge: "dogecoin",
  eth: "ethereum",
  icp: "internet-computer",
  ltc: "litecoin",
  shib: "shiba-inu",
  sol: "solana",
  trx: "tron",
  xrp: "ripple",
  zec: "zcash"
};

module.exports = { CRYPTO_MAP };
