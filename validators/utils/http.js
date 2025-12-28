// ------------------------------------------------------------
// http.js — Minimal HTTP(S) Client with Redirects & Headers
// ------------------------------------------------------------
//
// Responsibilities:
//   - Perform GET requests (HEAD is too unreliable for feeds)
//   - Follow redirects (301, 302, 307, 308) up to a max depth
//   - Apply sensible headers (User-Agent, Accept)
//   - Enforce timeouts
//   - Return:
//       * statusCode
//       * headers
//       * finalUrl
//       * contentType
//       * body (optional, small)
// ------------------------------------------------------------

const http = require("http");
const https = require("https");
const { URL } = require("url");

const DEFAULT_TIMEOUT_MS = 8000;
const MAX_REDIRECTS = 5;

const DEFAULT_HEADERS = {
  "User-Agent": "Mozilla/5.0 (KofiFeedValidator)",
  Accept:
    "application/rss+xml, application/xml, text/xml, application/json, text/html, */*",
};

/**
 * Perform a GET request with redirects and timeout.
 *
 * @param {string} url - The URL to request.
 * @param {object} options - Optional overrides:
 *   - timeoutMs: number
 *   - maxRedirects: number
 *   - headers: object
 *   - includeBody: boolean (default: true)
 *
 * @returns {Promise<{
 *   statusCode: number | null,
 *   headers: object,
 *   finalUrl: string,
 *   contentType: string | null,
 *   body: string | null,
 *   error: string | null
 * }>}
 */
async function fetchWithRedirects(url, options = {}) {
  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;
  const maxRedirects = options.maxRedirects || MAX_REDIRECTS;
  const headers = Object.assign({}, DEFAULT_HEADERS, options.headers || {});
  const includeBody = options.includeBody !== false;

  let currentUrl = url;
  let redirects = 0;

  while (redirects <= maxRedirects) {
    const result = await singleRequest(currentUrl, {
      timeoutMs,
      headers,
      includeBody,
    });

    // If we got an error or no redirect status, return result
    if (
      result.error ||
      !isRedirectStatus(result.statusCode) ||
      !result.headers.location
    ) {
      return result;
    }

    // Follow redirect
    const location = result.headers.location;
    currentUrl = resolveRedirect(currentUrl, location);
    redirects += 1;
  }

  return {
    statusCode: null,
    headers: {},
    finalUrl: currentUrl,
    contentType: null,
    body: null,
    error: `Max redirects exceeded (${maxRedirects})`,
  };
}

/**
 * Perform a single GET request (no redirect following).
 *
 * @param {string} url
 * @param {object} options
 * @returns {Promise<{
 *   statusCode: number | null,
 *   headers: object,
 *   finalUrl: string,
 *   contentType: string | null,
 *   body: string | null,
 *   error: string | null
 * }>}
 */
function singleRequest(url, options) {
  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;
  const headers = options.headers || DEFAULT_HEADERS;
  const includeBody = options.includeBody !== false;

  return new Promise((resolve) => {
    let parsed;
    try {
      parsed = new URL(url);
    } catch (e) {
      return resolve({
        statusCode: null,
        headers: {},
        finalUrl: url,
        contentType: null,
        body: null,
        error: `Invalid URL: ${url}`,
      });
    }

    const client = parsed.protocol === "https:" ? https : http;

    const req = client.request(
      {
        method: "GET",
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
        path: parsed.pathname + (parsed.search || ""),
        headers,
      },
      (res) => {
        const chunks = [];

        if (includeBody) {
          res.on("data", (chunk) => {
            chunks.push(chunk);
          });
        }

        res.on("end", () => {
          const body = includeBody ? Buffer.concat(chunks).toString("utf8") : null;
          const contentType = res.headers["content-type"] || null;

          resolve({
            statusCode: res.statusCode || null,
            headers: res.headers || {},
            finalUrl: url,
            contentType,
            body,
            error: null,
          });
        });
      }
    );

    req.on("error", (err) => {
      resolve({
        statusCode: null,
        headers: {},
        finalUrl: url,
        contentType: null,
        body: null,
        error: err.message || "REQUEST_ERROR",
      });
    });

    req.setTimeout(timeoutMs, () => {
      req.destroy();
      resolve({
        statusCode: null,
        headers: {},
        finalUrl: url,
        contentType: null,
        body: null,
        error: `TIMEOUT_${timeoutMs}ms`,
      });
    });

    req.end();
  });
}

function isRedirectStatus(statusCode) {
  return statusCode === 301 || statusCode === 302 || statusCode === 307 || statusCode === 308;
}

function resolveRedirect(baseUrl, location) {
  try {
    return new URL(location, baseUrl).toString();
  } catch {
    return location;
  }
}

module.exports = {
  fetchWithRedirects,
};
