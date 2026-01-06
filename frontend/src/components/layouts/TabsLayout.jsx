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
import MarketChart from "../MarketChart";

console.log("TabsLayout v1.204 + Chart + Symbol Fix loaded");

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index} style={{ width: "100%" }}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function TabsLayout({ activeCategory, setActiveCategory }) {
  const { status, strictMode } = useContext(FeedStatusContext);

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

  console.log("Active feed:", activeFeed);
  console.log("Active symbol:", activeSymbol);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          {safeCategory.toUpperCase()}
        </Typography>

        <Tabs
          value={categoryIndex === -1 ? 0 : categoryIndex}
          onChange={(_, v) => setActiveCategory(categoryList[v])}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              color: "#333",
              fontWeight: 600
            },
            "& .Mui-selected": {
              color: "#000 !important"
            }
          }}
        >
          {categoryList.map((cat) => (
            <Tab key={cat} label={cat.toUpperCase()} />
          ))}
        </Tabs>
      </Box>

      <Tabs
        value={feedIndex}
        onChange={(_, v) => setFeedIndex(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 1,
          "& .MuiTab-root": {
            color: "#333 !important",
            fontWeight: 600
          },
          "& .Mui-selected": {
            color: "#000 !important"
          }
        }}
      >
        {filteredFeeds.map((f) => (
          <Tab
            key={f.feedId}
            label={f.label?.trim() || f.feedId?.toUpperCase() || "UNKNOWN"}
          />
        ))}
      </Tabs>

      {filteredFeeds.map((f, i) => (
        <TabPanel key={f.feedId} value={feedIndex} index={i}>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
            <Box sx={{ flex: 2 }}>
              <RSSFeed feedId={f.feedId} categoryLabel={safeCategory} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <MarketChart symbol={f.symbol || "btc"} />
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
