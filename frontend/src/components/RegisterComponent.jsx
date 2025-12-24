import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import MainBar from './navigation/MainBar';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { googleLogout } from '@react-oauth/google';

export default function RegisterComponent() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const goToNewComponent = () => navigate("/login");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
      navigate('/home');
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

  const handleSubmit = (event) => {
    event.preventDefault();
    registerUser(formData.email, formData.password);
  };

  function registerUser(username, password) {
    const user = { username, password };
    localStorage.setItem('user', JSON.stringify(user));
    alert(`${user.username} registered successfully`);
    goToNewComponent();
  }

  return (
    <>
      {/* 🔥 Render your top navigation */}
      <MainBar />
      {/* OR <HeaderShell /> */}

      {/* 🔥 Custom Banner Image (Drop‑in) */}
      <Box
        sx={{
          width: "100%",
          mt: 2, // pushes banner below fixed MainBar/HeaderShell
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Box
          component="img"
          src={require('../images/bg/ksBanner08.jpeg')}   // <-- replace with image path
          alt="Login Banner"
          sx={{
            width: "100%",
            maxWidth: "70vw",
            borderRadius: '25px',
            boxShadow: '0px 0px 8px 2px white',
            objectFit: "cover"
          }}
        />
      </Box>

      {/* 🔥 Add top padding so form clears the fixed header */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 400,
          margin: 'auto',
          mt: 2,              // <-- pushes content below MainBar
          backgroundColor: 'white',
          p: 4,
          borderRadius: 3,
          boxShadow: 3
        }}
      >
        <Typography variant="h6" textAlign="center">Registration</Typography>

        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          fullWidth
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>


        {/* 🔥 Two‑Column MUI Layout (Drop‑in) */}
        <Box
          sx={{
            display: "grid",
            alignItems: "center", // vertical center 
            justifyContent: "center", // horizontal center
            gridTemplateColumns: { xs: "auto 1fr", md: "auto 1fr" },
            gap: 3,
            width: "100%",
            mt: 4
          }}
        >
          <Box
            sx={{}}>
            {/* Left Column Content */}
            <WarningAmberIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} />
          </Box>

          <Box sx={{}}>
            {/* Right Column Content */}
            <Typography variant="caption" component="div">
              Registration functionality is for{" "}
              <Box
                component="span"
                sx={{ color: "red", fontWeight: "bold" }}
              >
                TESTING PURPOSES ONLY
              </Box>
              <br />

              <Box
                component="span"
                sx={{ color: "red", fontWeight: "bold" }}
              >
                DO NOT
              </Box> register or login with your real credentials <br />
              USERNAME and PASSWORD are{" "}
              <Box
                component="span"
                sx={{ color: "red", fontWeight: "bold" }}
              >UNENCRYPTED</Box> and stored locally
            </Typography>
          </Box>

        </Box>

      </Box>
    </>
  );
}
