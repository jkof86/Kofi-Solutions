// ------------------------------------------------------------
// feedsMap.js — v1.173 (Aligned With New /feeds Directory)
// ------------------------------------------------------------

const FEEDS = {
  // -----------------------------
  // CRYPTO (JSON + RSS)
  // -----------------------------

  yahoo_crypto: {
    label: "Yahoo Crypto",
    type: "json",
    url: "https://query1.finance.yahoo.com/v7/finance/quote?symbols=BTC-USD",
    handler: "yahoo_crypto",
    fallback: true
  },

  coingecko_crypto: {
    label: "CoinGecko Crypto",
    type: "json",
    url: "https://api.coingecko.com/api/v3/status_updates",
    handler: "coingecko_crypto",
    fallback: true
  },

  cryptopanic_crypto: {
    label: "CryptoPanic",
    type: "json",
    url: "https://cryptopanic.com/api/v1/posts/?auth_token=YOUR_KEY&public=true",
    handler: "cryptopanic_crypto",
    fallback: true
  },

  ct: {
    label: "CoinTelegraph",
    url: "https://cointelegraph.com/rss",
    type: "rss",
    handler: null,
    fallback: true
  },

  decrypt: {
    label: "Decrypt",
    url: "https://decrypt.co/feed",
    type: "rss",
    handler: null,
    fallback: true
  },

  cb_eng: {
    label: "Coinbase Engineering",
    url: "https://blog.coinbase.com/feed",
    type: "rss",
    handler: null,
    fallback: true
  },

  cb: {
    label: "Coinbase Blog",
    url: "https://blog.coinbase.com/feed",
    type: "rss",
    handler: null,
    legacy: true,
    fallback: true
  },

  binance_blog: {
    label: "Binance Blog",
    url: "https://www.binance.com/en/blog",
    type: "rss",
    handler: null,
    fallback: true
  },

  kraken_blog: {
    label: "Kraken Blog",
    url: "https://blog.kraken.com/",
    type: "rss",
    handler: null,
    fallback: true
  },

  rh_crypto: {
    label: "Robinhood Crypto",
    url: "https://robinhood.com/crypto",
    type: "rss",
    handler: null,
    fallback: true
  },

  // -----------------------------
  // FINANCE
  // -----------------------------
  marketwatch_finance: {
    label: "MarketWatch Finance",
    url: "https://www.marketwatch.com/rss/topstories",
    type: "rss",
    handler: null,
    fallback: true
  },

  yahoo_finance: {
    label: "Yahoo Finance",
    url: "https://feeds.finance.yahoo.com/rss/2.0/headline?s=^GSPC",
    type: "rss",
    handler: null,
    fallback: true
  },

  ft_finance: {
    label: "Financial Times",
    url: "https://www.ft.com/?format=rss",
    type: "rss",
    handler: null,
    fallback: true
  },

  // -----------------------------
  // WORLD NEWS
  // -----------------------------
  ap_world: {
    label: "AP World",
    url: "https://www.apnews.com/apf-intlnews?format=xml",
    type: "rss",
    handler: null,
    fallback: true
  },

  reuters_world: {
    label: "Reuters World",
    url: "https://feeds.reuters.com/Reuters/worldNews",
    type: "rss",
    handler: null,
    fallback: true
  },

  guardian_world: {
    label: "The Guardian World",
    url: "https://www.theguardian.com/world/rss",
    type: "rss",
    handler: null,
    fallback: true
  },

  // -----------------------------
  // JAVA
  // -----------------------------
  baeldung_java: {
    label: "Baeldung Java",
    url: "https://www.baeldung.com/feed",
    type: "rss",
    handler: null,
    fallback: true
  },

  infoq_java: {
    label: "InfoQ Java",
    url: "https://feed.infoq.com/java",
    type: "rss",
    handler: null,
    fallback: true
  },

  dzone_java: {
    label: "DZone Java",
    url: "https://feeds.dzone.com/java",
    type: "rss",
    handler: null,
    fallback: true
  },

  // -----------------------------
  // SECURITY
  // -----------------------------
  krebs_security: {
    label: "Krebs on Security",
    url: "https://krebsonsecurity.com/feed/",
    type: "rss",
    handler: null,
    fallback: true
  },

  hackernews_security: {
    label: "Hacker News Security",
    url: "https://hnrss.org/frontpage",
    type: "rss",
    handler: null,
    fallback: true
  },

  darkreading_security: {
    label: "DarkReading Security",
    url: "https://www.darkreading.com/rss.xml",
    type: "rss",
    handler: null,
    fallback: true
  },

  // -----------------------------
  // IoT
  // -----------------------------
  iot_world: {
    label: "IoT World Today",
    url: "https://www.iotworldtoday.com/feed/",
    type: "rss",
    handler: null,
    fallback: true
  },

  iot_agenda: {
    label: "IoT Agenda",
    url: "https://www.techtarget.com/iotagenda/rss",
    type: "rss",
    handler: null,
    fallback: true
  },

  // -----------------------------
  // SPRING
  // -----------------------------
  spring_blog: {
    label: "Spring Blog",
    url: "https://spring.io/blog.atom",
    type: "rss",
    handler: null,
    fallback: true
  },

  spring_io: {
    label: "Spring.io Releases",
    url: "https://spring.io/blog/category/releases.atom",
    type: "rss",
    handler: null,
    fallback: true
  },

  // -----------------------------
  // AWS
  // -----------------------------
  aws_news: {
    label: "AWS News",
    url: "https://aws.amazon.com/about-aws/whats-new/recent/feed/",
    type: "rss",
    handler: null,
    fallback: true
  },

  aws_arch: {
    label: "AWS Architecture Blog",
    url: "https://aws.amazon.com/blogs/architecture/feed/",
    type: "rss",
    handler: null,
    fallback: true
  },

  // -----------------------------
  // REACT
  // -----------------------------
  reactjs_blog: {
    label: "ReactJS Blog",
    url: "https://reactjs.org/feed.xml",
    type: "rss",
    handler: null,
    fallback: true
  },

  logrocket_react: {
    label: "LogRocket React",
    url: "https://blog.logrocket.com/tag/react/feed/",
    type: "rss",
    handler: null,
    fallback: true
  },

  // -----------------------------
  // SPORTS
  // -----------------------------
  espn_sports: {
    label: "ESPN Sports",
    url: "https://www.espn.com/espn/rss/news",
    type: "rss",
    handler: null,
    fallback: true
  },

  sky_sports: {
    label: "Sky Sports",
    url: "https://www.skysports.com/rss/12040",
    type: "rss",
    handler: null,
    fallback: true
  }
};

module.exports = { FEEDS };
