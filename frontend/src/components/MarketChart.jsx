import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
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
  const [error, setError] = useState("");

  const normalize = (s) =>
    String(s || "")
      .toLowerCase()
      .replace(/\./g, "-");

  useEffect(() => {
    if (!symbol || typeof symbol !== "string") {
      setError("No valid symbol");
      setData([]);
      return;
    }

    const fetchData = async () => {
      try {
        const normalized = normalize(symbol);
        const url = `${API}?mode=market&symbol=${encodeURIComponent(normalized)}`;

        console.log("Fetching chart for:", normalized);
        console.log("Chart URL:", url);

        const res = await fetch(url);
        const json = await res.json();

        console.log("Chart response:", json);

        if (json.status !== "ok" || !Array.isArray(json.history)) {
          setError("No chart data");
          setData([]);
          return;
        }

        const cleaned = json.history
          .map((p) => ({
            time: p.time || "",
            price: typeof p.price === "number" ? p.price : null
          }))
          .filter((p) => p.time && p.price != null);

        if (cleaned.length === 0) {
          setError("No chart data");
          setData([]);
          return;
        }

        setData(cleaned);
        setError("");
      } catch (e) {
        console.error("Chart fetch error:", e);
        setError("Chart error");
        setData([]);
      }
    };

    fetchData();
  }, [symbol]);

  if (!symbol || typeof symbol !== "string" || symbol.trim() === "") {
    return (
      <Typography variant="body2" sx={{ opacity: 0.7 }}>
        No valid symbol provided
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", height: 300 }}>
      {error || data.length === 0 ? (
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          {error || "No data"}
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" hide />
            <YAxis domain={["auto", "auto"]} allowDecimals />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#1976d2"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
}
