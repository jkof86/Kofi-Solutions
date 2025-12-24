import NavBar from "../navigation/NavBar";
import NavDrawerProfessional from "../navigation/NavDrawerProfessional";

export default function Professional() {
    return (<>
        <NavDrawerProfessional />
        <NavBar />

        {/* <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: 400,
                margin: 'auto',
                marginTop: 4,
                backgroundColor: 'white',
                padding: 10,
                borderRadius: 10
            }}
        >
            <Typography 
            variant="h4" 
            color={"black"}
            sx={{textAlign:'center'}}
            >Weather Tracker</Typography>
            <CitySelector />
            <WeatherDashboard />
        </Box> */}


    </>)
}