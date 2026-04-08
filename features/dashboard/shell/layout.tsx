import type { CSSProperties, ReactNode } from "react";

import { cookies } from "next/headers";

import { AppSidebar } from "@/features/dashboard/shell/sidebar/app-sidebar";
import { AccountSwitcher } from "@/features/dashboard/shell/sidebar/account-switcher";
import { LayoutControls } from "@/features/dashboard/shell/sidebar/layout-controls";
import { SearchDialog } from "@/features/dashboard/shell/sidebar/search-dialog";
import { ThemeSwitcher } from "@/features/dashboard/shell/sidebar/theme-switcher";
import { Separator } from "@/features/dashboard/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/features/dashboard/components/ui/sidebar";
import { TooltipProvider } from "@/features/dashboard/components/ui/tooltip";
import { users } from "@/features/dashboard/data/users";
import {
  SIDEBAR_COLLAPSIBLE_VALUES,
  SIDEBAR_VARIANT_VALUES,
} from "@/features/dashboard/lib/preferences/layout";
import { PREFERENCE_DEFAULTS } from "@/features/dashboard/lib/preferences/preferences-config";
import { getPreference } from "@/features/dashboard/server/preferences.actions";
import { PreferencesStoreProvider } from "@/features/dashboard/stores/preferences/preferences-provider";
import { fontVars } from "@/features/dashboard/lib/fonts/registry";
import { Toaster } from "sonner";
import { cn } from "@/features/dashboard/lib/utils";

const COOKIE_PREFIX = "db_";

export default async function DashboardShellLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();

  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  const [
    variant,
    collapsible,
    themeMode,
    themePreset,
    contentLayout,
    navbarStyle,
    font,
  ] = await Promise.all([
    getPreference(`${COOKIE_PREFIX}sidebar_variant`, SIDEBAR_VARIANT_VALUES, PREFERENCE_DEFAULTS.sidebar_variant),
    getPreference(
      `${COOKIE_PREFIX}sidebar_collapsible`,
      SIDEBAR_COLLAPSIBLE_VALUES,
      PREFERENCE_DEFAULTS.sidebar_collapsible,
    ),
    getPreference(`${COOKIE_PREFIX}theme_mode`, ["light", "dark", "system"] as const, PREFERENCE_DEFAULTS.theme_mode),
    getPreference(`${COOKIE_PREFIX}theme_preset`, ["default"] as const, "default"),
    getPreference(`${COOKIE_PREFIX}content_layout`, ["centered", "full-width"] as const, PREFERENCE_DEFAULTS.content_layout),
    getPreference(`${COOKIE_PREFIX}navbar_style`, ["sticky", "scroll"] as const, PREFERENCE_DEFAULTS.navbar_style),
    getPreference(`${COOKIE_PREFIX}font`, ["workSans", "clashDisplay"] as const, PREFERENCE_DEFAULTS.font),
  ]);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              var root = document.documentElement;
              root.setAttribute('data-dashboard-active', 'true');
              root.setAttribute('data-theme-mode', '${themeMode}');
              root.setAttribute('data-theme-preset', '${themePreset}');
              root.setAttribute('data-content-layout', '${contentLayout}');
              root.setAttribute('data-navbar-style', '${navbarStyle}');
              root.setAttribute('data-sidebar-variant', '${variant}');
              root.setAttribute('data-sidebar-collapsible', '${collapsible}');
              root.setAttribute('data-font', '${font}');
              var resolved = '${themeMode}' === 'system'
                ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                : '${themeMode}';
              root.classList.toggle('dark', resolved === 'dark');
              root.style.colorScheme = resolved;
            })();
          `,
        }}
      />
      <PreferencesStoreProvider
        themeMode={themeMode}
        themePreset={themePreset}
        contentLayout={contentLayout}
        navbarStyle={navbarStyle}
        font={font}
      >
        <div className={cn(fontVars, "min-h-screen")}>
         <TooltipProvider>
          <SidebarProvider
            defaultOpen={defaultOpen}
            style={
              {
                "--sidebar-width": "calc(var(--spacing) * 68)",
              } as CSSProperties
            }
          >
            <AppSidebar variant={variant} collapsible={collapsible} />
            <SidebarInset
              className={cn(
                "[html[data-content-layout=centered]_&>*]:mx-auto",
                "[html[data-content-layout=centered]_&>*]:w-full",
                "[html[data-content-layout=centered]_&>*]:max-w-screen-2xl",
                "peer-data-[variant=inset]:border",
              )}
            >
              <header
                className={cn(
                  "flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
                  "[html[data-navbar-style=sticky]_&]:sticky [html[data-navbar-style=sticky]_&]:top-0 [html[data-navbar-style=sticky]_&]:z-50 [html[data-navbar-style=sticky]_&]:overflow-hidden [html[data-navbar-style=sticky]_&]:rounded-t-[inherit] [html[data-navbar-style=sticky]_&]:bg-background/50 [html[data-navbar-style=sticky]_&]:backdrop-blur-md",
                )}
              >
                <div className="flex w-full items-center justify-between px-4 lg:px-6">
                  <div className="flex items-center gap-1 lg:gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                      orientation="vertical"
                      className="mx-2 data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
                    />
                    <SearchDialog />
                  </div>
                  <div className="flex items-center gap-2">
                    <LayoutControls />
                    <ThemeSwitcher />
                    <AccountSwitcher users={users} />
                  </div>
                </div>
              </header>
              <div className="h-full p-4 md:p-6">{children}</div>
            </SidebarInset>
          </SidebarProvider>
          <Toaster richColors position="top-right" theme="system" />
         </TooltipProvider>
        </div>
      </PreferencesStoreProvider>
    </>
  );
}
