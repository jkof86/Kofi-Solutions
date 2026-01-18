import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";

import UserHeader from '../layouts/UserHeader';

export default function RegisterComponent() {

  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
    window.location.reload();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    registerUser(formData.email, formData.password);
  };

  function registerUser(email, password) {
  if (!email || !password) {
    alert("Please enter both email and password");
    return false;
  }

  const user = { email, password };

  localStorage.setItem("tempUser", JSON.stringify(user));

  alert(`Registered: ${email}`);
  goToLogin();
  return true;
}


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
          src={require('../../images/bg/ksBanner08.jpeg')}
          alt="Register Banner"
          sx={{
            width: "420px",
            height: "140px",
            borderRadius: "16px",
            boxShadow: 3,
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

        {/* Registration Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: "350px",
            backgroundColor: 'white',
            p: 4,
            borderRadius: 3,
            border: '2px solid black',
            boxShadow: 3,

            // Stylish double border
                border: "3px solid #1e293b",
                outline: "2px solid #3b82f6",
                outlineOffset: "3px",

                // Soft depth
                boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          }}
        >
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
            type='submit'
            variant="contained"
            color="primary"
            fullWidth
          >
            Create Account
          </Button>

          <Typography variant="caption" sx={{ mt: 1 }}>
            * This is a temporary registration system. <br /> 
            * Credentials are stored unencrypted in localStorage. <br /> 
            * DO NOT use real passwords.
          </Typography>
        </Box>
      </Box>
    </>
  );
}
