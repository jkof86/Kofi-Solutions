// ------------------------------------------------------------
// structure.js — FEEDS Structural Validator (Layers 1–5)
// ------------------------------------------------------------
//
// Validates:
//   1. Category alignment
//   2. Feed ID alignment
//   3. Feed object shape
//   4. URL equality
//   5. Type equality
//
// This module does NOT exit the process.
// It returns a structured report consumed by feeds/index.js.
// ------------------------------------------------------------

const { success, error, info } = require("../utils/colors");

// Utility: diff keys
function diff(a, b) {
  return Object.keys(a).filter((k) => !b[k]);
}

async function validateStructure(backend, frontend) {
  const report = {
    categories: true,
    feedIds: true,
    shapes: true,
    urls: true,
    types: true,
    errors: [],
  };

  console.log(info("\n[STRUCTURE] Validating FEEDS structure (Layers 1–5)...\n"));

  // ------------------------------------------------------------
  // LAYER 1 — Category Validation
  // ------------------------------------------------------------
  const missingInFrontend = diff(backend, frontend);
  const missingInBackend = diff(frontend, backend);

  if (missingInFrontend.length > 0) {
    console.log(error("❌ Missing categories in FRONTEND:"), missingInFrontend);
    report.categories = false;
    report.errors.push({ layer: 1, missingInFrontend });
  }

  if (missingInBackend.length > 0) {
    console.log(error("❌ Missing categories in BACKEND:"), missingInBackend);
    report.categories = false;
    report.errors.push({ layer: 1, missingInBackend });
  }

  if (report.categories) {
    console.log(success("✔ Categories aligned"));
  }

  // ------------------------------------------------------------
  // LAYER 2 — Feed ID Validation
  // ------------------------------------------------------------
  console.log(info("\n[STRUCTURE] Checking feed IDs..."));

  const feedIdIssues = [];

  for (const category of Object.keys(backend)) {
    const backendFeeds = backend[category] || [];
    const frontendFeeds = frontend[category] || [];

    const backendIds = backendFeeds.map((f) => f.id);
    const frontendIds = frontendFeeds.map((f) => f.id);

    const missingInFrontendIds = backendIds.filter((id) => !frontendIds.includes(id));
    const missingInBackendIds = frontendIds.filter((id) => !backendIds.includes(id));

    if (missingInFrontendIds.length > 0 || missingInBackendIds.length > 0) {
      feedIdIssues.push({
        category,
        missingInFrontend: missingInFrontendIds,
        missingInBackend: missingInBackendIds,
      });
    }
  }

  if (feedIdIssues.length > 0) {
    console.log(error("❌ Feed ID mismatches detected:"), feedIdIssues);
    report.feedIds = false;
    report.errors.push({ layer: 2, feedIdIssues });
  } else {
    console.log(success("✔ Feed IDs aligned"));
  }

  // ------------------------------------------------------------
  // LAYER 3 — Feed Object Shape Validation
  // ------------------------------------------------------------
  console.log(info("\n[STRUCTURE] Checking feed object shapes..."));

  const shapeIssues = [];

  for (const category of Object.keys(backend)) {
    const backendFeeds = backend[category] || [];
    const frontendFeeds = frontend[category] || [];

    backendFeeds.forEach((backendFeed) => {
      const frontendFeed = frontendFeeds.find((f) => f.id === backendFeed.id);
      if (!frontendFeed) return;

      const backendKeys = Object.keys(backendFeed).sort();
      const frontendKeys = Object.keys(frontendFeed).sort();

      const missingInFrontend = backendKeys.filter((k) => !frontendKeys.includes(k));
      const missingInBackend = frontendKeys.filter((k) => !backendKeys.includes(k));

      if (missingInFrontend.length > 0 || missingInBackend.length > 0) {
        shapeIssues.push({
          category,
          feedId: backendFeed.id,
          missingInFrontend,
          missingInBackend,
        });
      }
    });
  }

  if (shapeIssues.length > 0) {
    console.log(error("❌ Feed object shape mismatches detected:"), shapeIssues);
    report.shapes = false;
    report.errors.push({ layer: 3, shapeIssues });
  } else {
    console.log(success("✔ Feed object shapes aligned"));
  }

  // ------------------------------------------------------------
  // LAYER 4 — URL Equality Validation
  // ------------------------------------------------------------
  console.log(info("\n[STRUCTURE] Checking feed URLs..."));

  const urlIssues = [];

  for (const category of Object.keys(backend)) {
    const backendFeeds = backend[category] || [];
    const frontendFeeds = frontend[category] || [];

    backendFeeds.forEach((backendFeed) => {
      const frontendFeed = frontendFeeds.find((f) => f.id === backendFeed.id);
      if (!frontendFeed) return;

      if (backendFeed.url !== frontendFeed.url) {
        urlIssues.push({
          category,
          feedId: backendFeed.id,
          backendUrl: backendFeed.url,
          frontendUrl: frontendFeed.url,
        });
      }
    });
  }

  if (urlIssues.length > 0) {
    console.log(error("❌ URL mismatches detected:"), urlIssues);
    report.urls = false;
    report.errors.push({ layer: 4, urlIssues });
  } else {
    console.log(success("✔ Feed URLs aligned"));
  }

  // ------------------------------------------------------------
  // LAYER 5 — Type Validation
  // ------------------------------------------------------------
  console.log(info("\n[STRUCTURE] Checking feed types..."));

  const typeIssues = [];

  for (const category of Object.keys(backend)) {
    const backendFeeds = backend[category] || [];
    const frontendFeeds = frontend[category] || [];

    backendFeeds.forEach((backendFeed) => {
      const frontendFeed = frontendFeeds.find((f) => f.id === backendFeed.id);
      if (!frontendFeed) return;

      if (backendFeed.type !== frontendFeed.type) {
        typeIssues.push({
          category,
          feedId: backendFeed.id,
          backendType: backendFeed.type,
          frontendType: frontendFeed.type,
        });
      }
    });
  }

  if (typeIssues.length > 0) {
    console.log(error("❌ Feed TYPE mismatches detected:"), typeIssues);
    report.types = false;
    report.errors.push({ layer: 5, typeIssues });
  } else {
    console.log(success("✔ Feed types aligned"));
  }

  // ------------------------------------------------------------
  // FINAL STRUCTURE RESULT
  // ------------------------------------------------------------
  const ok =
    report.categories &&
    report.feedIds &&
    report.shapes &&
    report.urls &&
    report.types;

  console.log(
    ok
      ? success("\n[STRUCTURE] Structural validation passed.")
      : error("\n[STRUCTURE] Structural validation failed.")
  );

  return { ok, report };
}

module.exports = {
  validateStructure,
};
