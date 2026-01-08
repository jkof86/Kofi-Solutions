// ------------------------------------------------------------
// network.js — Full Feed Health Engine (GET + Redirects + Detection)
// ------------------------------------------------------------
//
// Responsibilities:
//   - Perform GET requests with redirect following
//   - Detect RSS/Atom/JSON/HTML
//   - Detect Cloudflare / paywall / captcha blocks
//   - Produce a structured health report per feed
//   - Colorized console output (no exits)
// ------------------------------------------------------------

const { fetchWithRedirects } = require("../utils/http");
const { detectContentKind } = require("../utils/detect");
const { success, error, warning, info, color } = require("../utils/colors");

// ------------------------------------------------------------
// Health classification
// ------------------------------------------------------------
//
// kind: rss_xml | atom_xml | json | html | unknown
// blocked: boolean
// reason: string
//
// health:
//   "healthy"        → RSS/Atom/JSON with 200
//   "redirect"       → Redirected but final is healthy
//   "blocked"        → Cloudflare / paywall / captcha
//   "dead"           → 404 / DNS / TIMEOUT / invalid
//   "html_error"     → HTML page instead of feed
// ------------------------------------------------------------

function classifyHealth(feed, fetchResult, detection) {
  const { statusCode, error: fetchError, finalUrl } = fetchResult;
  const { kind, blocked, reason } = detection;

  // Hard failures
  if (fetchError) {
    return {
      health: "dead",
      reason: fetchError,
      finalUrl,
      kind,
    };
  }

  if (!statusCode || statusCode >= 400) {
    return {
      health: "dead",
      reason: `HTTP_${statusCode || "NO_STATUS"}`,
      finalUrl,
      kind,
    };
  }

  // Blocked by Cloudflare / paywall / captcha
  if (blocked) {
    return {
      health: "blocked",
      reason,
      finalUrl,
      kind,
    };
  }

  // HTML page instead of feed
  if (kind === "html") {
    return {
      health: "html_error",
      reason,
      finalUrl,
      kind,
    };
  }

  // JSON feed
  if (kind === "json") {
    return {
      health: "healthy",
      reason: "JSON_FEED",
      finalUrl,
      kind,
    };
  }

  // RSS or Atom
  if (kind === "rss_xml" || kind === "atom_xml") {
    return {
      health: "healthy",
      reason: kind.toUpperCase(),
      finalUrl,
      kind,
    };
  }

  // Unknown but 200 OK
  return {
    health: "unknown",
    reason: "UNKNOWN_CONTENT",
    finalUrl,
    kind,
  };
}

// ------------------------------------------------------------
// Main network validator
// ------------------------------------------------------------

async function validateNetwork(backendFeeds) {
  console.log(info("\n[NETWORK] Running GET-based feed health checks...\n"));

  const results = [];

  for (const category of Object.keys(backendFeeds)) {
    for (const feed of backendFeeds[category]) {
      console.log(color(`→ Checking ${feed.id} (${category})`, "cyan"));


      const fetchResult = await fetchWithRedirects(feed.url, {
        includeBody: true,
      });

      const detection = detectContentKind({
        statusCode: fetchResult.statusCode,
        contentType: fetchResult.contentType,
        body: fetchResult.body,
      });

      const health = classifyHealth(feed, fetchResult, detection);

      // Colorized output
      if (health.health === "healthy") {
        console.log(success(`   ✔ Healthy (${health.reason})`));
      } else if (health.health === "redirect") {
        console.log(warning(`   ↪ Redirected → ${health.finalUrl}`));
      } else if (health.health === "blocked") {
        console.log(error(`   ❌ Blocked (${health.reason})`));
      } else if (health.health === "dead") {
        console.log(error(`   ❌ Dead (${health.reason})`));
      } else if (health.health === "html_error") {
        console.log(warning(`   ⚠ HTML page instead of feed (${health.reason})`));
      } else {
        console.log(warning(`   ⚠ Unknown content (${health.reason})`));
      }

      results.push({
        category,
        feedId: feed.id,
        originalUrl: feed.url,
        finalUrl: health.finalUrl,
        statusCode: fetchResult.statusCode,
        kind: health.kind,
        health: health.health,
        reason: health.reason,
      });
    }
  }

  console.log(info("\n[NETWORK] Network validation complete.\n"));

  return {
    ok: results.every((r) => r.health === "healthy"),
    results,
  };
}

module.exports = {
  validateNetwork,
};
