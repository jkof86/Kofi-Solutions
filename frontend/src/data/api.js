// ------------------------------------------------------------
// api.js — v1.208 (Stage-Aware API Routing)
// ------------------------------------------------------------
//
// Automatically selects the correct API Gateway stage:
//   • localhost → /test  (hits $LATEST)
//   • production → /default (hits prod alias)
//
// This lets you test new backend builds without touching the
// stable live site or repointing API Gateway integrations.
// ------------------------------------------------------------

const PROD_URL = process.env.REACT_APP_LAMBDA_URL;
const TEST_URL = process.env.REACT_APP_LAMBDA_TEST_URL;

// Local dev → test stage ($LATEST)
// Production → default stage (prod alias)
export const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? TEST_URL
    : PROD_URL;

export default API_BASE;
