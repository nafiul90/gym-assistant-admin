import React, { createContext, useState } from "react";
export const ThemeContext = createContext("ThemeContext");

const ThemeContextProvider = ({ children }) => {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") ?? "light"
    );

    const changeTheme = (value) => {
        setTheme(value);
        localStorage.setItem("theme", value);
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                changeTheme
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContextProvider;
