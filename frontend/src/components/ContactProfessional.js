import {
    Box, Toolbar, Typography,
    Grid, Card, CardActionArea,
    CardMedia
} from "@mui/material";
import { Link } from 'react-router-dom';
import SlideShowProfessional from "./SlideShowProfessional";
import NavDrawerProfessional from "./navigation/NavDrawerProfessional";

import banner from '../images/bg/ksAvatar01.jpg';

export default function ContactProfessional() {

    return (<>
        
        {<NavDrawerProfessional />}

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
                <center>
                    {/* <SlideShowProfessional /> */}
                    <Box sx={{
                              justifyContent: 'center',
                              backgroundImage: `url(${banner})`,
                              backgroundSize: 'cover',
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'center',
                              backgroundColor: 'white',
                              borderRadius: '25px',
                              border: '1px solid black',
                              boxShadow: '0px 0px 8px 2px white',
                              height: '874px',
                              width: '655px'
                            }}
                            ></Box>
                </center>

                <Grid container spacing={4} sx={{ justifyContent: 'center' }}>

                    <Grid item xs={2} >

                        <center>
                            <Card sx={{
                                // border: '2px solid black',
                                display: 'flex',
                                minWidth: '75%',
                                borderRadius: '25px',
                                padding: '5px',
                                margin: '20px',
                                textAlign: 'center'
                            }}>
                                <CardActionArea component={Link} to='https://www.linkedin.com/in/jkof86' target="_blank" >
                                    <CardMedia
                                        component="img"
                                        alt="LinkedIn Icon"
                                        image={require("../images/icons/linkedIn_PNG8.png")}
                                    >
                                    </CardMedia>
                                    {/* <CardContent >

                                    </CardContent> */}
                                </CardActionArea>

                                {/* <CardActions>
                                    <Button size="small">Share</Button>
                                    <Button size="small">Learn More</Button>
                                </CardActions> */}

                            </Card >
                        </center>

                    </Grid>

                    {/********************************************************/}

                    <Grid item xs={2} >

                        <center>
                            <Card sx={{
                                // border: '2px solid black',
                                minWidth: '75%',
                                borderRadius: '25px',
                                padding: '5px',
                                margin: '20px',
                                textAlign: 'center',
                            }}>
                                <CardActionArea component={Link} to='https://github.com/jkof86' target="_blank">
                                    <CardMedia
                                        component="img"
                                        alt="GitHub Icon"
                                        image={require("../images/icons/github_PNG45.png")}
                                    >
                                    </CardMedia>
                                    {/* <CardContent >

                                    </CardContent> */}
                                </CardActionArea>

                                {/* <CardActions>
                                    <Button size="small">Share</Button>
                                    <Button size="small">Learn More</Button>
                                </CardActions> */}

                            </Card >
                        </center>

                    </Grid>

                    {/********************************************************/}

                   
                </Grid>

            </Box>
        </center>

        {/* </Container > */}
    </>);
}