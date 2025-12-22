// ------------------------------------------------------------
// FeedCard.jsx — Enhanced with:
// - Tooltip showing root domain
// - Visit Site badge for fallback feeds
// - Per-feed custom root URLs
// - Last updated timestamp
// - Retry Feed button for fallback feeds
// ------------------------------------------------------------

import React, { useState, useContext } from "react";
import { Box, Typography, Chip, Button, Tooltip } from "@mui/material";
import { GlobalRefreshContext } from "../context/GlobalRefreshContext";

// ------------------------------------------------------------
// Custom root URLs per feed
// ------------------------------------------------------------
const ROOT_OVERRIDES = {
  ct: "https://cointelegraph.com",
  cb: "https://blog.coinbase.com",
  mw: "https://www.marketwatch.com",
  inv: "https://www.investopedia.com",
  sa: "https://seekingalpha.com"
};

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
const getRootDomain = (url) => {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.hostname}`;
  } catch {
    return url;
  }
};

const getFavicon = (url) => {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return null;
  }
};

const FeedCard = ({ item, source, category }) => {
  const { loadFeed } = useContext(GlobalRefreshContext);

  const {
    title,
    url,
    summary,
    content_html,
    date_published,
    image
  } = item;

  const [expanded, setExpanded] = useState(false);

  // ------------------------------------------------------------
  // Fallback detection
  // ------------------------------------------------------------
  const isFallback =
    title?.includes("Unavailable") ||
    summary?.toLowerCase?.().includes("unavailable") ||
    !date_published;

  // ------------------------------------------------------------
  // Determine final link target
  // ------------------------------------------------------------
  const rootDomain =
    ROOT_OVERRIDES[source] || getRootDomain(url);

  const favicon = getFavicon(rootDomain);
  const htmlContent = content_html || summary || "";

  const shortContent =
    htmlContent.length > 500 && !expanded
      ? htmlContent.slice(0, 500) + "..."
      : htmlContent;

  // ------------------------------------------------------------
  // Last updated timestamp
  // ------------------------------------------------------------
  const lastUpdated = isFallback
    ? "Last updated: Just now (fallback)"
    : date_published
      ? `Last updated: ${date_published}`
      : null;

  return (
    <Tooltip title={rootDomain} arrow placement="top">
      <a
        href={rootDomain}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            backgroundColor: "background.paper",
            boxShadow: 1,
            transition: "0.2s",
            cursor: "pointer",
            "&:hover": { boxShadow: 4 }
          }}
        >
          {/* Title + favicon */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
            {favicon && (
              <img
                src={favicon}
                alt=""
                style={{ width: 20, height: 20, borderRadius: 4 }}
              />
            )}

            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>

            {/* Visit Site badge for fallback feeds */}
            {isFallback && (
              <Chip
                label="Visit Site"
                size="small"
                color="secondary"
                sx={{ ml: 1, fontSize: "0.65rem", fontWeight: 600 }}
              />
            )}
          </Box>

          {/* Metadata */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            {source && (
              <Chip
                label={source.toUpperCase()}
                size="small"
                sx={{ fontSize: "0.65rem", fontWeight: 600, opacity: 0.8 }}
              />
            )}

            {category && (
              <Chip
                label={category}
                size="small"
                color="primary"
                sx={{ fontSize: "0.65rem", fontWeight: 600 }}
              />
            )}
          </Box>

          {/* Last updated timestamp */}
          {lastUpdated && (
            <Typography variant="caption" sx={{ opacity: 0.7, display: "block", mb: 1 }}>
              {lastUpdated}
            </Typography>
          )}

          {/* Main image */}
          {image && (
            <Box sx={{ my: 1 }}>
              <img
                src={image}
                alt=""
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: 6,
                  display: "block"
                }}
              />
            </Box>
          )}

          {/* Summary */}
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "normal",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
              lineHeight: 1.5,
              "& p": { mb: 1 },
              "& img": { maxWidth: "100%", borderRadius: 4 }
            }}
            dangerouslySetInnerHTML={{ __html: shortContent }}
          />

          {/* Expand/Collapse — disabled for fallback feeds */}
          {!isFallback && htmlContent.length > 500 && (
            <Button
              size="small"
              sx={{ mt: 1 }}
              onClick={(e) => {
                e.preventDefault();
                setExpanded(prev => !prev);
              }}
            >
              {expanded ? "Show Less" : "Read More"}
            </Button>
          )}

          {/* Retry Feed button — only for fallback feeds */}
          {isFallback && (
            <Button
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
              onClick={(e) => {
                e.preventDefault();
                loadFeed(source);
              }}
            >
              Retry Feed
            </Button>
          )}
        </Box>
      </a>
    </Tooltip>
  );
};

export default FeedCard;
