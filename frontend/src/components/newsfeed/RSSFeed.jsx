// ------------------------------------------------------------
// RSSFeed.jsx — v1.221 (Unified + StrictMode + Context-Aware)
// ------------------------------------------------------------

import React, {
  useState,
  useEffect,
  useContext
} from "react";

import {
  Box,
  Typography,
  Button,
  Stack,
  Collapse,
  Chip
} from "@mui/material";

import { API_BASE } from "../../data/api";
import { FeedStatusContext } from "../../context/FeedStatusContext";

import FeedCard from "./FeedCard";
import FeedStatusChip from "./FeedStatusChip";

const BATCH_SIZE = 4;

export default function RSSFeed({ feedId, feedMeta, categoryLabel, symbol }) {
  // ------------------------------------------------------------
  // Context
  // ------------------------------------------------------------
  const { status, strictMode } = useContext(FeedStatusContext);
  const feedStatus = status?.[feedId] || "unknown";

  // ------------------------------------------------------------
  // ALL HOOKS MUST BE AT THE TOP
  // ------------------------------------------------------------
  const [items, setItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  const [showDebug, setShowDebug] = useState(false);

  const [globalDebug, setGlobalDebug] = useState(() => {
    try {
      const urlParam = new URLSearchParams(window.location.search).get("debug");
      return urlParam === "true";
    } catch {
      return false;
    }
  });

  // Keyboard shortcut: Ctrl + Shift + D
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        setGlobalDebug((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ------------------------------------------------------------
  // Fetch feed items (MUST be defined before conditional returns)
  // ------------------------------------------------------------
  const fetchFeed = async (id = feedId, debug = false) => {
    if (!feedMeta?.url) {
      setError("Feed has no URL");
      return;
    }

    setLoading(true);
    setError(null);
    setIsFallback(false);
    setVisibleCount(BATCH_SIZE);
    setDebugInfo(null);

    const debugFlag = debug || globalDebug;

    try {
      const url = `${API_BASE}?mode=feed&feed=${encodeURIComponent(
        feedMeta.id
      )}${debugFlag ? "&debug=feeds" : ""}`;

      const res = await fetch(url);
      const json = await res.json();

      if (!json || typeof json !== "object") {
        setError("Malformed backend response");
        setItems([]);
        return;
      }

      if (json.status === "dead") {
        setError("Feed unavailable");
        setItems([]);
        return;
      }

      const itemsArray = Array.isArray(json.items) ? json.items : [];

      if (json.status !== "ok") {
        setIsFallback(json.status === "fallback");
        setItems(itemsArray);
        if (itemsArray.length === 0) {
          setError(json.error || "Feed error");
        }
      } else {
        setItems(itemsArray);
      }

      if (json.debug) setDebugInfo(json.debug);
    } catch (err) {
      setError(err.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // Auto-fetch when feedId or debug changes
  // ------------------------------------------------------------
  useEffect(() => {
    setItems([]);
    setVisibleCount(BATCH_SIZE);
    setError(null);
    setIsFallback(false);
    setDebugInfo(null);
    setShowDebug(false);

    if (feedMeta?.id) fetchFeed(feedMeta.id);
  }, [feedId, globalDebug]);

  // ------------------------------------------------------------
  // Derived values (MUST be above conditional returns)
  // ------------------------------------------------------------
  const visibleItems = items.slice(0, visibleCount);
  const feedLabel = feedMeta?.label || feedMeta?.name || feedId;

  // ------------------------------------------------------------
  // CONDITIONAL RETURNS (SAFE — AFTER ALL HOOKS + HELPERS)
  // ------------------------------------------------------------

  // StrictMode filtering
  if (
    strictMode &&
    !["ok", "json", "fallback", "empty"].includes(feedStatus)
  ) {
    return null;
  }

  if (!feedMeta) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">
          Feed “{feedId}” is missing metadata.
        </Typography>
      </Box>
    );
  }

  if (!feedMeta.url) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">
          Feed “{feedId}” has no URL defined.
        </Typography>
      </Box>
    );
  }

  if (
    ["empty", "fallback"].includes(feedStatus) &&
    items.length === 0
  ) {
    return (
      <Box>
        <FeedCard
          item={{ title: "Feed unavailable", url: feedMeta.url }}
          feedMeta={feedMeta}
          feedStatus={feedStatus}
          symbol={symbol}
          onRefresh={() => fetchFeed(feedId)}
        />
      </Box>
    );
  }

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
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
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
          {feedLabel}
          <Box sx={{ ml: 1 }}>
            <FeedStatusChip status={feedStatus} />
          </Box>
        </Typography>

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
        <Typography sx={{ mb: 2 }}>Loading feed: {feedLabel}</Typography>
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

      {/* Feed items */}
      <Stack spacing={2}>
        {visibleItems.map((item, idx) => (
          <FeedCard
            key={`${item.url || idx}-${idx}`}
            item={item}
            feedMeta={feedMeta}
            feedStatus={feedStatus}
            symbol={symbol}
            onRefresh={() => fetchFeed(feedId)}
          />
        ))}
      </Stack>

      {/* Load more */}
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
