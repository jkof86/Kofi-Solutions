import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { FEEDS } from "../../data/feedsMap";

export default function FallbackCard({ feedId, onRefresh }) {
  const meta = FEEDS[feedId] || {};
  const label = meta.label || feedId;

  const OVERRIDES = {
    axios: "https://www.axios.com",
    infoq_java: "https://www.infoq.com",
    jetbrains_java: "https://blog.jetbrains.com",
    spring_cloud_blog: "https://spring.io/blog",
    spring_security_blog: "https://spring.io/blog",
    bleacher_report: "https://bleacherreport.com",
    aljazeera_world: "https://www.aljazeera.com",
  };

  const url = OVERRIDES[feedId] || meta.url || "#";

  console.log("FallbackCard feedId:", feedId);
  console.log("Override hit:", OVERRIDES[feedId]);
  console.log("meta.url:", meta.url);

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: "#f9a825",
        bgcolor: "#fff8e1",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Banner */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "#f9a825",
          color: "#000",
          py: 0.5,
          px: 2,
          fontWeight: 700,
          fontSize: "0.85rem",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <WarningAmberIcon fontSize="small" />
        Feed Unavailable — Using Fallback Mode
      </Box>

      <CardContent>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 700 }}>
            {label}
          </Typography>
        </Box>

        {/* Banner Image */}
        <Box
          sx={{
            flex: 1,
            height: 140,
            borderRadius: 1,
            border: "1px solid black",
            backgroundImage: `url(${require("../../images/bg/ksBanner06.jpeg")})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            mb: 2,
          }}
        />

        {/* Message */}
        <Typography variant="body2" sx={{ mb: 2, color: "#120e0c" }}>
          This feed returned no articles. <br />
          You can retry fetching or visit the source directly.
        </Typography>

        {/* Actions */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color="warning"
            onClick={onRefresh}
            startIcon={<AutorenewIcon />}
          >
            Retry
          </Button>

          <Button
            variant="outlined"
            color="warning"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Website →
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
