// ------------------------------------------------------------
// api.js — v1.205 (Stable + Stage-Aware)
// ------------------------------------------------------------
//
// This file provides a single, reliable API_BASE that:
//
//   ✓ Uses REACT_APP_LAMBDA_TEST_URL on localhost
//   ✓ Uses REACT_APP_LAMBDA_URL in production
//   ✓ Never double-appends /RSSProxyAggregator
//   ✓ Guarantees a clean, correct backend base URL
//
// ------------------------------------------------------------
// ------------------------------------------------------------
// Environment variables
// ------------------------------------------------------------
export const PROD_URL = process.env.REACT_APP_LAMBDA_URL;        // default stage
export const TEST_URL = process.env.REACT_APP_LAMBDA_TEST_URL;   // test stage

// ------------------------------------------------------------
// Determine which URL to use
// ------------------------------------------------------------
const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

// ------------------------------------------------------------
// API_BASE is the single source of truth
// ------------------------------------------------------------
export const API_BASE = isLocal ? TEST_URL : PROD_URL;

// ------------------------------------------------------------
// Debug logging (safe)
// ------------------------------------------------------------
// console.log("[api] Environment =", isLocal ? "LOCAL → test" : "PROD → default");
// console.log("[url]: ", API_BASE);
