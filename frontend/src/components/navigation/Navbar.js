import { Toolbar, Button, IconButton, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material"

// export default function Navbar({ loggedIn, setLoggedIn }) {

export default function NavBar() {

    return (<>

        {
            <Toolbar sx={{
                //this rgb value is semi transparent
                background: 'rgba(0,0,0,0)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: 400,
                margin: 'auto',
                marginTop: 2
            }}
                variant="menu"
                position="static"
            >
                <Box textAlign={"center"} width={'100vw'}>

                    <Button variant='contained' sx={{
                        backgroundColor: 'grey',
                        borderRadius: '0px',
                        margin: '0px',
                        marginTop: '10px'
                    }}
                        component={RouterLink} to='/professional/about'
                    >
                        Professional
                    </Button>

                    <Button variant='contained' sx={{
                        backgroundColor: 'grey',
                        borderRadius: '0px',
                        margin: '0px',
                        marginTop: '10px'
                    }}
                        component={RouterLink} to='/fitness/calculator'>
                        Fitness / Nutrition
                    </Button>

                    <Button variant='contained' sx={{
                        backgroundColor: 'grey',
                        borderRadius: '0px',
                        margin: '0px',
                        marginTop: '10px'
                    }}
                        component={RouterLink} to='/gaming/about'>
                        Gaming
                    </Button>

                    <Button variant='contained' sx={{
                        backgroundColor: 'grey',
                        borderRadius: '0px',
                        margin: '0px',
                        marginTop: '10px'
                    }}
                        // we add rel="noopener noreferrer" 
                        // when using target="_blank" for security
                        component={MuiLink}
                        href="https://wp.kofisolutions.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                        Wordpress
                    </Button>
                </Box>
            </Toolbar>
        }
    </>)
}
