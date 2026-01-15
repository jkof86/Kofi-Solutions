import { useState } from "react";
import { Box, Container, Card, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

import HeaderShell from "../layouts/HeaderShell";
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
      <HeaderShell
        onHeightChange={(h) => setHeaderHeight(h)}
        activeCategory="professional"
      />

      {/* MAIN PAGE CONTENT */}
      <Box
        sx={{
          pt: `${headerHeight}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            pt: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "white",
            width: "100%",
            borderRadius: 5
          }}
        >

          {/* ACTION BUTTONS */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 4,
              mt: 2,
            }}
          >
            {/* PRINT ALL */}
            {/* <Card
              onClick={() => window.print()}
              sx={{
                cursor: "pointer",
                px: 3,
                py: 1,
                borderRadius: 2,
                backgroundColor: theme.gradient,
                color: theme.textColor,
                fontWeight: 600,
                boxShadow: 3,
                "&:hover": { opacity: 0.85 },
              }}
            >
              Print All
            </Card> */}

            {/* DOWNLOAD RESUME */}
            <Card
              component="a"
              href={require("../../misc/jkof_resume.pdf")}
              download="Jason_Kofi_Resume.pdf"
              sx={{
                cursor: "pointer",
                px: 3,
                py: 1,
                borderRadius: 2,
                backgroundColor: theme.gradient,
                color: theme.textColor,
                fontWeight: 600,
                boxShadow: 3,
                textDecoration: "none",
                "&:hover": { opacity: 0.85 },
              }}
            >
              Download Resume
            </Card>

            {/* DOWNLOAD PORTFOLIO */}
            <Card
              component="a"
              href={require("../../misc/jkof_portfolio.PDF")}
              download="Jason_Kofi_Portfolio.pdf"
              sx={{
                cursor: "pointer",
                px: 3,
                py: 1,
                borderRadius: 2,
                backgroundColor: theme.gradient,
                color: theme.textColor,
                fontWeight: 600,
                boxShadow: 3,
                textDecoration: "none",
                "&:hover": { opacity: 0.85 },
              }}
            >
              Download Portfolio
            </Card>
          </Box>


          {/* ============================
              RESUME (STACKED)
          ============================ */}
          <Box sx={{ maxWidth: "550px", width: "100%", mx: "auto", mb: 4 }}>
            <Box sx={{ background: theme.gradient }}>
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
              }}
            >
              <MyResume />
            </Box>
          </Box>

          {/* ============================
              PORTFOLIO (STACKED)
          ============================ */}
          <Box sx={{ maxWidth: "550px", width: "100%", mx: "auto", mb: 4 }}>
            <Box sx={{ background: theme.gradient, color: theme.textColor }}>
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
              }}
            >
              <MyPortfolio />
            </Box>
          </Box>

          {/* IMAGE CARD */}
          <Box
            sx={{
              display: "inline-flex",
              p: "10px",
              mt: 2,
              borderRadius: "20px",
            }}
          >
            <Card
              sx={{
                width: "100%",
                maxWidth: "800px",
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

          {/* CONTACT SECTION */}
          <Box
            sx={{
              mt: 6,
              width: "100%",
              maxWidth: "800px",
              borderRadius: 2,
              backgroundColor: "#fff",
              boxShadow: 3,
              p: 3,
              textAlign: "center",
            }}
          >
            <ContactProfessional />
          </Box>

        </Container>
      </Box>
    </>
  );
}
