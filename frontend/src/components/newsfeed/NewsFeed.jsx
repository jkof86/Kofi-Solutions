// ------------------------------------------------------------
// NewsFeed.jsx — v1.2.2.0 (Market Module Relocated)
// ------------------------------------------------------------

import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Chip
} from "@mui/material";

import { useAuth } from "../../context/AuthContext";

import RssFeedIcon from "@mui/icons-material/RssFeed";

import FeedExplorerLayout from "../layouts/FeedExplorerLayout";

import HealthDashboard from "./HealthDashboard";
import MarketCarousel from "./MarketCarousel";
import MiniSparkline from "./MiniSparkline";

import MainContainer from "../layouts/MainContainer";
import Drawer from "@mui/material/Drawer";
import { BannerThemes } from "../../data/bannerThemes";
import NewsHeader from "../layouts/NewsHeader";
import FeedDashboard from "./FeedDashboard";

export default function NewsFeed() {
  const [isHealthOpen, setIsHealthOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(null);
  const { authType } = useAuth();
  const theme = BannerThemes[authType] || BannerThemes.default;

  return (
    <>
      <NewsHeader
        onHeightChange={setHeaderHeight}
        isHealthOpen={isHealthOpen}
        setIsHealthOpen={setIsHealthOpen}
      />

      <MainContainer headerHeight={headerHeight}>
        <Container maxWidth="xl" sx={{ mt: 2, mb: 6 }}>

          {/* ----------------------------------------------------
             Banner
          ----------------------------------------------------- */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              background: theme.gradient,
              px: 3,
              py: 2,
              borderRadius: 2,
              boxShadow: 3,
              mb: 3,
            }}
          >
            <RssFeedIcon fontSize="large" sx={{ color: theme.textColor }} />

            <Typography
              variant="h5"
              sx={{ color: theme.textColor, fontWeight: 600 }}
            >
              News Feed (RSS)
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Chip
              label="v1.2.1.0"
              size="large"
              sx={{
                backgroundColor: "#fff",
                border: "1px solid #1976d2",
                color: "#1976d2",
                fontWeight: 600
              }}
            />
          </Box>

          {/* ----------------------------------------------------
             MARKET MODULE — now full width under banner
          ----------------------------------------------------- */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              backgroundColor: "#f5f5f5",
              border: "1px solid #ddd",
              borderRadius: 2,
              px: 2,
              py: 1.5,
              mb: 3,
            }}
          >
            <MiniSparkline />
            <Box sx={{ flexGrow: 1 }}>
              <MarketCarousel />
            </Box>
          </Box>

          {/* ----------------------------------------------------
             MAIN CONTENT — full-width Feed Explorer
          ----------------------------------------------------- */}
          <Box sx={{ mb: 4 }}>
            <FeedExplorerLayout />
          </Box>

          {/* ----------------------------------------------------
             Feed + Market Health Dashboard
          ----------------------------------------------------- */}
          <Box sx={{ mb: 4 }}>
            <FeedDashboard />
          </Box>

        </Container>
      </MainContainer>

      {/* --------------------------------------------------------
         System Health Drawer
      --------------------------------------------------------- */}
      <Drawer
        anchor="right"
        open={isHealthOpen}
        onClose={() => setIsHealthOpen(false)}
        PaperProps={{
          sx: {
            width: "26rem",
            padding: 2,
            backgroundColor: "#fafafa",
          },
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          System Health
        </Typography>

        <HealthDashboard />
      </Drawer>
    </>
  );
}
