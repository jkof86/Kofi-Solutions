import { Box, Typography, Chip, Paper, Button, Container } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import UserHeader from "../layouts/UserHeader";
import MainContainer from "../layouts/MainContainer";
import Gaming from "../portfolio/Gaming";
import MyResume from "../portfolio/MyResume";
import MyPortfolio from "../portfolio/MyPortfolio";
import Calculator from "../portfolio/Calculator";
import { BannerThemes } from "../../data/bannerThemes";

const cardLabels = ["Resume", "Portfolio", "Gaming", "WordPress", "Fitness / Nutrition"];

export default function GoogleUser() {
  const { authType } = useAuth();
  const [activeCard, setActiveCard] = useState("Resume");

  // Header height from UserHeader
  const [headerHeight, setHeaderHeight] = useState(0);

  function renderContent() {
    switch (activeCard) {
      case "Resume":
        return <MyResume />;

      case "Gaming":
        return <Gaming />;

      case "Fitness / Nutrition":
        return <Calculator />;

      case "Portfolio":
        return <MyPortfolio />;

      default:
        return (
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            This is a placeholder for {activeCard.toLowerCase()}‑specific content.
          </Typography>
        );
    }
  }

  function panelButton() {
    switch (activeCard) {
      case "Resume":
        return null;

      case "Portfolio":
        return null;

      case "WordPress":
        window.open("https://wp.kofisolutions.com", "_blank");
        return null;

      default:
        return null;
    }
  }

  const theme = BannerThemes[authType] || BannerThemes.default;

  return (
    <>
      {/* UserHeader reports its height dynamically */}
      <UserHeader onHeightChange={setHeaderHeight} />

      <MainContainer headerHeight={headerHeight}>
        <Container maxWidth="xl" sx={{ mt: 2, mb: 6 }}>

          {/* Banner */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              background: theme.gradient,
              color: theme.textColor,
              px: 3,
              py: 2,
              borderRadius: 2,
              boxShadow: 3,
              mb: 3,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Google User Dashboard
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Chip
              label="v1.2.0.4"
              sx={{
                backgroundColor: "#fff",
                color: "#1976d2",
                fontWeight: 600,
              }}
            />
          </Box>

          {/* Two-column layout */}
          <Box sx={{ display: "flex", gap: 3 }}>
            {/* LEFT COLUMN — Cards */}
            <Box sx={{ flex: "0 0 300px", display: "flex", flexDirection: "column", gap: 2 }}>
              {cardLabels.map((label) => (
                <Paper
                  key={label}
                  elevation={activeCard === label ? 6 : 2}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    backgroundColor: activeCard === label ? "#e3f2fd" : "#fff",
                    border: activeCard === label ? "2px solid #1976d2" : "1px solid #ccc",
                    transition: "0.2s ease",
                  }}
                  onClick={() => setActiveCard(label)}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {label}
                  </Typography>
                </Paper>
              ))}
            </Box>

            {/* RIGHT COLUMN — Dynamic Content */}
            <Box
              sx={{
                flex: "1 1 auto",
                minHeight: 240,
                p: 3,
                borderRadius: 2,
                backgroundColor: "#f5f5f5",
                border: "1px solid #ddd",
                boxShadow: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                {activeCard} Panel
              </Typography>

              {/* Dynamic content rendered */}
              {renderContent()}

              <Button variant="outlined" sx={{ mt: 3 }}
                onClick={panelButton}>
                Action for {activeCard}
              </Button>
            </Box>
          </Box>
        </Container>
      </MainContainer>
    </>
  );
}

