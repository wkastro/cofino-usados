"use client";

import Link from "next/link";

import { Logo, LogoIcon } from "@/components/global/logo";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/features/dashboard/components/ui/sidebar";
import { sidebarItems } from "@/features/dashboard/navigation/sidebar/sidebar-items";
import { useAppSidebar } from "./hooks/useAppSidebar";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { SidebarSupportCard } from "./sidebar-support-card";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  readonly user: {
    readonly name: string;
    readonly email: string;
    readonly avatar: string;
  };
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const { variant, collapsible } = useAppSidebar({
    variant: props.variant,
    collapsible: props.collapsible,
  });
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar {...props} variant={variant} collapsible={collapsible}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-auto py-2 [&_svg]:size-auto group-data-[collapsible=icon]:p-0!">
              <Link prefetch={false} href="/dashboard/default">
                {isCollapsed ? <LogoIcon className="h-auto w-full" /> : <Logo className="h-7 w-auto" />}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarSupportCard />
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
