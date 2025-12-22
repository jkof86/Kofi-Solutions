import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import { useNavigate } from "react-router-dom";

import { GoogleLogin } from "@react-oauth/google";

export default function LoginComponent() {

  const [formData, setFormData] = useState({ email: '', password: '' });
  const storedUser = JSON.parse(localStorage.getItem('user'));

  //we use this to navigate to the Home component after successful validation
  const navigate = useNavigate();
  const goToNewComponent = () => {
    //reload page after login to clear cache
    navigate("/home");
    window.location.reload();
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    loginUser(formData.email, formData.password);
    // console.log('Form Data Submitted:', formData);
  }

  function loginUser(username, password) {
    //first condition ensures storedUser isn’t null or undefined
    if (storedUser && storedUser.username === username && storedUser.password === password) {
      localStorage.setItem('isLoggedIn', 'true');
      alert(`Welcome back, ${storedUser.username}!`);

      goToNewComponent();

      return true;
    } else {
      alert('Invalid username or password');
      alert(JSON.stringify(storedUser));
      return false;
    }
  }

  //-----------Google Login------------------

  const handleSuccess = (credentialResponse) => {
    alert("Logged in successfully");

    //using localStorage for validation until sessions are integrated 
    localStorage.setItem("isLoggedIn", true)
    goToNewComponent();
  };

  const handleError = () => {
    alert("Login Failed");
  };

  //-----------Google Login------------------

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 400,
          margin: 'auto',
          marginTop: 4,
          backgroundColor: 'white',
          padding: 10,
          borderRadius: 10
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
          fullWidth>
          Submit
        </Button>

        <Typography>**WARNING**</Typography>

        <Typography variant='caption'>
          USERNAME and PASSWORD are UNENCRYPTED and stored locally <br />
          DO NOT register or login with your real credentials <br />
          Registration/Login functionality is for testing purposes
        </Typography>

      </Box>

    </>
  );
};