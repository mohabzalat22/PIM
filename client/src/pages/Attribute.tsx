import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { PaginationBar } from "@/components/app/PaginationBar";
import { BulkActionBar } from "@/components/app/BulkActionBar";
import { ColumnSelector, type Column } from "@/components/app/ColumnSelector";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  MoreHorizontalIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PageLayout } from "@/components/app/PageLayout";
import { FilterPanel } from "@/components/app/FilterPanel";
import { DataTable } from "@/components/app/DataTable";
import { EntityDialog } from "@/components/app/EntityDialog";
import type ProductAttributeValue from "@/interfaces/productAttributeValue.interface";
import { SelectType } from "@/components/app/select-type";
import type { Filters } from "@/interfaces/attributes.filters.interface";
import { useAttributes } from "@/hooks/useAttributes";
import { AttributeService } from "@/services/attribute.service";
import Loading from "@/components/app/loading";
import { DeleteConfirmDialog } from "@/components/app/DeleteConfirmDialog";

interface Attribute {
  id: number;
  code: string;
  label: string;
  dataType: string;
  inputType: string;
  isRequired: boolean;
  isFilterable: boolean;
  isGlobal: boolean;
  createdAt: string;
  updatedAt: string;
  productAttributeValues?: ProductAttributeValue[];
}



