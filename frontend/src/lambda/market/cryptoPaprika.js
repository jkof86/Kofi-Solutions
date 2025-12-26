import { CRYPTO_MAP } from "../config/cryptoMap.js";

export async function fetchCryptoPaprika(symbol) {
  const id = CRYPTO_MAP[symbol];
  if (!id) throw new Error("Unknown crypto symbol");

  const url =
    `https://api.coinpaprika.com/v1/tickers/${id}/historical?interval=1h`;

  const res = await fetch(url, {
    headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" }
  });

  const json = await res.json();

  const prices = json.map(p => [
    new Date(p.timestamp).getTime(),
    p.price
  ]);

  return { prices };
}
