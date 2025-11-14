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
  FilterIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
  XIcon,
  StoreIcon,
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
import type StoreInterface from "@/interfaces/store.interface";
import type Filters from "@/interfaces/store/filters.interface";
import { useStores } from "@/hooks/useStores";
import { StoreService } from "@/services/store.service";

export default function Store() {
  const limit = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [
    stores,
    storesLoading,
    storesErrors,
    refetchStores,
  ] = useStores(currentPage, limit, filters);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [editingStore, setEditingStore] = useState<StoreInterface | null>(null);
  const [storeIdToDelete, setStoreIdToDelete] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
  });

  useEffect(() => {
    if (storesErrors) {
      toast.error(`Failed to load stores: ${storesErrors.message}`);
    }
  }, [storesErrors]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(clearedFilters);
  };

  const handleCreateStore = async () => {
    try {
      await StoreService.create(formData);
      await refetchStores();
      toast.success("Store created successfully");
      setShowCreateDialog(false);
      setFormData({ code: "", name: "" });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to create store: ${error.message}`);
    }
  };

  const handleEditStore = async () => {
    if (!editingStore) return;

    try {
      await StoreService.update(editingStore.id, formData);
      await refetchStores();
      toast.success("Store updated successfully");
      setShowEditDialog(false);
      setEditingStore(null);
      setFormData({ code: "", name: "" });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to update store: ${error.message}`);
    }
  };

  const handleDeleteStore = async (id: number) => {
    try {
      await StoreService.remove(id);
      toast.success("Store deleted successfully");
      await refetchStores();
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to delete store: ${error.message}`);
    }
  };

  const openEditDialog = (store: StoreInterface) => {
    setEditingStore(store);
    setFormData({
      code: store.code,
      name: store.name || "",
    });
    setShowEditDialog(true);
  };

  if (storesLoading) {
    return <Loading />;
  }

  return (
    <PageLayout
      title="Stores"
      actions={
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Store
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
                  placeholder="Search by code or name..."
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
                <option value="code">Code</option>
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
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Store Views</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </>
        }
        rows={
          <>
            {stores.map((store) => (
              <TableRow key={store.id}>
                <TableCell className="font-medium">{store.id}</TableCell>
                <TableCell>
                  <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                    {store.code}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <StoreIcon className="w-4 h-4 text-blue-500" />
                    <span>{store.name || "No name"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    {store.storeViews?.length || 0} views
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(store.createdAt).toLocaleDateString()}
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
                      <DropdownMenuItem onClick={() => openEditDialog(store)}>
                        <EditIcon className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStoreIdToDelete(store.id)}
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
        colSpan={6}
        isEmpty={stores.length === 0}
        emptyMessage="No stores found"
      />

      {/* Pagination */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Create Store Dialog */}
      <EntityDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Create New Store"
        description="Add a new store to your system."
        primaryLabel="Create Store"
        onPrimary={handleCreateStore}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="code">Store Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              placeholder="store_code"
            />
          </div>
          <div>
            <Label htmlFor="name">Store Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Store Name"
            />
          </div>
        </div>
      </EntityDialog>

      {/* Edit Store Dialog */}
      <EntityDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Store"
        description="Update store information."
        primaryLabel="Update Store"
        onPrimary={handleEditStore}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-code">Store Code</Label>
            <Input
              id="edit-code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              placeholder="store_code"
            />
          </div>
          <div>
            <Label htmlFor="edit-name">Store Name</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Store Name"
            />
          </div>
        </div>
      </EntityDialog>

      <DeleteConfirmDialog
        open={storeIdToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setStoreIdToDelete(null);
        }}
        title="Delete Store"
        description="Are you sure you want to delete this store? This action cannot be undone."
        primaryLabel="Delete Store"
        onConfirm={() => {
          if (storeIdToDelete !== null) {
            void handleDeleteStore(storeIdToDelete);
          }
        }}
      />
    </PageLayout>
  );
}
