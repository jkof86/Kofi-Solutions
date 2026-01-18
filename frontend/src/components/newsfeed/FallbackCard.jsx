import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { FEEDS } from "../../data/feedsMap";

export default function FallbackCard({ feedId, onRefresh }) {
  const meta = FEEDS[feedId] || {};
  const label = meta.label || feedId;

  const OVERRIDES = {
  // -----------------------------
  // US NEWS
  // -----------------------------
  cnn_top: "https://www.cnn.com",
  fox_top: "https://www.foxnews.com",
  nbc_top: "https://www.nbcnews.com",
  abc_top: "https://abcnews.go.com",
  cbs_top: "https://www.cbsnews.com",
  nyt_top: "https://www.nytimes.com",
  wsj_top: "https://www.wsj.com",
  usa_today: "https://www.usatoday.com",

  // -----------------------------
  // WORLD NEWS
  // -----------------------------
  bbc_world: "https://www.bbc.com/news",
  reuters_world: "https://www.reuters.com",
  aljazeera_world: "https://www.aljazeera.com",
  ap_world: "https://apnews.com",
  guardian_world: "https://www.theguardian.com/world",

  // -----------------------------
  // BUSINESS / FINANCE
  // -----------------------------
  bloomberg_markets: "https://www.bloomberg.com/markets",
  bloomberg_tech: "https://www.bloomberg.com/technology",
  yahoo_finance: "https://finance.yahoo.com",
  marketwatch_top: "https://www.marketwatch.com",
  wsj_business: "https://www.wsj.com/news/business",
  ft_markets: "https://www.ft.com/markets",
  cnbc_markets: "https://www.cnbc.com/markets",
  cnbc_business: "https://www.cnbc.com/business",

  // -----------------------------
  // CRYPTO
  // -----------------------------
  coindesk_top: "https://www.coindesk.com",
  cointelegraph_top: "https://cointelegraph.com",
  decrypt_top: "https://decrypt.co",
  theblock_top: "https://www.theblock.co",

  // -----------------------------
  // TECHNOLOGY
  // -----------------------------
  verge_tech: "https://www.theverge.com/tech",
  techcrunch_top: "https://techcrunch.com",
  wired_top: "https://www.wired.com",
  ars_technica: "https://arstechnica.com",
  engadget_top: "https://www.engadget.com",
  hackernews_top: "https://news.ycombinator.com",
  infoq_java: "https://www.infoq.com",
  jetbrains_java: "https://blog.jetbrains.com",
  spring_cloud_blog: "https://spring.io/blog",
  spring_security_blog: "https://spring.io/blog",
  axios: "https://www.axios.com",

  // -----------------------------
  // SPORTS
  // -----------------------------
  espn_top: "https://www.espn.com",
  bleacher_report: "https://bleacherreport.com",
  yahoo_sports: "https://sports.yahoo.com",
  nfl_news: "https://www.nfl.com/news",
  nba_news: "https://www.nba.com/news",
  mlb_news: "https://www.mlb.com/news",

  // -----------------------------
  // GAMING
  // -----------------------------
  ign_top: "https://www.ign.com",
  gamespot_top: "https://www.gamespot.com",
  polygon_gaming: "https://www.polygon.com/gaming",
  pcgamer_top: "https://www.pcgamer.com",

  // -----------------------------
  // ENTERTAINMENT
  // -----------------------------
  variety_top: "https://variety.com",
  hollywood_reporter: "https://www.hollywoodreporter.com",
  rolling_stone: "https://www.rollingstone.com",
  people_entertainment: "https://people.com",

  // -----------------------------
  // FOOD
  // -----------------------------
  foodnetwork_top: "https://www.foodnetwork.com",
  bonappetit_top: "https://www.bonappetit.com",
  serious_eats: "https://www.seriouseats.com",

  // -----------------------------
  // FITNESS / NUTRITION
  // -----------------------------
  mens_health: "https://www.menshealth.com",
  womens_health: "https://www.womenshealthmag.com",
  bodybuilding_top: "https://www.bodybuilding.com",
  healthline_fitness: "https://www.healthline.com",

  // -----------------------------
  // FALLBACK DEFAULT
  // -----------------------------
  default: "https://www.google.com"
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
            borderRadius: 5,
            border: "2px solid black",
            backgroundImage: `url(${require("../../images/bg/ksBanner04.jpeg")})`,
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
