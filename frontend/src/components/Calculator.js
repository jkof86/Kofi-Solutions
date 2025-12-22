import {
    Box, TextField, Toolbar, Typography, InputAdornment,
    Button, Grid, Divider, Card, CardActions, CardActionArea,
    CardContent, CardMedia, Table,
    TableHead,
    TableBody,
    TableCell,
} from "@mui/material";

import { useState } from "react";
import PieChart from "./PieChart";
import NavDrawerFitness from "./navigation/NavDrawerFitness";

export default function Calculator() {

    const [state, setState] = useState({
        calorieLimit: "",
        proteinPercent: "",
        carbPercent: "",
        fatPercent: "",
        totalPercent: 0,
    })

    const [display, setDisplay] = useState({
        //we need to declare these values seperately to display later
        showCarbs: 0,
        showProtein: 0,
        showFat: 0
    })

    const resetState = () => {
        //we reset the states back to default values
        setState({
            calorieLimit: "",
            proteinPercent: "",
            carbPercent: "",
            fatPercent: "",
            totalPercent: 0
        })

    }

    const resetDisplay = () => {
        //we reset the display values back to default
        setDisplay({
            showCarbs: 0,
            showProtein: 0,
            showFat: 0
        })
    }

    const resetAll = () => {
        //we reset the display and state values back to default
        setDisplay({
            showCarbs: 0,
            showProtein: 0,
            showFat: 0
        })

        setState({
            calorieLimit: "",
            proteinPercent: "",
            carbPercent: "",
            fatPercent: "",
            totalPercent: 0
        })
    }

    //******************************************************************************* */

    function handleClick() {
        // we do some custom validation for our Textfield values
        // if any fields are left empty, the calc is invalid
        state.calorieLimit <= 0 || !state.calorieLimit || !state.proteinPercent ||
            !state.carbPercent || !state.fatPercent ?
            calcInvalid() : calculateMacros();

        // code to submit form to backend here...
    }

    function handleChange(e) {
        //we handle all input fields here
        const value = e.target.value;
        setState({
            ...state,
            [e.target.name]: value
        })
    }

    const calculateMacros = () => {

        //we create local variables for calculations
        console.log('Calculate Macros Button Test...');

        // we add ternary operation in case of empty values
        // this forces the type to a number
        var calorieLimit = state.calorieLimit ? state.calorieLimit : 0;
        var carb = state.carbPercent ? state.carbPercent : 0;
        var protein = state.proteinPercent ? state.proteinPercent : 0;
        var fat = state.fatPercent ? state.fatPercent : 0;
        var totalPercent = 0;

        // we calculate the total percent to verify it equals 100%
        totalPercent = (Number(carb) + Number(protein) + Number(fat));

        console.log(typeof (totalPercent));
        console.log(totalPercent);

        (totalPercent === 100) ? calcValid(calorieLimit, protein, carb, fat) : calcInvalid();
    }

    const calcValid = (calorieLimit, protein, carb, fat) => {
        {
            // we calculate the macronutrient values (in grams) 
            // given the entered calorieLimit

            //carbohydrates has 4 calories per gram
            carb = (((calorieLimit * carb) / 100.0) / 4.0);

            //protein has 4 calories per gram
            protein = (((calorieLimit * protein) / 100.0) / 4.0);

            //fat has 9 calories per gram
            fat = (((calorieLimit * fat) / 100.0) / 9.0);

            console.log("calorieLimit: " + calorieLimit + " kcal");
            console.log("Carbohydrates: " + carb + " grams");
            console.log("Protein: " + protein + " grams");
            console.log("Fat: " + fat + " grams");

            ShowResults(protein, carb, fat);
        }
    }

    // if total percent != 100 or a field is left empty...
    const calcInvalid = () => {

        // display error msg
        console.log("Error: Macronutrient % not equal to 100, Calorie Limit is less than zero, or a field was left empty...");
        alert("Error: Macronutrient % not equal to 100, Calorie Limit is less than zero, or a field was left empty...");

        /**Temporary Solution**/
        //we refresh the page to clear the fields
        // window.location.reload();
        resetAll();
    }

    const ShowResults = (protein, carb, fat) => {

        // we store the calculated results in state
        setDisplay({
            showCarbs: carb,
            showProtein: protein,
            showFat: fat
        });

        // print the macronutrient values (in grams)
        // console.log("Carbohydrates: " + display.showCarbs + " grams");
        // console.log("Protein: " + display.showProtein + " grams");
        // console.log("Fat: " + display.showFat + " grams");

        // console.log("Carbohydrates: " + carb + " grams");
        // console.log("Protein: " + protein + " grams");
        // console.log("Fat: " + fat + " grams");
    }

    /***************************************************************************/

    return (<>

        {<NavDrawerFitness />}

        {/* <Container disableGutters sx={{ width: '100vw' }}> */}
        <center>
            <Box padding={0} sx={{
                justifyContent: 'center',
                backgroundColor: 'white',
                borderRadius: '25px',
                border: '1px solid black',
                boxShadow: '0px 0px 2px 2px white',
                padding: '10px',
                margin: '20px',
                width: '75vw'
            }}>

                <center>
                    <img alt="Macronutrients" src={require("../images/macros.jpg")} width={'50%'} height={'50%'} />
                </center>

                {/* for each TextField, we use onChange to store the values */}

                <Grid container spacing={2}>
                    <Grid item xs={3}
                        sx={{ alignContent: 'center' }}>
                        <TextField
                            required={true}
                            type="number"
                            label="Calorie Limit"
                            variant="standard"
                            // ref={calorieLimit}
                            name="calorieLimit"
                            value={state.calorieLimit}
                            onChange={handleChange}
                            // onInput={e => setCalorieLimit(e.target.value)}
                            // onSubmit={handleChange}
                            sx={{
                                color: 'white',
                                margin: '5px'
                            }} InputProps={{
                                endAdornment: <InputAdornment position='end'>
                                    kcal
                                </InputAdornment>,
                            }} />

                        <TextField
                            required={true}
                            type="number"
                            label="Carb Percentage"
                            variant="standard"
                            // ref={carbPercent}
                            name="carbPercent"
                            value={state.carbPercent}
                            onChange={handleChange}
                            // onSubmit={handleChange}
                            sx={{
                                margin: '5px'
                            }} InputProps={{
                                endAdornment: <InputAdornment position='end'>
                                    %
                                </InputAdornment>,
                            }} />

                        <TextField
                            required={true}
                            type="number"
                            label="Protein Percentage"
                            variant="standard"
                            // ref={proteinPercent}
                            name="proteinPercent"
                            value={state.proteinPercent}
                            onChange={handleChange}
                            // onSubmit={handleChange}
                            sx={{
                                margin: '5px'
                            }} InputProps={{
                                endAdornment: <InputAdornment position='end'>
                                    %
                                </InputAdornment>,
                            }} />

                        <TextField
                            required={true}
                            type="number"
                            label="Fat Percentage"
                            variant="standard"
                            // ref={fatPercent}
                            name="fatPercent"
                            value={state.fatPercent}
                            onChange={handleChange}
                            // onSubmit={handleChange}
                            sx={{
                                margin: '5px'
                            }} InputProps={{
                                endAdornment: <InputAdornment position='end'>
                                    %
                                </InputAdornment>,
                            }} />

                        <Divider sx={{
                            marginTop: '10px',
                            marginBottom: '10px',
                            borderBottomWidth: '2px',
                            borderColor: 'black'
                        }} />

                        <Box textAlign={'center'}>
                            <Button variant="contained"
                                id="calculateButton"
                                type="button"
                                onClick={handleClick}
                            >
                                Calculate
                            </Button>

                            <Divider sx={{
                                marginTop: '10px',
                                marginBottom: '10px',
                                borderBottomWidth: '1px',
                                borderColor: 'gray'
                            }} />

                            <Button variant="contained"
                                id="clearButton"
                                type="button"
                                onClick={resetAll}
                            >
                                Clear
                            </Button>
                        </Box>

                    </Grid>

                    <Grid item xs={6}>
                        <Card sx={{
                            // border: '2px solid black',
                            maxWidth: '100%',
                            borderRadius: '25px',
                            margin: '10px',
                            padding: '10px',
                            textAlign: 'center',
                        }}>
                            <CardActionArea>
                                {/* <CardMedia
                                    component="img"
                                    alt="Macronutrient Image"
                                    image={require("../images/macros.jpg")}
                                >
                                </CardMedia> */}
                                {/* <CardMedia sx={{ width: '50%', border: '1px solid black' }}> */}
                                {/* </CardMedia> */}
                                <CardContent >
                                    <Typography gutterBottom
                                        variant="h5"
                                        component="div"
                                        sx={{ fontWeight: 'bold' }}>
                                        Macronutrient Results
                                    </Typography>
                                    <Table sx={{ border: '1px solid black' }}>
                                        <TableHead sx={{
                                            border: '1px solid black',
                                            backgroundColor: 'lightgrey',
                                        }}>
                                            <TableCell sx={{
                                                border: '1px solid black',
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                backgroundColor: 'rgba(0, 0, 255, 0.5)'
                                            }}>
                                                Carbs
                                            </TableCell>
                                            <TableCell sx={{
                                                border: '1px solid black',
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                backgroundColor: 'rgba(255, 0, 0, 0.5)'
                                            }}>
                                                Protein
                                            </TableCell>
                                            <TableCell sx={{
                                                border: '1px solid black',
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                backgroundColor: 'rgba(0, 255, 0, 0.5)'
                                            }}>
                                                Fats
                                            </TableCell>
                                        </TableHead>

                                        {/* by using state values we can update the results automatically */}
                                        <TableBody>
                                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>
                                                {display.showCarbs.toFixed(2)} grams
                                            </TableCell>
                                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>
                                                {display.showProtein.toFixed(2)} grams
                                            </TableCell>
                                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>
                                                {display.showFat.toFixed(2)} grams
                                            </TableCell>
                                        </TableBody>
                                    </Table>
                                </CardContent>

                            </CardActionArea>

                            <CardActions>
                                <Button size="small">Share</Button>
                                <Button size="small">Learn More</Button>
                            </CardActions>

                        </Card >
                    </Grid>
                    <Grid item xs={3} alignContent={'center'}>
                        {/*Here we pass in our values to the PieChart component*/}
                        <PieChart
                            carb={state.carbPercent}
                            protein={state.proteinPercent}
                            fat={state.fatPercent}
                        />
                    </Grid>
                </Grid>
            </Box>
        </center>
    </>);
}