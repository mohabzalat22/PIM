import { 
  Apple, 
  Store, 
  Eye, 
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
  BarChart3
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
} from "@/components/ui/sidebar";
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
        description: "System overview and analytics"
      }
    ]
  },
  products: {
    label: "Product Management",
    items: [
      {
        title: "Products",
        url: "/products",
        icon: Package,
        description: "Manage product catalog"
      },
      {
        title: "Product Attributes",
        url: "/product-attributes",
        icon: Tag,
        description: "EAV attribute assignments"
      }
    ]
  },
  catalog: {
    label: "Catalog Structure",
    items: [
      {
        title: "Categories",
        url: "/categories",
        icon: ChartBarStacked,
        description: "Product categorization"
      },
      {
        title: "Attributes",
        url: "/attributes",
        icon: Brush,
        description: "Attribute definitions"
      },
      {
        title: "Assets",
        url: "/assets",
        icon: Video,
        description: "Media and file management"
      }
    ]
  },
  stores: {
    label: "Store Management",
    items: [
      {
        title: "Stores",
        url: "/stores",
        icon: Store,
        description: "Store configuration"
      },
      {
        title: "Store Views",
        url: "/store-views",
        icon: Globe,
        description: "Multi-language support"
      },
      {
        title: "Locales",
        url: "/locales",
        icon: Globe,
        description: "Locale definitions (value & label)"
      }
    ]
  }
};

export function AppSidebar() {
  return (
    <Sidebar className="border-r bg-sidebar text-sidebar-foreground animate-in slide-in-from-left duration-300">
      <SidebarHeader className="border-b bg-sidebar-primary text-sidebar-primary-foreground">
        <div className="flex items-center space-x-3 px-4 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary-foreground/10 backdrop-blur-sm">
            <Database className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold">PIM System</h1>
            <p className="text-xs text-sidebar-primary-foreground/80">Product Information Management</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4 space-y-2">
        {Object.entries(menuItems).map(([key, section]) => (
          <SidebarGroup key={key} className="mb-6">
            <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>

                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className={({ isActive }) =>
                          clsx(
                            "group/item flex items-center space-x-3 rounded-lg px-4 py-5 text-sm font-medium border border-transparent transition-colors duration-200 ease-out",
                            "hover:bg-sidebar-primary/10 hover:border-sidebar-primary hover:text-foreground hover:shadow-sm",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                            isActive
                              ? "bg-sidebar-primary/10 text-sidebar-primary border-r-2 border-sidebar-primary shadow-sm"
                              : "text-muted-foreground"
                          )
                        }
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover/item:scale-110" />
                        <div className="flex-1 min-w-0">
                          <span className="truncate">{item.title}</span>
                          <p className="text-xs text-muted-foreground truncate group-hover/item:text-foreground">
                            {item.description}
                          </p>
                        </div>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      <SidebarFooter className="border-t bg-sidebar/80 p-4">
        <NavLink
          to="/settings"
          className="flex items-center space-x-3 rounded-lg px-2 py-2 text-sm font-medium text-sidebar-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent">
            <Settings className="h-4 w-4 text-sidebar-primary" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium">Settings</p>
            <p className="text-xs text-muted-foreground truncate">Theme & application preferences</p>
          </div>
        </NavLink>
      </SidebarFooter>
    </Sidebar>
  );
}
