// ------------------------------------------------------------
// HeaderShell.jsx — v1.2.0.5 (Auth‑Safe, No Alerts)
// ------------------------------------------------------------

import {
    AppBar,
    Toolbar,
    Box,
    Typography,
    Stack,
    Drawer,
    Tooltip,
    Chip
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import { useAuth } from "../../context/AuthContext";
import logo from "../../images/bg/ksBanner06.jpeg";

export default function HeaderShell({ onHeightChange, activeCategory }) {
    const [isHealthOpen, setIsHealthOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const navigate = useNavigate();
    const ref = useRef(null);

    const { isLoggedIn, authType, user, logout } = useAuth();

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
    const goToRegister = () => navigate("/register");
    const goToLogin = () => navigate("/login");
    const goToHome = () => {
        // if (type === "google"){navigate("/users/GoogleUser");}
        // if (type === "apple"){navigate("/users/AppleUser");}
        // if (type === "guest"){navigate("/home");}
        navigate("/home");
    }


    // Clean handlers — NO alerts, NO auth checks
    const handleRegister = () => {
        if (isLoggedIn) return alert("You are already logged in — logout first.");
        goToRegister();
    };

    function handleLogin() {
        if (isLoggedIn) return alert("You are already logged in — logout first.");
        goToLogin();
    }

    function handleLogout() {
        logout();
    }

    function sendEmail() {
        const recipient = "admin@kofisolutions.com";
        window.location.href = `mailto:${recipient}?subject=Attention:&body=`;
    }

    return (
        <AppBar position="static" color="default" elevation={1} sx={{ p: 0 }}>
            <Toolbar
                disableGutters
                sx={{
                    px: 2,
                    minHeight: 72,
                    backgroundColor: "#f9f9f9",
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    overflow: "hidden",
                }}
            >
                {/* LEFT: Logo */}
                <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                    <img
                        src={logo}
                        alt="Kofi Solutions"
                        style={{ height: 80, objectFit: "cover", display: "block" }}
                    />
                </Box>

                {/* RIGHT: Nav + UserBadge + Contact */}
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        alignItems: "center",
                        flexWrap: "wrap",
                        maxWidth: "100%",
                        overflow: "hidden",
                        height: 80,
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
                                fontWeight: 500,
                                color: "#1e3c72",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                padding: "6px 4px",
                                display: "flex",
                                alignItems: "center",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: 120,
                                transition: "0.2s ease",
                                "&:hover": {
                                    color: "#3b78e2",
                                    borderBottom: "2px solid #3b78e2"
                                }
                            }}
                        >
                            {label}
                        </Box>
                    ))}

                    {isLoggedIn && (
                        <Chip
                            label={`${authType.toUpperCase()} • ${user?.email || ""}`}
                            sx={{
                                backgroundColor: "#e3f2fd",
                                color: "#0d47a1",
                                fontWeight: 600,
                                borderRadius: "16px",
                                px: 1.5,
                                py: 0.5,
                                fontSize: "0.8rem",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: 200,
                            }}
                        />
                    )}

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
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                transition: "0.25s ease",
                                "&:hover": {
                                    backgroundColor: "#1e3c72"
                                }
                            }}
                        >
                            Contact
                        </Box>
                    </Tooltip>
                </Stack>
            </Toolbar>
        </AppBar>

    );
}
