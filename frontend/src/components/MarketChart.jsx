// ------------------------------------------------------------
// MarketChart.jsx — v2.701 (Debug-Enabled)
// ------------------------------------------------------------
//
// Adds:
//   ✓ Debug logging for history length + timestamps
//   ✓ Safe logging (won't crash if empty)
//   ✓ Helps confirm backend is returning correct ranges
//
// ------------------------------------------------------------

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const API =
  "https://jy4i499sj1.execute-api.us-east-1.amazonaws.com/default/RSSProxyAggregator";

export default function MarketChart({ symbol }) {
  const [data, setData] = useState([]);
  const [price, setPrice] = useState(null);
  const [change24h, setChange24h] = useState(null);
  const [range, setRange] = useState("1W");

  const normalize = (s) =>
    String(s || "").toLowerCase().replace(/\./g, "-");

  const handleRange = (_, val) => {
    if (val) setRange(val);
  };

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      const normalized = normalize(symbol);
      const url = `${API}?mode=market&symbol=${normalized}&range=${range}`;

      try {
        const res = await fetch(url);
        const json = await res.json();

        // ------------------------------------------------------------
        // DEBUG BLOCK (safe, no crashes)
        // ------------------------------------------------------------
        const hist = json.history || [];
        console.log("MARKET DEBUG", {
          symbol: normalized,
          range,
          count: hist.length,
          first: hist.length > 0 ? hist[0].time : null,
          last: hist.length > 0 ? hist[hist.length - 1].time : null
        });
        // ------------------------------------------------------------

        setPrice(json.price ?? null);
        setChange24h(json.change_24h ?? null);

        const cleaned = hist
          .map((p) => ({
            time: p.time,
            price: p.price
          }))
          .filter((p) => p.time && p.price != null);

        setData(cleaned);
      } catch (err) {
        console.error("Chart error:", err);
      }
    };

    fetchData();
  }, [symbol, range]);

  // ------------------------------------------------------------
  // Range-aware tick formatter
  // ------------------------------------------------------------
  const formatTick = (t) => {
    const d = new Date(t);

    if (range === "1D") {
      return d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
    }

    if (range === "1W" || range === "1M") {
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit"
      });
    }

    if (range === "1Y") {
      return d.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric"
      });
    }

    return t;
  };

  // ------------------------------------------------------------
  // Smart tick count
  // ------------------------------------------------------------
  const TICK_COUNT = {
    "1D": 6,
    "1W": 7,
    "1M": 6,
    "1Y": 6
  };

  const tickCount = TICK_COUNT[range] || 6;

  // ------------------------------------------------------------
  // Y-axis padding
  // ------------------------------------------------------------
  const yDomain = [
    (min) => (min ? min * 0.99 : 0),
    (max) => (max ? max * 1.01 : 1)
  ];

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {symbol?.toUpperCase()}
        </Typography>

        {price != null && (
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            ${price.toLocaleString()}{" "}
            <span
              style={{
                color: change24h >= 0 ? "green" : "red",
                fontWeight: 600
              }}
            >
              {change24h >= 0 ? "+" : ""}
              {change24h?.toFixed(2)}%
            </span>
          </Typography>
        )}
      </Box>

      {/* Range Toggle */}
      <ToggleButtonGroup
        value={range}
        exclusive
        onChange={handleRange}
        size="small"
        sx={{
          mb: 1,
          "& .MuiToggleButton-root": {
            padding: "2px 10px",
            fontSize: "0.7rem"
          }
        }}
      >
        <ToggleButton value="1D">1D</ToggleButton>
        <ToggleButton value="1W">1W</ToggleButton>
        <ToggleButton value="1M">1M</ToggleButton>
        <ToggleButton value="1Y">1Y</ToggleButton>
      </ToggleButtonGroup>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={180}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, bottom: 20, left: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="time"
            tick={{ fontSize: 10 }}
            tickFormatter={formatTick}
            tickCount={tickCount}
            minTickGap={10}
            tickMargin={8}
          />

          <YAxis
            domain={yDomain}
            tick={{ fontSize: 10 }}
            tickMargin={6}
            width={50}
            tickFormatter={(v) => `$${v.toFixed(2)}`}
          />

          <Tooltip
            formatter={(value) => `$${value.toLocaleString()}`}
            labelFormatter={(label) => formatTick(label)}
          />

          <Line
            type="monotone"
            dataKey="price"
            stroke="#1976d2"
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
