// ------------------------------------------------------------
// CategoryTabs.jsx
// Top-level category tabs + sub-tabs for feeds within each category.
// No nested button warnings. Works with RSSFeed.jsx.
// ------------------------------------------------------------

import React, { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import RSSFeed from "../RSSFeed.jsx";

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index} style={{ width: "100%" }}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

// --------------------------------------------------------
// ✅ Category and feed definitions
// label → array of feeds { label, name }
// "name" must match RSSFeed "name" prop / FEED_SOURCES keys
// --------------------------------------------------------
const FEED_CATEGORIES = {
  IoT: [
    { label: "IoT World Today", name: "iot_world" },
    { label: "Stacey on IoT", name: "stacey_iot" },
    { label: "IoT Business News", name: "iot_business" }
  ],
  "Cloud Security": [
    { label: "Dark Reading", name: "dark_reading" },
    { label: "Krebs on Security", name: "krebs" },
    { label: "Security Week", name: "security_week" }
  ],
  "Full Stack Development": [
    { label: "Smashing Magazine", name: "smashing" },
    { label: "Dev.to", name: "devto" },
    { label: "CSS-Tricks", name: "css_tricks" }
  ],
  Java: [
    { label: "Java Code Geeks", name: "jcg" },
    { label: "InfoQ Java", name: "infoq_java" },
    { label: "Baeldung", name: "baeldung" }
  ],
  Spring: [
    { label: "Spring Blog", name: "spring_blog" },
    { label: "Spring Guides", name: "spring_guides" },
    { label: "Baeldung Spring", name: "baeldung_spring" }
  ],
  AWS: [
    { label: "AWS News Blog", name: "aws_news" },
    { label: "AWS Architecture", name: "aws_arch" },
    { label: "AWS Security", name: "aws_security" }
  ],
  React: [
    { label: "React Status", name: "react_status" },
    { label: "LogRocket React", name: "logrocket_react" },
    { label: "Smashing React", name: "smashing_react" }
  ],
  Sports: [
    { label: "ESPN", name: "espn" },
    { label: "CBS Sports", name: "cbs_sports" },
    { label: "Bleacher Report", name: "bleacher" }
  ],
  Finance: [
    { label: "MarketWatch", name: "marketwatch" },
    { label: "Financial Times", name: "ft" },
    { label: "Investopedia", name: "investopedia" }
  ],
  Stocks: [
    { label: "Yahoo Finance", name: "yahoo_finance" },
    { label: "Seeking Alpha", name: "seeking_alpha" },
    { label: "MarketWatch Stocks", name: "marketwatch_stocks" }
  ],
  Crypto: [
    { label: "CoinDesk", name: "cd" },
    { label: "Cointelegraph", name: "ct" },
    { label: "Decrypt", name: "decrypt" }
  ],
  "US Politics": [
    { label: "The Federalist", name: "federalist" },
    { label: "Daily Wire", name: "dailywire" },
    { label: "Epoch Times", name: "epoch" }
  ],
  "World News": [
    { label: "Reuters World", name: "reuters_world" },
    { label: "BBC World", name: "bbc_world" },
    { label: "AP World", name: "ap_world" }
  ],
  Debug: [
    { label: "Java Code Geeks", name: "jcg" },
    { label: "CoinDesk", name: "cd" },
    { label: "Cointelegraph", name: "ct" },
    { label: "Coinbase", name: "cb" }
  ]
};

export default function CategoryTabs() {
  const categories = Object.keys(FEED_CATEGORIES);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [feedIndex, setFeedIndex] = useState(0);

  const handleCategoryChange = (_, newValue) => {
    setCategoryIndex(newValue);
    setFeedIndex(0); // reset sub-tab when category changes
  };

  const handleFeedChange = (_, newValue) => {
    setFeedIndex(newValue);
  };

  const currentCategory = categories[categoryIndex];
  const feeds = FEED_CATEGORIES[currentCategory];

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          {currentCategory}
        </Typography>

        <Tabs
          value={categoryIndex}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Category Tabs"
        >
          {categories.map(cat => (
            <Tab key={cat} label={cat} />
          ))}
        </Tabs>
      </Box>

      <Tabs
        value={feedIndex}
        onChange={handleFeedChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Feed Tabs"
        sx={{ borderBottom: 1, borderColor: "divider", mb: 1 }}
      >
        {feeds.map(feed => (
          <Tab key={feed.label} label={feed.label} />
        ))}
      </Tabs>

      {feeds.map((feed, i) => (
        <TabPanel key={feed.name} value={feedIndex} index={i}>
          <RSSFeed name={feed.name} categoryLabel={currentCategory} />
        </TabPanel>
      ))}
    </Box>
  );
}
