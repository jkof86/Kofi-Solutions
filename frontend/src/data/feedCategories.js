// ------------------------------------------------------------
// feedCategories.js — Phase 4.4  (Crypto Expansion)
//
// This file defines all feed groups used by Home.jsx + TabsLayout.
// Each category maps to an array of feed objects:
//   { name: "feedKey", label: "Human Label", symbol?: "BTC" }
//
// The `name` must match the FEEDS map in Lambda.
// The `label` is what appears in the UI tabs.
// ------------------------------------------------------------

export const feedCategories = {
  // ------------------------------------------------------------
  // CRYPTO
  // ------------------------------------------------------------
  crypto: [
    // CoinTelegraph — crypto news + analysis
    { name: "ct", label: "CoinTelegraph" },

    // Coinbase Blog — fallback-only (Cloudflare protected)
    { name: "cb", label: "Coinbase Blog" },

    // Decrypt — crypto news + guides
    { name: "decrypt", label: "Decrypt" },

    // CryptoPanic — massive crypto aggregator (RSS)
    { name: "cryptopanic", label: "CryptoPanic" },

    // Binance Blog — official exchange blog (RSS)
    { name: "binance_blog", label: "Binance Blog" },

    // Kraken Blog — official exchange blog (RSS)
    { name: "kraken_blog", label: "Kraken Blog" },

    // Robinhood Crypto — reliable JSON feed
    { name: "rh_crypto", label: "Robinhood Crypto" },

    // Yahoo Finance Crypto — reliable JSON feed
    { name: "yf_crypto", label: "Yahoo Crypto" },

    // CoinGecko Crypto — reliable JSON feed
    { name: "cg_crypto", label: "CoinGecko" }
  ],

  // ------------------------------------------------------------
  // FINANCE
  // ------------------------------------------------------------
  finance: [
    { name: "marketwatch", label: "MarketWatch" },
    { name: "investopedia", label: "Investopedia" },
    { name: "seeking_alpha", label: "Seeking Alpha" }
  ],

  // ------------------------------------------------------------
  // NEWS (World News)
  // ------------------------------------------------------------
  news: [
    { name: "reuters_world", label: "Reuters" },
    { name: "bbc_world", label: "BBC World" },
    { name: "ap_world", label: "AP News" }
  ],

  // ------------------------------------------------------------
  // JAVA
  // ------------------------------------------------------------
  java: [
    { name: "jcg", label: "Java Code Geeks" },
    { name: "infoq_java", label: "InfoQ Java" }
  ],

  // ------------------------------------------------------------
  // SECURITY
  // ------------------------------------------------------------
  security: [
    { name: "dark_reading", label: "Dark Reading" },
    { name: "security_week", label: "SecurityWeek" },
    { name: "krebs", label: "Krebs on Security" }
  ],

  // ------------------------------------------------------------
  // IoT
  // ------------------------------------------------------------
  iot: [
    { name: "iot_world", label: "IoT World Today" },
    { name: "stacey_iot", label: "Stacey on IoT" },
    { name: "iot_business", label: "IoT Business News" }
  ],

  // ------------------------------------------------------------
  // SPRING
  // ------------------------------------------------------------
  spring: [
    { name: "spring_blog", label: "Spring Blog" },
    { name: "spring_guides", label: "Spring Guides" }
  ],

  // ------------------------------------------------------------
  // AWS
  // ------------------------------------------------------------
  aws: [
    { name: "aws_news", label: "AWS News" },
    { name: "aws_arch", label: "AWS Architecture" },
    { name: "aws_security", label: "AWS Security" }
  ],

  // ------------------------------------------------------------
  // REACT
  // ------------------------------------------------------------
  react: [
    { name: "react_status", label: "React Status" },
    { name: "logrocket_react", label: "LogRocket React" },
    { name: "smashing_react", label: "Smashing React" }
  ],

  // ------------------------------------------------------------
  // SPORTS
  // ------------------------------------------------------------
  sports: [
    { name: "espn", label: "ESPN" },
    { name: "cbs_sports", label: "CBS Sports" },
    { name: "bleacher", label: "Bleacher Report" }
  ]
}
export default feedCategories;
