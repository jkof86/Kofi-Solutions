import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import FeedCard from "./FeedCard";
import { FEEDS } from "../data/feedsMap";

const BATCH_SIZE = 4;

const BACKEND_URL =
  "https://jy4i499sj1.execute-api.us-east-1.amazonaws.com/default/RSSProxyAggregator";

export default function RSSFeed({ name }) {
  const [items, setItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  // -----------------------------
  // Fetch a single feed
  // -----------------------------
  const fetchFeed = async (feedName = name) => {
    setLoading(true);
    setError(null);
    setIsFallback(false);
    setVisibleCount(BATCH_SIZE);

    try {
      const url = `${BACKEND_URL}?feed=${encodeURIComponent(feedName)}`;
      const res = await fetch(url);
      const json = await res.json();

      if (json.status !== "ok") {
        setIsFallback(true);
        setItems(json.items || []);
        if (!json.items || json.items.length === 0) {
          setError(json.error || "Feed error");
        }
      } else {
        setItems(json.items || []);
      }
    } catch (err) {
      setError(err.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Refresh All (parent-level)
  // -----------------------------
  const refreshAll = () => {
    fetchFeed(name);
  };

  // -----------------------------
  // Per-feed refresh (passed to FeedCard)
  // -----------------------------
  const refreshFeedItem = () => {
    fetchFeed(name);
  };

  useEffect(() => {
    if (name) fetchFeed(name);
  }, [name]);

  const visibleItems = items.slice(0, visibleCount);
  const feedMeta = FEEDS[name];

  return (
    <Box>
      {/* Header + Refresh All */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2
        }}
      >
        <Typography variant="h6"></Typography>

        <Button variant="outlined" onClick={refreshAll}>
          Refresh All
        </Button>
      </Box>

      {loading && feedMeta && (
        <Typography sx={{ mb: 2 }}>Loading feed: {feedMeta.label}…</Typography>
      )}

      {error && items.length === 0 && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {isFallback && items.length > 0 && (
        <Typography variant="body2" sx={{ mb: 1 }}>
          Feed "{name}" is currently unavailable (fallback mode).
        </Typography>
      )}

      <Stack spacing={2}>
        {visibleItems.map((item, idx) => (
          <FeedCard
            key={`${item.url}-${idx}`}
            item={item}
            feedMeta={feedMeta}
            onRefresh={refreshFeedItem}
          />
        ))}
      </Stack>

      {visibleCount < items.length && (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button
            variant="outlined"
            onClick={() => setVisibleCount((c) => c + BATCH_SIZE)}
          >
            Load more
          </Button>
        </Box>
      )}
    </Box>
  );
}
