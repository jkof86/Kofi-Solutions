// ------------------------------------------------------------
// TabsLayout.jsx — v1.171 (Corrected + Stable)
// ------------------------------------------------------------
//
// Fixes:
//   • useEffect moved INSIDE component (your version was invalid)
//   • RSSFeed now receives feedId prop (was incorrectly "name")
//   • Category switching resets feedIndex safely
//   • Feed switching logs correctly
//   • MarketChart receives correct symbol
//   • Health badges mapped correctly
//   • Layout stable for Recharts
//
// ------------------------------------------------------------

import React, { useEffect, useState, useMemo, useContext } from "react";
import { Tabs, Tab, Box, Typography, Stack, Avatar } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { FEED_CATEGORIES } from "../../data/feedCategories";
import {
  getFeedsForCategory,
  getLegacyCryptoFeeds
} from "../../data/feedsMap";

import { FeedStatusContext } from "../../context/FeedStatusContext";

import RSSFeed from "../RSSFeed";
import MarketChart from "../MarketChart";
import FeedStatusBar from "../FeedStatusBar";

// ------------------------------------------------------------
// Feed Tab Label Component
// ------------------------------------------------------------
function FeedTabLabel({ feed, status }) {
  const initials = feed.label
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  let icon = null;
  if (status === "ok") icon = <CheckCircleIcon color="success" fontSize="small" />;
  else if (status === "fallback" || status === "json")
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
// Main Layout Component
// ------------------------------------------------------------
export default function TabsLayout() {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [feedIndex, setFeedIndex] = useState(0);

  const { health } = useContext(FeedStatusContext);
  const feedHealth = health?.feeds || {};

  const activeCategory = FEED_CATEGORIES[categoryIndex];

  const feedsForActiveCategory = useMemo(() => {
    if (!activeCategory) return [];
    return activeCategory.id === "legacy_crypto"
      ? getLegacyCryptoFeeds()
      : getFeedsForCategory(activeCategory.id);
  }, [activeCategory]);

  const activeFeed =
    feedsForActiveCategory[feedIndex] || feedsForActiveCategory[0];

  const activeSymbol = activeFeed?.symbol ?? "btc";

  // ------------------------------------------------------------
  // Debug logging (correct placement)
  // ------------------------------------------------------------
  useEffect(() => {
    console.log("[TabsLayout] activeCategory:", activeCategory?.id);
    console.log("[TabsLayout] feedsForActiveCategory:", feedsForActiveCategory);
    console.log("[TabsLayout] activeFeed:", activeFeed?.id);
    console.log("[TabsLayout] activeSymbol:", activeSymbol);
  }, [activeCategory, feedsForActiveCategory, activeFeed, activeSymbol]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {/* Category Tabs */}
      <Tabs
        value={categoryIndex}
        onChange={(_, idx) => {
          setCategoryIndex(idx);
          setFeedIndex(0); // reset feed index on category change
        }}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
      >
        {FEED_CATEGORIES.map((cat, idx) => (
          <Tab key={cat.id} value={idx} label={cat.label} />
        ))}
      </Tabs>

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
          {feedsForActiveCategory.map((feed, idx) => (
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

          <Box sx={{ flex: 1, minHeight: 300 }}> {/* FIXED for Recharts */}
            <MarketChart symbol={activeSymbol} />
          </Box>
        </Box>
      </Box>

      {/* Bottom Health Bar */}
      <FeedStatusBar />
    </Box>
  );
}
