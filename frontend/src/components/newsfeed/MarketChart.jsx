// ------------------------------------------------------------
// MarketChart.jsx — v3.0 (Context-Integrated + Range-Aware)
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

import { API_BASE } from "../../data/api";
import { useMarketStatus } from "../../hooks/useMarketStatus";

export default function MarketChart({ symbol }) {
  const { market } = useMarketStatus();

  const [data, setData] = useState([]);
  const [range, setRange] = useState("1D");

  const normalize = (s) =>
    String(s || "").toLowerCase().replace(/\./g, "-");

  const normalized = normalize(symbol);

  const handleRange = (_, val) => {
    if (val) setRange(val);
  };

  // ------------------------------------------------------------
  // Fetch history (price + change come from context)
  // ------------------------------------------------------------
  useEffect(() => {
    if (!normalized) return;

    const fetchHistory = async () => {
      const url = `${API_BASE}?mode=market&symbol=${normalized}&range=${range}`;

      try {
        const res = await fetch(url);
        const json = await res.json();

        const hist = json.history || [];

        console.log("MARKET DEBUG", {
          symbol: normalized,
          range,
          count: hist.length,
          first: hist[0]?.time || null,
          last: hist[hist.length - 1]?.time || null
        });

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

    fetchHistory();
  }, [normalized, range]);

  // ------------------------------------------------------------
  // Pull live price + change from context
  // ------------------------------------------------------------
  const entry = market?.[normalized] || {};
  const price = entry.price ?? null;
  const change24h = entry.change_24h ?? null;

  // ------------------------------------------------------------
  // Tick formatting
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

  const TICK_COUNT = {
    "1D": 6,
    "1W": 7,
    "1M": 6,
    "1Y": 6
  };

  const tickCount = TICK_COUNT[range] || 6;

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
          key={range}
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
            key={range}
            type="monotone"
            dataKey="price"
            stroke="#1976d2"
            fill="url(#priceGradient)"
            dot={false}
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={600}
            animationEasing="ease-in-out"
          />

          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1976d2" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#1976d2" stopOpacity={0} />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
