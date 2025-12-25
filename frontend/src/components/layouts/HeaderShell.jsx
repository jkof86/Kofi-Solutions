import {
  AppBar,
  Avatar,
  Toolbar,
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Drawer,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Tooltip
} from "@mui/material";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import {
  Home as HomeIcon,
  Info as InfoIcon,
  ContactSupport as ContactSupportIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ViewList as ViewListIcon,
  Menu as MenuIcon
} from "@mui/icons-material";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";

import FeedHealthDashboard from "../FeedHealthDashboard";


import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import { googleLogout } from "@react-oauth/google";

import avatarImage from '../../images/icons/avatar_full.jpg';
import TickerBar from "./TickerBar";


const TICKER_DATA = [
  { label: "BITCOIN", value: 87841.0, change: -0.95 },
  { label: "ETHEREUM", value: 2940.71, change: -1.95 },
  { label: "SOLANA", value: 124.08, change: -1.45 },
  { label: "AAPL", value: 190.12, change: 0.8 },
  { label: "MSFT", value: 410.55, change: -0.3 },
  { label: "AMZN", value: 175.44, change: 1.2 }
];

export default function HeaderShell({ onHeightChange }) {
  // const [feedHealth, setFeedHealth] = useState(null);
  // const [loadingHealth, setLoadingHealth] = useState(true);
  // const [healthError, setHealthError] = useState(null);
  const [isHealthOpen, setIsHealthOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  // 🔥 THIS ref measures the ENTIRE header (AppBar + Banner + Ticker)
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(([entry]) => {
      onHeightChange(entry.contentRect.height);
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onHeightChange]);

  const navItems = [
    { label: "Home", icon: <HomeIcon />, to: "/home" },
    { label: "Gaming", icon: <SportsEsportsIcon />, to: "/gaming/about" },
    {
      label: "WordPress",
      icon: <InfoIcon />,
      external: true,
      href: "https://wp.kofisolutions.com"
    },
    { label: "Professional", icon: <ContactSupportIcon />, to: "/professional/about" },
    { label: "Fitness & Nutrition", icon: <InfoIcon />, to: "/fitness/calculator" }
  ];

  const navItems2 = [
    { label: "Account", icon: <AccountCircleIcon />, to: "/professional/about" },
    { label: "Settings", icon: <SettingsIcon />, to: "/professional/about" },
    {
      label: "Logout",
      icon: <LogoutIcon />,
      action: () => {
        googleLogout();
        alert("Logged out successfully");
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
      }
    }
  ];

  const handleClick = () => {
    alert("Kofi Solutions");
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
    const recipient = "jason.kofi@kofisolutions.com";
    const subject = encodeURIComponent("Attention: ");
    const body = encodeURIComponent("");
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  }

  return (
    <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>

      {/* This wrapper contains ALL header content and is measured */}
      <Box ref={ref}>

        {/* Drawer Menu */}
        <Drawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          PaperProps={{ sx: { width: "15rem" } }}
        >

          {/*           
  // ------------------------------------------------------------
  // Login Validation
  // ------------------------------------------------------------ */}

          <Stack direction="row" padding={1} spacing={1} justifyContent={'center'}>
            <Tooltip title='View Resume / Portfolio'>
              <Chip sx={{
                cursor: 'pointer', // Makes the mouse change to pointer on hover
                '&:hover': {
                  backgroundColor: '#95CDD5', // Optional: subtle hover effect
                },
              }}
                avatar={<Avatar alt="Jason" src={avatarImage}
                />}
                label="Jason"
                variant="outlined"
                component={Link}
                to="/about"
              />
            </Tooltip>
          </Stack>


          {/* <Divider sx={{ borderColor: "black", borderBottomWidth: "5px", mb: 1 }} /> */}


          {navItems.map(({ label, icon, to, external, href }) => (
            <ListItem key={label} disablePadding>
              <ListItemButton
                sx={{
                  textAlign: "left",
                  borderTop: "1px solid black"
                }}
                component={external ? "a" : Link}
                to={external ? undefined : to}
                href={external ? href : undefined}
                target={external ? "_blank" : undefined}
                onClick={() => setIsDrawerOpen(false)}
              >
                {icon}
                <ListItemText primary={label} sx={{ ml: 1 }} />
              </ListItemButton>
            </ListItem>
          ))}

          <Divider sx={{ borderColor: "black", borderBottomWidth: "5px", mt: 1 }} />

          {navItems2.map(({ label, icon, to, action }) => (
            <ListItem key={label} disablePadding>
              <ListItemButton
                sx={{ textAlign: "left", borderBottom: "1px solid black" }}
                component={to ? Link : "button"}
                to={to}
                onClick={() => {
                  setIsDrawerOpen(false);
                  if (action) action();
                }}
              >
                {icon}
                <ListItemText primary={label} sx={{ ml: 1 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </Drawer>

        {/* NavBar */}
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

        {/* Banner */}
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
              <Typography variant="h3" sx={{ fontWeight: 600 }}>
                Kofi Solutions
              </Typography>
              <Chip label="v1.142" size="small"
                sx={{
                  backgroundColor: "#fff",
                  color: "#1976d2",
                  fontWeight: 600
                }}
              />
            </Box>
          </Stack>


          {/* System Health Drawer */}
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

          <Box justifyContent='center'>

            <Tooltip title="Feed & Market Health">
              <HealthAndSafetyIcon
                sx={{
                  cursor: "pointer",
                  color: "#ffffff",
                  // zIndex: 3000,
                  position: "relative"
                }}
                onClick={() => setIsHealthOpen(true)}
              />
            </Tooltip>
          </Box>

        </Box>


        <TickerBar />

      </Box>
    </Box>
  );
}
