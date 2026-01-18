// utils/jsonResponse.js — v1.0 (CommonJS)

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS"
    },
    body: JSON.stringify(body)
  };
}

module.exports = { jsonResponse };
