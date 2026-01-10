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

// Core dashboard
import Home from "./components/Home";

// Portfolio sections
import About from "./components/portfolio/About";
import Account from "./components/users/Account";
import Settings from "./components/users/Settings";
import Calculator from "./components/portfolio/Calculator";
import Fitness from "./components/portfolio/Fitness";
import Professional from "./components/portfolio/Professional";
import Gaming from "./components/portfolio/Gaming";

// Contact pages
import ContactFitness from "./components/portfolio/ContactFitness";
import ContactProfessional from "./components/portfolio/ContactProfessional";

// Auth
import LoginComponent from "./components/auth/LoginComponent";
import RegisterComponent from "./components/auth/RegisterComponent";

// Users
import GoogleUser from "./components/users/GoogleUser";




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
          "/home" is protected by <ProtectedRoute>
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
        <Route path="/users/account" element={<Account />} />
        <Route path="/users/settings" element={<Settings />} />

        {/* MAIN DASHBOARD (PROTECTED) */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* PROFESSIONAL SECTION */}
        <Route path="/professional" element={<Professional />} />
        <Route path="/professional/about" element={<About />} />
        <Route path="/professional/contact" element={<ContactProfessional />} />

        {/* FITNESS SECTION */}
        <Route path="/fitness" element={<Fitness />} />
        <Route path="/fitness/calculator" element={<Calculator />} />
        <Route path="/fitness/contact" element={<ContactFitness />} />

        {/* GAMING SECTION */}
        <Route path="/gaming" element={<Gaming />} />
      </Routes>
    </>
  );
}
