import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Drawer,

  Tooltip
} from "@mui/material";

import {
  Home as HomeIcon,
  ContactSupport as ContactSupportIcon,
  Menu as MenuIcon
} from "@mui/icons-material";

import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import FeedHealthDashboard from "../FeedHealthDashboard";
import NavDrawerMain from "../navigation/NavDrawerMain";
import TickerBar from "./TickerBar";


import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import { googleLogout } from "@react-oauth/google";

export default function HeaderShell({ onHeightChange, activeCategory }) {

  const [isHealthOpen, setIsHealthOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [strictMode, setStrictMode] = useState(true);


  const navigate = useNavigate();

  // THIS ref measures the ENTIRE header (AppBar + Banner + Ticker)
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(([entry]) => {
      onHeightChange(entry.contentRect.height);
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onHeightChange]);

  //NavDrawerMain.js

  const handleClick = () => {
    alert("Emailing webmaster... ");
    sendEmail();
  };


  // ------------------------------------------------------------
  // Login Validation
  // ------------------------------------------------------------

  const goToRegister = () => {
    //reload page to clear cache
    navigate("/register");
    // window.location.reload()
  }
  const goToLogin = () => {
    //reload page to clear cache
    navigate("/login");
    // window.location.reload();
  }

  function handleRegister() {
    if (localStorage.getItem('isLoggedIn'))
      alert('Please logout before registering a new account');
    else
      goToRegister();
  }

  function handleLogin() {
    if (localStorage.getItem('isLoggedIn')) {
      alert('You are currently logged in');
    }
    else
      goToLogin();
  }

  function handleLogout() {
    if (!localStorage.getItem('isLoggedIn'))
      alert('You are currently logged out');
    else {
      googleLogout(); // disables auto-login
      alert(`Logged out successfully`);
      localStorage.removeItem('isLoggedIn');
      goToLogin();
    }
  }
  function sendEmail() {
    const recipient = "admin@kofisolutions.com";
    const subject = encodeURIComponent("Attention: ");
    const body = encodeURIComponent("");
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  }

  return (
    <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
      {/* Wrapper that is measured */}
      <Box ref={ref}>

        <NavDrawerMain
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />

        {/* NAVBAR */}
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6">
              <Tooltip title="Compose Email">
                <Chip
                  label="Contact"
                  variant="filled"
                  color="primary"
                  onClick={handleClick}
                />
              </Tooltip>
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button color="inherit" component={Link} to="/home">HOME</Button>
              <Button color="inherit" onClick={handleRegister}>REGISTER</Button>
              <Button color="inherit" onClick={handleLogin}>LOGIN</Button>
              <Button color="inherit" onClick={handleLogout}>LOGOUT</Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* BANNER */}
        <Box
          sx={{
            background: "linear-gradient(to right, #1e3c72, #2a5298)",
            color: "#fff",
            px: 3,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <MenuIcon
              fontSize="large"
              sx={{ cursor: "pointer" }}
              onClick={() => setIsDrawerOpen(true)}
            />

            <Box>
              {/* <Typography variant="h3" sx={{ fontWeight: 600 }}>
                Dashboard
              </Typography> */}
              <Chip
                label="v1.19"
                size="large"
                sx={{
                  backgroundColor: "#fff",
                  color: "#1976d2",
                  fontWeight: 600
                }}
              />
            </Box>
          </Stack>

          {/* HEALTH DRAWER BUTTON */}
          <Tooltip title="Feed & Market Health">
            <HealthAndSafetyIcon
              sx={{
                cursor: "pointer",
                color: "#ffffff",
                position: "relative"
              }}
              onClick={() => setIsHealthOpen(true)}
            />
          </Tooltip>

          {/* SYSTEM HEALTH DRAWER */}
          <Drawer
            anchor="right"
            open={isHealthOpen}
            onClose={() => setIsHealthOpen(false)}
            PaperProps={{
              sx: {
                width: "22rem",
                padding: 2,
                backgroundColor: "#fafafa",
                zIndex: 2000
              }
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              System Health
            </Typography>

            <FeedHealthDashboard />
          </Drawer>
        </Box>

        {/* TickerBar */}
        <TickerBar activeCategory={activeCategory} />
      </Box>
    </Box>
  )
}
