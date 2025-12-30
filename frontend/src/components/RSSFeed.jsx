// ------------------------------------------------------------
// RSSFeed.jsx — v1.180 (Flat FEEDS + Safe Hooks + Debug)
// ------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Stack, Collapse, Chip } from "@mui/material";

import FeedCard from "./FeedCard";
import { FEEDS } from "../data/feedsMap";
import { sanitizeFeeds } from "../utils/sanitizeFeeds";

const CLEAN_FEEDS = sanitizeFeeds(FEEDS);

const BATCH_SIZE = 4;
const BACKEND_URL =
  "https://jy4i499sj1.execute-api.us-east-1.amazonaws.com/default/RSSProxyAggregator";

export default function RSSFeed({ feedId }) {
  // Hooks must run first
  const [items, setItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  const [showDebug, setShowDebug] = useState(false);

  const [globalDebug, setGlobalDebug] = useState(() => {
    const urlParam = new URLSearchParams(window.location.search).get("debug");
    return urlParam === "true";
  });

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        setGlobalDebug((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Resolve feed metadata
  const feedMeta = FEEDS[feedId];

  // Fetch function
  const fetchFeed = async (id = feedId, debug = false) => {
    if (!feedMeta?.url) return;

    setLoading(true);
    setError(null);
    setIsFallback(false);
    setVisibleCount(BATCH_SIZE);
    setDebugInfo(null);

    const debugFlag = debug || globalDebug;

    try {
      const url = `${BACKEND_URL}?mode=feed&feed=${encodeURIComponent(
        feedMeta.id
      )}${debugFlag ? "&debug=debug_feeds" : ""}`;

      const res = await fetch(url);
      const json = await res.json();

      const hasItems = Array.isArray(json.items) && json.items.length > 0;

      if (json.status !== "ok") {
        setIsFallback(json.status === "fallback");
        setItems(json.items || []);

        if (!hasItems) {
          setError(json.error || "Feed error");
        }
      } else {
        setItems(json.items || []);
      }

      if (json.debug) {
        setDebugInfo(json.debug);
      }
    } catch (err) {
      setError(err.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch
  useEffect(() => {
    if (feedMeta?.id) fetchFeed(feedMeta.id);
  }, [feedId, globalDebug]);

  // Early returns (safe)
  if (!feedMeta) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">This feed is no longer available.</Typography>
      </Box>
    );
  }

  if (!feedMeta.url) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">Invalid feed: missing URL.</Typography>
      </Box>
    );
  }

  const visibleItems = items.slice(0, visibleCount);

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2
        }}
      >
        <Typography variant="h6">{feedMeta.label}</Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          {globalDebug && (
            <Chip
              label="Global Debug ON"
              color="secondary"
              size="small"
              sx={{ fontSize: 11 }}
            />
          )}

          <Button variant="outlined" onClick={() => fetchFeed(feedId)}>
            Refresh All
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              fetchFeed(feedId, true);
              setShowDebug(true);
            }}
          >
            Debug
          </Button>
        </Box>
      </Box>

      {loading && (
        <Typography sx={{ mb: 2 }}>Loading feed: {feedMeta.label}</Typography>
      )}

      {error && items.length === 0 && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {isFallback && items.length > 0 && (
        <Typography variant="body2" sx={{ mb: 1 }}>
          Feed "{feedId}" is using HTML fallback mode.
        </Typography>
      )}

      {/* Debug panel */}
      <Collapse in={showDebug && !!debugInfo}>
        <Box
          sx={{
            mb: 2,
            p: 1,
            borderRadius: 1,
            border: "1px dashed #ccc",
            backgroundColor: "#fafafa",
            fontFamily: "monospace",
            fontSize: 12,
            maxHeight: 200,
            overflow: "auto"
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Debug info:
          </Typography>
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </Box>
      </Collapse>

      <Stack spacing={2}>
        {visibleItems.map((item, idx) => (
          <FeedCard
            key={`${item.url}-${idx}`}
            item={item}
            feedMeta={feedMeta}
            onRefresh={() => fetchFeed(feedId)}
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
