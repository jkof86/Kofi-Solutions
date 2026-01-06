// ------------------------------------------------------------
// stockMap.js — v1.205 (Validated + Yahoo-Safe)
// ------------------------------------------------------------
//
// Maps normalized stock symbols → Yahoo Finance tickers
// All keys lowercase, dash-safe
//
// ------------------------------------------------------------

const STOCK_MAP = {
  aapl: "AAPL",
  amzn: "AMZN",
  bac: "BAC",
  "brk-b": "BRK-B",
  dis: "DIS",
  gme: "GME",
  goog: "GOOG",
  gs: "GS",
  ibm: "IBM",
  intc: "INTC",
  jpm: "JPM",
  ma: "MA",
  meta: "META",
  msft: "MSFT",
  nflx: "NFLX",
  nvo: "NVO",
  nvda: "NVDA",
  orcl: "ORCL",
  pfe: "PFE",
  qcom: "QCOM",
  sap: "SAP",
  stm: "STM",
  tsla: "TSLA",
  txn: "TXN",
  v: "V",
  xom: "XOM"
};

module.exports = { STOCK_MAP };
