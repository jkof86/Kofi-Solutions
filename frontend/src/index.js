/**
 * index.js — v1.199 (MarketStatus Integrated + AuthContext FIXED)
 */

import React from "react";
import ReactDOM from "react-dom/client";

import "./data/feedIconColors.css";
import "./index.css";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { BrowserRouter } from "react-router-dom";
// import { AppProvider } from "./components/providers/AppContext";

import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { FeedStatusProvider } from "./context/FeedStatusContext";
import { GlobalRefreshProvider } from "./context/GlobalRefreshContext";
import { MarketStatusProvider } from "./context/MarketStatusContext";   // NEW

const clientId = process.env.REACT_APP_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
  <GoogleOAuthProvider clientId={clientId}>
    {/* <AppProvider> */}

      {/* Feed + Market contexts must wrap the entire app */}
      <FeedStatusProvider>
        <MarketStatusProvider>   {/* NEW */}

          <GlobalRefreshProvider>

            {/* BrowserRouter MUST wrap AuthProvider */}
            <BrowserRouter>

              {/* AuthProvider MUST wrap App */}
              <AuthProvider>
                <App />
              </AuthProvider>

            </BrowserRouter>

          </GlobalRefreshProvider>

        </MarketStatusProvider>   {/* NEW */}
      </FeedStatusProvider>

    {/* </AppProvider> */}
  </GoogleOAuthProvider>
  // </React.StrictMode>
);

reportWebVitals();
