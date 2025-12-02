import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Mail, UserPlus } from "lucide-react";
import { WorkspaceInviteService } from "@/services/workspaceInvite.service";
import { asyncWrapper } from "@/utils/asyncWrapper";
import { toast } from "sonner";

interface InviteMemberDialogProps {
  workspaceId: number;
  workspaceName: string;
  onInviteCreated?: () => void;
}

export function InviteMemberDialog({
  workspaceId,
  workspaceName,
  onInviteCreated,
}: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
  const [invitationUrl, setInvitationUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateInvitation = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setIsLoading(true);
    await asyncWrapper(async () => {
      const response = await WorkspaceInviteService.createInvitation({
        workspaceId,
        email,
        role,
      });

      setInvitationUrl(response.data.invitationUrl);
      toast.success("Invitation created successfully!");
      onInviteCreated?.();
    });
    setIsLoading(false);
  };

  const handleCopyLink = async () => {
    await asyncWrapper(async () => {
      await navigator.clipboard.writeText(invitationUrl);
      toast.success("Invitation link copied to clipboard!");
    });
  };

  const handleClose = () => {
    setOpen(false);
    // Reset form after a delay to avoid visual glitch
    setTimeout(() => {
      setEmail("");
      setRole("MEMBER");
      setInvitationUrl("");
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite Member to {workspaceName}</DialogTitle>
          <DialogDescription>
            Send an invitation link to add a new member to your workspace.
          </DialogDescription>
        </DialogHeader>

        {!invitationUrl ? (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as "ADMIN" | "MEMBER")}
                disabled={isLoading}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEMBER">Member</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {role === "ADMIN"
                  ? "Admins can manage workspace settings and invite members"
                  : "Members have access to workspace resources"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <Label className="text-sm font-medium">Invitation Link</Label>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  value={invitationUrl}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyLink}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                This link expires in 7 days and can only be used once.
              </p>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Next steps:</strong>
              </p>
              <ul className="mt-1 list-inside list-disc text-xs text-blue-800 dark:text-blue-200">
                <li>Share this link with {email}</li>
                <li>They'll be prompted to sign up or sign in</li>
                <li>After accepting, they'll join as {role.toLowerCase()}</li>
              </ul>
            </div>
          </div>
        )}

        <DialogFooter>
          {!invitationUrl ? (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateInvitation} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Invitation"}
              </Button>
            </>
          ) : (
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
