import { useState } from "react";
import {
    Card, CardActions, CardMedia, CardContent,
    Grid, CardActionArea, Button, Container, Box,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

import HeaderShell from "../layouts/HeaderShell";
import { BannerThemes } from "../../data/bannerThemes";

export default function Gaming() {
    const [headerHeight, setHeaderHeight] = useState(0);
    const safeHeight = headerHeight || 120; // fallback if not yet measured
    const { authType } = useAuth();
    const theme = BannerThemes[authType] || BannerThemes.default;

    return (
        <>
            {/* FIXED HEADER */}
            <HeaderShell onHeightChange={(h) => setHeaderHeight(h)} />

            {/* MAIN PAGE CONTENT */}
            <Box
                sx={{
                    pt: `${safeHeight}px`, // always use px
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                }}
            >

                <Container
                    maxWidth="lg"
                    sx={{
                        pt: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        background: "white",
                        width: "100%",
                        borderRadius: 5,
                    }}
                >
                    {/* GRID WRAPPER */}
                    <Grid container justifyContent="center">
                        <Grid item xs={12} md={6}>
                            <Card
                                sx={{
                                    minWidth: "40vw",
                                    borderRadius: "25px",
                                    padding: "5px",
                                    margin: "20px",
                                    textAlign: "center",
                                }}
                            >
                                <CardActionArea
                                    component={Link}
                                    to="https://www.youtube.com/@jkof86"
                                    target="_blank"
                                >
                                    <CardContent />

                                    <CardMedia
                                        component="img"
                                        alt="Jkof Gaming"
                                        image={require("../../images/bg/jkofGamingBanner01.png")}
                                        sx={{ borderRadius: "25px" }}
                                    />
                                </CardActionArea>

                                <CardActions>
                                    <Button size="small">Share</Button>
                                    <Button size="small">Learn More</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
}
