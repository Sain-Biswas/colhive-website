"use client";

import { MoonIcon, SunIcon } from "lucide-react";

import { useTheme } from "@/components/providers/theme-providers";

import { DropdownMenuItem } from "./ui/dropdown-menu";
import { Switch } from "./ui/switch";

export default function ModeToggleSwitch() {
  const { theme, setTheme } = useTheme();

  const toggleMode = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("dark");
    else {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "light"
        : "dark";

      setTheme(systemTheme);
    }
  };

  return (
    <DropdownMenuItem className="hover:bg-background focus:bg-background flex justify-between">
      <p>Theme</p>
      <div className="flex gap-2">
        <SunIcon />
        <Switch
          checked={theme === "dark" ? true : false}
          onCheckedChange={toggleMode}
        />
        <MoonIcon />
      </div>
    </DropdownMenuItem>
  );
}
