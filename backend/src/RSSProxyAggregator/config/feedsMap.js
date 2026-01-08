// ------------------------------------------------------------
// feedsMap.js — Backend v1.204 (RSS + JSON + Handler-Safe)
// ------------------------------------------------------------
//
// Supports:
//   ✓ RSS feeds
//   ✓ JSON feeds (via jsonHandlers.js)
//   ✓ Handler-based feeds (Yahoo Crypto, CryptoPanic, CoinGecko)
//   ✓ Full compatibility with handleFeed v1.204
//   ✓ Full compatibility with handleHealth v1.204
//
// Feed object shape:
//   {
//     id: string,
//     name: string,
//     url: string,
//     type: "rss" | "json",
//     category: string,
//     handler?: string   // for JSON feeds
//   }
//
// ------------------------------------------------------------

const FEEDS = {
  // ------------------------------------------------------------
  // CRYPTO (RSS)
  // ------------------------------------------------------------
  coindesk: {
    id: "coindesk",
    name: "CoinDesk",
    url: "https://www.coindesk.com/arc/outboundfeeds/rss/",
    type: "rss",
    category: "crypto",
  },
  cointelegraph: {
    id: "cointelegraph",
    name: "CoinTelegraph",
    url: "https://cointelegraph.com/rss",
    type: "rss",
    category: "crypto",
  },
  cryptoslate: {
    id: "cryptoslate",
    name: "CryptoSlate",
    url: "https://cryptoslate.com/feed/",
    type: "rss",
    category: "crypto",
  },
  decrypt: {
    id: "decrypt",
    name: "Decrypt",
    url: "https://decrypt.co/feed",
    type: "rss",
    category: "crypto",
  },

  // ------------------------------------------------------------
  // CRYPTO (JSON HANDLERS)
  // ------------------------------------------------------------
  yahoo_crypto: {
    id: "yahoo_crypto",
    name: "Yahoo Crypto (JSON)",
    url: "https://query1.finance.yahoo.com/v7/finance/quote?symbols=BTC-USD,ETH-USD,SOL-USD,XRP-USD,ADA-USD",
    type: "json",
    handler: "yahoo_crypto",
    category: "crypto",
  },
  cryptopanic_crypto: {
    id: "cryptopanic_crypto",
    name: "CryptoPanic",
    url: "https://cryptopanic.com/api/v1/posts/?auth_token=demo&public=true",
    type: "json",
    handler: "cryptopanic_crypto",
    category: "crypto",
  },
  coingecko_crypto: {
    id: "coingecko_crypto",
    name: "CoinGecko Updates",
    url: "https://api.coingecko.com/api/v3/status_updates",
    type: "json",
    handler: "coingecko_crypto",
    category: "crypto",
  },

  // ------------------------------------------------------------
  // FINANCE
  // ------------------------------------------------------------
  cnbc_markets: {
    id: "cnbc_markets",
    name: "CNBC Markets",
    url: "https://www.cnbc.com/id/10001147/device/rss/rss.html",
    type: "rss",
    category: "finance",
  },
  investing: {
    id: "investing",
    name: "Investing.com",
    url: "https://www.investing.com/rss/news_25.rss",
    type: "rss",
    category: "finance",
  },
  yahoo_finance: {
    id: "yahoo_finance",
    name: "Yahoo Finance",
    url: "https://finance.yahoo.com/news/rssindex",
    type: "rss",
    category: "finance",
  },

  // ------------------------------------------------------------
  // NEWS
  // ------------------------------------------------------------
  aljazeera_world: {
    id: "aljazeera_world",
    name: "Al Jazeera World",
    url: "https://www.aljazeera.com/xml/rss/all.xml",
    type: "rss",
    category: "news",
  },
  bbc_world: {
    id: "bbc_world",
    name: "BBC World",
    url: "http://feeds.bbci.co.uk/news/world/rss.xml",
    type: "rss",
    category: "news",
  },
  fox_latest: {
    id: "fox_latest",
    name: "Fox News Latest",
    url: "https://feeds.foxnews.com/foxnews/latest",
    type: "rss",
    category: "news",
  },
  npr_world: {
    id: "npr_world",
    name: "NPR World",
    url: "https://feeds.npr.org/1004/rss.xml",
    type: "rss",
    category: "news",
  },
  nyt_home: {
    id: "nyt_home",
    name: "NYT Home",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
    type: "rss",
    category: "news",
  },

  // ------------------------------------------------------------
  // ⭐ ALTERNATIVE NEWS (NEW CATEGORY)
  // ------------------------------------------------------------
  intercept: {
    id: "intercept",
    name: "The Intercept",
    url: "https://theintercept.com/feed/?rss",
    type: "rss",
    category: "alternative_news",
  },
  propublica: {
    id: "propublica",
    name: "ProPublica",
    url: "https://www.propublica.org/feeds/propublica/main",
    type: "rss",
    category: "alternative_news",
  },
  reason: {
    id: "reason",
    name: "Reason Magazine",
    url: "https://reason.com/feed/",
    type: "rss",
    category: "alternative_news",
  },
  atlantic: {
    id: "atlantic",
    name: "The Atlantic",
    url: "https://www.theatlantic.com/feed/all/",
    type: "rss",
    category: "alternative_news",
  },
  the_hill: {
    id: "the_hill",
    name: "The Hill",
    url: "https://thehill.com/feed/",
    type: "rss",
    category: "alternative_news",
  },
  axios: {
    id: "axios",
    name: "Axios",
    url: "https://www.axios.com/rss",
    type: "rss",
    category: "alternative_news",
  },
  vice_world: {
    id: "vice_world",
    name: "VICE World News",
    url: "https://www.vice.com/en/rss",
    type: "rss",
    category: "alternative_news",
  },

  // ------------------------------------------------------------
  // AWS
  // ------------------------------------------------------------
  aws_news: {
    id: "aws_news",
    name: "AWS News Blog",
    url: "https://aws.amazon.com/blogs/aws/feed/",
    type: "rss",
    category: "aws",
  },
  aws_official_blog: {
    id: "aws_official_blog",
    name: "AWS Official Blog",
    url: "https://aws.amazon.com/blogs/security/feed/",
    type: "rss",
    category: "aws",
  },

  // ------------------------------------------------------------
  // SPRING
  // ------------------------------------------------------------
  spring_blog: {
    id: "spring_blog",
    name: "Spring Blog",
    url: "https://spring.io/blog.atom",
    type: "rss",
    category: "spring",
  },
  spring_cloud_blog: {
    id: "spring_cloud_blog",
    name: "Spring Cloud Blog",
    url: "https://spring.io/blog/category/cloud.atom",
    type: "rss",
    category: "spring",
  },
  spring_releases: {
    id: "spring_releases",
    name: "Spring Releases",
    url: "https://spring.io/blog/category/releases.atom",
    type: "rss",
    category: "spring",
  },
  spring_security_blog: {
    id: "spring_security_blog",
    name: "Spring Security Blog",
    url: "https://spring.io/blog/category/security.atom",
    type: "rss",
    category: "spring",
  },

  // ------------------------------------------------------------
  // JAVA
  // ------------------------------------------------------------
  baeldung: {
    id: "baeldung",
    name: "Baeldung",
    url: "https://feeds.feedburner.com/Baeldung",
    type: "rss",
    category: "java",
  },
  dzone_java: {
    id: "dzone_java",
    name: "DZone Java",
    url: "https://feeds.dzone.com/java",
    type: "rss",
    category: "java",
  },
  infoq_java: {
    id: "infoq_java",
    name: "InfoQ Java",
    url: "https://feed.infoq.com/java",
    type: "rss",
    category: "java",
  },
  jetbrains_java: {
    id: "jetbrains_java",
    name: "JetBrains Java",
    url: "https://blog.jetbrains.com/java/feed/",
    type: "rss",
    category: "java",
  },

  // ------------------------------------------------------------
  // REACT
  // ------------------------------------------------------------
  devto_react: {
    id: "devto_react",
    name: "Dev.to React",
    url: "https://dev.to/feed/tag/react",
    type: "rss",
    category: "react",
  },
  javascript_weekly: {
    id: "javascript_weekly",
    name: "JavaScript Weekly",
    url: "https://javascriptweekly.com/rss/",
    type: "rss",
    category: "react",
  },
  logrocket_react: {
    id: "logrocket_react",
    name: "LogRocket React",
    url: "https://blog.logrocket.com/tag/react/feed/",
    type: "rss",
    category: "react",
  },
  overreacted: {
    id: "overreacted",
    name: "Overreacted",
    url: "https://overreacted.io/rss.xml",
    type: "rss",
    category: "react",
  },
  react_blog: {
    id: "react_blog",
    name: "React Blog",
    url: "https://reactjs.org/feed.xml",
    type: "rss",
    category: "react",
  },

  // ------------------------------------------------------------
  // SPORTS
  // ------------------------------------------------------------
  bbc_sport: {
    id: "bbc_sport",
    name: "BBC Sport",
    url: "http://feeds.bbci.co.uk/sport/rss.xml",
    type: "rss",
    category: "sports",
  },
  bleacher_report: {
    id: "bleacher_report",
    name: "Bleacher Report",
    url: "https://bleacherreport.com/articles/feed",
    type: "rss",
    category: "sports",
  },
  espn: {
    id: "espn",
    name: "ESPN",
    url: "https://www.espn.com/espn/rss/news",
    type: "rss",
    category: "sports",
  },
  sky_sports: {
    id: "sky_sports",
    name: "Sky Sports",
    url: "https://www.skysports.com/rss/12040",
    type: "rss",
    category: "sports",
  },
  yahoo_sports: {
    id: "yahoo_sports",
    name: "Yahoo Sports",
    url: "https://sports.yahoo.com/rss/",
    type: "rss",
    category: "sports",
  },
};

Object.freeze(FEEDS);

module.exports = { FEEDS };
