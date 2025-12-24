// ------------------------------------------------------------
// RSSFeed.jsx — Feed list + batching
// ------------------------------------------------------------

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

  useEffect(() => {
    async function fetchFeed() {
      setLoading(true);
      setError(null);
      setIsFallback(false);
      setVisibleCount(BATCH_SIZE);

      try {
        const url = `${BACKEND_URL}?feed=${encodeURIComponent(name)}`;
        const res = await fetch(url);
        const json = await res.json();

        // backend: status !== "ok" used for fallback/unavailable
        if (json.status !== "ok") {
          setIsFallback(true);
          setItems(json.items || []);
          // do NOT show red error text if we have a fallback card
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
    }

    if (name) {
      fetchFeed();
    }
  }, [name]);

  const visibleItems = items.slice(0, visibleCount);
  const feedMeta = FEEDS[name];

  return (
    <Box>
      {loading && (
        <Typography sx={{ mb: 2 }}>Loading feed: {feedMeta?.label}…</Typography>
      )}

      {/* Only show red error if we truly have nothing to show */}
      {error && items.length === 0 && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Fallback/unavailable message should live on the card(s) only */}
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
          />
        ))}
      </Stack>

      {visibleCount < items.length && (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button
            variant="outlined"
            onClick={() => setVisibleCount(c => c + BATCH_SIZE)}
          >
            Load more
          </Button>
        </Box>
      )}
    </Box>
  );
}
