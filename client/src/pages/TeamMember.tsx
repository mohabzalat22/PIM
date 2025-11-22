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
  PlusIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
  UserIcon,
  UsersIcon,
  ShieldIcon,
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
import type TeamMember from "@/interfaces/teamMember.interface";
import type { User } from "@/interfaces/teamMember.interface";
import type Team from "@/interfaces/team.interface";
import type Filters from "@/interfaces/teamMember/filters.interface";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { TeamMemberService } from "@/services/teamMember.service";
import { TeamService } from "@/services/team.service";
import { UserService } from "@/services/user.service";
import { asyncWrapper } from "@/utils/asyncWrapper";

export default function TeamMemberPage() {
  const limit = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [
    teamMembers,
    teamMembersLoading,
    teamMembersErrors,
    teamMembersTotalPages,
    refetchTeamMembers,
  ] = useTeamMembers(currentPage, limit, filters);

  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberIdToDelete, setMemberIdToDelete] = useState<number | null>(null);

  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingOptions, setLoadingOptions] = useState<boolean>(true);

  const [formData, setFormData] = useState({
    teamId: 0,
    userId: 0,
    role: "MEMBER" as "OWNER" | "ADMIN" | "MEMBER",
  });

  const [showPageLoader, setShowPageLoader] = useState(true);

  // Fetch teams and users for dropdowns
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [teamsResponse, usersResponse] = await Promise.all([
          TeamService.getAll(1, 100),
          UserService.getAll(1, 100),
        ]);
        setTeams(teamsResponse.data || []);
        setUsers(usersResponse.data || []);
      } catch {
        toast.error("Failed to load teams and users");
      } finally {
        setLoadingOptions(false);
      }
    };
    void fetchOptions();
  }, []);

  useEffect(() => {
    if (teamMembersErrors) {
      toast.error(`Failed to load team members: ${teamMembersErrors.message}`);
    }
  }, [teamMembersErrors]);

  useEffect(() => {
    if (!teamMembersLoading) {
      setShowPageLoader(false);
    }
  }, [teamMembersLoading]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= teamMembersTotalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (key: keyof Filters, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    const clearedFilters: Filters = {
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
  };

  const handleCreateMember = async () => {
    if (!formData.teamId || !formData.userId) {
      toast.error("Please select both team and user");
      return;
    }

    await asyncWrapper(async () => {
      await TeamMemberService.create(formData);
      await refetchTeamMembers();
      toast.success("Team member added successfully");
      setShowCreateDialog(false);
      setFormData({ teamId: 0, userId: 0, role: "MEMBER" });
    });
  };

  const handleEditMember = async () => {
    if (!editingMember) return;

    await asyncWrapper(async () => {
      await TeamMemberService.update(editingMember.id, { role: formData.role });
      await refetchTeamMembers();
      toast.success("Team member role updated successfully");
      setShowEditDialog(false);
      setEditingMember(null);
      setFormData({ teamId: 0, userId: 0, role: "MEMBER" });
    });
  };

  const handleDeleteMember = async (id: number) => {
    await asyncWrapper(async () => {
      await TeamMemberService.remove(id);
      toast.success("Team member removed successfully");
      await refetchTeamMembers();
      setMemberIdToDelete(null);
    });
  };

  const openEditDialog = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      teamId: member.teamId,
      userId: member.userId,
      role: member.role as "OWNER" | "ADMIN" | "MEMBER",
    });
    setShowEditDialog(true);
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      OWNER: "bg-purple-100 text-purple-800",
      ADMIN: "bg-blue-100 text-blue-800",
      MEMBER: "bg-green-100 text-green-800",
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (showPageLoader && (teamMembersLoading || loadingOptions)) {
    return <Loading />;
  }

  return (
    <PageLayout
      title="Team Members"
      actions={
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      }
    >
      {/* Filters */}
      <FilterPanel
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onClear={clearFilters}
        mainFilters={
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by user email or name..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        }
        advancedFilters={
          <div className="flex flex-wrap gap-4">
            <div className="min-w-[150px]">
              <Label className="text-sm font-medium">Filter by Team</Label>
              <select
                value={filters.teamId || ""}
                onChange={(e) =>
                  handleFilterChange("teamId", e.target.value ? parseInt(e.target.value) : undefined)
                }
                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All Teams</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-[150px]">
              <Label className="text-sm font-medium">Filter by Role</Label>
              <select
                value={filters.role || ""}
                onChange={(e) =>
                  handleFilterChange("role", e.target.value)
                }
                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All Roles</option>
                <option value="OWNER">Owner</option>
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
              <Label className="text-sm font-medium">Order</Label>
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
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Added</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </>
        }
        rows={
          <>
            {teamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.id}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <UsersIcon className="w-4 h-4 text-blue-500" />
                    <span>{member.team?.name || `Team ${member.teamId}`}</span>
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(member.role)}`}>
                    <ShieldIcon className="w-3 h-3 inline mr-1" />
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
                        Change Role
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
        isEmpty={teamMembers.length === 0}
        emptyMessage="No team members found"
      />

      {/* Pagination */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={teamMembersTotalPages}
        onPageChange={handlePageChange}
      />

      {/* Create Member Dialog */}
      <EntityDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Add Team Member"
        description="Add a user to a team with a specific role."
        primaryLabel="Add Member"
        onPrimary={handleCreateMember}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="team">Team</Label>
            <select
              id="team"
              value={formData.teamId}
              onChange={(e) =>
                setFormData({ ...formData, teamId: parseInt(e.target.value) })
              }
              className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value={0}>Select a team...</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="user">User</Label>
            <select
              id="user"
              value={formData.userId}
              onChange={(e) =>
                setFormData({ ...formData, userId: parseInt(e.target.value) })
              }
              className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value={0}>Select a user...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value as "OWNER" | "ADMIN" | "MEMBER" })
              }
              className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
              <option value="OWNER">Owner</option>
            </select>
          </div>
        </div>
      </EntityDialog>

      {/* Edit Member Dialog */}
      <EntityDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Change Member Role"
        description="Update the member's role in the team."
        primaryLabel="Update Role"
        onPrimary={handleEditMember}
      >
        <div className="space-y-4">
          <div>
            <Label>Team</Label>
            <Input
              value={editingMember?.team?.name || ""}
              disabled
              className="bg-gray-100"
            />
          </div>
          <div>
            <Label>User</Label>
            <Input
              value={editingMember?.user?.email || ""}
              disabled
              className="bg-gray-100"
            />
          </div>
          <div>
            <Label htmlFor="edit-role">Role</Label>
            <select
              id="edit-role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value as "OWNER" | "ADMIN" | "MEMBER" })
              }
              className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
              <option value="OWNER">Owner</option>
            </select>
          </div>
        </div>
      </EntityDialog>

      {/* Delete Member Dialog */}
      <DeleteConfirmDialog
        open={memberIdToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setMemberIdToDelete(null);
        }}
        title="Remove Team Member"
        description="Are you sure you want to remove this member from the team? This action cannot be undone."
        primaryLabel="Remove Member"
        onConfirm={() => {
          if (memberIdToDelete !== null) {
            void handleDeleteMember(memberIdToDelete);
          }
        }}
      />
    </PageLayout>
  );
}
