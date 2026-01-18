// ------------------------------------------------------------
// FeedList.jsx — v1.0 (StrictMode-Aware Feed Renderer)
// ------------------------------------------------------------

import React, { useContext } from "react";
import { Stack, Typography } from "@mui/material";

import { FeedStatusContext } from "../../context/FeedStatusContext";
import RSSFeed from "./RSSFeed";

export default function FeedList({ feeds, categoryLabel, symbol }) {
  const { status, strictMode } = useContext(FeedStatusContext);

  if (!feeds || feeds.length === 0) {
    return (
      <Typography variant="body2" sx={{ opacity: 0.6 }}>
        No feeds available for this category.
      </Typography>
    );
  }

  const visibleFeeds = feeds.filter((feed) => {
    const s = status?.[feed.id];
    if (!strictMode) return true;
    return s === "ok" || s === "json" || s === "fallback";
  });

  return (
    <Stack spacing={3}>
      {visibleFeeds.map((feed) => (
        <RSSFeed
          key={feed.id}
          feedId={feed.id}
          feedMeta={feed}
          feedStatus={status?.[feed.id]}
          categoryLabel={categoryLabel}
          symbol={symbol}
        />
      ))}
    </Stack>
  );
}
