import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, Mail, Edit, Trash, Copy, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { WorkspaceInviteService } from "@/services/workspaceInvite.service";
import { WorkspaceMemberService } from "@/services/workspaceMember.service";
import { asyncWrapper } from "@/utils/asyncWrapper";
import { toast } from "sonner";
import type Workspace from "@/interfaces/workspace.interface";
import type WorkspaceMember from "@/interfaces/workspaceMember.interface";
import type { MemberRole } from "@/interfaces/workspaceMember.interface";
import { DeleteConfirmDialog } from "@/components/app/DeleteConfirmDialog";

interface WorkspaceSettingsDialogProps {
  workspace: Workspace | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkspaceUpdated?: () => void;
}

export function WorkspaceSettingsDialog({
  workspace,
  open,
  onOpenChange,
  onWorkspaceUpdated,
}: WorkspaceSettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<string>("members");
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  // Invitation state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
  const [invitationUrl, setInvitationUrl] = useState("");
  const [isCreatingInvite, setIsCreatingInvite] = useState(false);

  // Member management state
  const [editingMember, setEditingMember] = useState<WorkspaceMember | null>(null);
  const [editRole, setEditRole] = useState<MemberRole>("MEMBER");
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);

  // Fetch members when workspace changes
  useEffect(() => {
    if (workspace && open) {
      fetchMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace?.id, open]);

  const fetchMembers = async () => {
    if (!workspace) return;

    setIsLoadingMembers(true);
    await asyncWrapper(async () => {
      const response = await WorkspaceMemberService.getAll(1, 100, {
        workspaceId: workspace.id,
        search: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setMembers(response.data);
    });
    setIsLoadingMembers(false);
  };

  const handleCreateInvitation = async () => {
    if (!workspace || !inviteEmail) {
      toast.error("Please enter an email address");
      return;
    }

    setIsCreatingInvite(true);
    await asyncWrapper(async () => {
      const response = await WorkspaceInviteService.createInvitation({
        workspaceId: workspace.id,
        email: inviteEmail,
        role: inviteRole,
      });

      setInvitationUrl(response.data.invitationUrl);
      toast.success("Invitation created successfully!");
      setInviteEmail("");
      setInviteRole("MEMBER");
    });
    setIsCreatingInvite(false);
  };

  const handleCopyLink = async () => {
    await asyncWrapper(async () => {
      await navigator.clipboard.writeText(invitationUrl);
      toast.success("Invitation link copied to clipboard!");
    });
  };

  const handleUpdateMemberRole = async () => {
    if (!editingMember) return;

    await asyncWrapper(async () => {
      await WorkspaceMemberService.update(editingMember.id, { role: editRole });
      toast.success("Member role updated successfully");
      setEditingMember(null);
      fetchMembers();
      onWorkspaceUpdated?.();
    });
  };

  const handleDeleteMember = async (id: number) => {
    await asyncWrapper(async () => {
      await WorkspaceMemberService.remove(id);
      toast.success("Member removed successfully");
      setMemberToDelete(null);
      fetchMembers();
      onWorkspaceUpdated?.();
    });
  };

  const resetInvitationForm = () => {
    setInvitationUrl("");
    setInviteEmail("");
    setInviteRole("MEMBER");
  };

  if (!workspace) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {workspace.name} - Settings
            </DialogTitle>
            <DialogDescription>
              Manage workspace members and send invitations
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="members" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Members ({members.length})
              </TabsTrigger>
              <TabsTrigger value="invite" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Invite Member
              </TabsTrigger>
            </TabsList>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-4">
              <div className="rounded-lg border">
                {isLoadingMembers ? (
                  <div className="p-8 text-center text-muted-foreground">
                    Loading members...
                  </div>
                ) : members.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No members found. Start by inviting members to your workspace.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">
                            {member.user?.name || "N/A"}
                          </TableCell>
                          <TableCell>{member.user?.email || "N/A"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                member.role === "ADMIN" ? "destructive" : "default"
                              }
                            >
                              {member.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(member.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingMember(member);
                                  setEditRole(member.role);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setMemberToDelete(member.id)}
                              >
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {/* Edit Member Role Dialog */}
              {editingMember && (
                <Dialog
                  open={!!editingMember}
                  onOpenChange={(open) => !open && setEditingMember(null)}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Member Role</DialogTitle>
                      <DialogDescription>
                        Update the role for {editingMember.user?.name || editingMember.user?.email}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="edit-role">Role</Label>
                        <Select
                          value={editRole}
                          onValueChange={(value) => setEditRole(value as MemberRole)}
                        >
                          <SelectTrigger id="edit-role">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MEMBER">Member</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setEditingMember(null)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateMemberRole}>Update Role</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </TabsContent>

            {/* Invite Tab */}
            <TabsContent value="invite" className="space-y-4">
              {!invitationUrl ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="invite-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="invite-email"
                        type="email"
                        placeholder="colleague@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="pl-10"
                        disabled={isCreatingInvite}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="invite-role">Role</Label>
                    <Select
                      value={inviteRole}
                      onValueChange={(value) => setInviteRole(value as "ADMIN" | "MEMBER")}
                      disabled={isCreatingInvite}
                    >
                      <SelectTrigger id="invite-role">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEMBER">Member</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {inviteRole === "ADMIN"
                        ? "Admins can manage workspace settings and invite members"
                        : "Members have access to workspace resources"}
                    </p>
                  </div>

                  <Button
                    onClick={handleCreateInvitation}
                    disabled={isCreatingInvite || !inviteEmail}
                    className="w-full"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    {isCreatingInvite ? "Creating..." : "Create Invitation"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <Label className="text-sm font-medium">Invitation Link</Label>
                    <div className="mt-2 flex items-center gap-2">
                      <Input
                        value={invitationUrl}
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button size="sm" variant="outline" onClick={handleCopyLink}>
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
                      <li>Share this link with the invitee</li>
                      <li>They'll be prompted to sign up or sign in</li>
                      <li>After accepting, they'll join as {inviteRole.toLowerCase()}</li>
                    </ul>
                  </div>

                  <Button onClick={resetInvitationForm} variant="outline" className="w-full">
                    Create Another Invitation
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Delete Member Confirmation */}
      <DeleteConfirmDialog
        open={memberToDelete !== null}
        onOpenChange={(open) => !open && setMemberToDelete(null)}
        title="Remove Member"
        description="Are you sure you want to remove this member from the workspace? This action cannot be undone."
        primaryLabel="Remove Member"
        onConfirm={() => {
          if (memberToDelete !== null) {
            handleDeleteMember(memberToDelete);
          }
        }}
      />
    </>
  );
}
