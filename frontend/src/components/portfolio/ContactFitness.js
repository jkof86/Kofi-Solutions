import {
  Box,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  Container
} from "@mui/material";
import { Link } from "react-router-dom";
import Calculator from "./Calculator";

export default function ContactFitness() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        mt: 30,
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          background: "white",
          borderRadius: 5,
          pb: 4,
        }}
      >
        {/* ROW 1 — Calculator */}
        <Box
          sx={{
            width: "100%",
            borderRadius: "25px",
            backgroundColor: "white",
            boxShadow: "0px 0px 8px 2px white",
            overflow: "hidden",
          }}
        >
          <Calculator />
        </Box>

        {/* ROW 2 — Social Icons (side-by-side inside ONE column) */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: 4,              // spacing between icons
            flexWrap: "wrap",    // keeps it responsive
          }}
        >
          {/* Facebook */}
          <Box
            sx={{
              display: "inline-flex",
              borderRadius: "20px",
            }}
          >
            <Card
              sx={{
                borderRadius: "20px",
                p: 1,
                boxShadow: 3,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "auto",
              }}
            >
              <CardActionArea
                component={Link}
                to="https://www.facebook.com/jason.kofi.1"
                target="_blank"
              >
                <CardMedia
                  component="img"
                  alt="Facebook Icon"
                  image={require("../../images/icons/Facebook_Icon_(Official_2).png")}
                  sx={{
                    borderRadius: "12px",
                    maxHeight: 80,
                    maxWidth: 80,
                    objectFit: "contain",
                  }}
                />
              </CardActionArea>
            </Card>
          </Box>

          {/* Instagram */}
          <Box
            sx={{
              display: "inline-flex",
              borderRadius: "20px",
            }}
          >
            <Card
              sx={{
                borderRadius: "20px",
                p: 1,
                boxShadow: 3,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "auto",
              }}
            >
              <CardActionArea
                component={Link}
                to="https://www.instagram.com/jkof86/"
                target="_blank"
              >
                <CardMedia
                  component="img"
                  alt="Instagram Icon"
                  image={require("../../images/icons/Instagram_icon.png")}
                  sx={{
                    borderRadius: "12px",
                    maxHeight: 80,
                    maxWidth: 80,
                    objectFit: "contain",
                  }}
                />
              </CardActionArea>
            </Card>
          </Box>
        </Box>

        {/* ROW 3 — (Optional future content) */}
      </Container>
    </Box>
  );
}
