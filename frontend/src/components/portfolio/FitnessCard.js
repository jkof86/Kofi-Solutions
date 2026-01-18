import {
  Box,
  Button,
  CardContent,
  CardActions,
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
        // mt: 30,
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
        {/* ROW 1 — Calculator / Gaming Banner */}
        <Box
          sx={{
            width: "100%",
            borderRadius: "25px",
            backgroundColor: "white",
            boxShadow: "0px 0px 8px 2px white",
            overflow: "hidden",
          }}
        >
          <Card
            sx={{
              minWidth: "40vw",
              borderRadius: "25px",
              padding: "5px",
              margin: "20px",
              textAlign: "center",
            }}
          >
            <CardActionArea
              component={Link}
              to="/fitness/calculator"
            >
              <CardContent />

              <CardMedia
                component="img"
                alt="Jkof Gaming"
                image={require("../../images/macros.jpg")}
                sx={{ borderRadius: "25px" }}
              />
            </CardActionArea>

            <CardActions>
              <Button size="small">Share</Button>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </Box>

        {/* ROW 2 — Social Icons */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: 4,
            flexWrap: "wrap",
          }}
        >
          {/* Facebook */}
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

          {/* Instagram */}
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

        {/* ROW 3 — Future content */}
      </Container>
    </Box>
  );
}
