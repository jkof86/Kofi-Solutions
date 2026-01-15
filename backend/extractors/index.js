const wrap = require("./debugWrapper");

// Import extractors
const coindesk = wrap(require("./coindesk"), "coindesk.com");
const cointelegraph = wrap(require("./cointelegraph"), "cointelegraph.com");
const nytimes = wrap(require("./nytimes"), "nytimes.com");
const bbcworld = wrap(require("./bbcworld"), "bbc.com");
const cnbc = wrap(require("./cnbc"), "cnbc.com");
const espn = wrap(require("./espn"), "espn.com");
const foxnewslatest = wrap(require("./foxnewslatest"), "foxnews.com");
const investing = wrap(require("./investing"), "investing.com");
const javascriptweekly = wrap(require("./javascriptweekly"), "javascriptweekly.com");
const nprworld = wrap(require("./nprworld"), "npr.org");
const overreacted = wrap(require("./overreacted"), "overreacted.io");
const reactblog = wrap(require("./reactblog"), "reactjs.org");
const devtoreact = wrap(require("./devtoreact"), "dev.to");
const dzonejava = wrap(require("./dzonejava"), "dzone.com");
const aljazeeraworld = wrap(require("./aljazeeraworld"), "aljazeera.com");
const skysports = wrap(require("./skysports"), "skysports.com");
const yahoofinance = wrap(require("./yahoofinance"), "finance.yahoo.com");

// Default extractor
const defaultExtractor = wrap(
  async () => ({
    image: null,
    description: null,
    author: null,
    published: null,
    tags: []
  }),
  "default"
);

const map = {
  "coindesk.com": coindesk,
  "cointelegraph.com": cointelegraph,
  "nytimes.com": nytimes,
  "bbc.com": bbcworld,
  "cnbc.com": cnbc,
  "espn.com": espn,
  "foxnews.com": foxnewslatest,
  "investing.com": investing,
  "javascriptweekly.com": javascriptweekly,
  "npr.org": nprworld,
  "overreacted.io": overreacted,
  "reactjs.org": reactblog,
  "dev.to": devtoreact,
  "dzone.com": dzonejava,
  "aljazeera.com": aljazeeraworld,
  "skysports.com": skysports,
  "finance.yahoo.com": yahoofinance
};

module.exports = function getExtractor(url) {
  try {
    const domain = new URL(url).hostname.replace(/^www\./, "");
    return map[domain] || defaultExtractor;
  } catch {
    return defaultExtractor;
  }
};
