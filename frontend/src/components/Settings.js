import { Box, Container, TextField, Toolbar, Typography } from "@mui/material";


export default function Settings() {

    return (<>
        <Toolbar sx={{
            justifyContent: 'center',
            backgroundColor: 'grey',
            border: '1px solid black',
            boxShadow: '0px 0px 2px 2px white',
            marginBottom: '10px',
            width: '100vw'
        }}>
            <Typography sx={{ fontSize:'20px',
            fontStyle:'bold'}}>
                Settings
            </Typography>
        </Toolbar>

        <center>
            <Box padding={0} sx={{
                justifyContent: 'center',
                backgroundColor: 'white',
                borderRadius: '25px',
                border: '1px solid black',
                boxShadow: '0px 0px 2px 2px white',
                padding: '20px',
                margin: '20px',
                width: '75vw',
                // height: '85vh'
            }}>
                <h1>Settings</h1>
            </Box>
        </center>
    </>);
}