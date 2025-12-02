import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  MoreHorizontalIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
  UsersIcon,
  UserIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PageLayout } from "@/components/app/PageLayout";
import { FilterPanel } from "@/components/app/FilterPanel";
import { DataTable } from "@/components/app/DataTable";
import { PaginationBar } from "@/components/app/PaginationBar";
import { EntityDialog } from "@/components/app/EntityDialog";
import Loading from "@/components/app/loading";
import { DeleteConfirmDialog } from "@/components/app/DeleteConfirmDialog";
import type WorkspaceMember from "@/interfaces/workspaceMember.interface";
import type { MemberRole } from "@/interfaces/workspaceMember.interface";
import type Workspace from "@/interfaces/workspace.interface";
import type Filters from "@/interfaces/workspaceMember/filters.interface";
import { WorkspaceMemberService } from "@/services/workspaceMember.service";
import { useWorkspaceMembers } from "@/hooks/useWorkspaceMembers";
import { asyncWrapper } from "@/utils/asyncWrapper";
import { InviteMemberDialog } from "@/components/app/InviteMemberDialog";
import { WorkspaceService } from "@/services/workspace.service";

export default function WorkspaceMemberPage() {
  const limit = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [
    workspaceMembers,
    workspaceMembersLoading,
    workspaceMembersErrors,
    workspaceMembersTotalPages,
    refetchWorkspaceMembers,
  ] = useWorkspaceMembers(currentPage, limit, filters);

  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<WorkspaceMember | null>(null);
  const [memberIdToDelete, setMemberIdToDelete] = useState<number | null>(null);

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    role: "MEMBER" as MemberRole,
  });

  const [showPageLoader, setShowPageLoader] = useState(true);

  useEffect(() => {
    if (workspaceMembersErrors) {
      toast.error(workspaceMembersErrors.message);
    }
  }, [workspaceMembersErrors]);

  useEffect(() => {
    if (!workspaceMembersLoading) {
      setShowPageLoader(false);
    }
  }, [workspaceMembersLoading]);

  // Fetch workspaces from API
  useEffect(() => {
    const fetchWorkspaces = async () => {
      await asyncWrapper(async () => {
        const response = await WorkspaceService.getAll(1, 100);
        setWorkspaces(response.data);
        // Set first workspace as selected if available
        if (response.data.length > 0 && !selectedWorkspaceId) {
          setSelectedWorkspaceId(response.data[0].id);
        }
      });
    };
    fetchWorkspaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get selected workspace details
  const selectedWorkspace = workspaces.find((w) => w.id === selectedWorkspaceId);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (key: keyof Filters, value: string | number | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleEditWorkspaceMember = async () => {
    if (!editingMember) return;

    await asyncWrapper(async () => {
      await WorkspaceMemberService.update(editingMember.id, { role: formData.role });
      await refetchWorkspaceMembers();
      toast.success("Workspace member updated successfully");
      setShowEditDialog(false);
      setEditingMember(null);
      setFormData({ role: "MEMBER" });
    });
  };

  const handleDeleteWorkspaceMember = async (id: number) => {
    await asyncWrapper(async () => {
      await WorkspaceMemberService.remove(id);
      toast.success("Workspace member deleted successfully");
      await refetchWorkspaceMembers();
      setMemberIdToDelete(null);
    });
  };

  const openEditDialog = (member: WorkspaceMember) => {
    setEditingMember(member);
    setFormData({
      role: member.role,
    });
    setShowEditDialog(true);
  };

  if (showPageLoader && workspaceMembersLoading) {
    return <Loading />;
  }

  return (
    <PageLayout
      title="Workspace Members"
      actions={
        selectedWorkspace ? (
          <InviteMemberDialog
            workspaceId={selectedWorkspace.id}
            workspaceName={selectedWorkspace.name}
            onInviteCreated={refetchWorkspaceMembers}
          />
        ) : null
      }
    >
      <FilterPanel
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onClear={() => {
          setFilters({
            search: "",
            sortBy: "createdAt",
            sortOrder: "desc",
          });
          setCurrentPage(1);
        }}
        mainFilters={
          <div className="flex flex-wrap gap-4">
            <div className="min-w-[200px]">
              <Label className="text-sm font-medium">Search</Label>
              <div className="relative mt-1">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={filters.search}
                  onChange={(e) =>
                    handleFilterChange("search", e.target.value)
                  }
                  className="pl-9"
                />
              </div>
            </div>
            <div className="min-w-[150px]">
              <Label className="text-sm font-medium">Filter by Workspace</Label>
              <select
                value={filters.workspaceId || ""}
                onChange={(e) =>
                  handleFilterChange("workspaceId", e.target.value ? parseInt(e.target.value) : undefined)
                }
                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All Workspaces</option>
                {workspaces.map((workspace) => (
                  <option key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-[150px]">
              <Label className="text-sm font-medium">Filter by Role</Label>
              <select
                value={filters.role || ""}
                onChange={(e) =>
                  handleFilterChange("role", e.target.value || undefined)
                }
                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="MEMBER">Member</option>
              </select>
            </div>
            <div className="min-w-[150px]">
              <Label className="text-sm font-medium">Sort By</Label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="createdAt">Created Date</option>
                <option value="role">Role</option>
              </select>
            </div>
            <div className="min-w-[150px]">
              <Label className="text-sm font-medium">Sort Order</Label>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  handleFilterChange("sortOrder", e.target.value)
                }
                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        }
      />

      {/* Table */}
      <DataTable
        headerCells={
          <>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Workspace</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </>
        }
        rows={
          <>
            {workspaceMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.id}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <UsersIcon className="w-4 h-4 text-blue-500" />
                    <span>{member.workspace?.name || `Workspace ${member.workspaceId}`}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="font-medium">
                        {member.user?.name || member.user?.email || `User ${member.userId}`}
                      </div>
                      {member.user?.name && (
                        <div className="text-xs text-gray-500">{member.user.email}</div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.role === "ADMIN"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {member.role}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(member.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontalIcon className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => openEditDialog(member)}>
                        <EditIcon className="w-4 h-4 mr-2" />
                        Edit Role
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setMemberIdToDelete(member.id)}
                        className="text-red-600"
                      >
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </>
        }
        colSpan={6}
        isEmpty={workspaceMembers.length === 0}
        emptyMessage="No workspace members found"
      />

      {/* Pagination */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={workspaceMembersTotalPages}
        onPageChange={handlePageChange}
      />

      {/* Edit Member Dialog */}
      <EntityDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Workspace Member"
        description="Update the member's role in the workspace."
        primaryLabel="Update Role"
        onPrimary={handleEditWorkspaceMember}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-role-select" className="text-sm font-medium">
              Role
            </Label>
            <select
              id="edit-role-select"
              value={formData.role}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, role: e.target.value as MemberRole }))
              }
              className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
      </EntityDialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={memberIdToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setMemberIdToDelete(null);
        }}
        title="Remove Workspace Member"
        description="Are you sure you want to remove this member from the workspace? This action cannot be undone."
        primaryLabel="Remove Member"
        onConfirm={() => {
          if (memberIdToDelete !== null) {
            void handleDeleteWorkspaceMember(memberIdToDelete);
          }
        }}
      />
    </PageLayout>
  );
}