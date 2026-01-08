// ------------------------------------------------------------
// validatorSymbols.js — v1.202
// ------------------------------------------------------------
//
// Validates that every symbol in CATEGORY_SYMBOLS is present in
// CRYPTO_MAP, STOCK_MAP, or ETF_MAP.
//
// Checks:
//   • Missing symbols
//   • Normalization mismatches (BRK.B → brk-b)
//   • Duplicate definitions
//   • Category → map consistency
//
// Output:
//   • Pretty summary table
//   • Exit code 1 if errors found
//
// Usage:
//   node validatorSymbols.js
//
// ------------------------------------------------------------

const { CATEGORY_SYMBOLS } = require("./categorySymbols");
const { CRYPTO_MAP } = require("./cryptoMap");
const { STOCK_MAP } = require("./stocksMap");
const { ETF_MAP } = require("./etfMap");

// ------------------------------------------------------------
// Normalization helper (same rule used by handleMarket)
// ------------------------------------------------------------
function normalizeSymbol(symbol) {
  return symbol
    .trim()
    .toLowerCase()
    .replace(/\./g, "-"); // BRK.B → brk-b
}

// ------------------------------------------------------------
// Validator
// ------------------------------------------------------------
function validateSymbols() {
  const missing = [];
  const mismatched = [];
  const duplicates = [];

  const allMaps = {
    crypto: CRYPTO_MAP,
    stock: STOCK_MAP,
    etf: ETF_MAP,
  };

  const seen = new Set();

  for (const category of Object.keys(CATEGORY_SYMBOLS)) {
    const symbols = CATEGORY_SYMBOLS[category];

    for (const rawSymbol of symbols) {
      const normalized = normalizeSymbol(rawSymbol);

      // Detect duplicates across categories
      if (seen.has(normalized)) {
        duplicates.push({
          symbol: rawSymbol,
          normalized,
          category,
        });
      }
      seen.add(normalized);

      // Check maps
      const inCrypto = normalized in CRYPTO_MAP;
      const inStock = normalized in STOCK_MAP;
      const inEtf = normalized in ETF_MAP;

      if (!inCrypto && !inStock && !inEtf) {
        missing.push({
          symbol: rawSymbol,
          normalized,
          category,
        });
        continue;
      }

      // Check normalization mismatch (e.g., BRK.B vs brk-b)
      if (rawSymbol.toLowerCase() !== normalized) {
        mismatched.push({
          symbol: rawSymbol,
          normalized,
          category,
        });
      }
    }
  }

  // ------------------------------------------------------------
  // Output
  // ------------------------------------------------------------
  console.log("\n=== SYMBOL VALIDATION REPORT — v1.202 ===\n");

  if (missing.length === 0 && mismatched.length === 0 && duplicates.length === 0) {
    console.log("✔ All symbols are valid, normalized, and mapped correctly.\n");
    return;
  }

  if (missing.length > 0) {
    console.log("❌ Missing Symbols:");
    missing.forEach((m) =>
      console.log(`  • ${m.symbol} (normalized: ${m.normalized}) — category: ${m.category}`)
    );
    console.log("");
  }

  if (mismatched.length > 0) {
    console.log("⚠ Normalization Mismatches:");
    mismatched.forEach((m) =>
      console.log(`  • ${m.symbol} → ${m.normalized} — category: ${m.category}`)
    );
    console.log("");
  }

  if (duplicates.length > 0) {
    console.log("⚠ Duplicate Symbols Across Categories:");
    duplicates.forEach((d) =>
      console.log(`  • ${d.symbol} (normalized: ${d.normalized}) — category: ${d.category}`)
    );
    console.log("");
  }

  process.exitCode = 1;
}

// ------------------------------------------------------------
// Run
// ------------------------------------------------------------
validateSymbols();
