import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
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
import { useLocales } from "@/hooks/useLocales";
import { LocaleService } from "@/services/locale.service";
import type Locale from "@/interfaces/locale.interface";
import {
  MoreHorizontalIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
  GlobeIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type LocaleFilters } from "@/api/locale";

export default function LocalePage() {
  const limit = 10;

  const [filters, setFilters] = useState<LocaleFilters>({
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [
    locales,
    localesLoading,
    localesError,
    localesTotalPages,
    refetchLocales,
  ] = useLocales(currentPage, limit, filters);

  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [editingLocale, setEditingLocale] = useState<Locale | null>(null);
  const [localeIdToDelete, setLocaleIdToDelete] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    value: "",
    label: "",
  });

  const [showPageLoader, setShowPageLoader] = useState(true);

  const isLoading = localesLoading;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= localesTotalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
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

  const handleCreateLocale = async () => {
    try {
      await LocaleService.create(formData);
      await refetchLocales();
      toast.success("Locale created successfully");
      setShowCreateDialog(false);
      setFormData({ value: "", label: "" });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to create locale: ${error.message}`);
    }
  };

  const handleEditLocale = async () => {
    if (!editingLocale) return;

    try {
      await LocaleService.update(editingLocale.id, formData);
      await refetchLocales();
      toast.success("Locale updated successfully");
      setShowEditDialog(false);
      setEditingLocale(null);
      setFormData({ value: "", label: "" });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to update locale: ${error.message}`);
    }
  };

  const handleDeleteLocale = async (id: number) => {
    try {
      await LocaleService.remove(id);
      toast.success("Locale deleted successfully");
      await refetchLocales();
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to delete locale: ${error.message}`);
    }
  };

  const openEditDialog = (locale: Locale) => {
    setEditingLocale(locale);
    setFormData({
      value: locale.value,
      label: locale.label,
    });
    setShowEditDialog(true);
  };

  if (showPageLoader && isLoading) {
    return <Loading />;
  }

  return (
    <PageLayout
      title="Locales"
      actions={
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Locale
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
                  placeholder="Search by value or label..."
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
                onChange={(e) =>
                  handleFilterChange("sortBy", e.target.value as "createdAt" | "value")
                }
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">Created Date</option>
                <option value="value">Locale Value</option>
              </select>
            </div>
            <div className="min-w-[150px]">
              <Label className="text-sm font-medium">Order</Label>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  handleFilterChange("sortOrder", e.target.value as "asc" | "desc")
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
            <TableHead>Value</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </>
        }
        rows={
          <>
            {locales.map((locale) => (
              <TableRow key={locale.id}>
                <TableCell className="font-medium">{locale.id}</TableCell>
                <TableCell>
                  <code className="px-2 py-1 bg-muted/60 text-gray-800 dark:text-gray-100 rounded text-sm flex items-center space-x-2">
                    <GlobeIcon className="w-4 h-4 text-green-500 dark:text-green-400" />
                    <span>{locale.value}</span>
                  </code>
                </TableCell>
                <TableCell>{locale.label}</TableCell>
                <TableCell>
                  {new Date(locale.createdAt).toLocaleDateString()}
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
                      <DropdownMenuItem onClick={() => openEditDialog(locale)}>
                        <EditIcon className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setLocaleIdToDelete(locale.id)}
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
        isEmpty={locales.length === 0}
        emptyMessage="No locales found"
      />

      {/* Pagination */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={localesTotalPages}
        onPageChange={handlePageChange}
      />

      {/* Create Locale Dialog */}
      <EntityDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Create New Locale"
        description="Add a new locale (e.g., en_US, fr_FR)."
        primaryLabel="Create Locale"
        onPrimary={handleCreateLocale}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="value">Locale Value</Label>
            <Input
              id="value"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder="en_US"
            />
          </div>
          <div>
            <Label htmlFor="label">Locale Label</Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="English (US)"
            />
          </div>
        </div>
      </EntityDialog>

      {/* Edit Locale Dialog */}
      <EntityDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Locale"
        description="Update locale information."
        primaryLabel="Update Locale"
        onPrimary={handleEditLocale}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-value">Locale Value</Label>
            <Input
              id="edit-value"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder="en_US"
            />
          </div>
          <div>
            <Label htmlFor="edit-label">Locale Label</Label>
            <Input
              id="edit-label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="English (US)"
            />
          </div>
        </div>
      </EntityDialog>

      <DeleteConfirmDialog
        open={localeIdToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setLocaleIdToDelete(null);
        }}
        title="Delete Locale"
        description="Are you sure you want to delete this locale? This action cannot be undone."
        primaryLabel="Delete Locale"
        onConfirm={() => {
          if (localeIdToDelete !== null) {
            void handleDeleteLocale(localeIdToDelete);
          }
        }}
      />
    </PageLayout>
  );
}
