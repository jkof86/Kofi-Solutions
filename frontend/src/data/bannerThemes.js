// bannerThemes.js
import googleLogo from "../images/bg/ksLogo2T.png"; 
import appleLogo from "../images/bg/ksLogo1T.png"; 
import guestLogo from "../images/bg/ksLogo4T.png";

export const BannerThemes = {
    google: {
        gradient: "linear-gradient(to right, #e82020a5, #fbe41abc, #34a853bf, #1b1bf4b5)",
        background: "#5c5c5c",
        image: googleLogo,
        textColor: "#204b29"
    },
    apple: {
        gradient: "linear-gradient(45deg, #1976d2, #93b4d5)",
        background: "#ffffff",
        image: appleLogo,
        textColor: "#204b29"
    },
    guest: {
        gradient: "linear-gradient(to right, #1976d2,  #eceef1)",
        background: "#ffffff",
        image: guestLogo,
        textColor: "#000000"
    },
    default: {
        gradient: "linear-gradient(to right, #1e3c72, #3b78e2)",
        background: "#ffffff",
        image: guestLogo,
        textColor: "#000000"
    }
};
