// ------------------------------------------------------------
// TabsLayout.jsx — v1.177 (using helper functions)
// ------------------------------------------------------------

import React, { useEffect, useState, useMemo, useContext } from "react";
import { Tabs, Tab, Box, Typography, Stack, Avatar, Chip } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { FEED_CATEGORIES } from "../../data/feedCategories";
import {
  FEEDS,
  getFeedsForCategory,
  getLegacyCryptoFeeds
} from "../../data/feedsMap";

import { FeedStatusContext } from "../../context/FeedStatusContext";

import RSSFeed from "../RSSFeed";
import MarketChart from "../MarketChart";
import FeedStatusBar from "../FeedStatusBar";

// ------------------------------------------------------------
// Feed Tab Label
// ------------------------------------------------------------
function FeedTabLabel({ feed, status }) {
  const initials = feed.label
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  let icon = null;

  if (status === "ok" || status === "json")
    icon = <CheckCircleIcon color="success" fontSize="small" />;
  else if (status === "fallback")
    icon = <WarningAmberIcon color="warning" fontSize="small" />;
  else icon = <ErrorIcon color="error" fontSize="small" />;

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Avatar sx={{ width: 20, height: 20, fontSize: 10 }}>{initials}</Avatar>
      <Typography variant="body2">{feed.label}</Typography>
      {icon}
    </Stack>
  );
}

// ------------------------------------------------------------
// Main Component
// ------------------------------------------------------------
export default function TabsLayout() {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [feedIndex, setFeedIndex] = useState(0);

  const { health, debugMode } = useContext(FeedStatusContext);
  const feedHealth = health?.feeds || {};

  const globalDebug =
    debugMode === "debug_feeds" ||
    debugMode === "debug_health" ||
    new URLSearchParams(window.location.search).get("debug") === "true";

  const activeCategory = FEED_CATEGORIES[categoryIndex];

  // ------------------------------------------------------------
  // Use helper functions
  // ------------------------------------------------------------
  const feedsForActiveCategory = useMemo(() => {
    if (!activeCategory) return [];

    if (activeCategory.id === "legacy_crypto") {
      return getLegacyCryptoFeeds();
    }

    return getFeedsForCategory(activeCategory.id);
  }, [activeCategory]);

  // ------------------------------------------------------------
  // Finance ordering override
  // ------------------------------------------------------------
  const financeOrder = [
    "marketwatch_finance",
    "yahoo_finance",
    "investing_markets",
    "wsj_markets",
    "cnbc_markets",
    "ft_markets"
  ];

  const orderedFeeds =
    activeCategory?.id === "finance"
      ? financeOrder.map((id) => FEEDS[id]).filter(Boolean)
      : feedsForActiveCategory;

  const activeFeed = orderedFeeds[feedIndex] || orderedFeeds[0];
  const activeSymbol = activeFeed?.symbol ?? "btc";

  // ------------------------------------------------------------
  // Debug logging
  // ------------------------------------------------------------
  useEffect(() => {
    if (!globalDebug) return;

    console.log("[TabsLayout] activeCategory:", activeCategory?.id);
    console.log("[TabsLayout] feedsForActiveCategory:", feedsForActiveCategory);
    console.log("[TabsLayout] orderedFeeds:", orderedFeeds);
    console.log("[TabsLayout] activeFeed:", activeFeed?.id);
  }, [
    activeCategory,
    feedsForActiveCategory,
    orderedFeeds,
    activeFeed,
    globalDebug
  ]);

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {/* Category Tabs */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1 }}
      >
        <Tabs
          value={categoryIndex}
          onChange={(_, idx) => {
            setCategoryIndex(idx);
            setFeedIndex(0);
          }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: "divider", flex: 1 }}
        >
          {FEED_CATEGORIES.map((cat, idx) => (
            <Tab key={cat.id} value={idx} label={cat.label} />
          ))}
        </Tabs>

        {globalDebug && (
          <Chip
            label="Debug ON"
            color="secondary"
            size="small"
            sx={{ ml: 2, fontSize: 11 }}
          />
        )}
      </Stack>

      {/* Content Panel */}
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 2,
          p: 3,
          mt: 1
        }}
      >
        {/* Feed Tabs */}
        <Tabs
          value={feedIndex}
          onChange={(_, idx) => setFeedIndex(idx)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
        >
          {orderedFeeds.map((feed, idx) => (
            <Tab
              key={feed.id}
              value={idx}
              label={
                <FeedTabLabel
                  feed={feed}
                  status={feedHealth[feed.id] || "unknown"}
                />
              }
            />
          ))}
        </Tabs>

        {/* Feed + Chart */}
        <Box sx={{ display: "flex", flexDirection: "row", gap: 3, mt: 1 }}>
          <Box
            sx={{
              flex: 2,
              maxWidth: "800px",
              overflowY: "auto",
              maxHeight: "70vh"
            }}
          >
            {activeFeed ? (
              <RSSFeed feedId={activeFeed.id} />
            ) : (
              <Typography>No feed selected.</Typography>
            )}
          </Box>

          <Box sx={{ flex: 1, minHeight: 300 }}>
            <MarketChart symbol={activeSymbol} />
          </Box>
        </Box>
      </Box>

      <FeedStatusBar />
    </Box>
  );
}
