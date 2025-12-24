// ------------------------------------------------------------
// MarketChart.jsx — Snapshot + Recharts Line Chart
// ------------------------------------------------------------

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress
} from "@mui/material";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function MarketChart({ symbol }) {
  const [latest, setLatest] = useState(null);
  const [changePct, setChangePct] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ------------------------------------------------------------
  // Fetch 1D snapshot
  // ------------------------------------------------------------
  useEffect(() => {
    async function fetchSnapshot() {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true`
        );
        const json = await res.json();
        const price = json.bitcoin.usd;
        const change = json.bitcoin.usd_24h_change;

        setLatest(price);
        setChangePct(change);
      } catch {
        setLatest(null);
        setChangePct(null);
      }
    }

    fetchSnapshot();
  }, [symbol]);

  // ------------------------------------------------------------
  // Fetch 1D chart data
  // ------------------------------------------------------------
  useEffect(() => {
    async function fetchChart() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1`
        );
        const json = await res.json();

        const formatted = json.prices.map(([timestamp, price]) => ({
          time: new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          }),
          price
        }));

        setChartData(formatted);
      } catch {
        setChartData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchChart();
  }, [symbol]);

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: "1px solid #ddd",
        p: 2,
        backgroundColor: "#fff",
        boxShadow: 1,
        mt: 2
      }}
    >
      {/* Title */}
      <Typography variant="h6" sx={{ mb: 1 }}>
        {symbol.toUpperCase()} — 1D Snapshot
      </Typography>

      {/* Snapshot */}
      {latest != null ? (
        <>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Latest: ${latest.toFixed(2)}
          </Typography>

          {changePct != null && (
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: changePct >= 0 ? "success.main" : "error.main"
              }}
            >
              {changePct >= 0 ? "+" : ""}
              {changePct.toFixed(2)}%
            </Typography>
          )}
        </>
      ) : (
        <Typography variant="body2" color="error">
          Snapshot unavailable.
        </Typography>
      )}

      {/* Chart */}
      <Box sx={{ height: 250, mt: 2 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%"
            }}
          >
            <CircularProgress size={28} />
          </Box>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fontSize: 10 }}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  border: "1px solid #ccc"
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#1976d2"
                strokeWidth={2}
                dot={false}
                animationDuration={500}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Typography variant="body2" color="error">
            Chart data unavailable.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
