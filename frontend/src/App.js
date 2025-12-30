/**
 * App.jsx
 * -------------------------------
 * Central routing configuration for the Kofi Solutions frontend.
 *
 * This file defines all top‑level routes using React Router v6.
 * It should remain clean, declarative, and free of business logic.
 *
 * IMPORTANT:
 * - All components imported here must come from the *current* src/components tree.
 * - Avoid duplicate or shadowed paths (common cause of stale UI rendering).
 * - Keep route definitions consistent and predictable.
 */

import { Routes, Route } from "react-router";

// Core dashboard
import Home from "./components/Home";

// Portfolio sections
import About from "./components/portfolio/About";
import Account from "./components/portfolio/Account";
import Settings from "./components/portfolio/Settings";
import Calculator from "./components/portfolio/Calculator";
import Fitness from "./components/portfolio/Fitness";
import Professional from "./components/portfolio/Professional";
import Gaming from "./components/portfolio/Gaming";

// Contact pages
import ContactFitness from "./components/portfolio/ContactFitness";
import ContactProfessional from "./components/portfolio/ContactProfessional";
import ContactGaming from "./components/portfolio/ContactGaming";

// Auth
import LoginComponent from "./components/LoginComponent";
import RegisterComponent from "./components/RegisterComponent";

export default function App() {
  return (
    <>
      {/**
       * ROUTE TABLE
       * -----------------------------------------
       * Notes:
       * - "/" defaults to LoginComponent (user must log in first)
       * - "/home" is the main dashboard (FeedStatusProvider wraps App in index.js)
       * - Portfolio routes are grouped by category for clarity
       * - Avoid duplicate paths (e.g., gaming/about was incorrectly mapped)
       */}

      <Routes>

        {/* AUTH ROUTES */}
        <Route path="/" element={<LoginComponent />} />
        <Route path="/login" element={<LoginComponent />} />
        {/* <Route path="/register" element={<RegisterComponent />} /> */}

        {/* MAIN DASHBOARD */}
        <Route path="/home" element={<Home />} />

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
        <Route path="/gaming/about" element={<Gaming />} /> 
        <Route path="/gaming/contact" element={<ContactGaming />} />

        {/* USER SETTINGS */}
        <Route path="/account" element={<Account />} />
        <Route path="/settings" element={<Settings />} />

      </Routes>
    </>
  );
}
