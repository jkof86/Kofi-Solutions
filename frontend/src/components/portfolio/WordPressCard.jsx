import { Box, Button } from "@mui/material";
import loginBanner from "../../images/bg/ksBanner03.jpeg";


export default function WordPressCard() {

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Box
                    component="img"
                    src={loginBanner}
                    alt="Login Banner"
                    sx={{
                        width: "420px",
                        height: "auto",
                        borderRadius: "18px",
                        objectFit: "cover",
                        border: "3px solid #1e293b",
                        outline: "2px solid #3b82f6",
                        outlineOffset: "3px",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                    }}
                />
            </Box>
        </>)
}