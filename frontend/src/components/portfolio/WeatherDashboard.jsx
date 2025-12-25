import React from "react";

const WeatherDashboard = ({ city, cityData }) => {
    if (!city || !cityData) {
        return null; // Don't display anything if no city is selected
    }

    return (
        <div style={{
            maxWidth: "400px",
            margin: "20px auto",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            backgroundColor: "#f9f9f9"
        }}>
            <h2>{city}</h2>
            <p><strong>Weather:</strong> {cityData.weather}</p>
            <p><strong>Temperature:</strong> {(cityData.temperature - 273.15).toFixed(2)}°C</p>
            <p><strong>Humidity:</strong> {cityData.humidity}%</p>
            <p><strong>Wind Speed:</strong> {cityData.wind_speed} km/h</p>
        </div>
    );
};

export default WeatherDashboard;




