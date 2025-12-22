import { Box } from '@mui/material';
import React from 'react';
import { Slide } from 'react-slideshow-image';

const spanStyle = {
    padding: '40px',
    background: '#efefef',
    color: '#000000'
}

const divStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    border: '1px solid black',
    borderRadius: '25px',
    height: '75vh',
    width: '50vh',
}
const slideImages = [

    // photo order
    // 12,15,13,14
    // 17,18,19,16
    // 21,22,23,24,25,26
    // 9,10,11,20
    {
        url: require('../images/photos/nutrition_slide_12.jpg'),
        // caption: 'Slide 12
    },
    {
        url: require('../images/photos/nutrition_slide_15.jpg'),
        // caption: 'Slide 15'
    },
    {
        url: require('../images/photos/nutrition_slide_13.jpg'),
        // caption: 'Slide 13'
    },
    {
        url: require('../images/photos/nutrition_slide_14.jpg'),
        // caption: 'Slide 14'
    },
    {
        url: require('../images/photos/nutrition_slide_17.jpg'),
        // caption: 'Slide 17'
    },
    {
        url: require('../images/photos/nutrition_slide_18.jpg'),
        // caption: 'Slide 18'
    },
    {
        url: require('../images/photos/nutrition_slide_19.jpg'),
        // caption: 'Slide 19'
    },
    {
        url: require('../images/photos/nutrition_slide_16.jpg'),
        // caption: 'Slide 16'
    },
    {
        url: require('../images/photos/nutrition_slide_21.jpg'),
        // caption: 'Slide 21'
    },
    {
        url: require('../images/photos/nutrition_slide_22.jpg'),
        // caption: 'Slide 22'
    },
    {
        url: require('../images/photos/nutrition_slide_23.jpg'),
        // caption: 'Slide 23'
    },
    {
        url: require('../images/photos/nutrition_slide_24.jpg'),
        // caption: 'Slide 24'
    },
    {
        url: require('../images/photos/nutrition_slide_25.jpg'),
        // caption: 'Slide 25'
    },
    {
        url: require('../images/photos/nutrition_slide_26.jpg'),
        // caption: 'Slide 26'
    },
    {
        url: require('../images/photos/nutrition_slide_9.jpg'),
        // caption: 'Slide 9'
    },
    {
        url: require('../images/photos/nutrition_slide_10.jpg'),
        // caption: 'Slide 10'
    },
    {
        url: require('../images/photos/nutrition_slide_11.jpg'),
        // caption: 'Slide 11'
    }, 
    {
        url: require('../images/photos/nutrition_slide_20.jpg'),
        // caption: 'Slide 20'
    },  
];

export default function SlideShowFitness() {
    return (<>
        {/* <Box border='1px solid black'> */}
        <div className="slide-container">
            <Slide>
                {slideImages.map((slideImage, index) => (
                    <div key={index}>
                        <div style={{
                            ...divStyle,
                            'backgroundImage': `url(${slideImage.url})`,
                            'backgroundSize': 'cover'
                        }}>
                            {/* <span style={spanStyle}>{slideImage.caption}</span> */}
                        </div>
                    </div>
                ))}
            </Slide>
        </div>
        {/* </Box> */}
    </>)
}