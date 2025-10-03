/**
 * ThemeContext.jsx
 *
 * Provides a centralized theme management system for the Music App.
 * Supports Light, Dark, and System themes, as well as preset color themes.
 *
 * Exports:
 * - ThemeProvider: React context provider wrapping the app and managing theme state.
 * - useTheme: Custom hook to access current theme and theme setter.
 *
 * Features:
 * - Persists theme selection in localStorage.
 * - Automatically applies system theme if 'system' is selected.
 * - Updates CSS variables dynamically for custom themes.
 * - Throws an error if useTheme is called outside ThemeProvider.
 */


import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

// Full theme definitions
export const presetThemes = {
  light: {
    "--background": "0 0% 100%",
    "--foreground": "0 0% 3.9%",
    "--card": "0 0% 100%",
    "--card-foreground": "0 0% 3.9%",
    "--primary": "0 0% 9%",
    "--secondary": "0 0% 96.1%",
    "--accent": "0 0% 96.1%",
  },
  dark: {
    "--background": "0 0% 6%",
    "--foreground": "0 0% 98%",
    "--card": "0 0% 10%",
    "--card-foreground": "0 0% 98%",
    "--primary": "220 80% 60%",
    "--secondary": "0 0% 20%",
    "--accent": "220 80% 60%",
  },
  Purple: {
    "--background": "270 95.2% 75.3%",
    "--foreground": "262.1 83.3% 57.8%",
    "--card": "280 89.1% 89.2%",
    "--card-foreground": "262.1 83.3% 57.8%",
    "--primary": "262.1 83.3% 57.8%",
    "--secondary": "270 95.2% 75.3%",
    "--accent": "280 89.1% 89.2%",
  },
  Blue: {
    "--background": "210 40% 96.1%",
    "--foreground": "221.2 83.2% 53.3%",
    "--card": "210 40% 96.1%",
    "--card-foreground": "221.2 83.2% 53.3%",
    "--primary": "221.2 83.2% 53.3%",
    "--secondary": "210 40% 96.1%",
    "--accent": "210 40% 96.1%",
  },
  Green: {
    "--background": "145 63% 93%",
    "--foreground": "145 63% 17%",
    "--card": "145 63% 93%",
    "--card-foreground": "145 63% 17%",
    "--primary": "158 57% 32%",
    "--secondary": "145 63% 93%",
    "--accent": "158 57% 32%",
  },
  Orange: {
    "--background": "24 100% 95%",
    "--foreground": "24 100% 20%",
    "--card": "24 100% 95%",
    "--card-foreground": "24 100% 20%",
    "--primary": "24 100% 50%",
    "--secondary": "24 100% 95%",
    "--accent": "24 100% 50%",
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "system";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const allVars = [
      "--background",
      "--foreground",
      "--card",
      "--card-foreground",
      "--primary",
      "--secondary",
      "--accent",
    ];

    // Clear previous variables
    allVars.forEach((v) => root.style.removeProperty(v));

    let themeToApply = theme;

    // Handle system theme
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      themeToApply = mediaQuery.matches ? "dark" : "light";

      const listener = (e) => {
        const newTheme = e.matches ? "dark" : "light";
        const selected = presetThemes[newTheme] || presetThemes.light;
        Object.entries(selected).forEach(([key, value]) =>
          root.style.setProperty(key, value)
        );

         try {
            const customColors = JSON.parse(localStorage.getItem("customColors") || "{}");
           Object.entries(customColors).forEach(([key, value]) =>
             root.style.setProperty(`--${key}`, value)
            );
          } catch (e) {
            console.warn("Failed to apply custom colors:", e);
          }
      };

    

      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }

    // Apply preset theme first
    const selectedTheme = presetThemes[themeToApply] || presetThemes.light;
    Object.entries(selectedTheme).forEach(([key, value]) =>
      root.style.setProperty(key, value)
    );

    // Apply custom color overrides if present
    const customColors = JSON.parse(localStorage.getItem("customColors") || "{}");
    Object.entries(customColors).forEach(([key, value]) =>
      root.style.setProperty(`--${key}`, value)
    );
  }, [theme]);

  // Persist theme selection only when it changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

