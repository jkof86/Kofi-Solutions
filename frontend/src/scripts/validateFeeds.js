// ------------------------------------------------------------
// validateFeeds.js — Unified FEEDS Validator
// ------------------------------------------------------------
//
// Purpose:
//   Ensures the backend FEEDS map and the frontend FEEDS map
//   remain perfectly aligned. This prevents silent drift,
//   broken categories, missing feeds, and UI/backend mismatches.
//
// Why this matters:
//   - Backend FEEDS drives Lambda fetch logic
//   - Frontend FEEDS drives UI rendering & category grouping
//   - If they drift, the dashboard breaks in subtle ways
//
// How it works:
//   1. Loads backend FEEDS (CommonJS)
//   2. Loads frontend FEEDS mirror (CommonJS `.cjs` file)
//   3. Compares top-level keys (categories or feed IDs)
//   4. Reports anything missing on either side
//
// Current limitation:
//   This validator only checks *top-level keys*.
//   If backend uses flat feed IDs and frontend uses category-based
//   arrays, the validator will report massive mismatches.
//   (This is exactly what you're seeing now.)
//
// Usage:
//   node scripts/validateFeeds.js
//
// Exit codes:
//   0 = FEEDS match perfectly
//   1 = Drift detected (CI / pre-commit should block)
//
// ------------------------------------------------------------

// Load backend FEEDS (CommonJS)
const backend = require("../../../backend/src/lambda/config/feedsMap.js").FEEDS;

// Load frontend FEEDS mirror (CommonJS)
// NOTE: This must be a `.cjs` mirror of the ESM FEEDS file.
const frontend = require("../../config/feedsMap.cjs").FEEDS;

/**
 * diff(a, b)
 * -----------------------------------------
 * Returns keys that exist in object `a`
 * but do NOT exist in object `b`.
 *
 * This is a shallow comparison:
 *   - It only checks top-level keys
 *   - It does NOT compare nested feed objects
 *   - It does NOT compare URLs, types, symbols, etc.
 *
 * Example:
 *   a = { crypto: [...], finance: [...] }
 *   b = { crypto: [...] }
 *   diff(a, b) -> ['finance']
 */
function diff(a, b) {
  return Object.keys(a).filter((k) => !b[k]);
}

// Compute mismatches
const missingInFrontend = diff(backend, frontend);
const missingInBackend = diff(frontend, backend);

// ------------------------------------------------------------
// Output Report
// ------------------------------------------------------------
console.log("--------------------------------------------------");
console.log(" FEEDS VALIDATION REPORT");
console.log("--------------------------------------------------");

// Perfect match
if (missingInFrontend.length === 0 && missingInBackend.length === 0) {
  console.log("✔ FEEDS are perfectly aligned!");
  process.exit(0);
}

// Backend has keys that frontend does not
if (missingInFrontend.length > 0) {
  console.log("❌ Missing in FRONTEND:");
  console.log(missingInFrontend);
}

// Frontend has keys that backend does not
if (missingInBackend.length > 0) {
  console.log("❌ Missing in BACKEND:");
  console.log(missingInBackend);
}

// Drift detected — fail CI / pre-commit
process.exit(1);
