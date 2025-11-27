import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/Sidebar";
import { TopNavBar } from "@/components/app/TopNavBar";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { useMemo } from "react";

export default function MainLayout() {
  const location = useLocation();

  // Generate breadcrumbs based on current path
  const breadcrumbs = useMemo(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const crumbs = [{ label: "Home", path: "/dashboard" }];

    pathSegments.forEach((segment, index) => {
      const path = "/" + pathSegments.slice(0, index + 1).join("/");
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      crumbs.push({ label, path });
    });

    return crumbs;
  }, [location.pathname]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <TopNavBar breadcrumbs={breadcrumbs} />
          <main className="flex-1 p-6 custom-scrollbar overflow-auto bg-muted/30">
            <div className="mx-auto max-w-[1600px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
}
