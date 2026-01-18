const { jsonResponse } = require("../utils/jsonResponse.js");

function handleEcho(msg) {
  const payload = msg || "default: echo";

  return jsonResponse(200, {
    status: "ok",
    payload
  });
}

module.exports = { handleEcho };
