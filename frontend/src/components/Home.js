import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Chip
} from "@mui/material";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import TabsLayout from "./layouts/TabsLayout";
import FeedHealthDashboard from "./FeedHealthDashboard";
import { useNavigate } from "react-router-dom";
import MainContainer from "./layouts/MainContainer";
import HeaderShell from "./layouts/HeaderShell";

export default function Home() {
  const [feedHealth, setFeedHealth] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [healthError, setHealthError] = useState(null);
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
      <HeaderShell onHeightChange={setHeaderHeight} />

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
                mb: 3
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <RssFeedIcon fontSize="large" />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  News Feeds (RSS)
                </Typography>
              </Box>

              <Chip
                label="v1.141"
                size="small"
                sx={{
                  backgroundColor: "#fff",
                  color: "#1976d2",
                  fontWeight: 600
                }}
              />
            </Box>

            {/* Tabs */}
            <TabsLayout />

            {/* Feed Health */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Feed Health
              </Typography>

              {loadingHealth ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : healthError ? (
                <Typography color="error">{healthError}</Typography>
              ) : (
                <FeedHealthDashboard healthMap={feedHealth} />
              )}
            </Box>
          </Box>
        </Container>
      </MainContainer>
    </>
  );
}
