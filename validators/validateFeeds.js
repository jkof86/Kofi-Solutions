#!/usr/bin/env node

// ------------------------------------------------------------
// validateFeeds.js — CLI Entrypoint for Full FEEDS Validator
// ------------------------------------------------------------

const path = require("path");
const { runValidation } = require("./feeds");
const {
  color,
  bold,
  success,
  error,
  warning,
  info,
  colorizeStatus,
} = require("./utils/colors");

// ------------------------------------------------------------
// CLI FLAG PARSING
// ------------------------------------------------------------

const args = process.argv.slice(2);

const ENABLE_NETWORK = args.includes("--network") || args.includes("-n");
const ENABLE_SUMMARY = args.includes("--summary") || args.includes("-s");
const ENABLE_JSON = args.includes("--json") || args.includes("-j");
const ENABLE_FIX = args.includes("--fix") || args.includes("-f");
const STRICT_MODE = args.includes("--strict");

// FEEDS map paths
const BACKEND_PATH = path.resolve(
  __dirname,
  "../backend/src/RSSProxyAggregator/config/feedsMap.js"
);

const FRONTEND_PATH = path.resolve(
  __dirname,
  "../config/feedsMap.cjs"
);

// ------------------------------------------------------------
// MAIN EXECUTION
// ------------------------------------------------------------

(async () => {
  console.log(info("\n=== KOFI SOLUTIONS — FEEDS VALIDATOR ===\n"));

  const result = await runValidation({
    backendPath: BACKEND_PATH,
    frontendPath: FRONTEND_PATH,
    enableNetwork: ENABLE_NETWORK,
    enableFix: ENABLE_FIX,
  });

  if (ENABLE_SUMMARY) {
    console.log(info("\n----------------------"));
    console.log(info(" SUMMARY"));
    console.log(info("----------------------\n"));

    const rows = [
      ["Structure", result.structure.ok ? "✔" : "❌"],
      [
        "Network",
        result.network
          ? result.network.ok
            ? "✔"
            : "❌"
          : "SKIPPED",
      ],
      ["Auto-Fix", ENABLE_FIX ? "ENABLED" : "DISABLED"],
    ];

    rows.forEach(([label, status]) => {
      console.log(label.padEnd(15), colorizeStatus(status));
    });

    console.log("");
  }

  if (ENABLE_JSON) {
    console.log(
      JSON.stringify(
        {
          ok: result.ok,
          structure: result.structure,
          network: result.network,
          finalFeeds: result.finalFeeds,
        },
        null,
        2
      )
    );
  }

  if (!result.ok) {
    console.log(error("\nValidation completed with issues.\n"));
    process.exit(1);
  }

  console.log(success("\nAll validations passed.\n"));
  process.exit(0);
})();
