import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const presetThemes = {
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
    "--background": "0 0% 6%",       // dark background
    "--foreground": "0 0% 98%",      // light text
    "--card": "0 0% 10%",
    "--card-foreground": "0 0% 98%",
    "--primary": "220 80% 60%",      // blue accent
    "--secondary": "0 0% 20%",
    "--accent": "220 80% 60%",
  },
  Default: {
    "--background": "0 0% 100%",
    "--foreground": "0 0% 3.9%",
    "--card": "0 0% 100%",
    "--card-foreground": "0 0% 3.9%",
    "--primary": "0 0% 9%",
    "--secondary": "0 0% 96.1%",
    "--accent": "0 0% 96.1%",
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

    // Clear old variables
    Object.values(presetThemes).forEach((themeVars) => {
      Object.keys(themeVars).forEach((varName) => {
        root.style.removeProperty(varName);
      });
    });

    // Resolve system -> light/dark
    const themeToApply =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;

    // Apply CSS variables of the theme
    const selectedTheme = presetThemes[themeToApply];
    if (selectedTheme) {
      Object.entries(selectedTheme).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }

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
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
