// ------------------------------------------------------------
// feedsMap.js — v1.180 (Flat + AWS‑Safe + Validator‑Aligned)
// ------------------------------------------------------------
//
// Structure:
//   • Flat object: { feedId: { ... } }
//   • Each feed has: id, name, url, type, category
//   • All feeds are validated, reachable, and Lambda-safe
//   • Dead feeds removed: the_block, messari, marketwatch, ft_markets, reuters_top, ap_news
//
// ------------------------------------------------------------

export const FEEDS = {
  // -------------------------
  // CRYPTO
  // -------------------------
  coindesk: {
    id: "coindesk",
    name: "CoinDesk",
    url: "https://www.coindesk.com/arc/outboundfeeds/rss/",
    type: "rss",
    category: "crypto"
  },
  cointelegraph: {
    id: "cointelegraph",
    name: "CoinTelegraph",
    url: "https://cointelegraph.com/rss",
    type: "rss",
    category: "crypto"
  },
  decrypt: {
    id: "decrypt",
    name: "Decrypt",
    url: "https://decrypt.co/feed",
    type: "rss",
    category: "crypto"
  },
  cryptoslate: {
    id: "cryptoslate",
    name: "CryptoSlate",
    url: "https://cryptoslate.com/feed/",
    type: "rss",
    category: "crypto"
  },

  // -------------------------
  // FINANCE
  // -------------------------
  yahoo_finance: {
    id: "yahoo_finance",
    name: "Yahoo Finance",
    url: "https://finance.yahoo.com/news/rssindex",
    type: "rss",
    category: "finance"
  },
  investing: {
    id: "investing",
    name: "Investing.com",
    url: "https://www.investing.com/rss/news_25.rss",
    type: "rss",
    category: "finance"
  },
  cnbc_markets: {
    id: "cnbc_markets",
    name: "CNBC Markets",
    url: "https://www.cnbc.com/id/10001147/device/rss/rss.html",
    type: "rss",
    category: "finance"
  },

  // -------------------------
  // NEWS
  // -------------------------
  bbc_world: {
    id: "bbc_world",
    name: "BBC World",
    url: "http://feeds.bbci.co.uk/news/world/rss.xml",
    type: "rss",
    category: "news"
  },
  fox_latest: {
    id: "fox_latest",
    name: "Fox News Latest",
    url: "https://feeds.foxnews.com/foxnews/latest",
    type: "rss",
    category: "news"
  },
  nyt_home: {
    id: "nyt_home",
    name: "NYT Home",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
    type: "rss",
    category: "news"
  },
  npr_world: {
    id: "npr_world",
    name: "NPR World",
    url: "https://feeds.npr.org/1004/rss.xml",
    type: "rss",
    category: "news"
  },
  aljazeera_world: {
    id: "aljazeera_world",
    name: "Al Jazeera World",
    url: "https://www.aljazeera.com/xml/rss/all.xml",
    type: "rss",
    category: "news"
  },

  // -------------------------
  // AWS
  // -------------------------
  aws_news: {
    id: "aws_news",
    name: "AWS News Blog",
    url: "https://aws.amazon.com/blogs/aws/feed/",
    type: "rss",
    category: "aws"
  },
  aws_official_blog: {
    id: "aws_official_blog",
    name: "AWS Official Blog",
    url: "https://aws.amazon.com/blogs/security/feed/",
    type: "rss",
    category: "aws"
  },

  // -------------------------
  // SPRING
  // -------------------------
  spring_blog: {
    id: "spring_blog",
    name: "Spring Blog",
    url: "https://spring.io/blog.atom",
    type: "rss",
    category: "spring"
  },
  spring_releases: {
    id: "spring_releases",
    name: "Spring Releases",
    url: "https://spring.io/blog/category/releases.atom",
    type: "rss",
    category: "spring"
  },

  // -------------------------
  // JAVA
  // -------------------------
  infoq_java: {
    id: "infoq_java",
    name: "InfoQ Java",
    url: "https://feed.infoq.com/java",
    type: "rss",
    category: "java"
  },
  baeldung: {
    id: "baeldung",
    name: "Baeldung",
    url: "https://feeds.feedburner.com/Baeldung",
    type: "rss",
    category: "java"
  },

  // -------------------------
  // REACT
  // -------------------------
  react_blog: {
    id: "react_blog",
    name: "React Blog",
    url: "https://reactjs.org/feed.xml",
    type: "rss",
    category: "react"
  },
  logrocket_react: {
    id: "logrocket_react",
    name: "LogRocket React",
    url: "https://blog.logrocket.com/tag/react/feed/",
    type: "rss",
    category: "react"
  },

  // -------------------------
  // SPORTS
  // -------------------------
  espn: {
    id: "espn",
    name: "ESPN",
    url: "https://www.espn.com/espn/rss/news",
    type: "rss",
    category: "sports"
  },
  bleacher_report: {
    id: "bleacher_report",
    name: "Bleacher Report",
    url: "https://bleacherreport.com/articles/feed",
    type: "rss",
    category: "sports"
  }
};
