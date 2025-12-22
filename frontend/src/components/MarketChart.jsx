// MarketChart.jsx — Phase 4 Stable Version
//
// Improvements:
// ✅ Unified time handling (numeric timestamps → formatted in chart)
// ✅ Strict normalization of stock data from Lambda
// ✅ Safer handling of Lambda "data" vs "prices" vs "series"
// ✅ Proper loading state (no premature "No data")
// ✅ Guards against NaN values and malformed responses
// ✅ Crypto + stocks share one internal data shape

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Box, Typography, CircularProgress } from "@mui/material";

const rssProxy = process.env.REACT_APP_RSS_FEED_PROXY;
const LAMBDA_URL = `${rssProxy}`

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

// Detect crypto symbols (BTC-USD, ETH-USD, SOL-USD, etc.)
function isCryptoSymbol(symbol) {
  return symbol.toLowerCase().includes("-usd");
}

// Map BTC-USD → bitcoin for CoinGecko
function toCoinGeckoId(symbol) {
  const lower = symbol.toLowerCase();
  if (lower.startsWith("btc")) return "bitcoin";
  if (lower.startsWith("eth")) return "ethereum";
  if (lower.startsWith("sol")) return "solana";
  return lower.replace("-usd", "");
}

// Format timestamp (ms) for X-axis / tooltip
function formatTime(ts) {
  if (!ts && ts !== 0) return "";
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

// ------------------------------------------------------------
// Crypto fetcher (CoinGecko)
// ------------------------------------------------------------

// Downsample CoinGecko data (1 point every 5 minutes)
function downsampleCrypto(prices) {
  if (!Array.isArray(prices)) return [];

  const result = [];
  for (let i = 0; i < prices.length; i += 5) {
    const [t, p] = prices[i] || [];
    const ts = typeof t === "number" ? t : Number(t);

    if (!ts || Number.isNaN(ts)) continue;

    const val = Number(p);
    if (Number.isNaN(val)) continue;

    result.push({
      // store raw timestamp (ms)
      time: ts,
      value: val
    });
  }

  // Always ensure last point is included
  const lastRaw = prices[prices.length - 1];
  if (lastRaw) {
    const [t, p] = lastRaw;
    const ts = typeof t === "number" ? t : Number(t);
    const val = Number(p);

    if (
      !Number.isNaN(ts) &&
      !Number.isNaN(val) &&
      (!result.length || result[result.length - 1].time !== ts)
    ) {
      result.push({ time: ts, value: val });
    }
  }

  return result;
}

async function fetchCryptoHistory(symbol) {
  const id = toCoinGeckoId(symbol);
  const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=1`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const json = await res.json();

    if (!json || !Array.isArray(json.prices)) return [];

    return downsampleCrypto(json.prices);
  } catch {
    return [];
  }
}

// ------------------------------------------------------------
// Stock / index fetcher (Lambda market mode)
// ------------------------------------------------------------

// Normalize any plausible Lambda "market" shape into [{ time, value }]
function normalizeStockSeries(json) {
  if (!json || json.status !== "ok") return [];

  // Try common locations for series-like data
  let series = null;

  if (Array.isArray(json.data)) {
    series = json.data;
  } else if (json.data && Array.isArray(json.data.series)) {
    series = json.data.series;
  } else if (Array.isArray(json.prices)) {
    series = json.prices;
  } else if (Array.isArray(json.series)) {
    series = json.series;
  }

  if (!Array.isArray(series)) return [];

  // series might be:
  // 1) [{ time, value }] or [{ timestamp, close/price }]
  // 2) [[t, p], [t, p], ...]
  return series
    .map((point) => {
      // Case 2: [t, p]
      if (Array.isArray(point) && point.length >= 2) {
        const ts = Number(point[0]);
        const val = Number(point[1]);
        if (Number.isNaN(ts) || Number.isNaN(val)) return null;
        return { time: ts, value: val };
      }

      // Case 1: object
      const rawTime = point.time ?? point.timestamp ?? point.t;
      const rawValue = point.value ?? point.close ?? point.price ?? point.v;

      const ts = rawTime
        ? new Date(rawTime).getTime()
        : Number.isFinite(point) // extremely defensive
        ? Number(point)
        : NaN;

      const val = Number(rawValue);

      if (Number.isNaN(ts) || Number.isNaN(val)) return null;

      return { time: ts, value: val };
    })
    .filter(Boolean)
    .sort((a, b) => a.time - b.time); // ensure chronological
}

async function fetchStockHistory(symbol) {
  const url = `${LAMBDA_URL}?mode=market&symbol=${encodeURIComponent(symbol)}`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    console.log("Market raw response for", symbol, json, "status:", res.status);

    // If this check is killing legit data, we'll see it immediately
    if (!res.ok) {
      return [];
    }

    const normalized = normalizeStockSeries(json);
    console.log("Normalized series for", symbol, normalized);

    return normalized;
  } catch (e) {
    console.error("Market fetch error for", symbol, e);
    return [];
  }
}


// ------------------------------------------------------------
// Component
// ------------------------------------------------------------

export default function MarketChart({ symbol }) {
  const [data, setData] = useState(null); // null = not loaded yet
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!symbol) {
      setData(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setData(null);

      try {
        let series = [];

        if (isCryptoSymbol(symbol)) {
          series = await fetchCryptoHistory(symbol);
        } else {
          series = await fetchStockHistory(symbol);
        }

        if (!cancelled) {
          setData(Array.isArray(series) ? series : []);
        }
      } catch {
        if (!cancelled) {
          setData([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [symbol]);

  if (!symbol) return null;

  // Loading state
  if (loading || data === null) {
    return (
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  // No data state
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No market data available for {symbol}.
        </Typography>
      </Box>
    );
  }

  const latest = data[data.length - 1];
  const first = data[0];

  const change =
    first.value && !Number.isNaN(first.value)
      ? (((latest.value - first.value) / first.value) * 100).toFixed(2)
      : null;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 0.5, fontWeight: 600 }}>
        {symbol} Market Snapshot
      </Typography>

      {change !== null && !Number.isNaN(Number(change)) && (
        <Typography
          variant="body2"
          sx={{ mb: 1 }}
          color={Number(change) >= 0 ? "success.main" : "error.main"}
        >
          1d Change: {change}% | Latest: {latest.value.toFixed(2)}
        </Typography>
      )}

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis
            dataKey="time"
            tickFormatter={formatTime}
            minTickGap={30}
          />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip
            labelFormatter={(label) => formatTime(label)}
            formatter={(value) => [value.toFixed(2), "Price"]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#1976d2"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
