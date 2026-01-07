// ------------------------------------------------------------
// MarketChart.jsx — v1.211 (Axes + Header + Range Toggle)
// ------------------------------------------------------------
//
// Features:
//   ✓ Price + 24h change header
//   ✓ Range toggle (1D / 1W / 1M / 1Y)
//   ✓ Formatted X and Y axes
//   ✓ Responsive layout
//   ✓ Tooltip formatting
//   ✓ Compact height for sidebar use
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

        setPrice(json.price ?? null);
        setChange24h(json.change_24h ?? null);

        const cleaned = (json.history || [])
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
      {/* <ToggleButtonGroup
        value={range}
        exclusive
        onChange={handleRange}
        size="small"
        sx={{ mb: 1 }}
      >
        <ToggleButton value="1D">1D</ToggleButton>
        <ToggleButton value="1W">1W</ToggleButton>
        <ToggleButton value="1M">1M</ToggleButton>
        <ToggleButton value="1Y">1Y</ToggleButton>
      </ToggleButtonGroup> */}

      {/* Chart */}
      <ResponsiveContainer width="100%" height={180}>
  <LineChart
    data={data}
    margin={{ top: 10, right: 20, bottom: 10, left: 0 }} // ← key fix
  >
    <CartesianGrid strokeDasharray="3 3" />

    <XAxis
      dataKey="time"
      tick={{ fontSize: 10 }}
      tickFormatter={(t) => {
        const d = new Date(t);
        const date = d.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit"
        });
        const time = d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });
        // return `${date} ${time}`;
        return `${time}`;
      }}
      label={{ value: "Timestamp", position: "insideBottom", offset: -5 }}
    />

    <YAxis
      domain={["dataMin", "dataMax"]}
      tick={{ fontSize: 10 }}
      tickFormatter={(v) => `$${v.toFixed(2)}`}
      label={{ value: "Price (USD)", angle: -90, position: "insideLeft" }}
    />

    <Tooltip
      formatter={(value) => `$${value.toLocaleString()}`}
      labelFormatter={(label) => `Date: ${label}`}
    />

    <Line
      type="monotone"
      dataKey="price"
      stroke="#1976d2"
      dot={false}
      strokeWidth={2}
    />
  </LineChart>
</ResponsiveContainer>

    </Box>
  );
}
