import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Tooltip
} from "@mui/material";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import TabsLayout from "./layouts/TabsLayout";
import FeedHealthDashboard from "./FeedHealthDashboard";
import { useNavigate } from "react-router-dom";
import MainContainer from "./layouts/MainContainer";
import HeaderShell from "./layouts/HeaderShell";
import Drawer from '@mui/material/Drawer';

import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";



export default function Home() {
  const [feedHealth, setFeedHealth] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [healthError, setHealthError] = useState(null);
  const [isHealthOpen, setIsHealthOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(null);



  // ------------------------------------------------------------
  // Fetch feed health
  // ------------------------------------------------------------
  useEffect(() => {
    async function fetchHealth() {
      try {
        const res = await fetch(
          "https://jy4i499sj1.execute-api.us-east-1.amazonaws.com/default/RSSProxyAggregator?mode=health"
        );
        const json = await res.json();

        if (json.status === "ok") {
          setFeedHealth(json.feeds || {});
        } else {
          setHealthError(json.error || "Health error");
        }
      } catch (err) {
        setHealthError(err.message);
      } finally {
        setLoadingHealth(false);
      }
    }

    fetchHealth();
  }, []);

  // ------------------------------------------------------------
  // Login validation
  // ------------------------------------------------------------
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

  return (
    <>
      <HeaderShell
        onHeightChange={setHeaderHeight}
        isHealthOpen={isHealthOpen}
        setIsHealthOpen={setIsHealthOpen} 
        />

      <MainContainer headerHeight={headerHeight}>
        <Container maxWidth="xl" sx={{ mt: 2, mb: 6 }}>
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: 3,
              p: 3
            }}
          >
            {/* Banner */}
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
                zIndex: 2500
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <RssFeedIcon fontSize="large" />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  News Feeds (RSS)
                </Typography>
              </Box>
              
            </Box>

            {/* Tabs */}
            <TabsLayout />

            {/* Feed Health */}

            <Drawer
              anchor="right"
              open={isHealthOpen}
              onClose={() => setIsHealthOpen(false)}
              PaperProps={{
                sx: {
                  width: "22rem",
                  padding: 2,
                  backgroundColor: "#fafafa"
                }
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
