// ------------------------------------------------------------
// HeaderShell.jsx — v1.2.0.6 (Drawer‑Safe, Auth‑Safe, No Alerts)
// ------------------------------------------------------------

import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Drawer,
  Tooltip,
  Chip
} from "@mui/material";

import { Menu as MenuIcon } from "@mui/icons-material";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";

import FeedHealthDashboard from "../newsfeed/FeedHealthDashboard";
import NavDrawerMain from "../navigation/NavDrawerMain";
import TickerBar from "./TickerBar";

import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import { useAuth } from "../../context/AuthContext";
import logo from "../../images/bg/ksBanner06.jpeg";

export default function HeaderShell({ onHeightChange, activeCategory }) {
  const [isHealthOpen, setIsHealthOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const ref = useRef(null);

  const { isLoggedIn, authType, user, logout, logoutToRegister } = useAuth();

  // Measure header height
  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([entry]) =>
      onHeightChange(entry.contentRect.height)
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onHeightChange]);

  // Navigation
  const goToRegister = () => { navigate("/register"); }
  const goToLogin = () => navigate("/login");
  const goToHome = () => navigate("/home");

  const handleLogout = () => logout();

  const showConfirm = () => {
    if (window.confirm("Do you wish to logout?")) {
      logoutToRegister();
    }
  };


  const handleRegister = () => {
    if (!isLoggedIn) {
      goToRegister();
    } else {
      showConfirm();
    }
  };

  const handleLogin = () => {
    if (!isLoggedIn) {
      goToLogin();
    } else {
      alert("You are already logged in");
    }
  };

  const sendEmail = () => {
    const recipient = "admin@kofisolutions.com";
    window.location.href = `mailto:${recipient}?subject=Attention:&body=`;
  };

  const handleUserChipClick = () => {
    if (!isLoggedIn) return navigate("/login");

    switch (authType) {
      case "google":
        navigate("/users/GoogleUser");
        break;
      case "apple":
        navigate("/users/AppleUser");
        break;
      case "guest":
        navigate("/users/GuestUser");
        break;
      default:
        navigate("/home");
    }
  };

  // ------------------------------------------------------------
  // RETURN JSX
  // ------------------------------------------------------------
  return (
    <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
      <Box ref={ref} sx={{ p: 0, m: 0 }}>
        <NavDrawerMain
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />

        <AppBar position="static" color="default" elevation={1} sx={{ p: 0 }}>
          <Toolbar
            disableGutters
            sx={{
              px: 0,
              minHeight: 72,
              backgroundColor: "#f9f9f9",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Logo */}
            <Box
              sx={{
                flex: "0 0 200px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                component="img"
                src={logo}
                alt="Kofi Solutions"
                sx={{
                  height: 80,
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </Box>

            {/* Navigation */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                gap: 3,
              }}
            >
              {["Home", "Register", "Login", "Logout"].map((label) => (
                <Box
                  key={label}
                  onClick={() => {
                    if (label === "Home") goToHome();
                    else if (label === "Register") handleRegister();
                    else if (label === "Login") handleLogin();
                    else if (label === "Logout") handleLogout();
                  }}
                  sx={{
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "#1e3c72",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    px: 1,
                    py: 0.5,
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

            {/* Contact Button */}
            <Box
              sx={{
                flex: "0 0 200px",
                display: "flex",
                justifyContent: "flex-end",
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
                  <Box sx={{ mr: 1 }}>
                    <ContactSupportIcon />
                  </Box>
                  Contact
                </Box>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Banner */}
        <Box
          sx={{
            background: "linear-gradient(to right, #1e3c72, #3b78e2)",
            color: "#fff",
            px: 3,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <MenuIcon
            fontSize="large"
            sx={{ cursor: "pointer" }}
            onClick={() => setIsDrawerOpen(true)}
          />

          <Chip
            label={user?.email || authType?.toUpperCase()}
            onClick={handleUserChipClick}
            sx={{
              backgroundColor: "#e3f2fd",
              color: "#0d47a1",
              fontWeight: 600,
              borderRadius: "16px",
              px: 1.5,
              py: 0.5,
              fontSize: "0.8rem",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#bbdefb",
              },
            }}
          />

          <Tooltip title="Feed & Market Health">
            <HealthAndSafetyIcon
              sx={{ cursor: "pointer", color: "#ffffff" }}
              onClick={() => setIsHealthOpen(true)}
            />
          </Tooltip>

          <Drawer
            anchor="right"
            open={isHealthOpen}
            onClose={() => setIsHealthOpen(false)}
            PaperProps={{
              sx: {
                width: "22rem",
                padding: 2,
                backgroundColor: "#fafafa",
                zIndex: 2000,
              },
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              System Health
            </Typography>
            <FeedHealthDashboard />
          </Drawer>
        </Box>

        <TickerBar activeCategory={activeCategory} />
      </Box>
    </Box>
  );
}
