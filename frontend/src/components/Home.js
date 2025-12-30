// ------------------------------------------------------------
// Home.jsx — v1.190 (Context‑Driven Dashboard Shell)
// ------------------------------------------------------------
//
// This component renders the main RSS Intelligence Dashboard UI.
// It assumes the following providers wrap <App /> in index.js:
//
//   • FeedStatusProvider      → supplies feed + market health
//   • GlobalRefreshProvider   → manual refresh + retry logic
//
// Home.jsx itself does NOT fetch health data. All health/state
// flows come from context, ensuring a single source of truth.
//
// Responsibilities:
//   ✓ Validate login state
//   ✓ Render header + layout shell
//   ✓ Render TabsLayout (categories + feeds)
//   ✓ Render System Health drawer
//   ✓ Provide spacing + layout for the dashboard
//
// ------------------------------------------------------------

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
} from "@mui/material";

import RssFeedIcon from "@mui/icons-material/RssFeed";
import TabsLayout from "./layouts/TabsLayout";
import FeedHealthDashboard from "./FeedHealthDashboard";
import { useNavigate } from "react-router-dom";
import MainContainer from "./layouts/MainContainer";
import HeaderShell from "./layouts/HeaderShell";
import Drawer from "@mui/material/Drawer";

export default function Home() {
  // Controls whether the System Health drawer is open
  const [isHealthOpen, setIsHealthOpen] = useState(false);

  // HeaderShell reports its height so MainContainer can offset content
  const [headerHeight, setHeaderHeight] = useState(null);

  // ------------------------------------------------------------
  // Login validation
  // ------------------------------------------------------------
  //
  // This ensures users cannot access /home without being logged in.
  // The login flag is stored in localStorage by LoginComponent.
  //
  // NOTE:
  // If login state becomes more complex later (tokens, expiry),
  // this should be replaced with a proper auth context.
  //
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");

    if (!loggedIn) {
      console.log("User NOT logged in → redirecting to /login");
      navigate("/login");
    } else {
      console.log("User IS logged in");
    }
  }, [navigate]);

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  //
  // Layout structure:
  //
  //   <HeaderShell />
  //   <MainContainer>
  //     <Container>
  //       <Banner />
  //       <TabsLayout />          ← categories + feed tabs
  //       <Drawer>Health</Drawer> ← feed + market health
  //     </Container>
  //   </MainContainer>
  //
  // ------------------------------------------------------------

  return (
    <>
      {/* Fixed header with health toggle + height reporting */}
      <HeaderShell
        onHeightChange={setHeaderHeight}
        isHealthOpen={isHealthOpen}
        setIsHealthOpen={setIsHealthOpen}
      />

      {/* Main content area, offset by header height */}
      <MainContainer headerHeight={headerHeight}>
        <Container maxWidth="xl" sx={{ mt: 2, mb: 6 }}>
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: 3,
              p: 3,
            }}
          >
            {/* ------------------------------------------------------------
                Banner — static title bar for the RSS dashboard
               ------------------------------------------------------------ */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#1976d2",
                color: "#fff",
                px: 3,
                py: 2,
                borderRadius: 2,
                boxShadow: 3,
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <RssFeedIcon fontSize="large" />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  News Feeds (RSS)
                </Typography>
              </Box>
            </Box>

            {/* ------------------------------------------------------------
                TabsLayout
                - Builds categories dynamically from FEEDS map
                - Auto-selects first healthy feed
                - Renders RSSFeed internally
               ------------------------------------------------------------ */}
            <TabsLayout />

            {/* ------------------------------------------------------------
                System Health Drawer
                - Shows feed + market health
                - Debug tools included in FeedHealthDashboard
               ------------------------------------------------------------ */}
            <Drawer
              anchor="right"
              open={isHealthOpen}
              onClose={() => setIsHealthOpen(false)}
              PaperProps={{
                sx: {
                  width: "22rem",
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
          </Box>
        </Container>
      </MainContainer>
    </>
  );
}
