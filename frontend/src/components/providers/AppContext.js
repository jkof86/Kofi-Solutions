import { createContext, useState } from "react"

export const AppContext = createContext();

export default function AppProvider({ children }) {

    const [foodItems, setFoodItems] = useState('apple', 'orange', 'banana');

    //section for any global data required by the app
    function addFood(f) {
        //adds the passed in food item to the current list
        setFoodItems = [...foodItems, f]
    }

    const data = {
        foodItems: foodItems,
        addFood: addFood
    }

    return (<>
        {/* here we can pass down props to any child components wrapped in the Provider */}
        <AppContext.Provider value={data}>
            {children}
        </AppContext.Provider>
    </>)
}