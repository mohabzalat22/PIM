import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/Sidebar";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export default function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Toaster richColors position="top-right" />
      <main className="w-full border rounded-3xl p-2 m-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <SidebarTrigger />
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
