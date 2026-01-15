import {
  Box,
  Grid,
  Card,
  CardActionArea,
  CardMedia
} from "@mui/material";
import { Link } from "react-router-dom";

export default function ContactProfessional() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        py: 2,
      }}
    >
      <Grid
        container
        spacing={4}
        sx={{
          justifyContent: "center",
          maxWidth: "500px",
        }}
      >
        {/* LinkedIn */}
        <Grid item xs={6} sm={4} md={3}>
          <Card
            sx={{
              borderRadius: "20px",
              p: 1,
              boxShadow: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardActionArea
              component={Link}
              to="https://www.linkedin.com/in/jkof86"
              target="_blank"
              sx={{ p: 1 }}
            >
              <CardMedia
                component="img"
                alt="LinkedIn Icon"
                image={require("../../images/icons/linkedIn_PNG8.png")}
                sx={{
                  width: "60px",
                  height: "60px",
                  objectFit: "contain",
                }}
              />
            </CardActionArea>
          </Card>
        </Grid>

        {/* GitHub */}
        <Grid item xs={6} sm={4} md={3}>
          <Card
            sx={{
              borderRadius: "20px",
              p: 1,
              boxShadow: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardActionArea
              component={Link}
              to="https://github.com/jkof86"
              target="_blank"
              sx={{ p: 1 }}
            >
              <CardMedia
                component="img"
                alt="GitHub Icon"
                image={require("../../images/icons/github_PNG45.png")}
                sx={{
                  width: "60px",
                  height: "60px",
                  objectFit: "contain",
                }}
              />
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
