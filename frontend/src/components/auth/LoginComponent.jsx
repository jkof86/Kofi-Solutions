// ------------------------------------------------------------
// LoginComponent.jsx — v1.2.0.8 (Bug‑Free + Clean)
// ------------------------------------------------------------

import { Box, Button } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";
import { BannerThemes } from "../../data/bannerThemes";

import UserHeader from "../layouts/UserHeader";

// FIX: Static import for image (require() breaks in Vite/Webpack 5)
import loginBanner from "../../images/bg/ksBanner08.jpeg";

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
      {/* FIX: UserHeader does NOT accept sx props */}
      <UserHeader />

      <Box
        sx={{
          pt: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* FIX: Static import instead of require() */}
        <Box
          component="img"
          src={loginBanner}
          alt="Login Banner"
          sx={{
            width: "420px",
            height: "auto",
            borderRadius: "16px",
            boxShadow: 3,
            mb: 2,
            objectFit: "cover",
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "350px",
            backgroundColor: "white",
            p: 4,
            borderRadius: 3,
            border: "2px solid black",
            boxShadow: 3,
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
    </>
  );
}
