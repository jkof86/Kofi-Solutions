// ------------------------------------------------------------
// index.js — FEEDS Validation Orchestrator
// ------------------------------------------------------------
//
// Responsibilities:
//   - Load backend + frontend FEEDS
//   - Run structure validator (Layers 1–5)
//   - Run network validator (GET-based health engine)
//   - Run auto-fix engine (interactive)
//   - Return unified report (no process.exit here)
// ------------------------------------------------------------

const path = require("path");
const { validateStructure } = require("./structure");
const { validateNetwork } = require("./network");
const { runAutoFix } = require("./autofix");
const { info, success, error, warning } = require("../utils/colors");

// ------------------------------------------------------------
// Load FEEDS maps (backend + frontend)
// ------------------------------------------------------------

function loadFeeds(backendPath, frontendPath) {
  delete require.cache[require.resolve(backendPath)];
  delete require.cache[require.resolve(frontendPath)];

  const backend = require(backendPath).FEEDS;
  const frontend = require(frontendPath).FEEDS;

  return { backend, frontend };
}

// ------------------------------------------------------------
// Main orchestrator
// ------------------------------------------------------------

async function runValidation(options) {
  const {
    backendPath,
    frontendPath,
    enableNetwork,
    enableFix,
  } = options;

  console.log(info("\n[VALIDATOR] Starting FEEDS validation...\n"));

  // Load FEEDS
  const { backend, frontend } = loadFeeds(backendPath, frontendPath);

  // ------------------------------------------------------------
  // 1. STRUCTURE VALIDATION (Layers 1–5)
  // ------------------------------------------------------------
  const structure = await validateStructure(backend, frontend);

  if (!structure.ok && !enableNetwork && !enableFix) {
    console.log(error("\n[VALIDATOR] Structure failed. Stopping early.\n"));
    return {
      ok: false,
      structure,
      network: null,
      finalFeeds: backend,
    };
  }

  // ------------------------------------------------------------
  // 2. NETWORK VALIDATION (optional)
  // ------------------------------------------------------------
  let network = null;

  if (enableNetwork) {
    network = await validateNetwork(backend);

    if (!network.ok && !enableFix) {
      console.log(
        warning("\n[VALIDATOR] Network issues detected. Auto-fix disabled.\n")
      );
    }
  }

  // ------------------------------------------------------------
  // 3. AUTO-FIX MODE (optional)
  // ------------------------------------------------------------
  let finalFeeds = backend;

  if (enableFix && network) {
    finalFeeds = await runAutoFix(
      backendPath,
      frontendPath,
      backend,
      network.results
    );
  }

  // ------------------------------------------------------------
  // Final result
  // ------------------------------------------------------------
  const ok =
    structure.ok &&
    (!enableNetwork || (network && network.ok));

  console.log(
    ok
      ? success("\n[VALIDATOR] All validations passed.\n")
      : warning("\n[VALIDATOR] Validation completed with issues.\n")
  );

  return {
    ok,
    structure,
    network,
    finalFeeds,
  };
}

module.exports = {
  runValidation,
};
