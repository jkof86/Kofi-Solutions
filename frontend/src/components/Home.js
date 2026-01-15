// ------------------------------------------------------------
// Home.jsx — v1.2.0.3 (AuthContext‑Integrated + Stable Layout)
// ------------------------------------------------------------
//
// Goals of v1.2.0.3:
//   ✓ Replace localStorage checks with AuthContext
//   ✓ Redirect unauthenticated users cleanly
//   ✓ Maintain stable two‑column layout (Feed | Market)
//   ✓ Preserve MainContainer offset logic
//   ✓ Keep Drawer outside MainContainer for proper overlay
//   ✓ Production‑grade comments for long‑term maintainability
//
// Auth Model (via AuthContext):
//   isLoggedIn: boolean
//   authType: "google" | "apple" | "guest"
//   user: { email }
//
// Redirect Rules:
//   - If !isLoggedIn → /login
//
// Layout Structure:
//   <HeaderShell />
//   <MainContainer>
//       <Container>
//           Banner
//           Row: [Feed Column | MarketChart Column]
//           Health Summary
//           Status Bars
//       </Container>
//   </MainContainer>
//   <Drawer />
//
// ------------------------------------------------------------

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Chip
} from "@mui/material";

import RssFeedIcon from "@mui/icons-material/RssFeed";
import TabsLayout from "./layouts/TabsLayout";
import FeedStatusBar from "./newsfeed/FeedStatusBar";
import MarketStatusBar from "./newsfeed/MarketStatusBar";
import HealthSummaryCard from "./newsfeed/HealthSummaryCard";
import FeedHealthDashboard from "./newsfeed/FeedHealthDashboard";
import MarketCarousel from "./newsfeed/MarketCarousel";
import MiniSparkline from "./newsfeed/MiniSparkline";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import MainContainer from "./layouts/MainContainer";
import HeaderShell from "./layouts/HeaderShell";
import Drawer from "@mui/material/Drawer";



export default function Home() {
  const [isHealthOpen, setIsHealthOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  // ------------------------------------------------------------
  // AUTH VALIDATION (v1.2.0.3)
  // Ensures only authenticated users can access the dashboard.
  // ------------------------------------------------------------
  
  return (
    <>
      {/* --------------------------------------------------------
         HeaderShell controls the top navigation + health drawer.
         It reports its height so MainContainer can offset content.
      ---------------------------------------------------------- */}
      <HeaderShell
        onHeightChange={setHeaderHeight}
        isHealthOpen={isHealthOpen}
        setIsHealthOpen={setIsHealthOpen}
        activeCategory={activeCategory}
      />
 
      {/* --------------------------------------------------------
         Main page container — applies header offset + full height.
         All page content MUST live inside this container.
      --------------------------------------------------------- */}
      <MainContainer headerHeight={headerHeight}>
        <Container maxWidth="xl" sx={{ mt: 2, mb: 6 }}>

          {/* ----------------------------------------------------
             Banner — top section with title + icon
          ----------------------------------------------------- */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              backgroundColor: "#1976d2",
              color: "#fff",
              px: 3,
              py: 2,
              borderRadius: 2,
              boxShadow: 3,
              mb: 3,
            }}
          >
            <RssFeedIcon fontSize="large" />
            

            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              News Feed (RSS)
            </Typography>

            {/* Spacer pushes chip to the right */}
            <Box sx={{ flexGrow: 1 }} />

            <Chip
              label="v1.2.0.3"
              size="large"
              sx={{
                backgroundColor: "#fff",
                color: "#1976d2",
                fontWeight: 600
              }}
            />
          </Box>

          {/* ----------------------------------------------------
             MAIN CONTENT ROW
             Left: Tabs + Feed
             Right: Market Chart Column
          ----------------------------------------------------- */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              alignItems: "flex-start",
              mb: 4,
              overflow: "hidden",   // prevents horizontal scroll
              flexWrap: "nowrap",
            }}
          >
            {/* LEFT COLUMN — FEED + TABS */}
            <Box sx={{ flex: "1 1 auto", minWidth: 0 }}>
              <TabsLayout
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            </Box>

            {/* RIGHT COLUMN — MARKET CHART (fixed width) */}
            <Box
              sx={{
                flex: "0 0 320px",
                minWidth: 0,
                height: 300,
                p: 1.5,
                borderRadius: 2,
                backgroundColor: "#f5f5f5",
                border: "1px solid #ddd",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Mini Sparkline (global now) */}
              <MiniSparkline />

              {/* Main Market Carousel */}
              <MarketCarousel />
            </Box>
          </Box>

          {/* ----------------------------------------------------
             Health Summary — small card showing feed + market stats
          ----------------------------------------------------- */}
          <Box sx={{ mb: 4 }}>
            <HealthSummaryCard />
          </Box>

          {/* ----------------------------------------------------
             Status Bars — feed health + market health
             Wrapped to prevent overflow
          ----------------------------------------------------- */}
          <Box sx={{ mb: 4, maxWidth: "100%", overflowX: "auto" }}>
            <FeedStatusBar />
            <MarketStatusBar />
          </Box>

        </Container>
      </MainContainer>

      {/* --------------------------------------------------------
         System Health Drawer — MUST live OUTSIDE MainContainer.
         This ensures it overlays the page instead of stretching it.
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

        <FeedHealthDashboard />
      </Drawer>
    </>
  );
}
