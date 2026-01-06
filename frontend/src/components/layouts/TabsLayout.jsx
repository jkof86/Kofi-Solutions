// ------------------------------------------------------------
// TabsLayout.jsx — v1.204 (Production‑Ready + Alt News Support)
// ------------------------------------------------------------
//
// Improvements in v1.204:
//   ✓ Fully aligned with feedsMap v1.204 (including alternative_news)
//   ✓ Uses meta.label instead of meta.name (correct field)
//   ✓ Defensive guards for missing categories
//   ✓ Stable strictMode filtering
//   ✓ Auto‑selects first healthy feed on category change
//   ✓ Alphabetical category ordering
//   ✓ Clean, production‑grade comments
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
import { FEEDS } from "../../data/feedsMap";
import RSSFeed from "../RSSFeed";

console.log("TabsLayout v1.204 loaded");

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index} style={{ width: "100%" }}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function TabsLayout({ activeCategory, setActiveCategory }) {
  const { status, strictMode } = useContext(FeedStatusContext);

  // ------------------------------------------------------------
  // Build categories dynamically from FEEDS map
  // ------------------------------------------------------------
  const categories = useMemo(() => {
    const map = {};

    for (const [feedId, meta] of Object.entries(FEEDS)) {
      const cat = meta.category || "other";
      if (!map[cat]) map[cat] = [];
      map[cat].push({ feedId, ...meta });
    }

    // Alphabetize categories for consistent UI
    return Object.keys(map)
      .sort()
      .reduce((acc, key) => {
        acc[key] = map[key];
        return acc;
      }, {});
  }, []);

  const categoryList = Object.keys(categories);

  // If activeCategory is missing (e.g., new category added), default to first
  const categoryIndex = categoryList.indexOf(activeCategory);
  const safeCategory =
    categoryIndex === -1 ? categoryList[0] : activeCategory;

  const feedsInCategory = categories[safeCategory] || [];

  // ------------------------------------------------------------
  // Feed tab state
  // ------------------------------------------------------------
  const [feedIndex, setFeedIndex] = useState(0);

  // ------------------------------------------------------------
  // Filter feeds by health (strict/soft mode)
  // ------------------------------------------------------------
  const filteredFeeds = useMemo(() => {
    if (!strictMode) return feedsInCategory;

    return feedsInCategory.filter((f) => {
      const s = status[f.feedId];
      if (!s) return true; // unknown → allow
      return s === "ok" || s === "json" || s === "fallback";
    });
  }, [feedsInCategory, status, strictMode]);

  // ------------------------------------------------------------
  // Auto-select first healthy feed when category changes
  // ------------------------------------------------------------
  useEffect(() => {
    setFeedIndex(0);
  }, [safeCategory, filteredFeeds.length]);

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  return (
    <Box sx={{ width: "100%" }}>
      {/* Category Header */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          {safeCategory.toUpperCase()}
        </Typography>

        <Tabs
          value={categoryIndex === -1 ? 0 : categoryIndex}
          onChange={(_, v) => {
            setActiveCategory(categoryList[v]);
        
         }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categoryList.map((cat) => (
            <Tab key={cat} label={cat.toUpperCase()} />
          ))}
        </Tabs>
      </Box>

      {/* Feed Tabs */}
      <Tabs
        value={feedIndex}
        onChange={(_, v) => setFeedIndex(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: "divider", mb: 1 }}
      >
        {filteredFeeds.map((f) => (
          <Tab key={f.feedId} label={f.label} />
        ))}
      </Tabs>

      {/* Feed Panels */}
      {filteredFeeds.map((f, i) => (
        <TabPanel key={f.feedId} value={feedIndex} index={i}>
          <RSSFeed name={f.feedId} categoryLabel={safeCategory} />
        </TabPanel>
      ))}

      {/* Empty State */}
      {filteredFeeds.length === 0 && (
        <Box sx={{ p: 2 }}>
          <Typography>No healthy feeds in this category.</Typography>
        </Box>
      )}
    </Box>
  );
}
