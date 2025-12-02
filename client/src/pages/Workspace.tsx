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
  Settings,
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
import type Workspace from "@/interfaces/workspace.interface";
import type Filters from "@/interfaces/workspace/filters.interface";
import { WorkspaceService } from "@/services/workspace.service";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { asyncWrapper } from "@/utils/asyncWrapper";
import { WorkspaceSettingsDialog } from "@/components/app/WorkspaceSettingsDialog";

export default function WorkspacePage() {
  const limit = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [
    workspaces,
    workspacesLoading,
    workspacesErrors,
    workspacesTotalPages,
    refetchWorkspaces,
  ] = useWorkspaces(currentPage, limit, filters);

  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState<boolean>(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
  const [workspaceIdToDelete, setWorkspaceIdToDelete] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
  });

  const [showPageLoader, setShowPageLoader] = useState(true);

  useEffect(() => {
    if (workspacesErrors) {
      toast.error(workspacesErrors.message);
    }
  }, [workspacesErrors]);

  useEffect(() => {
    if (!workspacesLoading) {
      setShowPageLoader(false);
    }
  }, [workspacesLoading]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleCreateWorkspace = async () => {
    await asyncWrapper(async () => {
      await WorkspaceService.create(formData);
      await refetchWorkspaces();
      toast.success("Workspace created successfully");
      setShowCreateDialog(false);
      setFormData({ name: "" });
    });
  };

  const handleEditWorkspace = async () => {
    if (!editingWorkspace) return;

    await asyncWrapper(async () => {
      await WorkspaceService.update(editingWorkspace.id, formData);
      await refetchWorkspaces();
      toast.success("Workspace updated successfully");
      setShowEditDialog(false);
      setEditingWorkspace(null);
      setFormData({ name: "" });
    });
  };

  const handleDeleteWorkspace = async (id: number) => {
    await asyncWrapper(async () => {
      await WorkspaceService.remove(id);
      toast.success("Workspace deleted successfully");
      await refetchWorkspaces();
      setWorkspaceIdToDelete(null);
    });
  };

  const openEditDialog = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
    setFormData({
      name: workspace.name,
    });
    setShowEditDialog(true);
  };

  if (showPageLoader && workspacesLoading) {
    return <Loading />;
  }

  return (
    <PageLayout
      title="Workspaces"
      actions={
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Workspace
        </Button>
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
                  placeholder="Search workspaces..."
                  value={filters.search}
                  onChange={(e) =>
                    handleFilterChange("search", e.target.value)
                  }
                  className="pl-9"
                />
              </div>
            </div>
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
            <TableHead>Name</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </>
        }
        rows={
          <>
            {workspaces.map((workspace) => (
              <TableRow key={workspace.id}>
                <TableCell className="font-medium">{workspace.id}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <UsersIcon className="w-4 h-4 text-blue-500" />
                    <span>{workspace.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    {workspace.members?.length || 0} members
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(workspace.createdAt).toLocaleDateString()}
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
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedWorkspace(workspace);
                          setShowSettingsDialog(true);
                        }}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings & Members
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(workspace)}>
                        <EditIcon className="w-4 h-4 mr-2" />
                        Edit Name
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setWorkspaceIdToDelete(workspace.id)}
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
        isEmpty={workspaces.length === 0}
        emptyMessage="No workspaces found"
      />

      {/* Pagination */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={workspacesTotalPages}
        onPageChange={handlePageChange}
      />

      {/* Create Workspace Dialog */}
      <EntityDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Create New Workspace"
        description="Add a new workspace to your organization."
        primaryLabel="Create Workspace"
        onPrimary={handleCreateWorkspace}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">
              Workspace Name
            </Label>
            <Input
              id="name"
              placeholder="Enter workspace name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="mt-1"
            />
          </div>
        </div>
      </EntityDialog>

      {/* Edit Workspace Dialog */}
      <EntityDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Workspace"
        description="Update workspace information."
        primaryLabel="Update Workspace"
        onPrimary={handleEditWorkspace}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-name" className="text-sm font-medium">
              Workspace Name
            </Label>
            <Input
              id="edit-name"
              placeholder="Enter workspace name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="mt-1"
            />
          </div>
        </div>
      </EntityDialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={workspaceIdToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setWorkspaceIdToDelete(null);
        }}
        title="Delete Workspace"
        description="Are you sure you want to delete this workspace? This will also remove all workspace members. This action cannot be undone."
        primaryLabel="Delete Workspace"
        onConfirm={() => {
          if (workspaceIdToDelete !== null) {
            void handleDeleteWorkspace(workspaceIdToDelete);
          }
        }}
      />

      {/* Workspace Settings Dialog */}
      <WorkspaceSettingsDialog
        workspace={selectedWorkspace}
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        onWorkspaceUpdated={refetchWorkspaces}
      />
    </PageLayout>
  );
}