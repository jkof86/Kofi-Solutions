/**
 * index.js — v1.198
 * ---------------------------------------------------------
 * Application entry point for the Kofi Solutions frontend.
 *
 * This file defines the **true top‑level provider tree**.
 * All global contexts MUST be registered here so that every
 * page, route, and component receives consistent state.
 *
 * Provider Order (outer → inner):
 *
 *   1. React.StrictMode
 *   2. GoogleOAuthProvider      → Google login
 *   3. AppProvider              → global UI state (theme/layout)
 *   4. FeedStatusProvider       → feed + market health (POLLING)
 *   5. GlobalRefreshProvider    → manual refresh + retry logic
 *   6. BrowserRouter            → routing layer
 *   7. <App />                  → all pages (Home, Login, etc.)
 *
 * IMPORTANT:
 * FeedStatusProvider MUST wrap the entire app so that:
 *   • FeedHealthDashboard receives live health updates
 *   • TabsLayout receives feed status
 *   • TickerBar receives market status
 *
 * If this provider is missing or mis‑nested, the UI will
 * freeze on “Loading health…” even if the backend works.
 * ---------------------------------------------------------
 */

import React from "react";
import ReactDOM from "react-dom/client";

// CSS
import "./data/feedIconColors.css";
import "./index.css";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { BrowserRouter } from "react-router-dom";
import AppProvider from "./components/providers/AppContext";

import { GoogleOAuthProvider } from "@react-oauth/google";

// NEW: Feed + Market Health Context
import { FeedStatusProvider } from "./context/FeedStatusContext";

// NEW: Manual Refresh / Retry Context
import { GlobalRefreshProvider } from "./context/GlobalRefreshContext";

// Google OAuth client ID (from .env)
const clientId = process.env.REACT_APP_CLIENT_ID;

// Create the root React mount point
const root = ReactDOM.createRoot(document.getElementById("root"));

// ---------------------------------------------------------
// Render Application
// ---------------------------------------------------------
root.render(
  <React.StrictMode>
    {/* Google OAuth must wrap the entire app */}
    <GoogleOAuthProvider clientId={clientId}>
      
      {/* Global UI state (theme, layout prefs, etc.) */}
      <AppProvider>

        {/* Feed + Market health (polling every 60s) */}
        <FeedStatusProvider>

          {/* Manual refresh + retry logic */}
          <GlobalRefreshProvider>

            {/* Routing layer */}
            <BrowserRouter>
              <App />
            </BrowserRouter>

          </GlobalRefreshProvider>
        </FeedStatusProvider>
      </AppProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// Optional performance analytics
reportWebVitals();
