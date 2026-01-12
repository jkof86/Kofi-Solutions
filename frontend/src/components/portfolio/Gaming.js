import {
    Box, Button,
    Grid, Card, CardActionArea,
    CardMedia, CardContent, CardActions
} from "@mui/material";
import { Link } from 'react-router-dom';

export default function Gaming() {

    return (
        <>
            {/*********************** CARD 1 ************************/}

            <Grid item xs={12} md={6}>
                <Card sx={{
                    minWidth: '40vw',
                    borderRadius: '25px',
                    padding: '5px',
                    margin: '20px',
                    textAlign: 'center',
                }}>
                    <CardActionArea
                        component={Link}
                        to="https://www.youtube.com/@jkof86"
                        target="_blank"
                    >
                        <CardContent></CardContent>

                        <CardMedia
                            component="img"
                            alt="Jkof Gaming"
                            image={require("../../images/bg/jkofGamingBanner01.png")}
                            sx={{ borderRadius: '25px' }}
                        />
                    </CardActionArea>

                    <CardActions>
                        <Button size="small">Share</Button>
                        <Button size="small">Learn More</Button>
                    </CardActions>
                </Card>
            </Grid>
        </>
    );
}
