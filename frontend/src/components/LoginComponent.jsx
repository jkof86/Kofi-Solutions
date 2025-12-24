import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import { googleLogout } from '@react-oauth/google';

// 🔥 Add your MainBar or HeaderShell here
import MainBar from './navigation/MainBar';
// OR: import HeaderShell from "./layouts/HeaderShell";

export default function LoginComponent() {

  const [formData, setFormData] = useState({ email: '', password: '' });
  const storedUser = JSON.parse(localStorage.getItem('user'));

  const navigate = useNavigate();
  const goToNewComponent = () => {
    navigate("/home");
    window.location.reload();
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    loginUser(formData.email, formData.password);
  };

  function loginUser(username, password) {
    if (storedUser && storedUser.username === username && storedUser.password === password) {
      localStorage.setItem('isLoggedIn', 'true');
      alert(`Welcome back, ${storedUser.username}!`);
      goToNewComponent();
      return true;
    } else {
      alert('Invalid username or password');
      return false;
    }
  }

  // -------- Google Login --------
  const handleSuccess = () => {
    alert("Logged in successfully");
    localStorage.setItem("isLoggedIn", true);
    goToNewComponent();
  };

  const handleError = () => {
    alert("Login Failed");
  };
  // ------------------------------

  return (
    <>
      {/* 🔥 Render your top navigation */}
      <MainBar />
      {/* OR <HeaderShell /> */}

      {/* 🔥 Custom Banner Image (Drop‑in) */}
      <Box
        sx={{
          width: "100%",
          mt: 2,                 // pushes banner below fixed MainBar/HeaderShell
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


      {/* 🔥 Add top margin so form clears fixed header */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 400,
          margin: 'auto',
          mt: 2,              // <-- pushes form below header
          backgroundColor: 'white',
          p: 4,
          borderRadius: 3,
          border: '2px solid black',
          boxShadow: 3
        }}
      >
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />

        <Typography variant="h6" textAlign="center">Login</Typography>

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

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Submit
        </Button>
      </Box>
    </>
  );
}
