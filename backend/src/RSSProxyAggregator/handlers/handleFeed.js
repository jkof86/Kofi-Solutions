// handlers/handleFeed.js
// Universal feed handler v2.4 (CommonJS, router-aligned)
// Signature: handleFeed(feedConfig, { debug, test })

const { parseRss } = require("../utils/rssParser.js");
const { parseJsonFeed } = require("../utils/jsonParser.js");
const { parseHtmlFallback } = require("../utils/htmlFallback.js");
const { universalExtract } = require("../extractors/universalExtractor.js");
const { minimalFallback } = require("../utils/feedHelpers.js");
const { jsonResponse } = require("../utils/jsonResponse.js");

const TIMEOUT_MS = 6500;

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    return res;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

async function handleFeed(feedConfig, { debug, test }) {
  const url = feedConfig?.url;

  if (!url || typeof url !== "string") {
    return jsonResponse(400, {
      items: [],
      health: {
        status: "dead",
        type: "config",
        count: 0,
        error: "Invalid feed configuration"
      }
    });
  }

  let response;
  let text;

  // Network fetch
  try {
    response = await fetchWithTimeout(url);

    if (response.status === 403 || response.status === 429) {
      return jsonResponse(200, {
        items: [],
        health: {
          status: "blocked",
          type: "blocked",
          count: 0,
          error: `HTTP ${response.status}`
        }
      });
    }

    text = await response.text();
  } catch (err) {
    return jsonResponse(200, {
      items: [],
      health: {
        status: "dead",
        type: "network",
        count: 0,
        error: err.message
      }
    });
  }

  // Stage 1: RSS/XML
  try {
    const items = parseRss(text);
    if (items.length > 0) {
      return jsonResponse(200, {
        items,
        health: {
          status: "ok",
          type: "rss",
          count: items.length
        }
      });
    }
  } catch {}

  // Stage 2: JSON Feed
  try {
    const items = parseJsonFeed(text);
    if (items.length > 0) {
      return jsonResponse(200, {
        items,
        health: {
          status: "json",
          type: "json",
          count: items.length
        }
      });
    }
  } catch {}

  // Stage 3: HTML Fallback
  try {
    const items = parseHtmlFallback(text, url);
    if (items.length > 0) {
      return jsonResponse(200, {
        items,
        health: {
          status: "fallback",
          type: "html",
          count: items.length
        }
      });
    }
  } catch (err) {
    return jsonResponse(200, {
      items: [],
      health: {
        status: "html_error",
        type: "html",
        count: 0,
        error: err.message
      }
    });
  }

  // Stage 4: Universal Extractor
  try {
    const items = universalExtract(text, url);
    if (items.length > 0) {
      return jsonResponse(200, {
        items,
        health: {
          status: "fallback",
          type: "universal",
          count: items.length
        }
      });
    }
  } catch {}

  // Stage 5: Minimal Fallback
  const items = minimalFallback(url);
  return jsonResponse(200, {
    items,
    health: {
      status: "dead",
      type: "minimal",
      count: items.length,
      error: "No parser succeeded"
    }
  });
}

module.exports = { handleFeed };
