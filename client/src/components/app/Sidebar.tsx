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
      }
    ]
  }
};

export function AppSidebar() {
  return (
    <Sidebar className="border-r bg-gradient-to-b from-slate-50 to-white">
      <SidebarHeader className="border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center space-x-3 px-4 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold">PIM System</h1>
            <p className="text-xs text-blue-100">Product Information Management</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4">
        {Object.entries(menuItems).map(([key, section]) => (
          <SidebarGroup key={key} className="mb-6">
            <SidebarGroupLabel className="px-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="group">
                      <NavLink 
                        to={item.url}
                        className={({ isActive }) =>
                          clsx(
                            "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                            "hover:bg-slate-100 hover:text-slate-900",
                            "focus:bg-slate-100 focus:text-slate-900 focus:outline-none",
                            isActive
                              ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600 shadow-sm"
                              : "text-slate-600 hover:text-slate-900"
                          )
                        }
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="truncate">{item.title}</span>
                          <p className="text-xs text-slate-500 truncate group-hover:text-slate-600">
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
      
      <SidebarFooter className="border-t bg-slate-50/50 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200">
            <Settings className="h-4 w-4 text-slate-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900">System Status</p>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <p className="text-xs text-slate-500">All systems operational</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
