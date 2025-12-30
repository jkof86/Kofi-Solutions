// ------------------------------------------------------------
// TabsLayout.jsx — v1.190 (Backend‑Driven Categories + Feeds)
// ------------------------------------------------------------
//
// This component is the heart of the RSS dashboard UI.
//
// Responsibilities:
//   ✓ Build categories dynamically from FEEDS map
//   ✓ Render category tabs (top row)
//   ✓ Render feed tabs (second row)
//   ✓ Auto‑select first healthy feed when switching categories
//   ✓ Filter feeds by health (strict/soft mode)
//   ✓ Render RSSFeed panels for each feed
//
// Architectural Notes:
//   • FEEDS is the single source of truth for categories + metadata
//   • FeedStatusContext supplies health + strictMode
//   • RSSFeed handles loading + fallback for each feedId
//   • This replaces all legacy CategoryTabs.jsx logic
//
// ------------------------------------------------------------

import React, {
  useContext,
  useMemo,
  useState,
  useEffect
} from "react";

import { Box, Tabs, Tab, Typography } from "@mui/material";

import { FeedStatusContext } from "../../context/FeedStatusContext";
import { FEEDS } from "../../data/feedsMap";   // FEEDS = { feedId: { name, url, category, ... } }
import RSSFeed from "../RSSFeed";

console.log("TabsLayout v1.190 loaded");

/**
 * TabPanel
 * Simple wrapper for MUI tab content.
 * Only renders children when the tab is active.
 */
function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index} style={{ width: "100%" }}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function TabsLayout() {
  const { status, strictMode } = useContext(FeedStatusContext);

  // ------------------------------------------------------------
  // Build categories dynamically from FEEDS map
  // ------------------------------------------------------------
  //
  // FEEDS is a flat object:
  //   { "cnn": { name, url, category: "news" }, ... }
  //
  // We convert it into:
  //   {
  //     news: [ { feedId, name, url, ... }, ... ],
  //     tech: [ ... ],
  //     crypto: [ ... ]
  //   }
  //
  const categories = useMemo(() => {
    const map = {};

    for (const [feedId, meta] of Object.entries(FEEDS)) {
      const cat = meta.category || "other";
      if (!map[cat]) map[cat] = [];
      map[cat].push({ feedId, ...meta });
    }

    // Sort categories alphabetically for consistent UI
    return Object.keys(map)
      .sort()
      .reduce((acc, key) => {
        acc[key] = map[key];
        return acc;
      }, {});
  }, []);

  const categoryList = Object.keys(categories);

  // ------------------------------------------------------------
  // UI state
  // ------------------------------------------------------------
  //
  // categoryIndex → which category tab is active
  // feedIndex     → which feed tab inside that category is active
  //
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [feedIndex, setFeedIndex] = useState(0);

  const currentCategory = categoryList[categoryIndex];
  const feedsInCategory = categories[currentCategory] || [];

  // ------------------------------------------------------------
  // Filter feeds by health (strict/soft mode)
  // ------------------------------------------------------------
  //
  // strictMode = true:
  //   Only show feeds with status "ok" or "json"
  //
  // strictMode = false:
  //   Show all feeds regardless of health
  //
  const filteredFeeds = useMemo(() => {
    if (!strictMode) return feedsInCategory;

    return feedsInCategory.filter((f) => {
      const s = status[f.feedId];
      return s === "ok" || s === "json";
    });
  }, [feedsInCategory, status, strictMode]);

  // ------------------------------------------------------------
  // Auto-select first healthy feed when category changes
  // ------------------------------------------------------------
  //
  // When switching categories:
  //   - Always reset feedIndex to 0
  //   - This ensures RSSFeed loads the first available feed
  //
  useEffect(() => {
    setFeedIndex(0);
  }, [categoryIndex, filteredFeeds.length]);

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  return (
    <Box sx={{ width: "100%" }}>

      {/* ------------------------------------------------------------
          Category Tabs (top row)
         ------------------------------------------------------------ */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          {currentCategory.toUpperCase()}
        </Typography>

        <Tabs
          value={categoryIndex}
          onChange={(_, v) => setCategoryIndex(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categoryList.map((cat) => (
            <Tab key={cat} label={cat.toUpperCase()} />
          ))}
        </Tabs>
      </Box>

      {/* ------------------------------------------------------------
          Feed Tabs (second row)
         ------------------------------------------------------------ */}
      <Tabs
        value={feedIndex}
        onChange={(_, v) => setFeedIndex(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: "divider", mb: 1 }}
      >
        {filteredFeeds.map((f) => (
          <Tab key={f.feedId} label={f.name} />
        ))}
      </Tabs>

      {/* ------------------------------------------------------------
          Feed Panels (RSSFeed instances)
         ------------------------------------------------------------ */}
      {filteredFeeds.map((f, i) => (
        <TabPanel key={f.feedId} value={feedIndex} index={i}>
          <RSSFeed
            name={f.feedId}
            categoryLabel={currentCategory}
          />
        </TabPanel>
      ))}

      {/* ------------------------------------------------------------
          Empty State (no healthy feeds)
         ------------------------------------------------------------ */}
      {filteredFeeds.length === 0 && (
        <Box sx={{ p: 2 }}>
          <Typography>No healthy feeds in this category.</Typography>
        </Box>
      )}
    </Box>
  );
}
