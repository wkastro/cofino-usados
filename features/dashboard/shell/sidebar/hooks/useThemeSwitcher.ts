"use client"

import { usePreferencesStore } from "@/features/dashboard/stores/preferences/preferences-provider"
import { persistPreference } from "@/features/dashboard/lib/preferences/preferences-storage"
import type { ThemeMode } from "@/features/dashboard/lib/preferences/theme"

const THEME_CYCLE: ThemeMode[] = ["light", "dark", "system"]

export function useThemeSwitcher() {
  const themeMode = usePreferencesStore((s) => s.themeMode)
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode)

  const cycleTheme = () => {
    const currentIndex = THEME_CYCLE.indexOf(themeMode)
    const nextTheme = THEME_CYCLE[(currentIndex + 1) % THEME_CYCLE.length]
    setThemeMode(nextTheme)
    persistPreference("theme_mode", nextTheme)
  }

  return { themeMode, cycleTheme }
}
