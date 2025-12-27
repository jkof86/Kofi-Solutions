import { Toolbar, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


import { googleLogout } from '@react-oauth/google';

export default function MainBar() {

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    // ------------------------------------------------------------
    // Login Validation
    // ------------------------------------------------------------

    const goToRegister = () => {
        //reload page to clear cache
        // navigate("/register");
        // window.location.reload()

        alert('Registration is temporarily disabled');
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

    return (<>
        {

            <Box textAlign={"center"} width={'100vw'}>
                <Button variant='contained' sx={{
                    backgroundColor: 'grey',
                    borderRadius: '0px',
                    margin: '0px',
                    marginTop: '10px'
                }}
                    component={Link} to='/home'>
                    Home
                </Button>

                <Button variant='contained'
                    onClick={handleRegister}
                    sx={{
                        backgroundColor: 'grey',
                        borderRadius: '0px',
                        margin: '0px',
                        marginTop: '10px'
                    }}>
                    Register
                </Button>

                <Button variant='contained'
                    onClick={handleLogin}
                    sx={{
                        backgroundColor: 'grey',
                        borderRadius: '0px',
                        margin: '0px',
                        marginTop: '10px'
                    }}>
                    Login
                </Button>

                <Button variant='contained'
                    onClick={handleLogout}
                    sx={{
                        backgroundColor: 'grey',
                        borderRadius: '0px',
                        margin: '0px',
                        marginTop: '10px'
                    }}>
                    Logout
                </Button>

            </Box>
        }
    </>)
}