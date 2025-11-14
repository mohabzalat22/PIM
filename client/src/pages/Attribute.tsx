import { TableCell, TableHead, TableRow } from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { PaginationBar } from "@/components/app/PaginationBar";

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
  const [totalPages, setTotalPages] = useState<number>(1);
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

  useEffect(() => {
    if (attributesError) {
      toast.error(`Failed to load attributes: ${attributesError.message}`);
    }
  }, [attributesError]);

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
      dataType: "",
      inputType: "",
      isFilterable: "",
      isGlobal: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(clearedFilters);
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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <PageLayout
      title="Attributes"
      actions={
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Attribute
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
              <Select
                value={filters.isFilterable}
                onValueChange={(value) =>
                  handleFilterChange("isFilterable", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filterable" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[150px]">
              <Label className="text-sm font-medium">Global</Label>
              <Select
                value={filters.isGlobal}
                onValueChange={(value) =>
                  handleFilterChange("isGlobal", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Global" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[150px]">
              <Label className="text-sm font-medium">Sort By</Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  handleFilterChange("sortBy", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="code">Code</SelectItem>
                  <SelectItem value="label">Label</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[150px]">
              <Label className="text-sm font-medium">Order</Label>
              <Select
                value={filters.sortOrder}
                onValueChange={(value) =>
                  handleFilterChange("sortOrder", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
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
            <TableHead>Label</TableHead>
            <TableHead>Data Type</TableHead>
            <TableHead>Input Type</TableHead>
            <TableHead>Properties</TableHead>
            <TableHead>Values</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </>
        }
        rows={
          <>
            {attributes.map((attribute) => (
              <TableRow key={attribute.id}>
                <TableCell className="font-medium">{attribute.id}</TableCell>
                <TableCell>
                  <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                    {attribute.code}
                  </code>
                </TableCell>
                <TableCell>{attribute.label || "-"}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {attribute.dataType}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    {attribute.inputType}
                  </span>
                </TableCell>
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
                <TableCell>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                    {attribute.productAttributeValues?.length || 0}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(attribute.createdAt).toLocaleDateString()}
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
              </TableRow>
            ))}
          </>
        }
        colSpan={9}
        isEmpty={attributes.length === 0}
        emptyMessage="No attributes found"
      />

      {/* Pagination */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
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
              <Select
                value={formData.dataType}
                onValueChange={(value) =>
                  setFormData({ ...formData, dataType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dataTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="inputType">Input Type</Label>
              <Select
                value={formData.inputType}
                onValueChange={(value) =>
                  setFormData({ ...formData, inputType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {inputTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Select
                value={formData.dataType}
                onValueChange={(value) =>
                  setFormData({ ...formData, dataType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dataTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-inputType">Input Type</Label>
              <Select
                value={formData.inputType}
                onValueChange={(value) =>
                  setFormData({ ...formData, inputType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {inputTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
