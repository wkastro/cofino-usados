"use client";

import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/features/dashboard/components/ui/button";
import { useThemeSwitcher } from "./hooks/useThemeSwitcher";

export function ThemeSwitcher() {
  const { themeMode, cycleTheme } = useThemeSwitcher();

  return (
    <Button size="icon" onClick={cycleTheme} aria-label={`Current theme: ${themeMode}. Click to cycle themes`}>
      {/* SYSTEM */}
      <Monitor className="hidden [html[data-theme-mode=system]_&]:block" />

      {/* DARK (resolved) */}
      <Sun className="hidden dark:block [html[data-theme-mode=system]_&]:hidden" />

      {/* LIGHT (resolved) */}
      <Moon className="block dark:hidden [html[data-theme-mode=system]_&]:hidden" />
    </Button>
  );
}
