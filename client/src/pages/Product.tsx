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
import { useNavigate } from "react-router-dom";
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
  EyeIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SelectType } from "@/components/app/select-type";
import { MultiSelectType } from "@/components/app/multiselect-type";
import { DateType } from "@/components/app/date-type";
import type ProductInterface from "@/interfaces/product.interface";
import type Attribute from "@/interfaces/attribute.interface";
import type Filters from "@/interfaces/products.filters.interface";
import { useCategories } from "@/hooks/useCategories";
import { useAttributes } from "@/hooks/useAttributes";
import { useProducts } from "@/hooks/useProducts";

export default function Product() {
  const navigate = useNavigate();
  const limit = 10;

  const [filters, setFilters] = useState<Filters>({
    search: "",
    type: "",
    categoryId: "",
    attributeFilters: {},
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [products, productsLoading, productsError] = useProducts(
    currentPage,
    limit,
    filters
  );
  const [categories, categoriesLoading, categoriesError] = useCategories();
  const [attributes, attributesLoading, attributesError] = useAttributes();

  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ProductInterface | null>(
    null
  );

  const [formData, setFormData] = useState({
    sku: "",
    type: "SIMPLE",
  });

  const productTypes = [
    { value: "SIMPLE", label: "Simple" },
    { value: "CONFIGURABLE", label: "Configurable" },
    { value: "BUNDLE", label: "Bundle" },
    { value: "VIRTUAL", label: "Virtual" },
    { value: "DOWNLOADABLE", label: "Downloadable" },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleAttributeFilterChange = (
    attributeCode: string,
    value: string | string[],
    isMultiSelect: boolean = false
  ) => {
    const newAttributeFilters = { ...filters.attributeFilters };

    if (isMultiSelect && Array.isArray(value)) {
      const valueArray = value.map((v) => v.trim()).filter((v) => v !== "");
      if (valueArray.length > 0) {
        newAttributeFilters[attributeCode] = JSON.stringify(valueArray);
      } else {
        delete newAttributeFilters[attributeCode];
      }
      const newFilters = { ...filters, attributeFilters: newAttributeFilters };
      setFilters(newFilters);
      return;
    } else {
      if (value && !Array.isArray(value) && value.trim() !== "") {
        newAttributeFilters[attributeCode] = value;
      } else {
        delete newAttributeFilters[attributeCode];
      }
      const newFilters = { ...filters, attributeFilters: newAttributeFilters };
      setFilters(newFilters);
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      type: "",
      categoryId: "",
      attributeFilters: {},
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(clearedFilters);
  };

  const handleCreateProduct = async () => {
    try {
      await axios.post("http://localhost:3000/api/products", formData);
      toast.success("Product created successfully");
      setShowCreateDialog(false);
      setFormData({ sku: "", type: "SIMPLE" });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to create product: ${error.message}`);
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;

    try {
      await axios.put(
        `http://localhost:3000/api/products/${editingProduct.id}`,
        formData
      );
      toast.success("Product updated successfully");
      setShowEditDialog(false);
      setEditingProduct(null);
      setFormData({ sku: "", type: "SIMPLE" });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to update product: ${error.message}`);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const productDeleted = await axios.delete(
        `http://localhost:3000/api/products/${id}`
      );
      if (!productDeleted.data.success) {
        throw new Error(productDeleted.data.message);
      }
      toast.success("Product deleted successfully");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to delete product: ${error.message}`);
    }
  };

  const openEditDialog = (product: ProductInterface) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku,
      type: product.type,
    });
    setShowEditDialog(true);
  };

  const renderFilterComponent = (attribute: Attribute) => {
    switch (attribute.inputType) {
      case "TEXT":
        return (
          <Input
            type="text"
            value={filters.attributeFilters[attribute.code] || ""}
            onChange={(e) =>
              handleAttributeFilterChange(attribute.code, e.target.value)
            }
            placeholder={attribute.label}
          />
        );
      case "SELECT":
        return (
          <SelectType
            initialValue={filters.attributeFilters[attribute.code] || "all"} // use current filter or default
            options={[
              { name: "all", value: "all" }, // optional default
              ...attribute.productAttributeValues
                .map((element) => {
                  const value =
                    element.valueString ??
                    element.valueText ??
                    element.valueInt?.toString() ??
                    element.valueDecimal?.toString() ??
                    element.valueBoolean?.toString();
                  if (value) return { name: value, value };
                  return null;
                })
                .filter(
                  (item): item is { name: string; value: string } =>
                    item !== null
                ),
            ]}
            onValueChange={(value) =>
              handleAttributeFilterChange(
                attribute.code,
                value === "all" ? "" : value
              )
            }
          />
        );

      case "MULTISELECT":
        return (
          <MultiSelectType
            options={attribute.productAttributeValues
              .map((element) => {
                const value =
                  element.valueString ??
                  element.valueText ??
                  element.valueInt?.toString() ??
                  element.valueDecimal?.toString() ??
                  element.valueBoolean?.toString();
                if (value) {
                  return { name: value, value: value };
                }

                return null;
              })
              .filter(
                (item): item is { name: string; value: string } => item !== null
              )}
            onValueChange={(values) =>
              handleAttributeFilterChange(attribute.code, values, true)
            }
          />
        );
      case "MEDIA":
        // Media attributes are not filterable - they store file references, not filterable values
        return null;
      case "DATE":
        return (
          <DateType
            initialValue={filters.attributeFilters[attribute.code] || ""}
            onValueChange={(value) =>
              handleAttributeFilterChange(attribute.code, value)
            }
            placeholder={attribute.label}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-full p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Product
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
                placeholder="Search by SKU..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="min-w-[150px]">
            <SelectType
              initialValue={filters.type || "all"}
              options={[
                { name: "All Types", value: "all" },
                ...Object.entries(productTypes).map(([, type]) => ({
                  name: type.label,
                  value: type.value,
                })),
              ]}
              onValueChange={(value) =>
                handleFilterChange("type", value === "all" ? "" : value)
              }
            />
          </div>
          <div className="min-w-[150px]">
            {categories && (
              <SelectType
                initialValue={filters.categoryId || "all"}
                options={[
                  { name: "All Categories", value: "all" },
                  ...categories.map((category) => ({
                    name:
                      category.translations?.[0]?.name ||
                      `Category ${category.id}`,
                    value: category.id.toString(),
                  })),
                ]}
                onValueChange={(value) =>
                  handleFilterChange("categoryId", value === "all" ? "" : value)
                }
              />
            )}
          </div>
        </div>

        {showFilters && (
          <div className="space-y-4 pt-4 border-t">
            {/* Attribute Filters */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Attribute Filters
              </Label>
              {attributes && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {attributes
                    .filter(
                      (attr) =>
                        // Exclude MEDIA: Media attributes store file references and should never be filterable
                        // (aligns with Magento's behavior - media attributes are excluded from layered navigation)
                        //
                        // DATE attributes are now supported for filtering with date range support
                        attr.isFilterable && attr.inputType !== "MEDIA"
                    )
                    .map((attribute) => {
                      const filterComponent = renderFilterComponent(attribute);
                      // Only render if the component returns something (exclude null returns)
                      if (!filterComponent) return null;

                      return (
                        <div key={attribute.id} className="space-y-1">
                          <Label className="text-xs text-gray-600">
                            {attribute.label}
                          </Label>
                          {filterComponent}
                        </div>
                      );
                    })
                    .filter(Boolean)}
                </div>
              )}
            </div>

            {/* Sort Options */}
            <div className="flex flex-wrap gap-4">
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
                    <SelectItem value="sku">SKU</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
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
          </div>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Attributes</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {product.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    {product.productCategories?.length || 0} categories
                  </TableCell>
                  <TableCell>
                    {product.productAttributeValues?.length || 0} attributes
                  </TableCell>
                  <TableCell>
                    {new Date(product.createdAt).toLocaleDateString()}
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
                          onClick={() => navigate(`/products/${product.id}`)}
                        >
                          <EyeIcon className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openEditDialog(product)}
                        >
                          <EditIcon className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteProduct(product.id)}
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
                <TableCell colSpan={7} className="text-center py-8">
                  No products found
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
                onClick={() => currentPage > 1}
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
                onClick={() => currentPage < totalPages}
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

      {/* Create Product Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
            <DialogDescription>
              Add a new product to your inventory.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                placeholder="Enter product SKU"
              />
            </div>
            <div>
              <Label htmlFor="type">Product Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {productTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateProduct}>Create Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-sku">SKU</Label>
              <Input
                id="edit-sku"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                placeholder="Enter product SKU"
              />
            </div>
            <div>
              <Label htmlFor="edit-type">Product Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {productTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct}>Update Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
