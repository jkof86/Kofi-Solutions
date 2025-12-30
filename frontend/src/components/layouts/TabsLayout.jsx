// ------------------------------------------------------------
// TabsLayout.jsx — v1.180 (Flat FEEDS + Sanitized + Stable)
// ------------------------------------------------------------
//
// Major Fixes:
//   • Uses CLEAN_FEEDS (flat) instead of FEEDS
//   • Resolves feeds via FEED_CATEGORIES → CLEAN_FEEDS
//   • Fixes “No feed selected”
//   • Fixes ticker stuck on crypto
//   • Fixes MarketChart symbol selection
//   • Implements default symbols per category (Option A)
//   • Fully compatible with FEEDS v1.180 + sanitizeFeeds v1.180
//
// ------------------------------------------------------------

import React, { useState, useMemo, useContext } from "react";
import { Tabs, Tab, Box, Typography, Stack, Chip, Avatar } from "@mui/material";

import { FEED_CATEGORIES } from "../../data/feedCategories";
import { FEEDS } from "../../data/feedsMap"; // category → array of feeds
import { sanitizeFeeds } from "../../utils/sanitizeFeeds";

import { FeedStatusContext } from "../../context/FeedStatusContext";
import RSSFeed from "../RSSFeed";
import MarketChart from "../MarketChart";
import FeedStatusBar from "../FeedStatusBar";

// ------------------------------------------------------------
// 1. Sanitize + flatten FEEDS
// ------------------------------------------------------------
const CLEAN_FEEDS = sanitizeFeeds(FEEDS); 
// CLEAN_FEEDS = { coindesk: {...}, cointelegraph: {...}, ... }

// ------------------------------------------------------------
// 2. Default symbols per category (Option A)
// ------------------------------------------------------------
const CATEGORY_DEFAULT_SYMBOL = {
  crypto: "btc",
  finance: "spy",
  news: "spy",
  alternative_news: "spy",
  java: "msft",
  spring: "msft",
  aws: "amzn",
  react: "meta",
  iot: "qcom",
  cybersecurity: "msft",
  sports: "manu",
  infowars: "spy"
};

// ------------------------------------------------------------
// FeedTabLabel (safe + v1.180 compatible)
// ------------------------------------------------------------
function FeedTabLabel({ feed, status }) {
  if (!feed || !feed.name) {
    return (
      <Typography variant="body2" color="error">
        Unknown Feed
      </Typography>
    );
  }

  const initials = feed.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  let color = "error";
  if (status === "ok" || status === "json") color = "success";
  else if (status === "fallback") color = "warning";

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Avatar sx={{ width: 20, height: 20, fontSize: 10 }}>{initials}</Avatar>
      <Typography variant="body2">{feed.name}</Typography>
      <Chip size="small" color={color} label={status} sx={{ height: 20 }} />
    </Stack>
  );
}

// ------------------------------------------------------------
// Main Component
// ------------------------------------------------------------
export default function TabsLayout() {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [feedIndex, setFeedIndex] = useState(0);

  const { health } = useContext(FeedStatusContext);
  const feedHealth = health?.feeds || {};

  // Active category object
  const activeCategory = FEED_CATEGORIES[categoryIndex];

  // ------------------------------------------------------------
  // 3. Resolve feed objects for this category (via CLEAN_FEEDS)
  // ------------------------------------------------------------
  const feedsForCategory = useMemo(() => {
    if (!activeCategory) return [];

    return activeCategory.feeds
      .map((id) => CLEAN_FEEDS[id])
      .filter(Boolean); // remove missing feeds
  }, [activeCategory]);

  // ------------------------------------------------------------
  // 4. Finance ordering override (feed IDs)
  // ------------------------------------------------------------
  const financeOrder = [
    "marketwatch",
    "yahoo_finance",
    "investing",
    "wsj_markets",
    "cnbc_markets",
    "ft_markets"
  ];

  const orderedFeeds =
    activeCategory?.id === "finance"
      ? financeOrder.map((id) => CLEAN_FEEDS[id]).filter(Boolean)
      : feedsForCategory;

  // ------------------------------------------------------------
  // 5. Active feed + symbol resolution
  // ------------------------------------------------------------
  const activeFeed = orderedFeeds[feedIndex] || orderedFeeds[0];

  // If feed has no symbol, use category default
  const activeSymbol =
    activeFeed?.symbol ||
    CATEGORY_DEFAULT_SYMBOL[activeCategory?.id] ||
    "btc";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {/* ------------------------------------------------------------
          Category Tabs
         ------------------------------------------------------------ */}
      <Tabs
        value={categoryIndex}
        onChange={(_, idx) => {
          setCategoryIndex(idx);
          setFeedIndex(0); // reset feed index on category switch
        }}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        {FEED_CATEGORIES.map((cat, idx) => (
          <Tab key={cat.id} value={idx} label={cat.label} />
        ))}
      </Tabs>

      {/* ------------------------------------------------------------
          Feed Tabs
         ------------------------------------------------------------ */}
      <Tabs
        value={feedIndex}
        onChange={(_, idx) => setFeedIndex(idx)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}
      >
        {orderedFeeds.map((feed, idx) => (
          <Tab
            key={feed.id}
            value={idx}
            label={
              <FeedTabLabel
                feed={feed}
                status={feedHealth[feed.id]?.status || "unknown"}
              />
            }
          />
        ))}
      </Tabs>

      {/* ------------------------------------------------------------
          Feed Content + Market Chart
         ------------------------------------------------------------ */}
      <Box sx={{ display: "flex", flexDirection: "row", gap: 3, mt: 2 }}>
        <Box sx={{ flex: 2, maxHeight: "70vh", overflowY: "auto" }}>
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

      <FeedStatusBar />
    </Box>
  );
}
