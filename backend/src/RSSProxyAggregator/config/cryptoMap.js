// ------------------------------------------------------------
// cryptoMap.js — v1.180 (CoinPaprika IDs, Alphabetized)
// ------------------------------------------------------------
//
// Notes:
//   • Keys must be lowercase ticker symbols
//   • Values must be EXACT CoinPaprika IDs
//   • Used by handleMarket → fetchCryptoPrice
//   • Fully compatible with symbol normalization (BRK.B → brk-b)
//   • Alphabetized for maintainability
//
// ------------------------------------------------------------

const CRYPTO_MAP = {
  ada: "ada-cardano",
  avax: "avax-avalanche",
  bch: "bch-bitcoin-cash",
  bonk: "bonk-bonk",
  btc: "btc-bitcoin",
  doge: "doge-dogecoin",
  eth: "eth-ethereum",
  icp: "icp-internet-computer",
  ltc: "ltc-litecoin",
  shib: "shib-shiba-inu",
  sol: "sol-solana",
  trx: "trx-tron",
  xrp: "xrp-xrp",
  zec: "zec-zcash"

  // ------------------------------------------------------------
  // Optional future additions (commented for now)
  // ------------------------------------------------------------
  // arb: "arb-arbitrum",
  // op: "op-optimism",
  // matic: "matic-polygon",
  // dot: "dot-polkadot",
  // atom: "atom-cosmos",
  // near: "near-near-protocol",
  // apt: "apt-aptos",
  // sui: "sui-sui",
};

module.exports = { CRYPTO_MAP };
