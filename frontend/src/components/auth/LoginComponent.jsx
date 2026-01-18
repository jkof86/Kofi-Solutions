// ------------------------------------------------------------
// LoginComponent.jsx — v1.2.0.8 (Bug‑Free + Clean)
// ------------------------------------------------------------

import { Box, Button, Container } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";
import { BannerThemes } from "../../data/bannerThemes";

import UserHeader from "../layouts/UserHeader";

import loginBanner from "../../images/bg/ksBanner05.jpeg";

export default function LoginComponent() {
  const { loginGoogle, loginApple, loginGuest, authType } = useAuth();

  // GOOGLE LOGIN
  const handleGoogleSuccess = () => {
    loginGoogle({ email: "googleUser" });
  };

  const handleGoogleError = () => {
    alert("Google Login Failed");
  };

  // APPLE LOGIN
  const handleAppleLogin = () => {
    loginApple({ email: "appleUser" });
  };

  // GUEST LOGIN
  const handleGuestLogin = () => {
    loginGuest();
  };

  const theme = BannerThemes[authType] || BannerThemes.default;

  return (
    <>
      {/* Fixed header */}
            <UserHeader sx={{ m: 0, p: 0 }} />
      
            {/* Main wrapper */}
            <Box
              sx={{
                pt: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              
            {/* Banner */}
            <Box
              component="img"
              src={loginBanner}
              alt="Login Banner"
              sx={{
                width: "420px",
                height: "auto",
                borderRadius: "18px",
                mb: 2,
                objectFit: "cover",

                // Stylish double border
                border: "3px solid #1e293b",
                outline: "2px solid #3b82f6",
                outlineOffset: "3px",

                // Soft depth
                boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
              }}
            />

            {/* Login Box */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "350px",
                backgroundColor: "white",
                p: 4,
                borderRadius: 3,

                // Stylish double border (inner + outer)
                border: "3px solid #1e293b",
                outline: "2px solid #3b82f6",
                outlineOffset: "3px",

                // Depth + polish
                boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
              }}
            >
              {/* GOOGLE LOGIN */}
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />

              {/* APPLE LOGIN */}
              <Button
                type="button"
                variant="contained"
                fullWidth
                onClick={handleAppleLogin}
                sx={{
                  mt: 1,
                  background: theme.gradient,
                }}
              >
                Sign in with Apple
              </Button>

              {/* GUEST LOGIN */}
              <Button
                type="button"
                variant="outlined"
                color="primary"
                fullWidth
                onClick={handleGuestLogin}
              >
                Continue as Guest
              </Button>
            </Box>
          </Box>
        {/* </Container> */}
    </>
  );
}
