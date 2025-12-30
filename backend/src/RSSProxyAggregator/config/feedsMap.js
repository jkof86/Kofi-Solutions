// backend/src/lambda/config/feedsMap.js
// FEEDS v1.180 — FLAT MAP (L3: long name + short label + categories)

const FEEDS = {
  // ------------------------------------------------------------
  // CRYPTO
  // ------------------------------------------------------------
  coindesk: {
    id: "coindesk",
    category: "crypto",
    categories: ["crypto"],
    name: "CoinDesk — Global Crypto News",
    label: "CoinDesk",
    url: "https://www.coindesk.com/arc/outboundfeeds/rss/",
    type: "rss"
  },
  cointelegraph: {
    id: "cointelegraph",
    category: "crypto",
    categories: ["crypto"],
    name: "CoinTelegraph — Cryptocurrency & Blockchain News",
    label: "CoinTelegraph",
    url: "https://cointelegraph.com/rss",
    type: "rss"
  },
  decrypt: {
    id: "decrypt",
    category: "crypto",
    categories: ["crypto"],
    name: "Decrypt — Crypto & Web3 News",
    label: "Decrypt",
    url: "https://decrypt.co/feed",
    type: "rss"
  },
  the_block: {
    id: "the_block",
    category: "crypto",
    categories: ["crypto"],
    name: "The Block — Digital Assets & Market Research",
    label: "The Block",
    url: "https://www.theblock.co/rss",
    type: "rss"
  },
  cryptoslate: {
    id: "cryptoslate",
    category: "crypto",
    categories: ["crypto"],
    name: "CryptoSlate — Crypto Market Intelligence",
    label: "CryptoSlate",
    url: "https://cryptoslate.com/feed/",
    type: "rss"
  },
  messari: {
    id: "messari",
    category: "crypto",
    categories: ["crypto"],
    name: "Messari News — Crypto Research & Insights",
    label: "Messari",
    url: "https://data.messari.io/api/v1/news",
    type: "json"
  },

  // ------------------------------------------------------------
  // FINANCE
  // ------------------------------------------------------------
  marketwatch: {
    id: "marketwatch",
    category: "finance",
    categories: ["finance"],
    name: "MarketWatch — Top Financial Stories",
    label: "MarketWatch",
    url: "https://www.marketwatch.com/feeds/topstories",
    type: "rss"
  },
  yahoo_finance: {
    id: "yahoo_finance",
    category: "finance",
    categories: ["finance"],
    name: "Yahoo Finance — Market & Business News",
    label: "Yahoo Finance",
    url: "https://finance.yahoo.com/news/rssindex",
    type: "rss"
  },
  investing: {
    id: "investing",
    category: "finance",
    categories: ["finance"],
    name: "Investing.com — Global Markets & Economic News",
    label: "Investing",
    url: "https://www.investing.com/rss/news.rss",
    type: "rss"
  },
  wsj_markets: {
    id: "wsj_markets",
    category: "finance",
    categories: ["finance"],
    name: "Wall Street Journal — Markets",
    label: "WSJ Markets",
    url: "https://feeds.a.dj.com/rss/RSSMarketsMain.xml",
    type: "rss"
  },
  cnbc_markets: {
    id: "cnbc_markets",
    category: "finance",
    categories: ["finance"],
    name: "CNBC — Markets & Investing",
    label: "CNBC",
    url: "https://www.cnbc.com/id/100003114/device/rss/rss.html",
    type: "rss"
  },
  ft_markets: {
    id: "ft_markets",
    category: "finance",
    categories: ["finance"],
    name: "Financial Times — Markets",
    label: "FT Markets",
    url: "https://www.ft.com/markets/rss",
    type: "rss"
  },

  // ------------------------------------------------------------
  // NEWS
  // ------------------------------------------------------------
  reuters_top: {
    id: "reuters_top",
    category: "news",
    categories: ["news"],
    name: "Reuters — Top News",
    label: "Reuters",
    url: "http://feeds.reuters.com/reuters/topNews",
    type: "rss"
  },
  ap_news: {
    id: "ap_news",
    category: "news",
    categories: ["news"],
    name: "Associated Press — Breaking News",
    label: "AP News",
    url: "https://apnews.com/rss",
    type: "rss"
  },
  bbc_world: {
    id: "bbc_world",
    category: "news",
    categories: ["news"],
    name: "BBC World — International News",
    label: "BBC World",
    url: "http://feeds.bbci.co.uk/news/world/rss.xml",
    type: "rss"
  },
  fox_latest: {
    id: "fox_latest",
    category: "news",
    categories: ["news"],
    name: "Fox News — Latest Headlines",
    label: "Fox News",
    url: "http://feeds.foxnews.com/foxnews/latest",
    type: "rss"
  },
  nyt_home: {
    id: "nyt_home",
    category: "news",
    categories: ["news"],
    name: "New York Times — Home Page",
    label: "NYT",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
    type: "rss"
  },
  npr_world: {
    id: "npr_world",
    category: "news",
    categories: ["news"],
    name: "NPR — World News",
    label: "NPR World",
    url: "https://feeds.npr.org/1004/rss.xml",
    type: "rss"
  },
  aljazeera_world: {
    id: "aljazeera_world",
    category: "news",
    categories: ["news"],
    name: "Al Jazeera — World News",
    label: "Al Jazeera",
    url: "https://www.aljazeera.com/xml/rss/all.xml",
    type: "rss"
  },

  // ------------------------------------------------------------
  // ALTERNATIVE NEWS
  // ------------------------------------------------------------
  intercept: {
    id: "intercept",
    category: "alternative_news",
    categories: ["alternative_news"],
    name: "The Intercept — Investigative Journalism",
    label: "Intercept",
    url: "https://theintercept.com/feed/?lang=en",
    type: "rss"
  },
  propublica: {
    id: "propublica",
    category: "alternative_news",
    categories: ["alternative_news"],
    name: "ProPublica — Investigative Reporting",
    label: "ProPublica",
    url: "https://www.propublica.org/feeds/propublica/main",
    type: "rss"
  },
  reason: {
    id: "reason",
    category: "alternative_news",
    categories: ["alternative_news"],
    name: "Reason Magazine — Libertarian Commentary",
    label: "Reason",
    url: "https://reason.com/feed/",
    type: "rss"
  },
  atlantic: {
    id: "atlantic",
    category: "alternative_news",
    categories: ["alternative_news"],
    name: "The Atlantic — Politics & Culture",
    label: "Atlantic",
    url: "https://www.theatlantic.com/feed/all/",
    type: "rss"
  },
  the_hill: {
    id: "the_hill",
    category: "alternative_news",
    categories: ["alternative_news"],
    name: "The Hill — U.S. Politics",
    label: "The Hill",
    url: "https://thehill.com/feed/",
    type: "rss"
  },
  axios: {
    id: "axios",
    category: "alternative_news",
    categories: ["alternative_news"],
    name: "Axios — Smart Brevity News",
    label: "Axios",
    url: "https://www.axios.com/feed",
    type: "rss"
  },
  vice_world: {
    id: "vice_world",
    category: "alternative_news",
    categories: ["alternative_news"],
    name: "Vice World News — Global Reporting",
    label: "Vice",
    url: "https://www.vice.com/en/rss?locale=en_us&vertical=news",
    type: "rss"
  },

  // ------------------------------------------------------------
  // JAVA
  // ------------------------------------------------------------
  infoq_java: {
    id: "infoq_java",
    category: "java",
    categories: ["java"],
    name: "InfoQ — Java News & Articles",
    label: "InfoQ Java",
    url: "https://feed.infoq.com/java",
    type: "rss"
  },
  baeldung: {
    id: "baeldung",
    category: "java",
    categories: ["java"],
    name: "Baeldung — Java Tutorials",
    label: "Baeldung",
    url: "https://www.baeldung.com/feed",
    type: "rss"
  },
  jetbrains_java: {
    id: "jetbrains_java",
    category: "java",
    categories: ["java"],
    name: "JetBrains — Java Developer Blog",
    label: "JetBrains",
    url: "https://blog.jetbrains.com/java/feed/",
    type: "rss"
  },
  dzone_java: {
    id: "dzone_java",
    category: "java",
    categories: ["java"],
    name: "DZone — Java Zone",
    label: "DZone",
    url: "https://feeds.dzone.com/java",
    type: "rss"
  },

  // ------------------------------------------------------------
  // SPRING
  // ------------------------------------------------------------
  spring_blog: {
    id: "spring_blog",
    category: "spring",
    categories: ["spring"],
    name: "Spring Blog — Official Updates",
    label: "Spring Blog",
    url: "https://spring.io/blog.atom",
    type: "rss"
  },
  spring_releases: {
    id: "spring_releases",
    category: "spring",
    categories: ["spring"],
    name: "Spring — Release Announcements",
    label: "Spring Releases",
    url: "https://spring.io/blog/category/releases.atom",
    type: "rss"
  },
  spring_security_blog: {
    id: "spring_security_blog",
    category: "spring",
    categories: ["spring"],
    name: "Spring Security — Official Blog",
    label: "Spring Security",
    url: "https://spring.io/blog/category/security.atom",
    type: "rss"
  },
  spring_cloud_blog: {
    id: "spring_cloud_blog",
    category: "spring",
    categories: ["spring"],
    name: "Spring Cloud — Official Blog",
    label: "Spring Cloud",
    url: "https://spring.io/blog/category/spring-cloud.atom",
    type: "rss"
  },

  // ------------------------------------------------------------
  // AWS
  // ------------------------------------------------------------
  aws_news: {
    id: "aws_news",
    category: "aws",
    categories: ["aws"],
    name: "AWS — What's New",
    label: "AWS News",
    url: "https://aws.amazon.com/about-aws/whats-new/recent/feed/",
    type: "rss"
  },
  aws_official_blog: {
    id: "aws_official_blog",
    category: "aws",
    categories: ["aws"],
    name: "AWS Official Blog — Cloud Updates",
    label: "AWS Blog",
    url: "https://aws.amazon.com/blogs/aws/feed/",
    type: "rss"
  },
  aws_security_blog: {
    id: "aws_security_blog",
    category: "aws",
    categories: ["aws"],
    name: "AWS Security Blog — Cloud Security Insights",
    label: "AWS Security",
    url: "https://aws.amazon.com/blogs/security/feed/",
    type: "rss"
  },
  aws_compute_blog: {
    id: "aws_compute_blog",
    category: "aws",
    categories: ["aws"],
    name: "AWS Compute Blog — EC2, Lambda, Containers",
    label: "AWS Compute",
    url: "https://aws.amazon.com/blogs/compute/feed/",
    type: "rss"
  },

  // ------------------------------------------------------------
  // REACT / JS
  // ------------------------------------------------------------
  react_blog: {
    id: "react_blog",
    category: "react",
    categories: ["react"],
    name: "React Blog — Official Updates",
    label: "React",
    url: "https://react.dev/feed.xml",
    type: "rss"
  },
  javascript_weekly: {
    id: "javascript_weekly",
    category: "react",
    categories: ["react"],
    name: "JavaScript Weekly — JS News & Articles",
    label: "JS Weekly",
    url: "https://javascriptweekly.com/rss",
    type: "rss"
  },
  logrocket_react: {
    id: "logrocket_react",
    category: "react",
    categories: ["react"],
    name: "LogRocket — React Tutorials & Guides",
    label: "LogRocket",
    url: "https://blog.logrocket.com/tag/react/feed/",
    type: "rss"
  },
  overreacted: {
    id: "overreacted",
    category: "react",
    categories: ["react"],
    name: "Overreacted — Dan Abramov",
    label: "Overreacted",
    url: "https://overreacted.io/rss.xml",
    type: "rss"
  },
  devto_react: {
    id: "devto_react",
    category: "react",
    categories: ["react"],
    name: "Dev.to — React Tag Feed",
    label: "Dev.to React",
    url: "https://dev.to/feed/tag/react",
    type: "rss"
  },

  // ------------------------------------------------------------
  // IOT
  // ------------------------------------------------------------
  iot_world_today: {
    id: "iot_world_today",
    category: "iot",
    categories: ["iot"],
    name: "IoT World Today — Internet of Things News",
    label: "IoT World",
    url: "https://www.iotworldtoday.com/feed/",
    type: "rss"
  },
  stacey_iot: {
    id: "stacey_iot",
    category: "iot",
    categories: ["iot"],
    name: "Stacey on IoT — Connected Tech Insights",
    label: "Stacey IoT",
    url: "https://staceyoniot.com/feed/",
    type: "rss"
  },
  industrial_iot_news: {
    id: "industrial_iot_news",
    category: "iot",
    categories: ["iot"],
    name: "Industrial IoT News — IIoT Industry Updates",
    label: "Industrial IoT",
    url: "https://www.iiot-world.com/feed/",
    type: "rss"
  },
  postscapes_iot: {
    id: "postscapes_iot",
    category: "iot",
    categories: ["iot"],
    name: "Postscapes — IoT News & Analysis",
    label: "Postscapes",
    url: "https://www.postscapes.com/feed/",
    type: "rss"
  },
  connected_world: {
    id: "connected_world",
    category: "iot",
    categories: ["iot"],
    name: "Connected World — IoT & Tech News",
    label: "Connected World",
    url: "https://connectedworld.com/feed/",
    type: "rss"
  },

  // ------------------------------------------------------------
  // CYBERSECURITY
  // ------------------------------------------------------------
  krebs_security: {
    id: "krebs_security",
    category: "cybersecurity",
    categories: ["cybersecurity"],
    name: "Krebs on Security — Cybersecurity Investigations",
    label: "Krebs",
    url: "https://krebsonsecurity.com/feed/",
    type: "rss"
  },
  darkreading: {
    id: "darkreading",
    category: "cybersecurity",
    categories: ["cybersecurity"],
    name: "Dark Reading — Security News & Analysis",
    label: "Dark Reading",
    url: "https://www.darkreading.com/rss.xml",
    type: "rss"
  },
  the_hacker_news: {
    id: "the_hacker_news",
    category: "cybersecurity",
    categories: ["cybersecurity"],
    name: "The Hacker News — Cybersecurity Updates",
    label: "Hacker News",
    url: "https://feeds.feedburner.com/TheHackersNews",
    type: "rss"
  },
  bleepingcomputer: {
    id: "bleepingcomputer",
    category: "cybersecurity",
    categories: ["cybersecurity"],
    name: "BleepingComputer — Security & Tech News",
    label: "BleepingComp",
    url: "https://www.bleepingcomputer.com/feed/",
    type: "rss"
  },
  threatpost: {
    id: "threatpost",
    category: "cybersecurity",
    categories: ["cybersecurity"],
    name: "ThreatPost — Cybersecurity News",
    label: "ThreatPost",
    url: "https://threatpost.com/feed/",
    type: "rss"
  },
  securityweek: {
    id: "securityweek",
    category: "cybersecurity",
    categories: ["cybersecurity"],
    name: "SecurityWeek — Cybersecurity Industry News",
    label: "SecurityWeek",
    url: "https://www.securityweek.com/rss",
    type: "rss"
  },
    naosec_threatintel: {
    id: "naosec_threatintel",
    category: "cybersecurity",
    categories: ["cybersecurity"],
    name: "NaoSec — Threat Intelligence & Malware Research",
    label: "NaoSec",
    url: "https://nao-sec.org/feed/",
    type: "rss"
  },

  // ------------------------------------------------------------
  // SPORTS
  // ------------------------------------------------------------
  espn: {
    id: "espn",
    category: "sports",
    categories: ["sports"],
    name: "ESPN — Top Headlines",
    label: "ESPN",
    url: "https://www.espn.com/espn/rss/news",
    type: "rss"
  },
  bleacher_report: {
    id: "bleacher_report",
    category: "sports",
    categories: ["sports"],
    name: "Bleacher Report — Sports News & Highlights",
    label: "Bleacher Report",
    url: "https://bleacherreport.com/articles/feed",
    type: "rss"
  },
  bbc_sport: {
    id: "bbc_sport",
    category: "sports",
    categories: ["sports"],
    name: "BBC Sport — UK & Global Sports Coverage",
    label: "BBC Sport",
    url: "http://feeds.bbci.co.uk/sport/rss.xml?edition=uk",
    type: "rss"
  },
  sky_sports: {
    id: "sky_sports",
    category: "sports",
    categories: ["sports"],
    name: "Sky Sports — Latest Sports News",
    label: "Sky Sports",
    url: "https://www.skysports.com/rss/12040",
    type: "rss"
  },
  yahoo_sports: {
    id: "yahoo_sports",
    category: "sports",
    categories: ["sports"],
    name: "Yahoo Sports — Top Stories",
    label: "Yahoo Sports",
    url: "https://sports.yahoo.com/top/rss.xml",
    type: "rss"
  },

  // ------------------------------------------------------------
  // INFOWARS / ALEX JONES
  // ------------------------------------------------------------
  alex_jones_show: {
    id: "alex_jones_show",
    category: "infowars",
    categories: ["infowars"],
    name: "Alex Jones Show — Infowars Broadcast",
    label: "Alex Jones",
    url: "http://rss.infowars.com/Alex.rss",
    type: "rss"
  },
  infowars_news: {
    id: "infowars_news",
    category: "infowars",
    categories: ["infowars"],
    name: "Infowars — News Feed",
    label: "Infowars News",
    url: "http://rss.infowars.com/Infowars.rss",
    type: "rss"
  },
  war_room: {
    id: "war_room",
    category: "infowars",
    categories: ["infowars"],
    name: "War Room with Owen Shroyer — Infowars",
    label: "War Room",
    url: "http://rss.infowars.com/WarRoom.rss",
    type: "rss"
  },
  david_knight: {
    id: "david_knight",
    category: "infowars",
    categories: ["infowars"],
    name: "David Knight Show — Independent Commentary",
    label: "David Knight",
    url: "https://feeds.feedburner.com/davidknight",
    type: "rss"
  },
  banned_video_clips: {
    id: "banned_video_clips",
    category: "infowars",
    categories: ["infowars"],
    name: "Banned.Video — Featured Clips",
    label: "Banned.Video",
    url: "https://banned.video/feeds/rss.xml",
    type: "rss"
  }
};

// ------------------------------------------------------------
// CATEGORY HELPERS
// ------------------------------------------------------------
function getFeedsForCategory(categoryId) {
  return Object.values(FEEDS).filter((f) => f.category === categoryId);
}

function getLegacyCryptoFeeds() {
  return Object.values(FEEDS).filter(
    (f) => f.category === "crypto" && f.type === "rss"
  );
}

module.exports = {
  FEEDS,
  getFeedsForCategory,
  getLegacyCryptoFeeds
};

