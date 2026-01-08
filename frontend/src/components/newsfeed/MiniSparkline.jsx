// ------------------------------------------------------------
// MiniSparkline.jsx — v1.0 (Tiny Chart)
// ------------------------------------------------------------

import React from "react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

export default function MiniSparkline({ data }) {
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
