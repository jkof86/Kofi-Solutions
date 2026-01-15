import {
  Avatar,
  Box,
  Chip,
  Stack,
  Drawer,
  Tooltip,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";

import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import {
  Home as HomeIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Logout,
} from "@mui/icons-material";

import NewspaperIcon from "@mui/icons-material/Newspaper";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import WorkIcon from "@mui/icons-material/Work";

import { useAuth } from "../../context/AuthContext";

import { Link, useNavigate } from "react-router-dom";
import avatarImage from "../../images/icons/avatar_full.jpg";

// ------------------------------
// NAV ITEMS
// ------------------------------
const navItems = [
  { label: "Home", icon: <HomeIcon />, to: "/home" },
  { label: "Gaming", icon: <SportsEsportsIcon />, to: "/gaming" },
  {
    label: "WordPress",
    icon: <NewspaperIcon />,
    external: true,
    href: "https://wp.kofisolutions.com",
  },
  { label: "Professional", icon: <WorkIcon />, to: "/professional" },
  { label: "Fitness & Nutrition", icon: <FitnessCenterIcon />, to: "/fitness" },
];

export default function NavDrawerMain({ isDrawerOpen, setIsDrawerOpen }) {
  const navigate = useNavigate();
  const { isLoggedIn, authType, user, logout, logoutToRegister } = useAuth();


  function goToLogin() {
    navigate("/login");
  }

  function handleLogout() {
    logoutToRegister();
  }

  const navItems2 = [
    { label: "Account", icon: <AccountCircleIcon />, to: "" },
    { label: "Settings", icon: <SettingsIcon />, to: "" },
    {
      label: "Logout",
      icon: <LogoutIcon />,
      action: handleLogout,
    },
  ];

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
      PaperProps={{ sx: { width: "15rem" } }}
    >
      {/* PROFILE BOX */}
      <Box
        component={Link}
        to="/professional"
        onClick={() => setIsDrawerOpen(false)}
        sx={{
          cursor: "pointer",
          textDecoration: "none",
          color: "inherit",
          "&:hover": { backgroundColor: "#eef4f5ff" },
        }}
      >
        <Stack direction="row" padding={1} spacing={1} justifyContent="center">
          <Tooltip title="View Resume / Portfolio">
            <Chip
              sx={{
                height: 36,
                fontSize: "0.9rem",
                px: 1.5,
                "& .MuiChip-label": { paddingLeft: 6, paddingRight: 6 },
              }}
              size="medium"
              avatar={<Avatar alt="Jason" src={avatarImage} />}
              label="Jason"
              variant="outlined"
            />
          </Tooltip>
        </Stack>
      </Box>

      {/* MAIN NAV ITEMS */}
      {navItems.map(({ label, icon, to, external, href }) => (
        <ListItem key={label} disablePadding>
          <ListItemButton
            sx={{ textAlign: "left", borderTop: "1px solid black" }}
            component={external ? "a" : Link}
            to={!external ? to : undefined}
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

      {/* ACCOUNT / SETTINGS / LOGOUT */}
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
  );
}
