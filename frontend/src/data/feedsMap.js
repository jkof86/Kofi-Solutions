// ------------------------------------------------------------
// feedsMap.js — Frontend FEEDS metadata (aligned with backend)
// ------------------------------------------------------------

export const FEEDS = {
  // ------------------------------------------------------------
  // CRYPTO (Primary)
  // ------------------------------------------------------------
  ct: {
    id: "ct",
    label: "CoinTelegraph",
    category: "crypto",
    legacy: false,
    symbol: "btc"
  },
  decrypt: {
    id: "decrypt",
    label: "Decrypt",
    category: "crypto",
    legacy: false,
    symbol: "btc"
  },
  yahoo_crypto: {
    id: "yahoo_crypto",
    label: "Yahoo Crypto",
    category: "crypto",
    legacy: false,
    symbol: "btc"
  },
  coingecko_crypto: {
    id: "coingecko_crypto",
    label: "CoinGecko Status",
    category: "crypto",
    legacy: false,
    symbol: "btc"
  },
  cb_eng: {
    id: "cb_eng",
    label: "Coinbase Engineering",
    category: "crypto",
    legacy: false,
    symbol: "btc"
  },

  // ------------------------------------------------------------
  // CRYPTO (Legacy Sources)
  // ------------------------------------------------------------
  cb: {
    id: "cb",
    label: "Coinbase Blog (HTML)",
    category: "legacy_crypto",
    legacy: true,
    symbol: "btc"
  },
  binance_blog: {
    id: "binance_blog",
    label: "Binance Blog",
    category: "legacy_crypto",
    legacy: true,
    symbol: "btc"
  },
  kraken_blog: {
    id: "kraken_blog",
    label: "Kraken Blog",
    category: "legacy_crypto",
    legacy: true,
    symbol: "btc"
  },
  rh_crypto: {
    id: "rh_crypto",
    label: "Robinhood Crypto",
    category: "legacy_crypto",
    legacy: true,
    symbol: "btc"
  },
  cryptopanic_crypto: {
    id: "cryptopanic_crypto",
    label: "CryptoPanic",
    category: "legacy_crypto",
    legacy: true,
    symbol: "btc"
  },

  // ------------------------------------------------------------
  // FINANCE
  // ------------------------------------------------------------
  marketwatch_finance: {
    id: "marketwatch_finance",
    label: "MarketWatch",
    category: "finance",
    legacy: false,
    symbol: "aapl"
  },
  yahoo_finance: {
    id: "yahoo_finance",
    label: "Yahoo Finance",
    category: "finance",
    legacy: false,
    symbol: "aapl"
  },
  ft_finance: {
    id: "ft_finance",
    label: "Financial Times",
    category: "finance",
    legacy: false,
    symbol: "aapl"
  },

  // ------------------------------------------------------------
  // NEWS
  // ------------------------------------------------------------
  ap_world: {
    id: "ap_world",
    label: "AP World",
    category: "news",
    legacy: false
  },
  reuters_world: {
    id: "reuters_world",
    label: "Reuters World",
    category: "news",
    legacy: false
  },
  guardian_world: {
    id: "guardian_world",
    label: "The Guardian",
    category: "news",
    legacy: false
  },

  // ------------------------------------------------------------
  // JAVA
  // ------------------------------------------------------------
  baeldung_java: {
    id: "baeldung_java",
    label: "Baeldung",
    category: "java",
    legacy: false
  },
  infoq_java: {
    id: "infoq_java",
    label: "InfoQ Java",
    category: "java",
    legacy: false
  },
  dzone_java: {
    id: "dzone_java",
    label: "DZone Java",
    category: "java",
    legacy: false
  },

  // ------------------------------------------------------------
  // SECURITY
  // ------------------------------------------------------------
  krebs_security: {
    id: "krebs_security",
    label: "Krebs on Security",
    category: "security",
    legacy: false
  },
  hackernews_security: {
    id: "hackernews_security",
    label: "Hacker News (Security)",
    category: "security",
    legacy: false
  },
  darkreading_security: {
    id: "darkreading_security",
    label: "Dark Reading",
    category: "security",
    legacy: false
  },

  // ------------------------------------------------------------
  // IoT
  // ------------------------------------------------------------
  iot_world: {
    id: "iot_world",
    label: "IoT World Today",
    category: "iot",
    legacy: false
  },
  iot_agenda: {
    id: "iot_agenda",
    label: "IoT Agenda",
    category: "iot",
    legacy: false
  },

  // ------------------------------------------------------------
  // SPRING
  // ------------------------------------------------------------
  spring_blog: {
    id: "spring_blog",
    label: "Spring Blog",
    category: "spring",
    legacy: false
  },
  spring_io: {
    id: "spring_io",
    label: "Spring.io",
    category: "spring",
    legacy: false
  },

  // ------------------------------------------------------------
  // AWS
  // ------------------------------------------------------------
  aws_news: {
    id: "aws_news",
    label: "AWS News Blog",
    category: "aws",
    legacy: false
  },
  aws_arch: {
    id: "aws_arch",
    label: "AWS Architecture Blog",
    category: "aws",
    legacy: false
  },

  // ------------------------------------------------------------
  // REACT
  // ------------------------------------------------------------
  reactjs_blog: {
    id: "reactjs_blog",
    label: "ReactJS Blog",
    category: "react",
    legacy: false
  },
  logrocket_react: {
    id: "logrocket_react",
    label: "LogRocket React",
    category: "react",
    legacy: false
  },

  // ------------------------------------------------------------
  // SPORTS
  // ------------------------------------------------------------
  espn_sports: {
    id: "espn_sports",
    label: "ESPN",
    category: "sports",
    legacy: false
  },
  sky_sports: {
    id: "sky_sports",
    label: "Sky Sports",
    category: "sports",
    legacy: false
  }
};

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
export function getFeedsForCategory(categoryId) {
  return Object.values(FEEDS).filter(feed => feed.category === categoryId);
}

export function getLegacyCryptoFeeds() {
  return Object.values(FEEDS).filter(
    feed => feed.category === "legacy_crypto"
  );
}
