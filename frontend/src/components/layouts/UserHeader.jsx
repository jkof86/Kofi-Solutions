// ------------------------------------------------------------
// UserHeader.jsx — v1.1 (Sticky + Logo Left + Center Nav)
// ------------------------------------------------------------

import { AppBar, Toolbar, Box, Stack, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import { BannerThemes } from "../../data/bannerThemes";

export default function UserHeader({ onHeightChange = () => { } }) {
    const navigate = useNavigate();
    const ref = useRef(null);

    const { isLoggedIn, authType, user, logout } = useAuth();

    // Provides access to BannerThemes
    // theme.gradient
    // theme.image
    // theme.textColor

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
    const goTo = (path) => navigate(path);

    const handleRegister = () => {
        if (isLoggedIn) return alert("You are already LOGGED IN");
        goTo("/register");
    };

    const handleLogin = () => {
        if (isLoggedIn) return alert("You are already LOGGED IN");
        goTo("/login");
    };

    const handleLogout = () => {
        if (!isLoggedIn) return alert("You are already LOGGED OUT");
        logout();
    };

    const sendEmail = () => {
        const recipient = "admin@kofisolutions.com";
        window.location.href = `mailto:${recipient}?subject=Attention:&body=`;
    };

    const theme = BannerThemes[authType] || BannerThemes.default;

    return (
        <AppBar
            position="fixed"
            color="default"
            elevation={1}
            sx={{ p: 0, zIndex: 1000 }}
            ref={ref}
        >
            <Toolbar
                disableGutters
                sx={{
                    px: 0,                   // remove left/right padding
                    minHeight: 56,
                    display: "flex",
                    alignItems: "center",
                    background: theme.gradient,
                    color: theme.textColor,
                }}
            >

                {/* LEFT SECTION — Logo */}
                <Box
                    sx={{
                        flex: "0 0 180px",
                        display: "flex",
                        alignItems: "center",
                        pl: 0,
                        ml: 0,
                    }}
                >
                    <Box
                        component="img"
                        // src={require("../../images/bg/ksLogo2.png")}
                        src={theme.image}
                        alt="Kofi Solutions"
                        sx={{
                            height: 56,
                            objectFit: "contain",
                            display: "block",
                        }}
                    />
                </Box>

                {/* CENTER SECTION — Navigation */}
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
                                if (label === "Home") goTo("/home");
                                else if (label === "Register") handleRegister();
                                else if (label === "Login") handleLogin();
                                else if (label === "Logout") handleLogout();
                            }}
                            sx={{
                                cursor: "pointer",
                                fontSize: "0.9rem",
                                fontWeight: 600,
                                color: theme.textColor,
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                px: 1,
                                py: 0.5,
                                transition: "0.2s ease",
                                "&:hover": {
                                    color: "rgba(255,255,255,0.6)",
                                    borderBottom: "2px solid rgba(255,255,255,0.6)",
                                },
                            }}
                        >
                            {label}
                        </Box>
                    ))}
                </Box>

                {/* RIGHT SECTION — Contact Button */}
                <Box
                    sx={{
                        flex: "0 0 180px",
                        display: "flex",
                        justifyContent: "flex-end",
                        pr: 2,
                    }}
                >
                    <Tooltip title="Compose Email">
                        <Box
                            onClick={sendEmail}
                            sx={{
                                cursor: "pointer",
                                backgroundColor: "white",
                                color: "#1976d2",
                                px: 2.5,
                                py: 1,
                                borderRadius: "20px",
                                border: "1px solid #1976d2",
                                fontWeight: 600,
                                fontSize: "0.9rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                display: "flex",
                                alignItems: "center",
                                transition: "0.25s ease",
                                "&:hover": {
                                    backgroundColor: "rgba(179, 176, 176, 0.77)",
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
        </AppBar >
    );
}
