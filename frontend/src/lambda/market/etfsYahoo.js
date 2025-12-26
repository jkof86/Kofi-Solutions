import { ETF_MAP } from "../config/etfMap.js";

export async function fetchEtfYahoo(symbol) {
  const yf = ETF_MAP[symbol];
  if (!yf) throw new Error("Unknown ETF symbol");

  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${yf}?interval=1h&range=1d`;

  const res = await fetch(url, {
    headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" }
  });

  const json = await res.json();
  const result = json?.chart?.result?.[0];

  const timestamps = result.timestamp;
  const closes = result.indicators.quote[0].close;

  const prices = timestamps.map((t, i) => [
    t * 1000,
    closes[i]
  ]);

  return { prices };
}
