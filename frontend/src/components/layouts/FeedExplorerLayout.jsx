// ------------------------------------------------------------
// FeedExplorerLayout.jsx — v2.2.6
// Object.keys patch + full guards
// ------------------------------------------------------------

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  MenuItem,
  FormControl,
  Select,
  InputLabel
} from "@mui/material";

import { FEED_CATEGORIES } from "../../data/feedCategories";
import { FEEDS } from "../../data/feedsMap";
import { categoryLabelMap } from "../../data/labelMap";

import RSSFeed from "../newsfeed/RSSFeed";
import MarketChart from "../newsfeed/MarketChart";

export default function FeedExplorerLayout() {
  const categoryList = Object.keys(FEED_CATEGORIES);
  const [category, setCategory] = useState(categoryList[0] || "");
  const [feedIndex, setFeedIndex] = useState(0);

  // ------------------------------------------------------------
  // Safely filter feeds by category
  // ------------------------------------------------------------
  const feedsForCategory = useMemo(() => {
    if (!FEEDS || typeof FEEDS !== "object") return [];

    return Object.values(FEEDS).filter(
      (f) => f && f.category === category
    );
  }, [category]);

  // ------------------------------------------------------------
  // Safely derive active feed
  // ------------------------------------------------------------
  const activeFeed =
    feedsForCategory.length > 0
      ? feedsForCategory[feedIndex] || feedsForCategory[0]
      : null;

  const activeSymbol =
    typeof activeFeed?.symbol === "string" && activeFeed.symbol.trim()
      ? activeFeed.symbol.trim().toLowerCase()
      : "btc";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Category dropdown */}
      <FormControl size="small" sx={{ width: 260 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          label="Category"
          onChange={(e) => {
            setCategory(e.target.value);
            setFeedIndex(0);
          }}
        >
          {categoryList.map((catId) => (
            <MenuItem key={catId} value={catId}>
              {categoryLabelMap[catId] || catId}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 3‑pane layout */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "260px 1fr 320px",
          gap: 2,
          width: "100%",
          minHeight: "70vh"
        }}
      >
        {/* Left: feed list */}
        <Box
          sx={{
            border: "1px solid #ddd",
            borderRadius: 2,
            overflowY: "auto",
            backgroundColor: "#fafafa",
            p: 1
          }}
        >
          {feedsForCategory.length === 0 && (
            <Typography sx={{ p: 1, opacity: 0.7 }}>
              No feeds in this category.
            </Typography>
          )}

          {feedsForCategory.map((feed, idx) => (
            <Box
              key={feed?.id || idx}
              onClick={() => setFeedIndex(idx)}
              sx={{
                p: 1,
                mb: 1,
                borderRadius: 1,
                cursor: "pointer",
                backgroundColor: idx === feedIndex ? "#e3f2fd" : "transparent",
                "&:hover": { backgroundColor: "#f0f0f0" }
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {feed?.label || feed?.id || "Unnamed Feed"}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Middle: feed content */}
        <Box
          sx={{
            border: "1px solid #ddd",
            borderRadius: 2,
            overflowY: "auto",
            p: 2,
            backgroundColor: "#fff"
          }}
        >
          {!activeFeed?.id && (
            <Typography>No valid feed selected.</Typography>
          )}

          {activeFeed?.id && (
            <RSSFeed name={activeFeed.id} />
          )}
        </Box>

        {/* Right: market chart */}
        <Box
          sx={{
            border: "1px solid #ddd",
            borderRadius: 2,
            backgroundColor: "#fff",
            p: 2,
            overflow: "hidden"
          }}
        >
          {!activeFeed?.id && (
            <Typography>Select a feed to view market data.</Typography>
          )}

          {activeFeed?.id && (
            <MarketChart symbol={activeSymbol} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
