/**
 * index.js
 * ---------------------------------------------------------
 * Application entry point for the Kofi Solutions frontend.
 *
 * This file mounts the React application and defines the
 * top‑level provider tree:
 *
 *  - React.StrictMode: dev‑only checks for unsafe patterns
 *  - GoogleOAuthProvider: enables Google login
 *  - AppProvider: global UI/app state (non‑feed related)
 *  - BrowserRouter: routing layer for all pages
 *
 * IMPORTANT:
 * FeedStatusProvider and GlobalRefreshProvider are NOT here.
 * They wrap <App /> inside Home.js This file should remain minimal.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter } from 'react-router-dom';
import AppProvider from './components/providers/AppContext';

import { GoogleOAuthProvider } from "@react-oauth/google";

// Google OAuth client ID (injected via .env)
const clientId = process.env.REACT_APP_CLIENT_ID;

// Create the root React mount point
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application
root.render(
  <React.StrictMode>
    {/* Google OAuth must wrap the entire app */}
    <GoogleOAuthProvider clientId={clientId}>

      {/**
       * AppProvider:
       * Global UI state (theme, layout prefs, etc.)
       * Does NOT handle feed health or refresh logic.
       */}
      <AppProvider>

        {/**
         * BrowserRouter:
         * Enables all <Route> definitions inside App.jsx.
         * Must wrap <App /> so routing works everywhere.
         */}
        <BrowserRouter>
          <App />
        </BrowserRouter>

      </AppProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

/**
 * Optional performance analytics.
 * Safe to leave as-is; does nothing unless configured.
 */
reportWebVitals();
