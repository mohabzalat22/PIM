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
  UsersIcon,
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
import type Team from "@/interfaces/team.interface";
import type Filters from "@/interfaces/team/filters.interface";
import { useTeams } from "@/hooks/useTeams";
import { TeamService } from "@/services/team.service";
import { asyncWrapper } from "@/utils/asyncWrapper";

export default function TeamPage() {
  const limit = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [
    teams,
    teamsLoading,
    teamsErrors,
    teamsTotalPages,
    refetchTeams,
  ] = useTeams(currentPage, limit, filters);

  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [teamIdToDelete, setTeamIdToDelete] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
  });

  const [showPageLoader, setShowPageLoader] = useState(true);

  useEffect(() => {
    if (teamsErrors) {
      toast.error(`Failed to load teams: ${teamsErrors.message}`);
    }
  }, [teamsErrors]);

  useEffect(() => {
    if (!teamsLoading) {
      setShowPageLoader(false);
    }
  }, [teamsLoading]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= teamsTotalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
  };

  const handleCreateTeam = async () => {
    await asyncWrapper(async () => {
      await TeamService.create(formData);
      await refetchTeams();
      toast.success("Team created successfully");
      setShowCreateDialog(false);
      setFormData({ name: "" });
    });
  };

  const handleEditTeam = async () => {
    if (!editingTeam) return;

    await asyncWrapper(async () => {
      await TeamService.update(editingTeam.id, formData);
      await refetchTeams();
      toast.success("Team updated successfully");
      setShowEditDialog(false);
      setEditingTeam(null);
      setFormData({ name: "" });
    });
  };

  const handleDeleteTeam = async (id: number) => {
    await asyncWrapper(async () => {
      await TeamService.remove(id);
      toast.success("Team deleted successfully");
      await refetchTeams();
      setTeamIdToDelete(null);
    });
  };

  const openEditDialog = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
    });
    setShowEditDialog(true);
  };

  if (showPageLoader && teamsLoading) {
    return <Loading />;
  }

  return (
    <PageLayout
      title="Teams"
      actions={
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Team
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
                  placeholder="Search by team name..."
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
              <Label className="text-sm font-medium">Sort By</Label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="createdAt">Created Date</option>
                <option value="name">Name</option>
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
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </>
        }
        rows={
          <>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell className="font-medium">{team.id}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <UsersIcon className="w-4 h-4 text-blue-500" />
                    <span>{team.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    {team.teamMembers?.length || 0} members
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(team.createdAt).toLocaleDateString()}
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
                      <DropdownMenuItem onClick={() => openEditDialog(team)}>
                        <EditIcon className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setTeamIdToDelete(team.id)}
                        className="text-red-600"
                      >
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </>
        }
        colSpan={5}
        isEmpty={teams.length === 0}
        emptyMessage="No teams found"
      />

      {/* Pagination */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={teamsTotalPages}
        onPageChange={handlePageChange}
      />

      {/* Create Team Dialog */}
      <EntityDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Create New Team"
        description="Add a new team to your organization."
        primaryLabel="Create Team"
        onPrimary={handleCreateTeam}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Engineering Team"
            />
          </div>
        </div>
      </EntityDialog>

      {/* Edit Team Dialog */}
      <EntityDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Team"
        description="Update team information."
        primaryLabel="Update Team"
        onPrimary={handleEditTeam}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Team Name</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Engineering Team"
            />
          </div>
        </div>
      </EntityDialog>

      {/* Delete Team Dialog */}
      <DeleteConfirmDialog
        open={teamIdToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setTeamIdToDelete(null);
        }}
        title="Delete Team"
        description="Are you sure you want to delete this team? This will also remove all team members. This action cannot be undone."
        primaryLabel="Delete Team"
        onConfirm={() => {
          if (teamIdToDelete !== null) {
            void handleDeleteTeam(teamIdToDelete);
          }
        }}
      />
    </PageLayout>
  );
}
