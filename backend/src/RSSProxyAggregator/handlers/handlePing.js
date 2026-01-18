// ------------------------------------------------------------
// handlePing.js — v1.208 (Real Lambda Self-Ping, Hardened)
// ------------------------------------------------------------
// Performs an actual HTTPS request to your own API Gateway URL.
// Verifies outbound internet, DNS, TLS, and router correctness.
// ------------------------------------------------------------

const https = require("https");
const { jsonResponse } = require("../utils/jsonResponse.js");

// Stable self-target URL (debug=echo ensures a minimal response)
const SELF_URL =
  "https://jy4i499sj1.execute-api.us-east-1.amazonaws.com/default/RSSProxyAggregator?debug=echo";

// ------------------------------------------------------------
// Internal: Minimal HTTPS GET wrapper
// ------------------------------------------------------------
function httpGet(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            body: data
          });
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

// ------------------------------------------------------------
// Safe JSON parse helper
// ------------------------------------------------------------
function safeJson(str) {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}

// ------------------------------------------------------------
// Public Handler
// ------------------------------------------------------------
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
      error: err?.message || "Unknown error",
      latencyMs: Date.now() - start,
      target: SELF_URL,
      timestamp: Date.now()
    });
  }
}

module.exports = { handlePing };
