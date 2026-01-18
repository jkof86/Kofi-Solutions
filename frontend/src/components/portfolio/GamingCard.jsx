import { useState } from "react";
import {
    Card, CardActions, CardMedia, CardContent,
    Grid, CardActionArea, Button, Container, Box,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

import { BannerThemes } from "../../data/bannerThemes";

export default function GamingCard() {
    const [headerHeight, setHeaderHeight] = useState(0);
    const safeHeight = headerHeight || 120; // fallback if not yet measured
    const { authType } = useAuth();
    const theme = BannerThemes[authType] || BannerThemes.default;

    return (
        <>
            <Card
                sx={{
                    minWidth: "40vw",
                    borderRadius: "25px",
                    padding: "5px",
                    margin: "20px",
                    textAlign: "center",
                    px: 4,
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

        </>
    );
}
