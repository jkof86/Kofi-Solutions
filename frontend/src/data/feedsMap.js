// ------------------------------------------------------------
// feedsMap.js — FRONTEND — v1.177 (ESM)
// Bloomberg removed + stable finance replacements
// ------------------------------------------------------------
//
// IMPORTANT:
//   • Must match backend FEEDS 1:1
//   • ESM exports only (React/Webpack compatible)
//   • Includes helper functions for TabsLayout
//
// ------------------------------------------------------------

export const FEEDS = {
  // --------------------
  // CRYPTO (JSON + RSS)
  // --------------------
  ct: {
    id: "ct",
    label: "CoinTelegraph",
    category: "crypto",
    type: "rss",
    url: "https://cointelegraph.com/rss"
  },
  decrypt: {
    id: "decrypt",
    label: "Decrypt",
    category: "crypto",
    type: "rss",
    url: "https://decrypt.co/feed"
  },
  blockworks_crypto: {
    id: "blockworks_crypto",
    label: "Blockworks",
    category: "crypto",
    type: "rss",
    url: "https://blockworks.co/feed"
  },
  coindesk: {
    id: "coindesk",
    label: "CoinDesk",
    category: "crypto",
    type: "rss",
    url: "https://www.coindesk.com/arc/outboundfeeds/rss/"
  },
  bitcoin_magazine: {
    id: "bitcoin_magazine",
    label: "Bitcoin Magazine",
    category: "crypto",
    type: "rss",
    url: "https://bitcoinmagazine.com/.rss"
  },
  yahoo_crypto: {
    id: "yahoo_crypto",
    label: "Yahoo Crypto (JSON)",
    category: "crypto",
    type: "json",
    url: "https://query1.finance.yahoo.com/v7/finance/quote?symbols=BTC-USD,ETH-USD"
  },
  coingecko_crypto: {
    id: "coingecko_crypto",
    label: "CoinGecko (JSON)",
    category: "crypto",
    type: "json",
    url: "https://api.coingecko.com/api/v3/news"
  },
  cryptopanic_crypto: {
    id: "cryptopanic_crypto",
    label: "CryptoPanic (JSON)",
    category: "crypto",
    type: "json",
    url: "https://cryptopanic.com/api/v1/posts/?auth_token=YOUR_TOKEN&public=true"
  },

  // --------------------
  // FINANCE (v1.177 updated)
  // --------------------
  marketwatch_finance: {
    id: "marketwatch_finance",
    label: "MarketWatch",
    category: "finance",
    type: "rss",
    url: "https://www.marketwatch.com/rss/topstories"
  },
  yahoo_finance: {
    id: "yahoo_finance",
    label: "Yahoo Finance",
    category: "finance",
    type: "rss",
    url: "https://feeds.finance.yahoo.com/rss/2.0/headline?s=^GSPC&region=US&lang=en-US"
  },

  // NEW — stable replacements
  investing_markets: {
    id: "investing_markets",
    label: "Investing.com Markets",
    category: "finance",
    type: "rss",
    url: "https://www.investing.com/rss/news_25.rss"
  },
  wsj_markets: {
    id: "wsj_markets",
    label: "WSJ Markets",
    category: "finance",
    type: "rss",
    url: "https://feeds.a.dj.com/rss/RSSMarketsMain.xml"
  },
  cnbc_markets: {
    id: "cnbc_markets",
    label: "CNBC Markets",
    category: "finance",
    type: "rss",
    url: "https://www.cnbc.com/id/10001147/device/rss/rss.html"
  },
  ft_markets: {
    id: "ft_markets",
    label: "Financial Times Markets",
    category: "finance",
    type: "rss",
    url: "https://www.ft.com/?format=rss"
  },

  // --------------------
  // NEWS
  // --------------------
  guardian_world: {
    id: "guardian_world",
    label: "The Guardian World",
    category: "news",
    type: "rss",
    url: "https://www.theguardian.com/world/rss"
  },
  bbc_world: {
    id: "bbc_world",
    label: "BBC World",
    category: "news",
    type: "rss",
    url: "http://feeds.bbci.co.uk/news/world/rss.xml"
  },
  nytimes_world: {
    id: "nytimes_world",
    label: "NYTimes World",
    category: "news",
    type: "rss",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml"
  },
  cnn_top: {
    id: "cnn_top",
    label: "CNN Top Stories",
    category: "news",
    type: "rss",
    url: "http://rss.cnn.com/rss/edition.rss"
  },
  euronews_world: {
    id: "euronews_world",
    label: "Euronews World",
    category: "news",
    type: "rss",
    url: "https://www.euronews.com/rss?level=theme&name=news"
  },
  aljazeera_world: {
    id: "aljazeera_world",
    label: "Al Jazeera World",
    category: "news",
    type: "rss",
    url: "https://www.aljazeera.com/xml/rss/all.xml"
  },
  npr_world: {
    id: "npr_world",
    label: "NPR World",
    category: "news",
    type: "rss",
    url: "https://feeds.npr.org/1004/rss.xml"
  },

  // Conservative / alt
  redstate_news: { id: "redstate_news", label: "RedState", category: "news", type: "rss", url: "https://redstate.com/feed" },
  federalist_news: { id: "federalist_news", label: "The Federalist", category: "news", type: "rss", url: "https://thefederalist.com/feed/" },
  newsmax_news: { id: "newsmax_news", label: "Newsmax", category: "news", type: "rss", url: "https://www.newsmax.com/rss/" },
  dailywire_news: { id: "dailywire_news", label: "The Daily Wire", category: "news", type: "rss", url: "https://www.dailywire.com/feeds/rss.xml" },
  breitbart_news: { id: "breitbart_news", label: "Breitbart", category: "news", type: "rss", url: "https://www.breitbart.com/feed/" },
  gatewaypundit_news: { id: "gatewaypundit_news", label: "The Gateway Pundit", category: "news", type: "rss", url: "https://www.thegatewaypundit.com/feed/" },
  townhall_news: { id: "townhall_news", label: "Townhall", category: "news", type: "rss", url: "https://townhall.com/rss/" },

  // --------------------
  // JAVA
  // --------------------
  baeldung_java: { id: "baeldung_java", label: "Baeldung (Java)", category: "java", type: "rss", url: "https://www.baeldung.com/feed" },
  infoq_java: { id: "infoq_java", label: "InfoQ Java", category: "java", type: "rss", url: "https://feed.infoq.com/java/" },
  dzone_java: { id: "dzone_java", label: "DZone Java", category: "java", type: "rss", url: "https://feeds.dzone.com/java" },
  jetbrains_java: { id: "jetbrains_java", label: "JetBrains Java", category: "java", type: "rss", url: "https://blog.jetbrains.com/category/java/feed/" },
  frankel_java: { id: "frankel_java", label: "Nicolas Frankel", category: "java", type: "rss", url: "https://blog.frankel.ch/index.xml" },
  petrikainulainen_java: { id: "petrikainulainen_java", label: "Petri Kainulainen (Java)", category: "java", type: "rss", url: "https://www.petrikainulainen.net/feed/" },
  devto_java: { id: "devto_java", label: "Dev.to Java", category: "java", type: "rss", url: "https://dev.to/feed/tag/java" },

  // --------------------
  // CYBERSECURITY
  // --------------------
  krebs_security: { id: "krebs_security", label: "Krebs on Security", category: "cybersecurity", type: "rss", url: "https://krebsonsecurity.com/feed/" },
  darkreading_security: { id: "darkreading_security", label: "Dark Reading", category: "cybersecurity", type: "rss", url: "https://www.darkreading.com/rss.xml" },
  thehackernews: { id: "thehackernews", label: "The Hacker News", category: "cybersecurity", type: "rss", url: "https://thehackernews.com/feeds/posts/default" },
  bleepingcomputer_security: { id: "bleepingcomputer_security", label: "BleepingComputer", category: "cybersecurity", type: "rss", url: "https://www.bleepingcomputer.com/feed/" },
  threatpost_security: { id: "threatpost_security", label: "Threatpost", category: "cybersecurity", type: "rss", url: "https://threatpost.com/feed/" },
  naosec_threatintel: { id: "naosec_threatintel", label: "NaoSec Threat Intel", category: "cybersecurity", type: "rss", url: "https://nao-sec.org/feed" },
  securityweek_cyber: { id: "securityweek_cyber", label: "SecurityWeek", category: "cybersecurity", type: "rss", url: "https://www.securityweek.com/rss" },

  // --------------------
  // IOT
  // --------------------
  iot_agenda: { id: "iot_agenda", label: "IoT Agenda", category: "iot", type: "rss", url: "https://internetofthingsagenda.techtarget.com/rss" },
  connected_world: { id: "connected_world", label: "Connected World", category: "iot", type: "rss", url: "https://connectedworld.com/feed/" },
  link_labs_iot: { id: "link_labs_iot", label: "Link Labs IoT", category: "iot", type: "rss", url: "https://www.link-labs.com/blog/rss.xml" },
  iiot_feedspot_top: { id: "iiot_feedspot_top", label: "Industrial IoT (Feedspot)", category: "iot", type: "rss", url: "https://blog.feedspot.com/industrial_iot_rss_feeds/" },
  stacey_iot: { id: "stacey_iot", label: "Stacey on IoT", category: "iot", type: "rss", url: "https://staceyoniot.com/feed/" },
  postscapes_iot: { id: "postscapes_iot", label: "Postscapes IoT", category: "iot", type: "rss", url: "https://www.postscapes.com/feed/" },
  industrial_iot_news: { id: "industrial_iot_news", label: "Industrial IoT News", category: "iot", type: "rss", url: "https://www.iiot-world.com/feed/" },

  // --------------------
  // SPRING
  // --------------------
  spring_blog: { id: "spring_blog", label: "Spring Blog", category: "spring", type: "rss", url: "https://spring.io/blog.atom" },
  spring_io: { id: "spring_io", label: "Spring.io News", category: "spring", type: "rss", url: "https://spring.io/blog/category/news.atom" },
  spring_news: { id: "spring_news", label: "Spring News", category: "spring", type: "rss", url: "https://spring.io/blog/category/releases.atom" },
  spring_io_guides: { id: "spring_io_guides", label: "Spring Guides", category: "spring", type: "rss", url: "https://spring.io/guides.atom" },
  spring_cloud_blog: { id: "spring_cloud_blog", label: "Spring Cloud Blog", category: "spring", type: "rss", url: "https://spring.io/blog/category/spring-cloud.atom" },
  spring_security_blog: { id: "spring_security_blog", label: "Spring Security Blog", category: "spring", type: "rss", url: "https://spring.io/blog/category/spring-security.atom" },
  petrikainulainen_spring: { id: "petrikainulainen_spring", label: "Petri Kainulainen (Spring)", category: "spring", type: "rss", url: "https://www.petrikainulainen.net/category/spring/feed/" },

  // --------------------
  // AWS
  // --------------------
  aws_news: { id: "aws_news", label: "AWS News Blog", category: "aws", type: "rss", url: "https://aws.amazon.com/blogs/aws/feed/" },
  aws_arch: { id: "aws_arch", label: "AWS Architecture Blog", category: "aws", type: "rss", url: "https://aws.amazon.com/blogs/architecture/feed/" },
  aws_official_blog: { id: "aws_official_blog", label: "AWS Official Blog", category: "aws", type: "rss", url: "https://aws.amazon.com/blogs/feed/" },
  aws_security_blog: { id: "aws_security_blog", label: "AWS Security Blog", category: "aws", type: "rss", url: "https://aws.amazon.com/blogs/security/feed/" },
  aws_compute_blog: { id: "aws_compute_blog", label: "AWS Compute Blog", category: "aws", type: "rss", url: "https://aws.amazon.com/blogs/compute/feed/" },
  aws_database_blog: { id: "aws_database_blog", label: "AWS Database Blog", category: "aws", type: "rss", url: "https://aws.amazon.com/blogs/database/feed/" },
  aws_open_source_blog: { id: "aws_open_source_blog", label: "AWS Open Source Blog", category: "aws", type: "rss", url: "https://aws.amazon.com/blogs/opensource/feed/" },

  // --------------------
  // REACT
  // --------------------
  reactjs_blog: { id: "reactjs_blog", label: "ReactJS Blog", category: "react", type: "rss", url: "https://reactjs.org/feed.xml" },
  logrocket_react: { id: "logrocket_react", label: "LogRocket React", category: "react", type: "rss", url: "https://blog.logrocket.com/tag/react/feed/" },
  react_native_blog: { id: "react_native_blog", label: "React Native Blog", category: "react", type: "rss", url: "https://reactnative.dev/blog/rss.xml" },
  overreacted_blog: { id: "overreacted_blog", label: "Overreacted (Dan Abramov)", category: "react", type: "rss", url: "https://overreacted.io/rss.xml" },
  devto_react: { id: "devto_react", label: "Dev.to React", category: "react", type: "rss", url: "https://dev.to/feed/tag/react" },
  hashnode_react: { id: "hashnode_react", label: "Hashnode React", category: "react", type: "rss", url: "https://hashnode.com/n/reactjs/rss" },
  freecodecamp_react: { id: "freecodecamp_react", label: "freeCodeCamp React", category: "react", type: "rss", url: "https://www.freecodecamp.org/news/tag/react/rss/" },

  // --------------------
  // SPORTS
  // --------------------
  espn_sports: { id: "espn_sports", label: "ESPN", category: "sports", type: "rss", url: "https://www.espn.com/espn/rss/news" },
  sky_sports: { id: "sky_sports", label: "Sky Sports", category: "sports", type: "rss", url: "https://www.skysports.com/rss/12040" },
  bbc_sport: { id: "bbc_sport", label: "BBC Sport", category: "sports", type: "rss", url: "http://feeds.bbci.co.uk/sport/rss.xml" },
  yahoo_sports: { id: "yahoo_sports", label: "Yahoo Sports", category: "sports", type: "rss", url: "https://sports.yahoo.com/top/rss.xml" },
  five_thirty_eight_sports: { id: "five_thirty_eight_sports", label: "FiveThirtyEight Sports", category: "sports", type: "rss", url: "https://fivethirtyeight.com/sports/feed/" },
  theathletic_top: { id: "theathletic_top", label: "The Athletic (Top)", category: "sports", type: "rss", url: "https://theathletic.com/feed/" },
  bleacher_report_sports: { id: "bleacher_report_sports", label: "Bleacher Report", category: "sports", type: "rss", url: "https://bleacherreport.com/articles/feed" },

  // --------------------
  // INFOWARS (disabled)
  // --------------------
  infowars_show: {
    id: "infowars_show",
    label: "Alex Jones Show",
    category: "infowars",
    type: "rss",
    url: "http://rss.infowars.com/Alex.rss",
    disabled: true
  }
};

// ------------------------------------------------------------
// Helper: Get feeds by category
// ------------------------------------------------------------
export function getFeedsForCategory(categoryId) {
  return Object.values(FEEDS).filter(
    (f) => f.category === categoryId && !f.disabled
  );
}

// ------------------------------------------------------------
// Helper: Get legacy JSON crypto feeds only
// ------------------------------------------------------------
export function getLegacyCryptoFeeds() {
  return Object.values(FEEDS).filter(
    (f) => f.category === "crypto" && f.type === "json" && !f.disabled
  );
}
