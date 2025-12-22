// ------------------------------------------------------------
// TabsLayout.jsx — Phase 3 Version
//
// Responsibilities:
// - Renders feed tabs with real-time error badges
// - Switches between feeds instantly
// - Supports per-feed refresh via loadFeed()
// - Supports global refresh via refreshAll()
// - Displays feed + optional market chart side-by-side
// - Fully reactive with FeedStatusContext + GlobalRefreshContext
// ------------------------------------------------------------

import React, { useState, useContext } from "react";
import { Box, Tabs, Tab, Button, Typography } from "@mui/material";

import RSSFeed from "../RSSFeed";
import MarketChart from "../MarketChart";

import { GlobalRefreshContext } from "../../context/GlobalRefreshContext";
import { FeedStatusContext } from "../../context/FeedStatusContext";

export default function TabsLayout({ feeds, safeFeedIndex, currentCategory }) {
  // ------------------------------------------------------------
  // ✅ Track which tab is active
  // ------------------------------------------------------------
  const [tabIndex, setTabIndex] = useState(safeFeedIndex || 0);

  // ------------------------------------------------------------
  // ✅ Phase 3 Context Hooks
  // ------------------------------------------------------------
  const { loadFeed, refreshAll } = useContext(GlobalRefreshContext);
  const { status } = useContext(FeedStatusContext);

  // Ensure index is always valid
  const safeIndex = Math.min(tabIndex, feeds.length - 1);
  const activeFeed = feeds[safeIndex];

  // ------------------------------------------------------------
  // ✅ Tab switching
  // ------------------------------------------------------------
  const handleTabChange = (_, newValue) => {
    setTabIndex(newValue);

    // ✅ Immediately load the newly selected feed
    const selected = feeds[newValue];
    if (selected) {
      loadFeed(selected.name);
    }
  };

  // ------------------------------------------------------------
  // ✅ Per-feed refresh (Phase 3)
  // ------------------------------------------------------------
  const handleFeedRefresh = () => {
    if (activeFeed) {
      loadFeed(activeFeed.name);
    }
  };

  // ------------------------------------------------------------
  // ✅ Global refresh (Phase 3)
  // Streams updates one-by-one
  // ------------------------------------------------------------
  const handleGlobalRefresh = () => {
    refreshAll();
  };

  return (
    <Box>
      {/* --------------------------------------------------------
         Tabs Row
      --------------------------------------------------------- */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          gap: 2
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ flexGrow: 1 }}
        >
          {feeds.map((feed, idx) => {
            const feedState = status[feed.name];
            const isError = feedState && feedState !== "ok";

            return (
              <Tab
                key={feed.name}
                value={idx}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {feed.label}

                    {/* ✅ Real-time error badge */}
                    {isError && (
                      <Typography
                        component="span"
                        sx={{
                          color: "error.main",
                          fontWeight: 700,
                          fontSize: "0.9rem"
                        }}
                      >
                        !
                      </Typography>
                    )}
                  </Box>
                }
              />
            );
          })}
        </Tabs>

        {/* ✅ Per-feed refresh */}
        <Button variant="outlined" onClick={handleFeedRefresh}>
          Refresh Feed
        </Button>

        {/* ✅ Global refresh */}
        <Button variant="contained" onClick={handleGlobalRefresh}>
          Global Refresh
        </Button>
      </Box>

      {/* --------------------------------------------------------
         Main Layout: Feed + Chart
      --------------------------------------------------------- */}
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Left column: Feed */}
        <Box sx={{ flex: 3 }}>
          <RSSFeed
            name={activeFeed.name}
            feedLabel={activeFeed.label}
            categoryLabel={currentCategory}
          />
        </Box>

        {/* Right column: Market Chart */}
        <Box sx={{ flex: 2 }}>
          {activeFeed?.symbol && (
            <MarketChart symbol={activeFeed.symbol} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
