// ------------------------------------------------------------
// Home.jsx — Phase 4.2 Full Width Arrow Navigation
// ------------------------------------------------------------

import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Toolbar,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  IconButton
} from "@mui/material";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { useNavigate } from "react-router-dom";

import banner from "../images/bg/ksBanner08.jpeg";
import Navbar from "./navigation/Navbar";

import TabsLayout from "./layouts/TabsLayout";
import TickerBar from "./layouts/TickerBar";
import FeedHealthDashboard from "./FeedHealthDashboard";

import { FeedStatusProvider } from "../context/FeedStatusContext";
import { GlobalRefreshProvider, GlobalRefreshContext } from "../context/GlobalRefreshContext";
import { feedCategories } from "../data/feedCategories";

// ------------------------------------------------------------
// Category Scroller — Full Width Arrow Navigation
// ------------------------------------------------------------
function CategoryScroller({ categories, currentCategory, setCurrentCategory }) {
  const keys = Object.keys(categories);
  const [index, setIndex] = useState(0);

  const visibleCount = 5;
  const maxIndex = Math.max(0, keys.length - visibleCount);
  const visibleKeys = keys.slice(index, index + visibleCount);

  const scrollLeft = () => setIndex(i => Math.max(0, i - 1));
  const scrollRight = () => setIndex(i => Math.min(maxIndex, i + 1));

  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2, width: "100%" }}>
      <IconButton onClick={scrollLeft} disabled={index === 0}>
        <ArrowBackIosIcon fontSize="small" />
      </IconButton>

      <Box sx={{ flexGrow: 1 }}>
        <ToggleButtonGroup
          value={currentCategory}
          exclusive
          onChange={(e, val) => val && setCurrentCategory(val)}
          size="small"
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${visibleCount}, 1fr)`,
            gap: 1
          }}
        >
          {visibleKeys.map(cat => (
            <ToggleButton
              key={cat}
              value={cat}
              sx={{
                borderRadius: 2,
                width: "100%",
                justifyContent: "center"
              }}
            >
              {cat}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <IconButton onClick={scrollRight} disabled={index >= maxIndex}>
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

// ------------------------------------------------------------
// Home Component
// ------------------------------------------------------------
export default function Home() {
  const categories = feedCategories;

  const [currentCategory, setCurrentCategory] = useState(
    Object.keys(categories)[0] || ""
  );

  const feeds = categories[currentCategory] || [];
  const safeFeedIndex = 0;

  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (!loggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <FeedStatusProvider>
      <GlobalRefreshProvider>
        <AutoLoadFirstFeed feeds={feeds} />

        <center>
          {/* Banner */}
          <Toolbar
            sx={{
              justifyContent: "center",
              backgroundImage: `url(${banner})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundColor: "white",
              borderRadius: "25px",
              border: "1px solid black",
              boxShadow: "0px 0px 8px 5px white",
              height: "300px",
              width: "800px",
              mt: 2
            }}
          />

          <Navbar />
          <TickerBar />

          {/* Main Content */}
          <Box
            sx={{
              justifyContent: "center",
              backgroundColor: "white",
              borderRadius: "25px",
              border: "1px solid black",
              boxShadow: "0px 0px 2px 2px white",
              padding: "10px",
              margin: "20px",
              width: "75vw"
            }}
          >
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  RSS Feeds
                </Typography>

                <Card
                  sx={{
                    border: "2px solid black",
                    maxWidth: "100%",
                    borderRadius: "25px",
                    margin: "10px",
                    padding: "10px",
                    textAlign: "center"
                  }}
                >
                  <Box
                  >                    <CardMedia>
                      <CardContent>

                        {/* Category Selector — Full Width Arrow Navigation */}
                        <CategoryScroller
                          categories={categories}
                          currentCategory={currentCategory}
                          setCurrentCategory={setCurrentCategory}
                        />

                        {/* Tabs Layout */}
                        <TabsLayout
                          feeds={feeds}
                          safeFeedIndex={safeFeedIndex}
                          currentCategory={currentCategory}
                        />
                      </CardContent>
                      <CardActions />
                    </CardMedia>
                  </Box>
                </Card>
              </Grid>

              {/* Feed Health Dashboard */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <FeedHealthDashboard />
              </Grid>
            </Grid>
          </Box>
        </center>
      </GlobalRefreshProvider>
    </FeedStatusProvider>
  );
}

// ------------------------------------------------------------
// Auto-load first feed whenever feeds change (Phase 4 Stable)
// ------------------------------------------------------------
function AutoLoadFirstFeed({ feeds }) {
  const { loadFeed } = useContext(GlobalRefreshContext);
  const [lastLoadedFeed, setLastLoadedFeed] = useState(null);

  useEffect(() => {
    if (!feeds || feeds.length === 0) return;

    const firstFeedName = feeds[0].name;

    if (firstFeedName && firstFeedName !== lastLoadedFeed) {
      loadFeed(firstFeedName);
      setLastLoadedFeed(firstFeedName);
    }
  }, [feeds, lastLoadedFeed]);

  return null;
}
