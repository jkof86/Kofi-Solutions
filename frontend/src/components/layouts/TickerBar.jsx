// ------------------------------------------------------------
// TickerBar.jsx
// Lightweight crypto + mock stocks ticker bar.
// ------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

const CRYPTO_SYMBOLS = ["bitcoin", "ethereum", "solana"];

const STOCKS = [
  { symbol: "AAPL", price: 190.12, change: +0.8 },
  { symbol: "MSFT", price: 410.55, change: -0.3 },
  { symbol: "AMZN", price: 175.44, change: +1.2 }
];

export default function TickerBar() {
  const [crypto, setCrypto] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const ids = CRYPTO_SYMBOLS.join(",");
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
        const res = await fetch(url);
        const json = await res.json();

        const data = CRYPTO_SYMBOLS.map(id => ({
          symbol: id.toUpperCase(),
          price: json[id]?.usd ?? null,
          change: json[id]?.usd_24h_change ?? null
        }));

        setCrypto(data);
      } catch (e) {
        console.error("TickerBar crypto error:", e);
      }
    }

    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        px: 2,
        py: 1,
        display: "flex",
        flexWrap: "wrap",
        gap: 3,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0d1117",
        color: "#fff",
        fontSize: 14
      }}
    >
      {crypto.map(c => (
        <Box key={c.symbol}>
          <Typography component="span" sx={{ fontWeight: 600, mr: 0.5 }}>
            {c.symbol}
          </Typography>
          <Typography component="span" sx={{ mr: 0.5 }}>
            ${c.price?.toFixed(2)}
          </Typography>
          <Typography
            component="span"
            sx={{
              color: (c.change ?? 0) >= 0 ? "#4caf50" : "#f44336"
            }}
          >
            {c.change?.toFixed(2)}%
          </Typography>
        </Box>
      ))}

      {STOCKS.map(s => (
        <Box key={s.symbol}>
          <Typography component="span" sx={{ fontWeight: 600, mr: 0.5 }}>
            {s.symbol}
          </Typography>
          <Typography component="span" sx={{ mr: 0.5 }}>
            ${s.price.toFixed(2)}
          </Typography>
          <Typography
            component="span"
            sx={{
              color: s.change >= 0 ? "#4caf50" : "#f44336"
            }}
          >
            {s.change.toFixed(2)}%
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
