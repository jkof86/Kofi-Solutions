import React, { useState, useEffect } from "react";
import WeatherDashboard from "./WeatherDashboard";

const CitySelector = () => {
    const [citiesData, setCitiesData] = useState({});
    const [search, setSearch] = useState("");
    const [filteredCities, setFilteredCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);

    // Fetch weather data 
    useEffect(() => {
        /*
        fetch("http://api.revaturelearn.com/current_weather/all_cities")
        */
        fetch()
            .then((response) => response.json())
            .then((data) => setCitiesData(data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    // Filter city names based on user input
    useEffect(() => {
        // If the selected city is already chosen, clear the dropdown.
        if (selectedCity && search.toLowerCase() === selectedCity.toLowerCase()) {
            setFilteredCities([]);
        } else if (search.length > 0) {
            const filtered = Object.keys(citiesData).filter(city =>
                city.toLowerCase().startsWith(search.toLowerCase())
            );
            setFilteredCities(filtered);
        } else {
            setFilteredCities([]);
        }
    }, [search, citiesData, selectedCity]);


    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for a city..."
                    style={{
                        width: "300px",
                        padding: "10px",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                        fontSize: "16px"
                    }}
                />
                {filteredCities.length > 0 && (
                    <ul style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "100%",
                        background: "white",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        listStyleType: "none",
                        padding: "5px",
                        marginTop: "5px",
                        maxHeight: "150px",
                        overflowY: "auto",
                        zIndex: "1000",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
                    }}>
                        {filteredCities.map(city => (
                            <li key={city}
                                onClick={() => {
                                    setSelectedCity(city);
                                    setSearch(city); // Set search input to selected city
                                    setFilteredCities([]); // Hide dropdown
                                }}
                                style={{
                                    padding: "10px",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #eee"
                                }}>
                                {city}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Pass selected city and weather data to WeatherDashboard */}
            {selectedCity && <WeatherDashboard city={selectedCity} cityData={citiesData[selectedCity]} />}
        </div>
    );
};

export default CitySelector;
