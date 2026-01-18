// ------------------------------------------------------------
// MiniSparkline.jsx — v2.0 (Symbol-Aware + Auto-Fetch)
// ------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line } from "recharts";
import { API_BASE } from "../../data/api";

export default function MiniSparkline({ symbol, range = "1D" }) {
  const [data, setData] = useState([]);

  const normalize = (s) =>
    String(s || "").toLowerCase().replace(/\./g, "-");

  useEffect(() => {
    if (!symbol) return;

    const fetchHistory = async () => {
      const normalized = normalize(symbol);
      const url = `${API_BASE}?mode=market&symbol=${normalized}&range=${range}`;

      try {
        const res = await fetch(url);
        const json = await res.json();

        const cleaned = (json.history || [])
          .map((p) => ({
            time: p.time,
            price: p.price
          }))
          .filter((p) => p.time && p.price != null);

        setData(cleaned);
      } catch (err) {
        console.error("[MiniSparkline] error:", err);
      }
    };

    fetchHistory();
  }, [symbol, range]);

  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="price"
          stroke="#1976d2"
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
