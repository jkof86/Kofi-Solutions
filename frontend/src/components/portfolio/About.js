import { Box } from "@mui/material";
import MyPortfolio from "./MyPortfolio";
import MyResume from './MyResume';

export default function About() {

    return (<>

        {/* *****************************************************/}

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
                <MyResume/>
            </Box>

        {/* *****************************************************/}

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
                <MyPortfolio />
            </Box>
        </center>
    </>);
};