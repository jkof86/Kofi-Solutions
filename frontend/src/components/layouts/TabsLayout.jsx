import React, {
  useContext,
  useMemo,
  useState,
  useEffect
} from "react";

import { Box, Tabs, Tab, Typography } from "@mui/material";

import { FeedStatusContext } from "../../context/FeedStatusContext";
import { FEEDS } from "../../data/feedsMap";
import RSSFeed from "..//newsfeed/RSSFeed";
import { categoryLabelMap } from "../../data/labelMap";
import { feedLabelMap } from "../../data/labelMap";

console.log("TabsLayout v1.205 — Category + Feed Label Maps Enabled");

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
  // BUILD CATEGORIES (sorted by label)
  // ------------------------------------------------------------
  const categories = useMemo(() => {
    const map = {};

    for (const [feedId, meta] of Object.entries(FEEDS)) {
      const cat = meta.category || "other";
      if (!map[cat]) map[cat] = [];
      map[cat].push({ feedId, ...meta });
    }

    return Object.keys(map)
      .sort((a, b) => {
        const labelA = categoryLabelMap[a] || a;
        const labelB = categoryLabelMap[b] || b;
        return labelA.localeCompare(labelB);
      })
      .reduce((acc, key) => {
        acc[key] = map[key];
        return acc;
      }, {});
  }, [FEEDS]);

  const categoryList = Object.keys(categories);
  const categoryIndex = categoryList.indexOf(activeCategory);
  const safeCategory =
    categoryIndex === -1 ? categoryList[0] : activeCategory;

  const feedsInCategory = categories[safeCategory] || [];
  const [feedIndex, setFeedIndex] = useState(0);

  const filteredFeeds = useMemo(() => {
    if (!strictMode) return feedsInCategory;

    return feedsInCategory.filter((f) => {
      const s = status[f.feedId];
      if (!s) return true;
      return s === "ok" || s === "json" || s === "fallback";
    });
  }, [feedsInCategory, status, strictMode]);

  useEffect(() => {
    setFeedIndex(0);
  }, [safeCategory, filteredFeeds.length]);

  const activeFeed = filteredFeeds[feedIndex] || null;
  const activeSymbol =
    typeof activeFeed?.symbol === "string" && activeFeed.symbol.trim()
      ? activeFeed.symbol.trim().toLowerCase()
      : "btc";

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 1 }}>
        <Tabs
          value={categoryIndex === -1 ? 0 : categoryIndex}
          onChange={(_, v) => setActiveCategory(categoryList[v])}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": { color: "#333", fontWeight: 600 },
            "& .Mui-selected": { color: "#000 !important" }
          }}
        >
          {categoryList.map((cat) => (
            <Tab key={cat} label={categoryLabelMap[cat] || cat} />
          ))}
        </Tabs>
      </Box>

      {/* FEED TABS — NOW USING feedLabelMap */}
      <Tabs
        value={feedIndex}
        onChange={(_, v) => setFeedIndex(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 1,
          "& .MuiTab-root": { color: "#333 !important", fontWeight: 600 },
          "& .Mui-selected": { color: "#000 !important" }
        }}
      >
        {filteredFeeds.map((f) => (
          <Tab
            key={f.feedId}
            label={feedLabelMap[f.feedId] || f.label || f.feedId}
          />
        ))}
      </Tabs>

      {filteredFeeds.map((f, i) => (
        <TabPanel key={f.feedId} value={feedIndex} index={i}>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Box sx={{ flex: 2 }}>
              <RSSFeed feedId={f.feedId} categoryLabel={safeCategory} />
            </Box>
          </Box>
        </TabPanel>
      ))}

      {filteredFeeds.length === 0 && (
        <Box sx={{ p: 2 }}>
          <Typography>No healthy feeds in this category.</Typography>
        </Box>
      )}
    </Box>
  );
}
