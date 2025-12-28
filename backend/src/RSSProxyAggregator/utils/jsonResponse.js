// ------------------------------------------------------------
// jsonResponse.js — v1.150
// ------------------------------------------------------------
//
// Standardized JSON response wrapper for AWS Lambda.
// Ensures:
//   • CORS headers
//   • JSON.stringify safety
//   • Consistent structure across all handlers
//   • Prevents Lambda crashes from malformed payloads
//
// Used by:
//   • handleFeed
//   • handleMarket
//   • handleHealth
//   • router
//
// ------------------------------------------------------------

function jsonResponse(statusCode = 200, payload = {}) {
  try {
    return {
      statusCode,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS"
      },
      body: JSON.stringify(payload)
    };
  } catch (err) {
    // Failsafe: never let JSON stringify crash Lambda
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS"
      },
      body: JSON.stringify({
        status: "error",
        error: "Failed to serialize JSON response",
        detail: String(err)
      })
    };
  }
}

module.exports = { jsonResponse };
