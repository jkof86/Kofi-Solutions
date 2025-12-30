// ------------------------------------------------------------
// handleFeed.js — v1.190 (HEAD-Smart + AWS-Safe)
// ------------------------------------------------------------

const https = require("https");
const dns = require("dns");
const Parser = require("rss-parser");
const axios = require("axios");

const parser = new Parser();

// Optional: one-time DNS test
dns.lookup("google.com", (err, addr) => {
  console.log("[dns test]", err, addr);
});

function testConnectivity() {
  return new Promise((resolve) => {
    const req = https.get("https://www.google.com", (res) => {
      console.log("[net-test] status:", res.statusCode);
      res.resume();
      resolve();
    });
    req.on("error", (err) => {
      console.error("[net-test][ERROR]", err.code || err.message);
      resolve();
    });
    req.setTimeout(3000, () => {
      console.error("[net-test][TIMEOUT]");
      req.destroy();
      resolve();
    });
  });
}

// Known feeds where HEAD is unreliable (404/405/etc.)
const HEAD_UNRELIABLE = new Set([
  "spring_cloud_blog",
  "spring_security_blog",
  "bleacher_report",
]);

async function handleFeed(feedIdOrObj, opts = {}) {
  const feed =
    typeof feedIdOrObj === "object" ? feedIdOrObj : null;

  const id = feed?.id || feedIdOrObj?.id || feedIdOrObj;
  const url = feed?.url || feedIdOrObj?.url;
  const type = feed?.type || feedIdOrObj?.type || "rss";

  console.log("[handleFeed] feedId:", id, "opts:", opts);

  await testConnectivity();

  if (!url || !id) {
    console.error("[handleFeed][INVALID_FEED]", feedIdOrObj);
    return {
      id,
      status: "dead",
      fallback: false,
      count: 0,
      error: "INVALID_FEED",
    };
  }

  const headTimeout = 1500;
  const getTimeout = 3000;

  // HEAD fastFail (unless known unreliable)
  if (!HEAD_UNRELIABLE.has(id)) {
    try {
      const head = await axios.head(url, {
        timeout: headTimeout,
        validateStatus: () => true,
      });

      if (head.status === 404 || head.status === 405) {
        console.warn("[handleFeed][HEAD_UNSUPPORTED]", id, "status:", head.status);
        // fall through to GET
      } else if (head.status >= 400) {
        console.warn("[handleFeed][HEAD_FAIL]", id, "status:", head.status);
        return {
          id,
          status: "dead",
          fallback: false,
          count: 0,
          error: `HEAD ${head.status}`,
        };
      }
    } catch (err) {
      console.error("[handleFeed][HEAD_ERROR]", id, err.code || err.message);
      return {
        id,
        status: "dead",
        fallback: false,
        count: 0,
        error: err.code || err.message,
      };
    }
  }

  // FETCH + PARSE
  try {
    if (type === "rss") {
      const feedData = await parser.parseURL(url);
      const items = Array.isArray(feedData.items) ? feedData.items : [];
      return { id, status: "ok", fallback: false, count: items.length };
    }

    if (type === "json") {
      const res = await axios.get(url, { timeout: getTimeout });
      const items = Array.isArray(res.data?.data) ? res.data.data : [];
      return { id, status: "ok", fallback: false, count: items.length };
    }

    console.error("[handleFeed][INVALID_TYPE]", id, type);
    return {
      id,
      status: "dead",
      fallback: false,
      count: 0,
      error: "INVALID_TYPE",
    };
  } catch (err) {
    console.error("[handleFeed][FETCH_ERROR]", id, url, err.code || err.message);
    return {
      id,
      status: "dead",
      fallback: false,
      count: 0,
      error: err.code || err.message,
    };
  }
}

module.exports = { handleFeed };
