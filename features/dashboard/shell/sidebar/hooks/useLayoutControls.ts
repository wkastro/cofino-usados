"use client"

import {
  applyContentLayout,
  applyFont,
  applyNavbarStyle,
  applySidebarCollapsible,
  applySidebarVariant,
} from "@/features/dashboard/lib/preferences/layout-utils"
import { PREFERENCE_DEFAULTS } from "@/features/dashboard/lib/preferences/preferences-config"
import { persistPreference } from "@/features/dashboard/lib/preferences/preferences-storage"
import { applyThemePreset } from "@/features/dashboard/lib/preferences/theme-utils"
import { usePreferencesStore } from "@/features/dashboard/stores/preferences/preferences-provider"
import type { FontKey } from "@/features/dashboard/lib/fonts/registry"
import type { ContentLayout, NavbarStyle, SidebarCollapsible, SidebarVariant } from "@/features/dashboard/lib/preferences/layout"
import type { ThemeMode, ThemePreset } from "@/features/dashboard/lib/preferences/theme"

export function useLayoutControls() {
  const themeMode = usePreferencesStore((s) => s.themeMode)
  const resolvedThemeMode = usePreferencesStore((s) => s.resolvedThemeMode)
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode)
  const themePreset = usePreferencesStore((s) => s.themePreset)
  const setThemePreset = usePreferencesStore((s) => s.setThemePreset)
  const contentLayout = usePreferencesStore((s) => s.contentLayout)
  const setContentLayout = usePreferencesStore((s) => s.setContentLayout)
  const navbarStyle = usePreferencesStore((s) => s.navbarStyle)
  const setNavbarStyle = usePreferencesStore((s) => s.setNavbarStyle)
  const variant = usePreferencesStore((s) => s.sidebarVariant)
  const setSidebarVariant = usePreferencesStore((s) => s.setSidebarVariant)
  const collapsible = usePreferencesStore((s) => s.sidebarCollapsible)
  const setSidebarCollapsible = usePreferencesStore((s) => s.setSidebarCollapsible)
  const font = usePreferencesStore((s) => s.font)
  const setFont = usePreferencesStore((s) => s.setFont)

  const onThemePresetChange = (preset: ThemePreset) => {
    applyThemePreset(preset)
    setThemePreset(preset)
    persistPreference("theme_preset", preset)
  }

  const onThemeModeChange = (mode: ThemeMode | "") => {
    if (!mode) return
    setThemeMode(mode)
    persistPreference("theme_mode", mode)
  }

  const onContentLayoutChange = (layout: ContentLayout | "") => {
    if (!layout) return
    applyContentLayout(layout)
    setContentLayout(layout)
    persistPreference("content_layout", layout)
  }

  const onNavbarStyleChange = (style: NavbarStyle | "") => {
    if (!style) return
    applyNavbarStyle(style)
    setNavbarStyle(style)
    persistPreference("navbar_style", style)
  }

  const onSidebarStyleChange = (value: SidebarVariant | "") => {
    if (!value) return
    setSidebarVariant(value)
    applySidebarVariant(value)
    persistPreference("sidebar_variant", value)
  }

  const onSidebarCollapseModeChange = (value: SidebarCollapsible | "") => {
    if (!value) return
    setSidebarCollapsible(value)
    applySidebarCollapsible(value)
    persistPreference("sidebar_collapsible", value)
  }

  const onFontChange = (value: FontKey | "") => {
    if (!value) return
    applyFont(value)
    setFont(value)
    persistPreference("font", value)
  }

  const handleRestore = () => {
    onThemePresetChange(PREFERENCE_DEFAULTS.theme_preset)
    onThemeModeChange(PREFERENCE_DEFAULTS.theme_mode)
    onContentLayoutChange(PREFERENCE_DEFAULTS.content_layout)
    onNavbarStyleChange(PREFERENCE_DEFAULTS.navbar_style)
    onSidebarStyleChange(PREFERENCE_DEFAULTS.sidebar_variant)
    onSidebarCollapseModeChange(PREFERENCE_DEFAULTS.sidebar_collapsible)
    onFontChange(PREFERENCE_DEFAULTS.font)
  }

  return {
    themeMode,
    resolvedThemeMode,
    themePreset,
    contentLayout,
    navbarStyle,
    variant,
    collapsible,
    font,
    onThemePresetChange,
    onThemeModeChange,
    onContentLayoutChange,
    onNavbarStyleChange,
    onSidebarStyleChange,
    onSidebarCollapseModeChange,
    onFontChange,
    handleRestore,
  }
}
