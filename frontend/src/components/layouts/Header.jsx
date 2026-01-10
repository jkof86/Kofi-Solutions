// ------------------------------------------------------------
// Header.jsx — v1.2.0.7 (Centered Nav + Right Contact)
// ------------------------------------------------------------
//
// Layout:
//   • Center: Home | Register | Login | Logout
//   • Right:  Contact button
//   • No logo
//
// Auth Integration:
//   • Uses AuthContext for isLoggedIn + logout()
//   • Prevents Register/Login when already logged in
//
// ------------------------------------------------------------

import { AppBar, Toolbar, Box, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Header({ onHeightChange }) {
  const navigate = useNavigate();
  const ref = useRef(null);

  const { isLoggedIn, logout } = useAuth();

  // ------------------------------------------------------------
  // Measure header height for parent layout offset
  // ------------------------------------------------------------
  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([entry]) =>
      onHeightChange?.(entry.contentRect.height)
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onHeightChange]);

  // ------------------------------------------------------------
  // Navigation helpers
  // ------------------------------------------------------------
  const goTo = (path) => navigate(path);

  const handleRegister = () => {
    if (isLoggedIn) return alert("You are already logged in — logout first.");
    goTo("/register");
  };

  const handleLogin = () => {
    if (isLoggedIn) return alert("You are already logged in.");
    goTo("/login");
  };

  const handleLogout = () => {
    if (!isLoggedIn) return alert("You are already logged out.");
    logout();
  };

  const sendEmail = () => {
    const recipient = "admin@kofisolutions.com";
    window.location.href = `mailto:${recipient}?subject=Attention:&body=`;
  };

  return (
    <AppBar position="static" color="default" elevation={1} ref={ref}>
      <Toolbar
        disableGutters
        sx={{
          minHeight: 72,
          backgroundColor: "#f9f9f9",
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* ----------------------------------------------------
            CENTERED NAVIGATION
        ---------------------------------------------------- */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            height: 80,
          }}
        >
          {[
            { label: "Home", action: () => goTo("/home") },
            { label: "Register", action: handleRegister },
            { label: "Login", action: handleLogin },
            { label: "Logout", action: handleLogout },
          ].map(({ label, action }) => (
            <Box
              key={label}
              onClick={action}
              sx={{
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: 500,
                color: "#1e3c72",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                padding: "6px 4px",
                display: "flex",
                alignItems: "center",
                transition: "0.2s ease",
                "&:hover": {
                  color: "#3b78e2",
                  borderBottom: "2px solid #3b78e2",
                },
              }}
            >
              {label}
            </Box>
          ))}
        </Box>

        {/* ----------------------------------------------------
            RIGHT-SIDE CONTACT BUTTON
        ---------------------------------------------------- */}
        <Box
          sx={{
            position: "absolute",
            right: 20,
            display: "flex",
            alignItems: "center",
            height: 80,
          }}
        >
          <Tooltip title="Compose Email">
            <Box
              onClick={sendEmail}
              sx={{
                cursor: "pointer",
                backgroundColor: "#3b78e2",
                color: "#fff",
                px: 2.5,
                py: 1,
                borderRadius: "20px",
                fontWeight: 600,
                fontSize: "0.9rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                display: "flex",
                alignItems: "center",
                transition: "0.25s ease",
                "&:hover": {
                  backgroundColor: "#1e3c72",
                },
              }}
            >
              Contact
            </Box>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
