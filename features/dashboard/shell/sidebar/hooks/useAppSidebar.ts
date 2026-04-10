"use client"

import { useShallow } from "zustand/react/shallow"
import { usePreferencesStore } from "@/features/dashboard/stores/preferences/preferences-provider"
import type { Sidebar } from "@/features/dashboard/components/ui/sidebar"
import type { ComponentProps } from "react"

type SidebarProps = Pick<ComponentProps<typeof Sidebar>, "variant" | "collapsible">

export function useAppSidebar({ variant: propVariant, collapsible: propCollapsible }: SidebarProps) {
  const { sidebarVariant, sidebarCollapsible, isSynced } = usePreferencesStore(
    useShallow((s) => ({
      sidebarVariant: s.sidebarVariant,
      sidebarCollapsible: s.sidebarCollapsible,
      isSynced: s.isSynced,
    })),
  )

  return {
    variant: isSynced ? sidebarVariant : propVariant,
    collapsible: isSynced ? sidebarCollapsible : propCollapsible,
  }
}
