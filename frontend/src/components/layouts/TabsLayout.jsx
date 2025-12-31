// ------------------------------------------------------------
// TabsLayout.jsx — v1.197 (Controlled Category)
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

console.log("TabsLayout v1.197 loaded");

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

    return Object.keys(map)
      .sort()
      .reduce((acc, key) => {
        acc[key] = map[key];
        return acc;
      }, {});
  }, []);

  const categoryList = Object.keys(categories);
  const categoryIndex = categoryList.indexOf(activeCategory);
  const feedsInCategory = categories[activeCategory] || [];

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
      if (!s) return true;
      return s === "ok" || s === "json" || s === "fallback";
    });
  }, [feedsInCategory, status, strictMode]);

  // ------------------------------------------------------------
  // Auto-select first healthy feed when category changes
  // ------------------------------------------------------------
  useEffect(() => {
    setFeedIndex(0);
  }, [activeCategory, filteredFeeds.length]);

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  return (
    <Box sx={{ width: "100%" }}>
      {/* Category Tabs */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          {activeCategory.toUpperCase()}
        </Typography>

        <Tabs
          value={categoryIndex}
          onChange={(_, v) => setActiveCategory(categoryList[v])}
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
          <Tab key={f.feedId} label={f.name} />
        ))}
      </Tabs>

      {/* Feed Panels */}
      {filteredFeeds.map((f, i) => (
        <TabPanel key={f.feedId} value={feedIndex} index={i}>
          <RSSFeed name={f.feedId} categoryLabel={activeCategory} />
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
