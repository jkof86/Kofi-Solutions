import {
    Box, Button, Toolbar, Typography,
    Grid, Card, CardActionArea,
    CardMedia, CardContent, CardActions
} from "@mui/material";
import { Link } from 'react-router-dom';
import SlideShowFitness from "./SlideShowFitness";
import NavDrawerGaming from "./navigation/NavDrawerGaming";

export default function ContactGaming() {

    return (<>

        {<NavDrawerGaming />}

        {/********************************************************/}

        {/* <Container disableGutters={false} sx={{ width: '100vw' }}> */}
        <center>
            <Box padding={0} sx={{
                justifyContent: 'center',
                backgroundColor: 'white',
                borderRadius: '25px',
                border: '1px solid black',
                boxShadow: '0px 0px 2px 2px white',
                padding: '10px',
                margin: '20px',
                width: '90vw'
            }}>

                {/* <center>
                    <SlideShowFitness />
                </center> */}

                <Grid container spacing={4} sx={{ justifyContent: 'center' }}>

                    {/********************************************************/}

                    <Grid item xs={6} >

                        <Card sx={{
                            // border: '2px solid black',
                            minWidth: '40vw',
                            borderRadius: '25px',
                            padding: '5px',
                            margin: '20px',
                            textAlign: 'center',
                        }}>
                            <CardActionArea component={Link} to='https://www.youtube.com/@jkof86' target="_blank">

                                <CardContent>
                                </CardContent>
                                <CardMedia
                                    component="img"
                                    alt="Jkof Gaming"
                                    // image={require("../images/icons/youtube-transparent-png-15.png")}
                                    image={require("../images/bg/jkofGamingBanner01.png")}
                                    sx={{borderRadius:'25px'}}
                                    >


                                </CardMedia>
                            </CardActionArea>

                            <CardActions>
                                <Button size="small">Share</Button>
                                <Button size="small">Learn More</Button>
                            </CardActions>

                        </Card >

                    </Grid>

                    {/********************************************************/}

                </Grid>

            </Box>
        </center>
    </>);
}