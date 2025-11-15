import { ModeToggle } from "@/components/mode-toggle";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserButton } from "@clerk/clerk-react";

export default function Settings() {
  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your appearance and application preferences.
        </p>
      </div>

      <Card className="p-4 space-y-6">
        <div className="space-y-1">
          <h2 className="text-sm font-medium">Appearance</h2>
          <p className="text-xs text-muted-foreground">
            Choose between light and dark mode for the interface.
          </p>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-sm">Theme</span>
          <ModeToggle />
        </div>

        <Separator />

        <div className="space-y-2">
          <h2 className="text-sm font-medium">Account</h2>
          <p className="text-xs text-muted-foreground">
            Manage your profile and sign out of XStore PIM.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm">User</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </Card>
    </div>
  );
}
