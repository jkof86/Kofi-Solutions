// ------------------------------------------------------------
// handleRss.js — Wraps safeRssFetch with JSON response
// ------------------------------------------------------------

const { safeRssFetch } = require("./safeRssFetch.js");
const { jsonResponse } = require("../../utils/jsonResponse.js");

async function handleRss(url, feedKey) {
  const result = await safeRssFetch(url, feedKey);

  return jsonResponse(200, {
    status: result.ok ? "ok" : "error",
    items: result.items
  });
}

module.exports = { handleRss };
