import { TableCell, TableHead, TableRow } from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  MoreHorizontalIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
  EyeIcon,
  GlobeIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SelectType } from "@/components/app/select-type";
import { PageLayout } from "@/components/app/PageLayout";
import { FilterPanel } from "@/components/app/FilterPanel";
import { DataTable } from "@/components/app/DataTable";
import { PaginationBar } from "@/components/app/PaginationBar";
import { EntityDialog } from "@/components/app/EntityDialog";
import Loading from "@/components/app/loading";
import { DeleteConfirmDialog } from "@/components/app/DeleteConfirmDialog";
import type Filter from "@/interfaces/storeView/filters.iterface";
import { useStoreViews } from "@/hooks/useStoreViews";
import { useStores } from "@/hooks/useStores";
import { useLocales } from "@/hooks/useLocales";
import { StoreViewService } from "@/services/storeView.service";
interface StoreView {
  id: number;
  storeId: number;
  code: string;
  name: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
  store?: Store;
}

interface Store {
  id: number;
  code: string;
  name: string;
}

export default function StoreView() {
  const limit = 10;

  const [filters, setFilters] = useState<Filter>({
    search: "",
    storeId: "",
    locale: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [
    storeViews,
    storeViewsLoading,
    storeViewsErrors,
    storeViewsTotalPages,
    refetchStoreViews,
  ] = useStoreViews<StoreView>(currentPage, limit, filters);
  const [stores, storesLoading, storesErrors, storesTotalPages, refetchStores] =
    useStores(currentPage, limit);
  const [
    locales,
    localesLoading,
    localesError,
    localesTotalPages,
    refetchLocales,
  ] = useLocales(1, 100, { sortBy: "value", sortOrder: "asc" });

  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [editingStoreView, setEditingStoreView] = useState<StoreView | null>(
    null
  );

  const [formData, setFormData] = useState({
    storeId: "",
    code: "",
    name: "",
    locale: "",
  });

  const [showPageLoader, setShowPageLoader] = useState(true);

  const isLoading = storeViewsLoading || storesLoading || localesLoading;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= storeViewsTotalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (key: keyof Filter, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      storeId: "",
      locale: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (storeViewsErrors) {
      toast.error(`Failed to load store views: ${storeViewsErrors.message}`);
    }
  }, [storeViewsErrors]);

  useEffect(() => {
    if (storesErrors) {
      toast.error(`Failed to load stores: ${storesErrors.message}`);
    }
  }, [storesErrors]);

  useEffect(() => {
    if (localesError) {
      toast.error(`Failed to load locales: ${localesError.message}`);
    }
  }, [localesError]);

  useEffect(() => {
    if (!isLoading) {
      setShowPageLoader(false);
    }
  }, [isLoading]);

  const handleCreateStoreView = async () => {
    try {
      const storeViewData = {
        storeId: parseInt(formData.storeId),
        code: formData.code,
        name: formData.name,
        locale: formData.locale,
      };
      await StoreViewService.create(storeViewData);
      await refetchStoreViews();
      toast.success("Store view created successfully");
      setShowCreateDialog(false);
      setFormData({ storeId: "", code: "", name: "", locale: "" });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to create store view: ${error.message}`);
    }
  };

  const handleEditStoreView = async () => {
    if (!editingStoreView) return;

    try {
      const storeViewData = {
        storeId: parseInt(formData.storeId),
        code: formData.code,
        name: formData.name,
        locale: formData.locale,
      };

      await StoreViewService.update(editingStoreView.id, storeViewData);
      await refetchStoreViews();
      toast.success("Store view updated successfully");
      setShowEditDialog(false);
      setEditingStoreView(null);
      setFormData({ storeId: "", code: "", name: "", locale: "" });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to update store view: ${error.message}`);
    }
  };

  const [storeViewIdToDelete, setStoreViewIdToDelete] = useState<number | null>(
    null
  );

  const handleDeleteStoreView = async (id: number) => {
    try {
      await StoreViewService.remove(id);
      toast.success("Store view deleted successfully");
      await refetchStoreViews();
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to delete store view: ${error.message}`);
    }
  };

  const openEditDialog = (storeView: StoreView) => {
    setEditingStoreView(storeView);
    setFormData({
      storeId: storeView.storeId.toString(),
      code: storeView.code,
      name: storeView.name,
      locale: storeView.locale,
    });
    setShowEditDialog(true);
  };

  

  if (showPageLoader && isLoading) {
    return <Loading />;
  }

  return (
    <PageLayout
      title="Store Views"
      actions={
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Store View
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
            <div className="min-w-[150px]">
              <SelectType
                initialValue={filters.storeId}
                options={[
                  { value: "all", name: "All Stores" },
                  ...stores.map((store) => ({
                    value: store.id.toString(),
                    name: store.name || store.code,
                  })),
                ]}
                onValueChange={(value) =>
                  handleFilterChange("storeId", value === "all" ? "" : value)
                }
              />
            </div>
            <div className="min-w-[150px]">
              <SelectType
                initialValue={filters.locale}
                options={[
                  { value: "all", name: "All Locales" },
                  ...locales.map((locale) => ({
                    value: locale.value || "none",
                    name: locale.label,
                  })),
                ]}
                onValueChange={(value) =>
                  handleFilterChange("locale", value === "all" ? "" : value)
                }
              />
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
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">Created Date</option>
                <option value="code">Code</option>
                <option value="name">Name</option>
                <option value="locale">Locale</option>
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
            <TableHead>Store</TableHead>
            <TableHead>Locale</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </>
        }
        rows={
          <>
            {storeViews.map((storeView) => (
              <TableRow key={storeView.id}>
                <TableCell className="font-medium">{storeView.id}</TableCell>
                <TableCell>
                  <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                    {storeView.code}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <EyeIcon className="w-4 h-4 text-blue-500" />
                    <span>{storeView.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {storeView.store?.name ||
                      storeView.store?.code ||
                      `Store ${storeView.storeId}`}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <GlobeIcon className="w-4 h-4 text-green-500" />
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {storeView.locale}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(storeView.createdAt).toLocaleDateString()}
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
                        onClick={() => openEditDialog(storeView)}
                      >
                        <EditIcon className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStoreViewIdToDelete(storeView.id)}
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
        colSpan={7}
        isEmpty={storeViews.length === 0}
        emptyMessage="No store views found"
      />

      {/* Pagination */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={storeViewsTotalPages}
        onPageChange={handlePageChange}
      />

      {/* Create Store View Dialog */}
      <EntityDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Create New Store View"
        description="Add a new store view for multi-language support."
        primaryLabel="Create Store View"
        onPrimary={handleCreateStoreView}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="storeId">Store</Label>
            <Select
              value={formData.storeId}
              onValueChange={(value) =>
                setFormData({ ...formData, storeId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select store" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem
                    key={store.id}
                    value={store.id.toString() || "none"}
                  >
                    {store.name || store.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="code">Store View Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              placeholder="store_view_code"
            />
          </div>
          <div>
            <Label htmlFor="name">Store View Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Store View Name"
            />
          </div>
          <div>
            <Label htmlFor="locale">Locale</Label>
            <Select
              value={formData.locale}
              onValueChange={(value) =>
                setFormData({ ...formData, locale: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select locale" />
              </SelectTrigger>
              <SelectContent>
                {locales.map((locale) => (
                  <SelectItem key={locale.value} value={locale.value || "none"}>
                    {locale.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </EntityDialog>

      {/* Edit Store View Dialog */}
      <EntityDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Store View"
        description="Update store view information."
        primaryLabel="Update Store View"
        onPrimary={handleEditStoreView}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-storeId">Store</Label>
            <Select
              value={formData.storeId}
              onValueChange={(value) =>
                setFormData({ ...formData, storeId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select store" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem
                    key={store.id}
                    value={store.id.toString() || "none"}
                  >
                    {store.name || store.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-code">Store View Code</Label>
            <Input
              id="edit-code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              placeholder="store_view_code"
            />
          </div>
          <div>
            <Label htmlFor="edit-name">Store View Name</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Store View Name"
            />
          </div>
          <div>
            <Label htmlFor="edit-locale">Locale</Label>
            <Select
              value={formData.locale}
              onValueChange={(value) =>
                setFormData({ ...formData, locale: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select locale" />
              </SelectTrigger>
              <SelectContent>
                {locales.map((locale) => (
                  <SelectItem key={locale.value} value={locale.value || "none"}>
                    {locale.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </EntityDialog>

      <DeleteConfirmDialog
        open={storeViewIdToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setStoreViewIdToDelete(null);
        }}
        title="Delete Store View"
        description="Are you sure you want to delete this store view? This action cannot be undone."
        primaryLabel="Delete Store View"
        onConfirm={() => {
          if (storeViewIdToDelete !== null) {
            void handleDeleteStoreView(storeViewIdToDelete);
          }
        }}
      />
    </PageLayout>
  );
}
