// ------------------------------------------------------------
// TabsLayout.jsx — Category + Feed tabs + layout
// ------------------------------------------------------------

import React, { useState, useMemo } from "react";
import { Tabs, Tab, Box, Typography, Stack, Chip, Avatar } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { FEED_CATEGORIES } from "../../data/feedCategories";
import { FEEDS, getFeedsForCategory, getLegacyCryptoFeeds } from "../../data/feedsMap";
import RSSFeed from "../RSSFeed";
import MarketChart from "../MarketChart";

function CategoryTabLabel({ icon: IconComponent, label }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {IconComponent && <IconComponent fontSize="small" />}
      <Typography variant="body2">{label}</Typography>
    </Stack>
  );
}

function FeedTabLabel({ feed }) {
  const initials = feed.label
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase();

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Avatar sx={{ width: 20, height: 20, fontSize: 10 }}>{initials}</Avatar>
      <Typography variant="body2">{feed.label}</Typography>
      {feed.legacy && (
        <WarningAmberIcon fontSize="small" color="warning" />
      )}
    </Stack>
  );
}

export default function TabsLayout() {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [feedIndex, setFeedIndex] = useState(0);

  const activeCategory = FEED_CATEGORIES[categoryIndex];

  const feedsForActiveCategory = useMemo(() => {
    if (!activeCategory) return [];
    return activeCategory.id === "legacy_crypto"
      ? getLegacyCryptoFeeds()
      : getFeedsForCategory(activeCategory.id);
  }, [activeCategory]);

  const activeFeed =
    feedsForActiveCategory[feedIndex] || feedsForActiveCategory[0];
  const activeSymbol = activeFeed?.symbol || "btc";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {/* Category tabs */}
      <Tabs
        value={categoryIndex}
        onChange={(_, idx) => {
          setCategoryIndex(idx);
          setFeedIndex(0);
        }}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
      >
        {FEED_CATEGORIES.map((cat, idx) => (
          <Tab
            key={cat.id}
            value={idx}
            label={<CategoryTabLabel icon={cat.icon} label={cat.label} />}
          />
        ))}
      </Tabs>

      {/* White content panel */}
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 2,
          p: 3,
          mt: 1
        }}
      >
        {/* Feed tabs */}
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
              label={<FeedTabLabel feed={feed} />}
            />
          ))}
        </Tabs>

        {/* Feed + chart */}
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
              <RSSFeed name={activeFeed.id} />
            ) : (
              <Typography>No feed selected.</Typography>
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            <MarketChart symbol={activeSymbol} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
