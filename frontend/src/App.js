/**
 * App.jsx — v1.2.0.4
 * ---------------------------------------------------------
 * Central routing configuration for the Kofi Solutions frontend.
 *
 * Responsibilities:
 *   • Declare all top‑level routes (React Router v6)
 *   • Protect authenticated routes using <ProtectedRoute>
 *
 * Notes:
 *   • <AuthProvider> MUST wrap <App /> in index.js, not here
 *   • Keep this file declarative and free of business logic
 *   • Avoid duplicate or shadowed paths
 */

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// News Feed (RSS)
import NewsFeed from "./components/newsfeed/NewsFeed";

// Portfolio sections
import Account from "./components/users/Account";
import Settings from "./components/users/Settings";
import Calculator from "./components/portfolio/Calculator";
import Fitness from "./components/portfolio/Fitness";
import Professional from "./components/portfolio/Professional";
import Gaming from "./components/portfolio/Gaming";

// Landing Page / Auth
import LoginComponent from "./components/auth/LoginComponent";
import RegisterComponent from "./components/auth/RegisterComponent";

// User Type Dashboards
import GoogleUser from "./components/users/GoogleUser";
import AppleUser from "./components/users/AppleUser";
import GuestUser from "./components/users/GuestUser";


/* ---------------------------------------------------------
   ProtectedRoute — simple wrapper for authenticated pages
--------------------------------------------------------- */
function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  // Wait until AuthContext finishes restoring state
  if (loading) {
    return null; // or a spinner component
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


export default function App() {
  return (
    <>
      {/* -----------------------------------------------------
          ROUTE TABLE — v1.2.0.4
          "/" defaults to LoginComponent
          "/news" is protected by <ProtectedRoute>
      ------------------------------------------------------ */}
      <Routes>

        {/* AUTH ROUTES */}
        <Route path="/" element={<LoginComponent />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/register" element={<RegisterComponent />} />

        {/* USERS */}
        <Route
          path="/users/GoogleUser"
          element={
            <ProtectedRoute>
              <GoogleUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/AppleUser"
          element={
            <ProtectedRoute>
              <AppleUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/GuestUser"
          element={
            <ProtectedRoute>
              <GuestUser />
            </ProtectedRoute>
          }
        />
        <Route path="/users/account" element={<Account />} />
        <Route path="/users/settings" element={<Settings />} />

        {/* News Feed (PROTECTED) */}
        <Route
          path="/news"
          element={
            <ProtectedRoute>
              <NewsFeed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <NewsFeed />
            </ProtectedRoute>
          }
        />

        {/* PROFESSIONAL SECTION */}
        <Route path="/professional" element={<Professional />} />

        {/* FITNESS SECTION */}
        <Route path="/fitness" element={<Fitness />} />
        <Route path="/fitness/calculator" element={<Calculator />} />

        {/* GAMING SECTION */}
        <Route path="/gaming" element={<Gaming />} />
      </Routes>
    </>
  );
}
