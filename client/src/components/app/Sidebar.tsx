import { Apple, Store, Eye, ChartBarStacked, Brush, Video } from "lucide-react";
import { NavLink } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import clsx from "clsx";

// Menu items.
const items = [
  {
    title: "Store",
    url: "/stores",
    icon: Store,
  },
  {
    title: "Store View",
    url: "store-views",
    icon: Eye,
  },
  {
    title: "Category",
    url: "categories",
    icon: ChartBarStacked,
  },
  {
    title: "Product",
    url: "products",
    icon: Apple,
  },
  {
    title: "Attribute",
    url: "attributes",
    icon: Brush,
  },
  {
    title: "Asset",
    url: "assets",
    icon: Video,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>PIM Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink key={item.title} to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
