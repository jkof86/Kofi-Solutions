import { useState } from "react";
import {
  Box,
  Container,
  Card,
  Typography,
  Grid
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";

import NewsHeader from "../layouts/NewsHeader";
import MyResume from "./MyResume";
import MyPortfolio from "./MyPortfolio";
import ContactProfessional from "./ContactProfessional";
import { BannerThemes } from "../../data/bannerThemes";

export default function Professional() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const { authType } = useAuth();
  const theme = BannerThemes[authType] || BannerThemes.default;

  return (
    <>
      {/* FIXED HEADER */}
      <NewsHeader
        onHeightChange={(h) => setHeaderHeight(h)}
        activeCategory="professional"
      />

      {/* MAIN PAGE CONTENT */}
      <Box
        sx={{
          pt: `${headerHeight}px`,
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            background: "white",
            borderRadius: 5,
            pb: 4,
            px: 2,
          }}
        >
          {/* IMAGE CARD */}
          <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <Card
              sx={{
                width: "100%",
                maxWidth: 200, 
                borderRadius: "20px",
                p: 2,
                boxShadow: 3,
                backgroundColor: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                component="img"
                src={require("../../images/icons/avatar_full.jpg")}
                alt="Professional Graphic"
                sx={{
                  maxWidth: "100%",
                  maxHeight: 300,
                  objectFit: "contain",
                  borderRadius: "12px",
                }}
              />
            </Card>
          </Box>

          {/* DOCUMENTS SECTION */}
          <Grid container spacing={4}>
            {/* LEFT COLUMN — Resume */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Card
                  component="a"
                  href={require("../../misc/jkof_resume.pdf")}
                  download="Jason_Kofi_Resume_2025.pdf"
                  sx={{
                    cursor: "pointer",
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    color: "#3b78e2",
                    fontWeight: 600,
                    boxShadow: 3,
                    textDecoration: "none",
                    "&:hover": { opacity: 0.85 },
                  }}
                >
                  Download Resume
                </Card>
              </Box>

              <Box sx={{ background: theme.gradient, color: theme.textColor, borderRadius: 2 }}>
                <Typography variant="h6" textAlign="center">
                  Resume
                </Typography>
              </Box>

              <Box
                sx={{
                  borderRadius: 2,
                  backgroundColor: "#fff",
                  boxShadow: 3,
                  p: 2,
                  mt: 1,
                }}
              >
                <MyResume />
              </Box>
            </Grid>

            {/* RIGHT COLUMN — Portfolio */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Card
                  component="a"
                  href={require("../../misc/jkof_portfolio.PDF")}
                  download="Jason_Kofi_Portfolio_2025.pdf"
                  sx={{
                    cursor: "pointer",
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    color: "#3b78e2",
                    fontWeight: 600,
                    boxShadow: 3,
                    textDecoration: "none",
                    "&:hover": { opacity: 0.85 },
                  }}
                >
                  Download Portfolio
                </Card>
              </Box>

              <Box sx={{ background: theme.gradient, color: theme.textColor, borderRadius: 2 }}>
                <Typography variant="h6" textAlign="center">
                  Portfolio
                </Typography>
              </Box>

              <Box
                sx={{
                  borderRadius: 2,
                  backgroundColor: "#fff",
                  boxShadow: 3,
                  p: 2,
                  mt: 1,
                  minHeight: 790,
                }}
              >
                <MyPortfolio />
              </Box>
            </Grid>
          </Grid>

          {/* CONTACT SECTION */}
          <Box
            sx={{
              width: "100%",
              maxWidth: 800,
              borderRadius: 2,
              backgroundColor: "#fff",
              boxShadow: 3,
              p: 3,
              textAlign: "center",
              mx: "auto",
            }}
          >
            <ContactProfessional />
          </Box>
        </Container>
      </Box>
    </>
  );
}
