// ------------------------------------------------------------
// RSSFeed.jsx
//
// Phase 3 Responsibilities:
// - Fetches feed data when feed name changes or global refresh fires
// - Uses per-feed loadFeed() from GlobalRefreshContext
// - Updates FeedStatusContext immediately
// - Notifies parent via onFeedLoaded()
// - Caps initial articles to 3 with Load More
// - Fully reactive: updates instantly per feed
// ------------------------------------------------------------

import React, {
  useEffect,
  useState,
  useContext,
  useMemo
} from "react";

import {
  Box,
  Typography,
  CircularProgress,
  Button
} from "@mui/material";

import { GlobalRefreshContext } from "../context/GlobalRefreshContext";
import { FeedStatusContext } from "../context/FeedStatusContext";
import FeedCard from "./FeedCard";

const DEFAULT_FEED_CAP = 3;

const RSSFeed = ({ name, feedLabel, categoryLabel, onFeedLoaded }) => {
  const { refreshVersion, loadFeed } = useContext(GlobalRefreshContext);
  const { status } = useContext(FeedStatusContext);

  const [items, setItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(DEFAULT_FEED_CAP);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Derived error count (optional UI)
  const errorCount = useMemo(() => {
    return Object.values(status).filter(s => s === "error").length;
  }, [status]);

  // ------------------------------------------------------------
  // ✅ Fetch feed whenever:
  //    - feed name changes
  //    - global refresh occurs
  // ------------------------------------------------------------
  useEffect(() => {
    if (!name) return;

    const fetchFeed = async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        let proxy = process.env.RSS_FEED_PROXY;
        const url = `https://jy4i499sj1.execute-api.us-east-1.amazonaws.com/default/RSSProxyAggregator?source=${name}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(`Feed error (${res.status}): ${data.error || "Unknown error"}`);
          setItems([]);
          return;
        }

        if (data.status !== "ok") {
          setErrorMsg(data.error || "Feed returned an error.");
          setItems([]);
          return;
        }

        if (!data.items || data.items.length === 0) {
          setErrorMsg("No articles found.");
          setItems([]);
          return;
        }

        setItems(data.items);
        setVisibleCount(DEFAULT_FEED_CAP);

        if (onFeedLoaded) onFeedLoaded(name);
      } catch (err) {
        setErrorMsg("Network error: " + err.message);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [name, refreshVersion, onFeedLoaded]);

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        {feedLabel}
        {categoryLabel ? ` — ${categoryLabel}` : ""}
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={32} />
        </Box>
      )}

      {!loading && errorMsg && (
        <Typography color="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Typography>
      )}

      {!loading &&
        !errorMsg &&
        items.slice(0, visibleCount).map((item, index) => (
          <FeedCard
            key={index}
            item={item}
            source={name}
            category={categoryLabel}
          />
        ))}

      {!loading && !errorMsg && visibleCount < items.length && (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setVisibleCount(prev => prev + 5)}
          >
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default RSSFeed;
