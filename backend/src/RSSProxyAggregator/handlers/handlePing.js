// ------------------------------------------------------------
// ping.js — v1.202 (Real Lambda Self-Ping)
// ------------------------------------------------------------
// Performs an actual HTTPS request to your own API Gateway URL.
// Verifies outbound internet, DNS, TLS, and router correctness.
// ------------------------------------------------------------

const https = require("https");
const { jsonResponse } = require("../utils/jsonResponse.js");

// Your deployed API Gateway URL
const SELF_URL = "https://jy4i499sj1.execute-api.us-east-1.amazonaws.com/default/RSSProxyAggregator?debug=echo";

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve({ statusCode: res.statusCode, body: data }));
      })
      .on("error", reject);
  });
}

async function handlePing() {
  const start = Date.now();

  try {
    const result = await httpGet(SELF_URL);

    return jsonResponse(200, {
      status: "ok",
      selfPing: true,
      latencyMs: Date.now() - start,
      target: SELF_URL,
      responseStatus: result.statusCode,
      responseBody: safeJson(result.body),
      timestamp: Date.now()
    });
  } catch (err) {
    return jsonResponse(200, {
      status: "error",
      selfPing: false,
      error: err.message,
      latencyMs: Date.now() - start,
      target: SELF_URL,
      timestamp: Date.now()
    });
  }
}

// Safe JSON parse helper
function safeJson(str) {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}

module.exports = { handlePing };
