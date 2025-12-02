import { 
  Store, 
  ChartBarStacked, 
  Brush, 
  Video, 
  Home, 
  Tag, 
  Package,
  Settings,
  Database,
  Layers,
  FileText,
  Globe,
  Users,
  Kanban,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
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
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import clsx from "clsx";

// Menu items organized by category
const menuItems = {
  overview: {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
    ],
  },
  products: {
    label: "Products",
    items: [
      {
        title: "Products",
        url: "/products",
        icon: Package,
      },
      {
        title: "Workflow",
        url: "/product-workflow",
        icon: Kanban,
      },
      {
        title: "Attributes",
        url: "/product-attributes",
        icon: Tag,
      },
    ],
  },
  catalog: {
    label: "Catalog",
    items: [
      {
        title: "Categories",
        url: "/categories",
        icon: ChartBarStacked,
      },
      {
        title: "Attributes",
        url: "/attributes",
        icon: Brush,
      },
      {
        title: "Attribute Sets",
        url: "/attribute-sets",
        icon: Layers,
      },
      {
        title: "Attribute Groups",
        url: "/attribute-groups",
        icon: FileText,
      },
      {
        title: "Assets",
        url: "/assets",
        icon: Video,
      },
    ],
  },
  stores: {
    label: "Channels",
    items: [
      {
        title: "Stores",
        url: "/stores",
        icon: Store,
      },
      {
        title: "Store Views",
        url: "/store-views",
        icon: Globe,
      },
      {
        title: "Locales",
        url: "/locales",
        icon: Globe,
      },
    ],
  },
  workspaces: {
    label: "System",
    items: [
      {
        title: "Workspaces",
        url: "/workspaces",
        icon: Users,
      },
    ],
  },
};

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      {/* Header */}
      <SidebarHeader className="h-16 border-b border-border/40">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {!isCollapsed && (
              <>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary flex-shrink-0">
                  <Database className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-sm font-bold tracking-tight truncate">MOLAB PIM</h1>
                  <p className="text-xs text-muted-foreground truncate">Product Information</p>
                </div>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 hover:bg-accent flex-shrink-0"
          >
            {isCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>
      </SidebarHeader>
      
      {/* Content */}
      <SidebarContent className="px-2 py-3 gap-2">
        <TooltipProvider delayDuration={0}>
          {Object.entries(menuItems).map(([key, section]) => (
            <SidebarGroup key={key} className="px-0">
              {!isCollapsed && (
                <SidebarGroupLabel className="px-3 h-8 text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">
                  {section.label}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton asChild className="h-9">
                            <NavLink 
                              to={item.url}
                              className={({ isActive }) =>
                                clsx(
                                  "flex items-center gap-3 rounded-md px-2.5 text-sm font-medium transition-all",
                                  isCollapsed && "justify-center px-0 w-full",
                                  "hover:bg-accent hover:text-accent-foreground",
                                  isActive
                                    ? "bg-primary/10 text-primary font-semibold"
                                    : "text-muted-foreground hover:text-foreground"
                                )
                              }
                            >
                              <item.icon className="h-4 w-4 flex-shrink-0" />
                              {!isCollapsed && (
                                <span className="truncate">{item.title}</span>
                              )}
                            </NavLink>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        {isCollapsed && (
                          <TooltipContent side="right" className="font-medium">
                            {item.title}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </TooltipProvider>
      </SidebarContent>
      
      {/* Footer */}
      <SidebarFooter className="border-t border-border/40 p-2">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            clsx(
              "flex items-center gap-3 rounded-md px-2.5 h-10 text-sm font-medium transition-all",
              isCollapsed && "justify-center px-0",
              "hover:bg-accent hover:text-accent-foreground",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )
          }
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span className="truncate">Settings</span>}
        </NavLink>
      </SidebarFooter>
    </Sidebar>
  );
}
