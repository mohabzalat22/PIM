import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  MoreHorizontalIcon,
  FilterIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type ProductAttributeValue from "@/interfaces/productAttributeValue.interface";

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

interface Filters {
  search: string;
  dataType: string;
  inputType: string;
  isFilterable: string;
  isGlobal: string;
  sortBy: string;
  sortOrder: string;
}

export default function Attribute() {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(
    null
  );
  const [filters, setFilters] = useState<Filters>({
    search: "",
    dataType: "",
    inputType: "",
    isFilterable: "",
    isGlobal: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [formData, setFormData] = useState({
    code: "",
    label: "",
    dataType: "STRING",
    inputType: "TEXT",
    isRequired: false,
    isFilterable: false,
    isGlobal: true,
  });

  const limit = 10;

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

  const fetchAttributes = async (
    page: number = 1,
    currentFilters: Filters = filters
  ) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy: currentFilters.sortBy,
        sortOrder: currentFilters.sortOrder,
      });

      if (currentFilters.search) params.append("search", currentFilters.search);
      if (currentFilters.dataType)
        params.append("dataType", currentFilters.dataType);
      if (currentFilters.inputType)
        params.append("inputType", currentFilters.inputType);
      if (currentFilters.isFilterable !== "")
        params.append("isFilterable", currentFilters.isFilterable);
      if (currentFilters.isGlobal !== "")
        params.append("isGlobal", currentFilters.isGlobal);

      const response = await axios.get(
        `http://localhost:3000/api/attributes?${params.toString()}`
      );

      setAttributes(response.data.data);
      setTotalPages(Math.ceil(response.data.meta.total / limit));
      setCurrentPage(page);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to load attributes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes(currentPage);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchAttributes(page);
    }
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchAttributes(1, newFilters);
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
    fetchAttributes(1, clearedFilters);
  };

  const handleCreateAttribute = async () => {
    try {
      await axios.post("http://localhost:3000/api/attributes", formData);
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
      fetchAttributes(currentPage);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to create attribute: ${error.message}`);
    }
  };

  const handleEditAttribute = async () => {
    if (!editingAttribute) return;

    try {
      await axios.put(
        `http://localhost:3000/api/attributes/${editingAttribute.id}`,
        formData
      );
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
      fetchAttributes(currentPage);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to update attribute: ${error.message}`);
    }
  };

  const handleDeleteAttribute = async (id: number) => {
    if (!confirm("Are you sure you want to delete this attribute?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/attributes/${id}`);
      toast.success("Attribute deleted successfully");
      fetchAttributes(currentPage);
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

  if (loading && attributes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-blue-500">Loading attributes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-full p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Attributes</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Attribute
        </Button>
      </div>

      {/* Filters */}
      <div className="border rounded-lg p-4 bg-slate-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FilterIcon className="w-4 h-4" />
            <span className="font-medium">Filters</span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <XIcon className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by code or label..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="min-w-[150px]">
            <Select
              value={filters.dataType}
              onValueChange={(value) => handleFilterChange("dataType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Data Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {dataTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value || "none"}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[150px]">
            <Select
              value={filters.inputType}
              onValueChange={(value) => handleFilterChange("inputType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Input Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Input Types</SelectItem>
                {inputTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value || "none"}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-4 pt-4 border-t">
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
                onValueChange={(value) => handleFilterChange("isGlobal", value)}
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
                onValueChange={(value) => handleFilterChange("sortBy", value)}
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
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Data Type</TableHead>
              <TableHead>Input Type</TableHead>
              <TableHead>Properties</TableHead>
              <TableHead>Values</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attributes.length > 0 ? (
              attributes.map((attribute) => (
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
                          onClick={() => handleDeleteAttribute(attribute.id)}
                          className="text-red-600"
                        >
                          <TrashIcon className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  No attributes found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="flex justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
                className={
                  currentPage === 1 ? "opacity-50 pointer-events-none" : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={() => handlePageChange(page)}
                    className={
                      page === currentPage ? "bg-blue-600 text-white" : ""
                    }
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
                className={
                  currentPage === totalPages
                    ? "opacity-50 pointer-events-none"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Create Attribute Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Attribute</DialogTitle>
            <DialogDescription>
              Add a new attribute to your product catalog.
            </DialogDescription>
          </DialogHeader>
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
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateAttribute}>Create Attribute</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Attribute Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Attribute</DialogTitle>
            <DialogDescription>Update attribute information.</DialogDescription>
          </DialogHeader>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAttribute}>Update Attribute</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
