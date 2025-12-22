import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Box, Toolbar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalculateIcon from '@mui/icons-material/Calculate';
import InfoIcon from '@mui/icons-material/Info';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';

import banner from '../../images/bg/fitnessBanner02.jpeg';

import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const navItems = ['Back', 'Home', 'Contact', 'Nutrition Calculator'];
const navItems2 = ['Account', 'Settings', 'Logout'];

export default function NavDrawerFitness() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const goToLogin = () => {
    //reload page to clear cache
    navigate("/login");
    // window.location.reload()
  }

  function handleLogout() {
    googleLogout(); // disables auto-login
    alert(`Logged out successfully`);
    localStorage.removeItem('isLoggedIn');
    goToLogin();
  }


  return (<>

    <Toolbar sx={{
      justifyContent: 'center'
    }}>

      <IconButton
        edge="start"
        aria-label="menu"
        onClick={() => { setIsDrawerOpen(true) }
        } >

        <MenuIcon sx={{ color: 'white' }} />

      </IconButton>

      <center>

        <Toolbar sx={{
          justifyContent: 'center',
          marginLeft: 2,
          backgroundImage: `url(${banner})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: 'white',
          borderRadius: '25px',
          border: '1px solid black',
          boxShadow: '0px 0px 8px 5px white',
          height: '230px',
          width: '487px'
        }}
        >

          <Drawer
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            // PaperProps allows us to resize the menu
            PaperProps={{
              sx: { width: "15rem" }
            }}>

            <Typography sx={{ my: 2, textAlign: 'center' }}>
              Fitness / Nutrition
            </Typography>

            <Divider sx={{
              borderColor: 'black',
              borderBottomWidth: '5px', margin: ' 5px'
            }} />


            {/* //THIS SECTION HANDLES MENU BUTTON NAVIGATION  */}
            {navItems.map((item) => (
              <ListItem key={item} disablePadding>

                {/* //------------------------------------------------ */}

                {item === 'Back' ? <ListItemButton sx={{ textAlign: 'left' }}
                  component={Link}
                  to='/fitness/calculator'
                  onClick={() => {
                    console.info("BACK BUTTON TEST");
                    setIsDrawerOpen(false);
                  }}>
                  <ArrowBackIcon sx={{ margin: '5px' }} />
                  <ListItemText primary={item} />
                </ListItemButton> : ''}

                {/* //------------------------------------------------ */}

                {item === 'Home' ? <ListItemButton sx={{ textAlign: 'left' }}
                  component={Link}
                  to='/home'
                  onClick={() => {
                    console.info("HOME BUTTON TEST");
                    setIsDrawerOpen(false);
                  }}>
                  <HomeIcon sx={{ margin: '5px' }} />
                  <ListItemText primary={item} />
                </ListItemButton> : ''}

                {/* //------------------------------------------------ */}

                {item === 'Nutrition Calculator' ? <ListItemButton sx={{
                  borderTop: '1px solid black',
                  textAlign: 'left'
                }}
                  component={Link}
                  to='/fitness/calculator'
                  onClick={() => {
                    console.info("CALCULATOR BUTTON TEST");
                    setIsDrawerOpen(false);
                  }}>
                  <CalculateIcon sx={{ margin: '5px' }} />
                  <ListItemText primary={item} />
                </ListItemButton> : ''}

                {/* //------------------------------------------------ */}

                {item === 'About' ? <ListItemButton sx={{
                  borderTop: '1px solid black',
                  textAlign: 'left'
                }}
                  component={Link}
                  to='/about'
                  onClick={() => {
                    console.info("ABOUT BUTTON TEST");
                    setIsDrawerOpen(false);
                  }}>
                  <InfoIcon sx={{ margin: '5px' }} />
                  <ListItemText primary={item} />
                </ListItemButton> : ''}

                {/* //------------------------------------------------ */}

                {item === 'Contact' ? <ListItemButton sx={{
                  borderTop: '1px solid black',
                  textAlign: 'left'
                }}
                  component={Link}
                  to='/fitness/contact'
                  onClick={() => {
                    console.info("CONTACT US BUTTON TEST");
                    setIsDrawerOpen(false);
                  }}>
                  <ContactSupportIcon sx={{ margin: '5px' }} />
                  <ListItemText primary={item} />
                </ListItemButton> : ''}

                {/* //------------------------------------------------ */}

              </ListItem>

            ))};

            {/* //------------------------------------------------ */}

            <Divider sx={{
              borderColor: 'black',
              borderBottomWidth: '5px'
            }} />

            {/* //------------------------------------------------ */}

            {navItems2.map((item) => (
              <ListItem key={item} disablePadding>

                {item === 'Account' ? <ListItemButton sx={{}}
                  component={Link}
                  to='/fitness/calculator'
                  onClick={() => {
                    console.info("ACCOUNT BUTTON TEST");
                    setIsDrawerOpen(false);
                  }}>
                  <AccountCircleIcon sx={{ margin: '5px' }} />
                  <ListItemText primary={item} />
                </ListItemButton> : ''}

                {/* //------------------------------------------------ */}

                {item === 'Settings' ? <ListItemButton sx={{ borderTop: '1px solid black' }}
                  component={Link}
                  to='/fitness/calculator'
                  onClick={() => {
                    console.info("SETTINGS BUTTON TEST");
                    setIsDrawerOpen(false);
                  }}>
                  <SettingsIcon sx={{ margin: '5px' }} />
                  <ListItemText primary={item} />
                </ListItemButton> : ''}

                {/* //------------------------------------------------ */}

                {item === 'Logout' ? <ListItemButton sx={{ borderTop: '1px solid black' }}
                  onClick={() => {
                    setIsDrawerOpen(false);
                    handleLogout();
                  }}>
                  <LogoutIcon sx={{ margin: '5px' }} />
                  <ListItemText primary={item} />
                </ListItemButton> : ''}
              </ListItem>
            ))}

          </Drawer>

        </Toolbar>

      </center>

    </Toolbar>

  </>
  );
}