export default function Attribute() {
  const limit = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    dataType: "",
    inputType: "",
    isFilterable: "",
    isGlobal: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [
    attributes,
    attributesLoading,
    attributesError,
    attributesTotalPages,
    refetchAttributes,
  ] = useAttributes<Attribute>(currentPage, limit, filters);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(
    null
  );
  const [attributeIdToDelete, setAttributeIdToDelete] = useState<number | null>(
    null
  );
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState<boolean>(false);

  // Bulk actions state
  const [selectedAttributeIds, setSelectedAttributeIds] = useState<Set<number>>(
    new Set()
  );

  // Column visibility state
  const [columns, setColumns] = useState<Column[]>([
    { id: "checkbox", label: "Select", visible: true, locked: true },
    { id: "id", label: "ID", visible: true, locked: false },
    { id: "code", label: "Code", visible: true, locked: true },
    { id: "label", label: "Label", visible: true, locked: false },
    { id: "dataType", label: "Data Type", visible: true, locked: false },
    { id: "inputType", label: "Input Type", visible: true, locked: false },
    { id: "properties", label: "Properties", visible: true, locked: false },
    { id: "values", label: "Values", visible: true, locked: false },
    { id: "created", label: "Created", visible: true, locked: false },
    { id: "actions", label: "Actions", visible: true, locked: true },
  ]);


  const [formData, setFormData] = useState({
    code: "",
    label: "",
    dataType: "STRING",
    inputType: "TEXT",
    isRequired: false,
    isFilterable: false,
    isGlobal: true,
  });

  const dataTypes = [
    { value: "BOOLEAN", label: "Boolean" },
    { value: "STRING", label: "String" },
    { value: "INT", label: "Integer" },
    { value: "DECIMAL", label: "Decimal" },
    { value: "TEXT", label: "Text" },
    { value: "JSON", label: "JSON" },
  ];

  const inputTypes = [
    { value: "TEXT", label: "Text" },
    { value: "SELECT", label: "Select" },
    { value: "MULTISELECT", label: "Multi-select" },
    { value: "DATE", label: "Date" },
    { value: "MEDIA", label: "Media" },
  ];

  const isLoading = attributesLoading;

  const [showPageLoader, setShowPageLoader] = useState(true);

  useEffect(() => {
    if (attributesError) {
      toast.error(`Failed to load attributes: ${attributesError.message}`);
    }
  }, [attributesError]);

  useEffect(() => {
    if (!isLoading) {
      setShowPageLoader(false);
    }
  }, [isLoading]);

  // Clear selections when page or filters change
  useEffect(() => {
    setSelectedAttributeIds(new Set());
  }, [currentPage, filters]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= attributesTotalPages) {
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
      dataType: "",
      inputType: "",
      isFilterable: "",
      isGlobal: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
  };

  // Bulk action handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked && attributes) {
      const allIds = new Set(attributes.map((a) => a.id));
      setSelectedAttributeIds(allIds);
    } else {
      setSelectedAttributeIds(new Set());
    }
  };

  const handleSelectAttribute = (attributeId: number, checked: boolean) => {
    const newSelected = new Set(selectedAttributeIds);
    if (checked) {
      newSelected.add(attributeId);
    } else {
      newSelected.delete(attributeId);
    }
    setSelectedAttributeIds(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedAttributeIds.size === 0) return;
    
    // Open confirmation dialog
    setShowBulkDeleteDialog(true);
  };

  const confirmBulkDelete = async () => {
    try {
      const deletePromises = Array.from(selectedAttributeIds).map((id) =>
        AttributeService.remove(id)
      );
      await Promise.all(deletePromises);
      await refetchAttributes();
      const count = selectedAttributeIds.size;
      setSelectedAttributeIds(new Set());
      toast.success(`Successfully deleted ${count} attribute${count > 1 ? "s" : ""}`);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to delete attributes: ${error.message}`);
    }
  };

  const handleClearSelection = () => {
    setSelectedAttributeIds(new Set());
  };

  // Column visibility handlers
  const handleColumnChange = (columnId: string, visible: boolean) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === columnId ? { ...col, visible } : col))
    );
  };

  const isColumnVisible = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    return column?.visible ?? true;
  };

  const handleCreateAttribute = async () => {
    try {
      await AttributeService.create(formData);
      await refetchAttributes();
      toast.success("Attribute created successfully");
      setShowCreateDialog(false);
      setFormData({
        code: "",
        label: "",
        dataType: "STRING",
        inputType: "TEXT",
        isRequired: false,
        isFilterable: false,
        isGlobal: true,
      });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to create attribute: ${error.message}`);
    }
  };

  const handleEditAttribute = async () => {
    if (!editingAttribute) return;

    try {
      await AttributeService.update(editingAttribute.id, formData);
      await refetchAttributes();
      toast.success("Attribute updated successfully");
      setShowEditDialog(false);
      setEditingAttribute(null);
      setFormData({
        code: "",
        label: "",
        dataType: "STRING",
        inputType: "TEXT",
        isRequired: false,
        isFilterable: false,
        isGlobal: true,
      });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to update attribute: ${error.message}`);
    }
  };

  const handleDeleteAttribute = async (id: number) => {
    try {
      await AttributeService.remove(id);
      await refetchAttributes();
      toast.success("Attribute deleted successfully");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to delete attribute: ${error.message}`);
    }
  };

  const openEditDialog = (attribute: Attribute) => {
    setEditingAttribute(attribute);
    setFormData({
      code: attribute.code,
      label: attribute.label,
      dataType: attribute.dataType,
      inputType: attribute.inputType,
      isRequired: attribute.isRequired,
      isFilterable: attribute.isFilterable,
      isGlobal: attribute.isGlobal,
    });
    setShowEditDialog(true);
  };

  if (showPageLoader && isLoading) {
    return <Loading />;
  }

  return (
    <PageLayout
      title="Attributes"
      actions={
        <div className="flex items-center gap-2">
          <ColumnSelector columns={columns} onColumnChange={handleColumnChange} />
          <Button onClick={() => setShowCreateDialog(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Attribute
          </Button>
        </div>
      }
    >
      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedAttributeIds.size}
        onDelete={handleBulkDelete}
        onClearSelection={handleClearSelection}
      />

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
                  placeholder="Search by code or label..."
                  value={filters.search}
                  onChange={(e) =>
                    handleFilterChange("search", e.target.value)
                  }
                  className="pl-10"
                />
              </div>
            </div>
            <div className="min-w-[150px]">
              <SelectType
                initialValue={filters.dataType}
                options={[
                  { value: "all", name: "All Data Types" },
                  ...dataTypes.map((type) => ({
                    value: type.value || "none",
                    name: type.value,
                  })),
                ]}
                onValueChange={(value) =>
                  handleFilterChange(
                    "dataType",
                    value === "all" ? "" : value
                  )
                }
              />
            </div>
            <div className="min-w-[150px]">
              <SelectType
                initialValue={filters.inputType}
                options={[
                  { value: "all", name: "All Input Types" },
                  ...inputTypes.map((type) => ({
                    value: type.value || "none",
                    name: type.value,
                  })),
                ]}
                onValueChange={(value) =>
                  handleFilterChange(
                    "inputType",
                    value === "all" ? "" : value
                  )
                }
              />
            </div>
          </div>
        }
        advancedFilters={
          <div className="flex flex-wrap gap-4">
            <div className="min-w-[150px]">
              <Label className="text-sm font-medium">Filterable</Label>
              <SelectType
                initialValue={filters.isFilterable}
                options={[
                  { value: "", name: "All" },
                  { value: "true", name: "Yes" },
                  { value: "false", name: "No" },
                ]}
                onValueChange={(value) =>
                  handleFilterChange("isFilterable", value)
                }
              />
            </div>
            <div className="min-w-[150px]">
              <Label className="text-sm font-medium">Global</Label>
              <SelectType
                initialValue={filters.isGlobal}
                options={[
                  { value: "", name: "All" },
                  { value: "true", name: "Yes" },
                  { value: "false", name: "No" },
                ]}
                onValueChange={(value) =>
                  handleFilterChange("isGlobal", value)
                }
              />
            </div>
            <div className="min-w-[150px]">
              <Label className="text-sm font-medium">Sort By</Label>
              <SelectType
                initialValue={filters.sortBy}
                options={[
                  { value: "createdAt", name: "Created Date" },
                  { value: "code", name: "Code" },
                  { value: "label", name: "Label" },
                ]}
                onValueChange={(value) =>
                  handleFilterChange("sortBy", value)
                }
              />
            </div>
            <div className="min-w-[150px]">
              <Label className="text-sm font-medium">Order</Label>
              <SelectType
                initialValue={filters.sortOrder}
                options={[
                  { value: "asc", name: "Ascending" },
                  { value: "desc", name: "Descending" },
                ]}
                onValueChange={(value) =>
                  handleFilterChange("sortOrder", value)
                }
              />
            </div>
          </div>
        }
      />

      {/* Table */}
      <DataTable
        headerCells={
          <>
            {isColumnVisible("checkbox") && (
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    attributes && attributes.length > 0 && 
                    attributes.every((a) => selectedAttributeIds.has(a.id))
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
            )}
            {isColumnVisible("id") && <TableHead className="w-[100px]">ID</TableHead>}
            {isColumnVisible("code") && <TableHead>Code</TableHead>}
            {isColumnVisible("label") && <TableHead>Label</TableHead>}
            {isColumnVisible("dataType") && <TableHead>Data Type</TableHead>}
            {isColumnVisible("inputType") && <TableHead>Input Type</TableHead>}
            {isColumnVisible("properties") && <TableHead>Properties</TableHead>}
            {isColumnVisible("values") && <TableHead>Values</TableHead>}
            {isColumnVisible("created") && <TableHead>Created</TableHead>}
            {isColumnVisible("actions") && <TableHead className="w-[100px]">Actions</TableHead>}
          </>
        }
        rows={
          <>
            {attributes.map((attribute) => (
              <TableRow key={attribute.id}>
                {isColumnVisible("checkbox") && (
                  <TableCell>
                    <Checkbox
                      checked={selectedAttributeIds.has(attribute.id)}
                      onCheckedChange={(checked) =>
                        handleSelectAttribute(attribute.id, checked as boolean)
                      }
                    />
                  </TableCell>
                )}
                {isColumnVisible("id") && (
                  <TableCell className="font-medium">{attribute.id}</TableCell>
                )}
                {isColumnVisible("code") && (
                  <TableCell>
                    <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                      {attribute.code}
                    </code>
                  </TableCell>
                )}
                {isColumnVisible("label") && (
                  <TableCell>{attribute.label || "-"}</TableCell>
                )}
                {isColumnVisible("dataType") && (
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {attribute.dataType}
                    </span>
                  </TableCell>
                )}
                {isColumnVisible("inputType") && (
                  <TableCell>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {attribute.inputType}
                    </span>
                  </TableCell>
                )}
                {isColumnVisible("properties") && (
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {attribute.isRequired && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          Required
                        </span>
                      )}
                      {attribute.isFilterable && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          Filterable
                        </span>
                      )}
                      {attribute.isGlobal && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          Global
                        </span>
                      )}
                    </div>
                  </TableCell>
                )}
                {isColumnVisible("values") && (
                  <TableCell>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                      {attribute.productAttributeValues?.length || 0}
                    </span>
                  </TableCell>
                )}
                {isColumnVisible("created") && (
                  <TableCell>
                    {new Date(attribute.createdAt).toLocaleDateString()}
                  </TableCell>
                )}
                {isColumnVisible("actions") && (
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
                          onClick={() => openEditDialog(attribute)}
                        >
                          <EditIcon className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setAttributeIdToDelete(attribute.id)}
                          className="text-red-600"
                        >
                          <TrashIcon className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </>
        }
        colSpan={columns.filter((col) => col.visible).length}
        isEmpty={attributes.length === 0}
        emptyMessage="No attributes found"
      />

      {/* Pagination */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={attributesTotalPages}
        onPageChange={handlePageChange}
      />

      <DeleteConfirmDialog
        open={attributeIdToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setAttributeIdToDelete(null);
        }}
        title="Delete Attribute"
        description="Are you sure you want to delete this attribute? This action cannot be undone."
        primaryLabel="Delete Attribute"
        onConfirm={() => {
          if (attributeIdToDelete !== null) {
            void handleDeleteAttribute(attributeIdToDelete);
          }
        }}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        title="Delete Multiple Attributes"
        description={`Are you sure you want to delete ${selectedAttributeIds.size} attribute${selectedAttributeIds.size !== 1 ? "s" : ""}? This action cannot be undone.`}
        primaryLabel={`Delete ${selectedAttributeIds.size} Attribute${selectedAttributeIds.size !== 1 ? "s" : ""}`}
        onConfirm={confirmBulkDelete}
      />

      {/* Create Attribute Dialog */}
      <EntityDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Create New Attribute"
        description="Add a new attribute to your product catalog."
        primaryLabel="Create Attribute"
        onPrimary={handleCreateAttribute}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="attribute_code"
              />
            </div>
            <div>
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                placeholder="Attribute Label"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dataType">Data Type</Label>
              <SelectType
                initialValue={formData.dataType}
                options={dataTypes.map((type) => ({
                  value: type.value,
                  name: type.label,
                }))}
                onValueChange={(value) =>
                  setFormData({ ...formData, dataType: value })
                }
              />
            </div>
            <div>
              <Label htmlFor="inputType">Input Type</Label>
              <SelectType
                initialValue={formData.inputType}
                options={inputTypes.map((type) => ({
                  value: type.value,
                  name: type.label,
                }))}
                onValueChange={(value) =>
                  setFormData({ ...formData, inputType: value })
                }
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isRequired"
                checked={formData.isRequired}
                onChange={(e) =>
                  setFormData({ ...formData, isRequired: e.target.checked })
                }
                className="rounded"
              />
              <Label htmlFor="isRequired">Required</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFilterable"
                checked={formData.isFilterable}
                onChange={(e) =>
                  setFormData({ ...formData, isFilterable: e.target.checked })
                }
                className="rounded"
              />
              <Label htmlFor="isFilterable">Filterable</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isGlobal"
                checked={formData.isGlobal}
                onChange={(e) =>
                  setFormData({ ...formData, isGlobal: e.target.checked })
                }
                className="rounded"
              />
              <Label htmlFor="isGlobal">Global</Label>
            </div>
          </div>
        </div>
      </EntityDialog>

      {/* Edit Attribute Dialog */}
      <EntityDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Attribute"
        description="Update attribute information."
        primaryLabel="Update Attribute"
        onPrimary={handleEditAttribute}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-code">Code</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="attribute_code"
              />
            </div>
            <div>
              <Label htmlFor="edit-label">Label</Label>
              <Input
                id="edit-label"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                placeholder="Attribute Label"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-dataType">Data Type</Label>
              <SelectType
                initialValue={formData.dataType}
                options={dataTypes.map((type) => ({
                  value: type.value,
                  name: type.label,
                }))}
                onValueChange={(value) =>
                  setFormData({ ...formData, dataType: value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-inputType">Input Type</Label>
              <SelectType
                initialValue={formData.inputType}
                options={inputTypes.map((type) => ({
                  value: type.value,
                  name: type.label,
                }))}
                onValueChange={(value) =>
                  setFormData({ ...formData, inputType: value })
                }
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isRequired"
                checked={formData.isRequired}
                onChange={(e) =>
                  setFormData({ ...formData, isRequired: e.target.checked })
                }
                className="rounded"
              />
              <Label htmlFor="edit-isRequired">Required</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isFilterable"
                checked={formData.isFilterable}
                onChange={(e) =>
                  setFormData({ ...formData, isFilterable: e.target.checked })
                }
                className="rounded"
              />
              <Label htmlFor="edit-isFilterable">Filterable</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isGlobal"
                checked={formData.isGlobal}
                onChange={(e) =>
                  setFormData({ ...formData, isGlobal: e.target.checked })
                }
                className="rounded"
              />
              <Label htmlFor="edit-isGlobal">Global</Label>
            </div>
          </div>
        </div>
      </EntityDialog>
    </PageLayout>
  );
}
