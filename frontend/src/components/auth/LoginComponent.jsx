// ------------------------------------------------------------
// LoginComponent.jsx — v1.2.0.7 (Clean + Working)
// ------------------------------------------------------------

import { Box, Button } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";

import Header from "../layouts/Header";

export default function LoginComponent() {
  const auth = useAuth();

  // GOOGLE LOGIN
  const handleGoogleSuccess = () => {
    auth.loginGoogle({ email: "googleUser" });
  };

  const handleGoogleError = () => {
    alert("Google Login Failed");
  };

  // APPLE LOGIN (placeholder)
  const handleAppleLogin = () => {
    auth.loginApple({ email: "appleUser" });
  };

  // GUEST LOGIN
  const handleGuestLogin = () => {
    console.log("Guest login clicked");
    auth.loginGuest();
  };

  return (
    <>
      <Header sx={{ m: 0, p: 0 }} />

      <Box
        sx={{
          pt: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          component="img"
          src={require("../../images/bg/ksBanner08.jpeg")}
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
            color="secondary"
            fullWidth
            onClick={handleAppleLogin}
            sx={{ mt: 1 }}
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
