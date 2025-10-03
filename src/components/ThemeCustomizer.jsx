// src/components/ThemeCustomizer.jsx
import { useState } from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const presetThemes = [
  {
    name: "Default",
    colors: {
      primary: "0 0% 9%",
      secondary: "0 0% 96.1%",
      accent: "0 0% 96.1%",
    },
  },
  {
    name: "Purple",
    colors: {
      primary: "262.1 83.3% 57.8%",
      secondary: "270 95.2% 75.3%",
      accent: "280 89.1% 89.2%",
    },
  },
  {
    name: "Blue",
    colors: {
      primary: "221.2 83.2% 53.3%",
      secondary: "210 40% 96.1%",
      accent: "210 40% 96.1%",
    },
  },
  {
    name: "Green",
    colors: {
      primary: "142.1 76.2% 36.3%",
      secondary: "138.5 76.5% 96.7%",
      accent: "138.5 76.5% 96.7%",
    },
  },
  {
    name: "Orange",
    colors: {
      primary: "24.6 95% 53.1%",
      secondary: "33.3 100% 96.5%",
      accent: "33.3 100% 96.5%",
    },
  },
];

export function ThemeCustomizer() {
  const [selectedTheme, setSelectedTheme] = useState("Default");

  const applyTheme = (theme) => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    setSelectedTheme(theme.name);
    localStorage.setItem("customTheme", JSON.stringify(theme));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Customize theme</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Customize Theme</DialogTitle>
          <DialogDescription>
            Choose from preset themes or create your own custom color scheme.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          <TabsContent value="presets" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {presetThemes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => applyTheme(theme)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTheme === theme.name
                      ? "border-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold">{theme.name}</span>
                    <div className="flex gap-2">
                      {Object.entries(theme.colors).map(([key, value]) => (
                        <div
                          key={key}
                          className="w-8 h-8 rounded-full"
                          style={{
                            backgroundColor: `hsl(${value})`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primary">Primary Color</Label>
                <input
                  type="color"
                  id="primary"
                  className="w-full h-10 rounded-md cursor-pointer"
                  onChange={(e) => {
                    const hsl = hexToHSL(e.target.value);
                    document.documentElement.style.setProperty(
                      "--primary",
                      hsl
                    );
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary">Secondary Color</Label>
                <input
                  type="color"
                  id="secondary"
                  className="w-full h-10 rounded-md cursor-pointer"
                  onChange={(e) => {
                    const hsl = hexToHSL(e.target.value);
                    document.documentElement.style.setProperty(
                      "--secondary",
                      hsl
                    );
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accent">Accent Color</Label>
                <input
                  type="color"
                  id="accent"
                  className="w-full h-10 rounded-md cursor-pointer"
                  onChange={(e) => {
                    const hsl = hexToHSL(e.target.value);
                    document.documentElement.style.setProperty("--accent", hsl);
                  }}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to convert hex to HSL
function hexToHSL(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
}
