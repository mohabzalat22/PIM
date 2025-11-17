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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  MoreHorizontalIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
  EyeIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SelectType } from "@/components/app/select-type";
import { MultiSelectType } from "@/components/app/multiselect-type";
import { DateType } from "@/components/app/date-type";
import { PageLayout } from "@/components/app/PageLayout";
import { FilterPanel } from "@/components/app/FilterPanel";
import { DataTable } from "@/components/app/DataTable";
import { EntityDialog } from "@/components/app/EntityDialog";
import Loading from "@/components/app/loading";
import { DeleteConfirmDialog } from "@/components/app/DeleteConfirmDialog";
import type ProductInterface from "@/interfaces/product.interface";
import type Attribute from "@/interfaces/attribute.interface";
import type Filters from "@/interfaces/products.filters.interface";
import { useCategories } from "@/hooks/useCategories";
import { useAttributes } from "@/hooks/useAttributes";
import { useProducts } from "@/hooks/useProducts";
import { ProductService } from "@/services/product.service";
import type Category from "@/interfaces/category.interface";

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
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [
    products,
    productsLoading,
    productsError,
    productsTotalPages,
    refetchProducts,
  ] = useProducts(currentPage, limit, filters);
  const [categories, categoriesLoading, categoriesError] =
    useCategories<Category>(currentPage, limit);
  const [attributes, attributesLoading, attributesError] = useAttributes<Attribute>(
    currentPage,
    limit
  );

  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ProductInterface | null>(
    null
  );
  const [productIdToDelete, setProductIdToDelete] = useState<number | null>(null);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState<boolean>(false);

  // Bulk actions state
  const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(
    new Set()
  );

  // Column visibility state
  const [columns, setColumns] = useState<Column[]>([
    { id: "checkbox", label: "Select", visible: true, locked: true },
    { id: "id", label: "ID", visible: true, locked: false },
    { id: "sku", label: "SKU", visible: true, locked: true },
    { id: "type", label: "Type", visible: true, locked: false },
    { id: "categories", label: "Categories", visible: true, locked: false },
    { id: "attributes", label: "Attributes", visible: true, locked: false },
    { id: "created", label: "Created", visible: true, locked: false },
    { id: "actions", label: "Actions", visible: true, locked: true },
  ]);

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

  const isLoading =
    productsLoading || categoriesLoading || attributesLoading;

  const [showPageLoader, setShowPageLoader] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setShowPageLoader(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (productsError) {
      toast.error(`Failed to load products: ${productsError.message}`);
    }
  }, [productsError]);

  useEffect(() => {
    if (categoriesError) {
      toast.error(`Failed to load categories: ${categoriesError.message}`);
    }
  }, [categoriesError]);

  useEffect(() => {
    if (attributesError) {
      toast.error(`Failed to load attributes: ${attributesError.message}`);
    }
  }, [attributesError]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= productsTotalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
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
    setCurrentPage(1);
  };

  // Clear selections when page or filters change
  useEffect(() => {
    setSelectedProductIds(new Set());
  }, [currentPage, filters]);

  // Bulk action handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked && products) {
      const allIds = new Set(products.map((p) => p.id));
      setSelectedProductIds(allIds);
    } else {
      setSelectedProductIds(new Set());
    }
  };

  const handleSelectProduct = (productId: number, checked: boolean) => {
    const newSelected = new Set(selectedProductIds);
    if (checked) {
      newSelected.add(productId);
    } else {
      newSelected.delete(productId);
    }
    setSelectedProductIds(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedProductIds.size === 0) return;
    
    // Open confirmation dialog
    setShowBulkDeleteDialog(true);
  };

  const confirmBulkDelete = async () => {
    try {
      const deletePromises = Array.from(selectedProductIds).map((id) =>
        ProductService.remove(id)
      );
      await Promise.all(deletePromises);
      await refetchProducts();
      const count = selectedProductIds.size;
      setSelectedProductIds(new Set());
      toast.success(`Successfully deleted ${count} product${count > 1 ? "s" : ""}`);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to delete products: ${error.message}`);
    }
  };

  const handleClearSelection = () => {
    setSelectedProductIds(new Set());
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

  if (showPageLoader && isLoading) {
    return <Loading />;
  }

  const handleCreateProduct = async () => {
    try {
      await ProductService.create(formData);
      await refetchProducts();
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
      await ProductService.update(editingProduct.id, formData);
      await refetchProducts();
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
    try {
      await ProductService.remove(id);
      await refetchProducts();
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
    <PageLayout
      title="Products"
      actions={
        <div className="flex items-center gap-2">
          <ColumnSelector columns={columns} onColumnChange={handleColumnChange} />
          <Button onClick={() => setShowCreateDialog(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      }
    >
      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedProductIds.size}
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
        }
        advancedFilters={
          <div className="space-y-4">
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
                        attr.isFilterable && attr.inputType !== "MEDIA"
                    )
                    .map((attribute) => {
                      const filterComponent = renderFilterComponent(attribute);
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
                    products && products.length > 0 && 
                    products.every((p) => selectedProductIds.has(p.id))
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
            )}
            {isColumnVisible("id") && <TableHead className="w-[100px]">ID</TableHead>}
            {isColumnVisible("sku") && <TableHead>SKU</TableHead>}
            {isColumnVisible("type") && <TableHead>Type</TableHead>}
            {isColumnVisible("categories") && <TableHead>Categories</TableHead>}
            {isColumnVisible("attributes") && <TableHead>Attributes</TableHead>}
            {isColumnVisible("created") && <TableHead>Created</TableHead>}
            {isColumnVisible("actions") && <TableHead className="w-[100px]">Actions</TableHead>}
          </>
        }
        rows={
          <>
            {products?.map((product) => (
              <TableRow key={product.id}>
                {isColumnVisible("checkbox") && (
                  <TableCell>
                    <Checkbox
                      checked={selectedProductIds.has(product.id)}
                      onCheckedChange={(checked) =>
                        handleSelectProduct(product.id, checked as boolean)
                      }
                    />
                  </TableCell>
                )}
                {isColumnVisible("id") && (
                  <TableCell className="font-medium">{product.id}</TableCell>
                )}
                {isColumnVisible("sku") && <TableCell>{product.sku}</TableCell>}
                {isColumnVisible("type") && (
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {product.type}
                    </span>
                  </TableCell>
                )}
                {isColumnVisible("categories") && (
                  <TableCell>
                    {product.productCategories?.length || 0} categories
                  </TableCell>
                )}
                {isColumnVisible("attributes") && (
                  <TableCell>
                    {product.productAttributeValues?.length || 0} attributes
                  </TableCell>
                )}
                {isColumnVisible("created") && (
                  <TableCell>
                    {new Date(product.createdAt).toLocaleDateString()}
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
                          onClick={() => setProductIdToDelete(product.id)}
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
        isEmpty={!products || products.length === 0}
        emptyMessage="No products found"
      />

      {/* Pagination */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={productsTotalPages}
        onPageChange={handlePageChange}
      />

      <DeleteConfirmDialog
        open={productIdToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setProductIdToDelete(null);
        }}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        primaryLabel="Delete Product"
        onConfirm={() => {
          if (productIdToDelete !== null) {
            void handleDeleteProduct(productIdToDelete);
          }
        }}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        title="Delete Multiple Products"
        description={`Are you sure you want to delete ${selectedProductIds.size} product${selectedProductIds.size !== 1 ? "s" : ""}? This action cannot be undone.`}
        primaryLabel={`Delete ${selectedProductIds.size} Product${selectedProductIds.size !== 1 ? "s" : ""}`}
        onConfirm={confirmBulkDelete}
      />

      {/* Create Product Dialog */}
      <EntityDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Create New Product"
        description="Add a new product to your inventory."
        primaryLabel="Create Product"
        onPrimary={handleCreateProduct}
      >
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
      </EntityDialog>

      {/* Edit Product Dialog */}
      <EntityDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Product"
        description="Update product information."
        primaryLabel="Update Product"
        onPrimary={handleEditProduct}
      >
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
      </EntityDialog>
    </PageLayout>
  );
}
