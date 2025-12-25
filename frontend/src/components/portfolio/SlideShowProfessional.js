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
    {
        url: require('../images/photos/nutrition_slide_1.jpeg'),
        // caption: 'Slide 1'
    },
    {
        url: require('../images/photos/nutrition_slide_2.jpeg'),
        // caption: 'Slide 2'
    },
];

export default function SlideShowProfessional() {
    return (<>
        {/* <Box border='1px solid black'> */}
        <div className="slide-container">
            <Slide>
                {slideImages.map((slideImage, index) => (
                    <div key={index}>
                        <div style={{
                            ...divStyle,
                            'backgroundImage': `url(${slideImage.url})`,
                            'backgroundSize':'cover'
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