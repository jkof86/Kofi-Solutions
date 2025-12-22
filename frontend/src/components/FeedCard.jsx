// ------------------------------------------------------------
// FeedCard.jsx — Fixed for fallback feeds
// ------------------------------------------------------------

import React, { useState } from "react";
import { Box, Typography, Chip, Button } from "@mui/material";

const getFavicon = (url) => {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return null;
  }
};

const getRootDomain = (url) => {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.hostname}`;
  } catch {
    return url;
  }
};

const FeedCard = ({ item, source, category }) => {
  const {
    title,
    url,
    summary,
    content_html,
    date_published,
    image
  } = item;

  const [expanded, setExpanded] = useState(false);

  const favicon = url ? getFavicon(url) : null;
  const htmlContent = content_html || summary || "";


  // ✅ Correct fallback detection
  const isFallback =
    title?.includes("Unavailable") ||
    summary?.toLowerCase?.().includes("unavailable") ||
    !date_published;

  const shortContent =
    htmlContent.length > 500 && !expanded
      ? htmlContent.slice(0, 500) + "..."
      : htmlContent;

  return (
    <a
      href={getRootDomain(url)}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none", color: "inherit" }}
    > {/*Failed feeds open up the main website onClick */}
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

          {date_published && (
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {date_published}
            </Typography>
          )}
        </Box>

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

        {/* Expand/Collapse — hidden for fallback feeds */}
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
      </Box>
    </a>
  );
};

export default FeedCard;
