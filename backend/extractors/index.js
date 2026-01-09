// Import all extractors
const coindesk = require('./coindesk');
const cointelegraph = require('./cointelegraph');
const nytimes = require('./nytimes');
const bbcworld = require('./bbcworld');
const cnbc = require('./cnbc');
const espn = require('./espn');
const foxnewslatest = require('./foxnewslatest');
const investing = require('./investing');
const javascriptweekly = require('./javascriptweekly');
const nprworld = require('./nprworld');
const overreacted = require('./overreacted');
const reactblog = require('./reactblog');
const devtoreact = require('./devtoreact');
const dzonejava = require('./dzonejava');
const aljazeeraworld = require('./aljazeeraworld');
const skysports = require('./skysports');
const yahoofinance = require('./yahoofinance');

// Default fallback extractor
const defaultExtractor = async function (html, url) {
    return { image: null };
};

// Domain → extractor map
const map = {
    'coindesk.com': coindesk,
    'cointelegraph.com': cointelegraph,
    'nytimes.com': nytimes,
    'bbc.com': bbcworld,
    'cnbc.com': cnbc,
    'espn.com': espn,
    'foxnews.com': foxnewslatest,
    'investing.com': investing,
    'javascriptweekly.com': javascriptweekly,
    'npr.org': nprworld,
    'overreacted.io': overreacted,
    'reactjs.org': reactblog,
    'dev.to': devtoreact,
    'dzone.com': dzonejava,
    'aljazeera.com': aljazeeraworld,
    'skysports.com': skysports,
    'finance.yahoo.com': yahoofinance
};

// Export router function
module.exports = function getExtractor(url) {
    try {
        const domain = new URL(url).hostname.replace(/^www\./, '');
        return map[domain] || defaultExtractor;
    } catch (err) {
        return defaultExtractor;
    }
};
