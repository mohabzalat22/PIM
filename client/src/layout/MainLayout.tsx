import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/Sidebar";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export default function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Toaster richColors position="top-right" />
      <main>
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
