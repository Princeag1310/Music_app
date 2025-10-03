// // src/components/ThemeToggle.jsx
// import { Moon, Sun, Monitor } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/menubar.tsx";
// import { useTheme } from "@/context/ThemeContext";

// export function ThemeToggle() {
//   const { theme, setTheme } = useTheme();

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" size="icon">
//           {theme === "light" && <Sun className="h-[1.2rem] w-[1.2rem]" />}
//           {theme === "dark" && <Moon className="h-[1.2rem] w-[1.2rem]" />}
//           {theme === "system" && <Monitor className="h-[1.2rem] w-[1.2rem]" />}
//           <span className="sr-only">Toggle theme</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem onClick={() => setTheme("light")}>
//           <Sun className="mr-2 h-4 w-4" />
//           <span>Light</span>
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("dark")}>
//           <Moon className="mr-2 h-4 w-4" />
//           <span>Dark</span>
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("system")}>
//           <Monitor className="mr-2 h-4 w-4" />
//           <span>System</span>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

// src/components/ThemeToggle.jsx



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
  "Default",
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
