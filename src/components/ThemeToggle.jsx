/**
 * ThemeToggle.jsx
 *
 * Component that allows users to switch between multiple themes.
 *
 * Features:
 * - Supports all themes: light, dark, system, Default, Purple, Blue, Green, Orange.
 * - Displays an icon corresponding to the current theme.
 * - Updates the theme context on selection.
 * - Works with ThemeContext to persist and apply theme globally.
 *
 * Usage:
 *   import { ThemeToggle } from '@/components/ThemeToggle';
 *
 *   <ThemeToggle />
 */

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar.tsx";
import { Moon, Sun, Monitor, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

const allThemes = [
  "light",
  "dark",
  "system",
  "Purple",
  "Blue",
  "Green",
  "Orange",
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const renderIcon = (t) => {
    if (t === "light") return <Sun className="h-4 w-4" />;
    if (t === "dark") return <Moon className="h-4 w-4" />;
    if (t === "system") return <Monitor className="h-4 w-4" />;
    return <Palette className="h-4 w-4" />;
  };

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button variant="outline" size="icon">
            {renderIcon(theme)}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </MenubarTrigger>

        <MenubarContent align="end">
          {allThemes.map((t) => (
            <MenubarItem
              key={t}
              className="flex items-center gap-2"
              onClick={() => setTheme(t)}
            >
              {renderIcon(t)}
              <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
