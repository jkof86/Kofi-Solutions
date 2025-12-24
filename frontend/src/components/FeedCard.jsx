// ------------------------------------------------------------
// FeedCard.jsx — Single feed item card
// ------------------------------------------------------------

import {
  Card,
  CardContent,
  CardMedia,
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Avatar
} from "@mui/material";

export default function FeedCard({ item, feedMeta }) {

  const FALLBACK_IMAGES = {
    cb: "https://www.coinbase.com/favicon.ico",
    binance_blog: "https://www.binance.com/favicon.ico",
    kraken_blog: "https://www.kraken.com/favicon.ico",
    rh_crypto: "https://robinhood.com/favicon.ico",
    cryptopanic_crypto: "https://cryptopanic.com/favicon.ico"
  };

  const imageSrc =
    item.image ||
    FALLBACK_IMAGES[feedMeta?.id] ||
    "https://via.placeholder.com/320x180.png?text=No+Image";

  const initials = feedMeta?.label
    ? feedMeta.label
      .split(" ")
      .map(w => w[0])
      .join("")
      .toUpperCase()
    : "FD";

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        boxShadow: 2,
        borderRadius: 2,
        overflow: "hidden"
      }}
    >
      <CardMedia
        component="img"
        image={imageSrc}
        alt={item.title}
        sx={{ width: 220, objectFit: "cover" }}
        onError={e => {
          e.target.src =
            "https://via.placeholder.com/320x180.png?text=No+Image";
        }}
      />

      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
            {initials}
          </Avatar>
          <Chip
            size="small"
            label={feedMeta?.label || "Feed"}
            color={feedMeta?.legacy ? "warning" : "primary"}
            variant={feedMeta?.legacy ? "outlined" : "filled"}
          />
        </Stack>

        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          {item.title}
        </Typography>

        {item.summary && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1 }}
            dangerouslySetInnerHTML={{ __html: item.summary }}
          />
        )}

        <Box sx={{ mt: "auto" }}>
          <Button
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
          >
            Visit site
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
