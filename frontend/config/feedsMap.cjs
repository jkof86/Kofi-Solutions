// feedsMap.cjs
// CommonJS mirror of FEEDS v1.177 for validator use only

const FEEDS = {
  crypto: [
    { id: "coindesk", name: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/", type: "rss" },
    { id: "cointelegraph", name: "CoinTelegraph", url: "https://cointelegraph.com/rss", type: "rss" },
    { id: "decrypt", name: "Decrypt", url: "https://decrypt.co/feed", type: "rss" },
    { id: "theblock", name: "The Block", url: "https://www.theblock.co/rss", type: "rss" },
    { id: "cryptoslate", name: "CryptoSlate", url: "https://cryptoslate.com/feed/", type: "rss" },
    { id: "messari", name: "Messari", url: "https://data.messari.io/api/v1/news", type: "json" }
  ],

  finance: [
    { id: "marketwatch", name: "MarketWatch", url: "https://www.marketwatch.com/feeds/topstories", type: "rss" },
    { id: "yahoo_finance", name: "Yahoo Finance", url: "https://finance.yahoo.com/news/rssindex", type: "rss" },
    { id: "investing", name: "Investing.com", url: "https://www.investing.com/rss/news.rss", type: "rss" },
    { id: "wsj_markets", name: "WSJ Markets", url: "https://feeds.a.dj.com/rss/RSSMarketsMain.xml", type: "rss" },
    { id: "cnbc", name: "CNBC", url: "https://www.cnbc.com/id/100003114/device/rss/rss.html", type: "rss" },
    { id: "ft_markets", name: "Financial Times", url: "https://www.ft.com/markets/rss", type: "rss" }
  ],

  news: [
    { id: "reuters", name: "Reuters", url: "http://feeds.reuters.com/reuters/topNews", type: "rss" },
    { id: "ap", name: "AP News", url: "https://apnews.com/rss", type: "rss" },
    { id: "bbc", name: "BBC", url: "http://feeds.bbci.co.uk/news/rss.xml", type: "rss" },
    { id: "fox", name: "Fox News", url: "http://feeds.foxnews.com/foxnews/latest", type: "rss" },
    { id: "nyt", name: "NY Times", url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml", type: "rss" }
  ],

  java: [
    { id: "infoq_java", name: "InfoQ Java", url: "https://feed.infoq.com/java", type: "rss" },
    { id: "baeldung", name: "Baeldung", url: "https://www.baeldung.com/feed", type: "rss" }
  ],

  spring: [
    { id: "spring_blog", name: "Spring Blog", url: "https://spring.io/blog.atom", type: "rss" },
    { id: "spring_releases", name: "Spring Releases", url: "https://spring.io/blog/category/releases.atom", type: "rss" }
  ],

  aws: [
    { id: "aws_news", name: "AWS News", url: "https://aws.amazon.com/about-aws/whats-new/recent/feed/", type: "rss" },
    { id: "aws_blog", name: "AWS Blog", url: "https://aws.amazon.com/blogs/aws/feed/", type: "rss" }
  ],

  react: [
    { id: "reactjs", name: "React Blog", url: "https://react.dev/feed.xml", type: "rss" },
    { id: "javascript_weekly", name: "JavaScript Weekly", url: "https://javascriptweekly.com/rss", type: "rss" }
  ],

  iot: [
    { id: "iot_world", name: "IoT World Today", url: "https://www.iotworldtoday.com/feed/", type: "rss" }
  ],

  cybersecurity: [
    { id: "krebsonsecurity", name: "Krebs on Security", url: "https://krebsonsecurity.com/feed/", type: "rss" },
    { id: "darkreading", name: "Dark Reading", url: "https://www.darkreading.com/rss.xml", type: "rss" }
  ],

  sports: [
    { id: "espn", name: "ESPN", url: "https://www.espn.com/espn/rss/news", type: "rss" },
    { id: "bleacher", name: "Bleacher Report", url: "https://bleacherreport.com/articles/feed", type: "rss" }
  ]
};

// ----------------------------
// Helper Functions
// ----------------------------
function getFeedsForCategory(categoryId) {
  return FEEDS[categoryId] || [];
}

function getLegacyCryptoFeeds() {
  return FEEDS.crypto.filter(f => f.type === "rss");
}

module.exports = {
  FEEDS,
  getFeedsForCategory,
  getLegacyCryptoFeeds
};
