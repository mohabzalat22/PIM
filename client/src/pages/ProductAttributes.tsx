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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  MoreHorizontalIcon, 
  PlusIcon, 
  EditIcon, 
  TrashIcon,
  SearchIcon,
  TagIcon,
  PackageIcon,
  EyeIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SelectType } from "@/components/app/select-type";
import { PageLayout } from "@/components/app/PageLayout";
import { FilterPanel } from "@/components/app/FilterPanel";
import { DataTable } from "@/components/app/DataTable";
import { EntityDialog } from "@/components/app/EntityDialog";
import Loading from "@/components/app/loading";
import { DeleteConfirmDialog } from "@/components/app/DeleteConfirmDialog";
import type ProductAttributeValue from "@/interfaces/productAttributes/productAttributevalue.interface";
import type Filters from "@/interfaces/productAttributes/filters.interface";
import type AttributeData from "@/interfaces/productAttributes/attributes.data.interface";
import { useProductAttributeValues } from "@/hooks/useProductAttributeValues";
import { useProducts } from "@/hooks/useProducts";
import { useAttributes } from "@/hooks/useAttributes";
import { useStoreViews } from "@/hooks/useStoreViews";
import type Attribute from "@/interfaces/attribute.interface";
import type StoreView from "@/interfaces/storeView.interface";
import { ProductAttributeValueService } from "@/services/productAttributeValue.service";

export default function ProductAttributes() {
  const navigate = useNavigate();
  const limit = 10;

  const [filters, setFilters] = useState<Filters>({
    search: '',
    productId: '',
    attributeId: '',
    storeViewId: '',
    dataType: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [
    productAttributeValues,
    productAttributeValuesLoading,
    ,
    productAttributeValuesTotalPages,
    refetchProductAttributeValues,
  ] = useProductAttributeValues(currentPage, limit, filters);
  const [products, productsLoading] = useProducts(currentPage, limit);
  const [attributes, attributesLoading] = useAttributes<Attribute>(currentPage, limit);

  const [storeViews, storeViewsLoading] = useStoreViews<StoreView>(currentPage,limit);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [editingProductAttribute, setEditingProductAttribute] =
    useState<ProductAttributeValue | null>(null);
  const [productAttributeIdToDelete, setProductAttributeIdToDelete] =
    useState<number | null>(null);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState<boolean>(false);

  // Bulk actions state
  const [selectedProductAttributeIds, setSelectedProductAttributeIds] = useState<Set<number>>(
    new Set()
  );

  // Column visibility state
  const [columns, setColumns] = useState<Column[]>([
    { id: "checkbox", label: "Select", visible: true, locked: true },
    { id: "id", label: "ID", visible: true, locked: false },
    { id: "product", label: "Product", visible: true, locked: true },
    { id: "attribute", label: "Attribute", visible: true, locked: true },
    { id: "value", label: "Value", visible: true, locked: false },
    { id: "dataType", label: "Data Type", visible: true, locked: false },
    { id: "storeView", label: "Store View", visible: true, locked: false },
    { id: "created", label: "Created", visible: true, locked: false },
    { id: "actions", label: "Actions", visible: true, locked: true },
  ]);

  const [formData, setFormData] = useState({
    productId: '',
    attributeId: '',
    storeViewId: '',
    valueString: '',
    valueText: '',
    valueInt: '',
    valueDecimal: '',
    valueBoolean: false
  });


  const dataTypes = [
    { value: 'STRING', label: 'String' },
    { value: 'TEXT', label: 'Text' },
    { value: 'INTEGER', label: 'Integer' },
    { value: 'DECIMAL', label: 'Decimal' },
    { value: 'BOOLEAN', label: 'Boolean' }
  ];


  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= productAttributeValuesTotalPages) {
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
      search: '',
      productId: '',
      attributeId: '',
      storeViewId: '',
      dataType: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
  };

  // Clear selections when page or filters change
  useEffect(() => {
    setSelectedProductAttributeIds(new Set());
  }, [currentPage, filters]);

  // Bulk action handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked && productAttributeValues) {
      const allIds = new Set(productAttributeValues.map((p) => p.id));
      setSelectedProductAttributeIds(allIds);
    } else {
      setSelectedProductAttributeIds(new Set());
    }
  };

  const handleSelectProductAttribute = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedProductAttributeIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedProductAttributeIds(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedProductAttributeIds.size === 0) return;
    
    // Open confirmation dialog
    setShowBulkDeleteDialog(true);
  };

  const confirmBulkDelete = async () => {
    try {
      const deletePromises = Array.from(selectedProductAttributeIds).map((id) =>
        ProductAttributeValueService.remove(id)
      );
      await Promise.all(deletePromises);
      await refetchProductAttributeValues();
      const count = selectedProductAttributeIds.size;
      setSelectedProductAttributeIds(new Set());
      toast.success(`Successfully deleted ${count} product attribute${count > 1 ? "s" : ""}`);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to delete product attributes: ${error.message}`);
    }
  };

  const handleClearSelection = () => {
    setSelectedProductAttributeIds(new Set());
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

  const handleCreateProductAttribute = async () => {
    try {
      const selectedAttribute = attributes.find(
        (attr) => attr.id.toString() === formData.attributeId
      );
      if (!selectedAttribute) {
        toast.error('Please select an attribute');
        return;
      }

      const attributeData: AttributeData = {
        productId: parseInt(formData.productId),
        attributeId: parseInt(formData.attributeId),
        storeViewId: parseInt(formData.storeViewId)
      };

      // Add value based on data type
      switch (selectedAttribute.dataType) {
        case 'STRING':
          attributeData.valueString = formData.valueString;
          break;
        case 'TEXT':
          attributeData.valueText = formData.valueText;
          break;
        case 'INTEGER':
          attributeData.valueInt = parseInt(formData.valueInt) || 0;
          break;
        case 'DECIMAL':
          attributeData.valueDecimal = parseFloat(formData.valueDecimal) || 0;
          break;
        case 'BOOLEAN':
          attributeData.valueBoolean = formData.valueBoolean;
          break;
      }

      await ProductAttributeValueService.create(attributeData);
      await refetchProductAttributeValues();
      toast.success('Product attribute assigned successfully');
      setShowCreateDialog(false);
      resetFormData();
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to assign attribute: ${error.message}`);
    }
  };

  const handleEditProductAttribute = async () => {
    if (!editingProductAttribute) return;

    try {
      const selectedAttribute = attributes.find(attr => attr.id.toString() === formData.attributeId);
      if (!selectedAttribute) {
        toast.error('Please select an attribute');
        return;
      }

      const attributeData: AttributeData = {
        productId: parseInt(formData.productId),
        attributeId: parseInt(formData.attributeId),
        storeViewId: parseInt(formData.storeViewId)
      };

      // Add value based on data type
      switch (selectedAttribute.dataType) {
        case 'STRING':
          attributeData.valueString = formData.valueString;
          break;
        case 'TEXT':
          attributeData.valueText = formData.valueText;
          break;
        case 'INTEGER':
          attributeData.valueInt = parseInt(formData.valueInt) || 0;
          break;
        case 'DECIMAL':
          attributeData.valueDecimal = parseFloat(formData.valueDecimal) || 0;
          break;
        case 'BOOLEAN':
          attributeData.valueBoolean = formData.valueBoolean;
          break;
      }

      await ProductAttributeValueService.update(
        editingProductAttribute.id,
        attributeData
      );
      await refetchProductAttributeValues();
      toast.success('Product attribute updated successfully');
      setShowEditDialog(false);
      setEditingProductAttribute(null);
      resetFormData();
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to update attribute: ${error.message}`);
    }
  };

  const handleDeleteProductAttribute = async (id: number) => {
    try {
      await ProductAttributeValueService.remove(id);
      await refetchProductAttributeValues();
      toast.success('Product attribute deleted successfully');
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to delete product attribute: ${error.message}`);
    }
  };

  const openEditDialog = (productAttribute: ProductAttributeValue) => {
    setEditingProductAttribute(productAttribute);
    setFormData({
      productId: productAttribute.productId.toString(),
      attributeId: productAttribute.attributeId.toString(),
      storeViewId: productAttribute.storeViewId.toString(),
      valueString: productAttribute.valueString || '',
      valueText: productAttribute.valueText || '',
      valueInt: productAttribute.valueInt?.toString() || '',
      valueDecimal: productAttribute.valueDecimal?.toString() || '',
      valueBoolean: productAttribute.valueBoolean || false
    });
    setShowEditDialog(true);
  };

  const resetFormData = () => {
    setFormData({
      productId: '',
      attributeId: '',
      storeViewId: '',
      valueString: '',
      valueText: '',
      valueInt: '',
      valueDecimal: '',
      valueBoolean: false
    });
  };

  const getAttributeValue = (productAttribute: ProductAttributeValue) => {
    if (productAttribute.valueString) return productAttribute.valueString;
    if (productAttribute.valueText) return productAttribute.valueText;
    if (productAttribute.valueInt !== null && productAttribute.valueInt !== undefined) return productAttribute.valueInt.toString();
    if (productAttribute.valueDecimal !== null && productAttribute.valueDecimal !== undefined) return productAttribute.valueDecimal.toString();
    if (productAttribute.valueBoolean !== null && productAttribute.valueBoolean !== undefined) return productAttribute.valueBoolean ? 'Yes' : 'No';
    return 'No value';
  };

  const getDataTypeColor = (dataType: string) => {
    switch (dataType) {
      case 'STRING': return 'bg-blue-100 text-blue-800';
      case 'TEXT': return 'bg-green-100 text-green-800';
      case 'INTEGER': return 'bg-purple-100 text-purple-800';
      case 'DECIMAL': return 'bg-orange-100 text-orange-800';
      case 'BOOLEAN': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isLoading =
    productAttributeValuesLoading ||
    productsLoading ||
    attributesLoading ||
    storeViewsLoading;

  const [showPageLoader, setShowPageLoader] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setShowPageLoader(false);
    }
  }, [isLoading]);

  if (showPageLoader && isLoading) {
    return <Loading />;
  }

  return (
    <PageLayout
      title="Product Attributes"
      actions={
        <div className="flex items-center gap-2">
          <ColumnSelector columns={columns} onColumnChange={handleColumnChange} />
          <Button onClick={() => setShowCreateDialog(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Assign Attribute
          </Button>
        </div>
      }
    >
      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedProductAttributeIds.size}
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
                  placeholder="Search by product SKU or attribute..."
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
                initialValue={filters.productId || "all"}
                options={[
                  { name: "All Products", value: "all" },
                  ...products.map((product) => ({
                    name: product.sku,
                    value: product.id.toString(),
                  })),
                ]}
                onValueChange={(value) =>
                  handleFilterChange("productId", value === "all" ? "" : value)
                }
              />
            </div>
            <div className="min-w-[150px]">
              <SelectType
                initialValue={filters.attributeId || "all"}
                options={[
                  { name: "All Attributes", value: "all" },
                  ...attributes.map((attribute) => ({
                    name: attribute.label,
                    value: attribute.id.toString(),
                  })),
                ]}
                onValueChange={(value) =>
                  handleFilterChange("attributeId", value === "all" ? "" : value)
                }
              />
            </div>
            <div className="min-w-[150px]">
              <SelectType
                initialValue={filters.storeViewId || "all"}
                options={[
                  { name: "All Store Views", value: "all" },
                  ...storeViews.map((storeView) => ({
                    name: storeView.name,
                    value: storeView.id.toString(),
                  })),
                ]}
                onValueChange={(value) =>
                  handleFilterChange(
                    "storeViewId",
                    value === "all" ? "" : value
                  )
                }
              />
            </div>
            <div className="min-w-[150px]">
              <SelectType
                initialValue={filters.dataType || "all"}
                options={[
                  { name: "All Data Types", value: "all" },
                  ...dataTypes.map((type) => ({
                    name: type.label,
                    value: type.value,
                  })),
                ]}
                onValueChange={(value) =>
                  handleFilterChange("dataType", value === "all" ? "" : value)
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
                onChange={(e) =>
                  handleFilterChange("sortBy", e.target.value)
                }
                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="createdAt">Created Date</option>
                <option value="productId">Product</option>
                <option value="attributeId">Attribute</option>
                <option value="storeViewId">Store View</option>
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
            {isColumnVisible("checkbox") && (
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    productAttributeValues && productAttributeValues.length > 0 && 
                    productAttributeValues.every((p) => selectedProductAttributeIds.has(p.id))
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
            )}
            {isColumnVisible("id") && <TableHead className="w-[100px]">ID</TableHead>}
            {isColumnVisible("product") && <TableHead>Product</TableHead>}
            {isColumnVisible("attribute") && <TableHead>Attribute</TableHead>}
            {isColumnVisible("value") && <TableHead>Value</TableHead>}
            {isColumnVisible("dataType") && <TableHead>Data Type</TableHead>}
            {isColumnVisible("storeView") && <TableHead>Store View</TableHead>}
            {isColumnVisible("created") && <TableHead>Created</TableHead>}
            {isColumnVisible("actions") && <TableHead className="w-[100px]">Actions</TableHead>}
          </>
        }
        rows={
          <>
            {productAttributeValues?.map((productAttribute) => (
              <TableRow key={productAttribute.id}>
                {isColumnVisible("checkbox") && (
                  <TableCell>
                    <Checkbox
                      checked={selectedProductAttributeIds.has(productAttribute.id)}
                      onCheckedChange={(checked) =>
                        handleSelectProductAttribute(productAttribute.id, checked as boolean)
                      }
                    />
                  </TableCell>
                )}
                {isColumnVisible("id") && (
                  <TableCell className="font-medium">
                    {productAttribute.id}
                  </TableCell>
                )}
                {isColumnVisible("product") && (
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <PackageIcon className="w-4 h-4 text-blue-500" />
                      <button
                        onClick={() =>
                          navigate(`/products/${productAttribute.productId}`)
                        }
                        className="font-mono text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {productAttribute.product?.sku}
                      </button>
                    </div>
                  </TableCell>
                )}
                {isColumnVisible("attribute") && (
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <TagIcon className="w-4 h-4 text-green-500" />
                      <span>{productAttribute.attribute?.label}</span>
                      <code className="px-1 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                        {productAttribute.attribute?.code}
                      </code>
                    </div>
                  </TableCell>
                )}
                {isColumnVisible("value") && (
                  <TableCell>
                    <span className="font-medium">
                      {getAttributeValue(productAttribute)}
                    </span>
                  </TableCell>
                )}
                {isColumnVisible("dataType") && (
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getDataTypeColor(
                        productAttribute.attribute?.dataType || ""
                      )}`}
                    >
                      {productAttribute.attribute?.dataType}
                    </span>
                  </TableCell>
                )}
                {isColumnVisible("storeView") && (
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <EyeIcon className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">
                        {productAttribute.storeView?.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({productAttribute.storeView?.locale?.value})
                      </span>
                    </div>
                  </TableCell>
                )}
                {isColumnVisible("created") && (
                  <TableCell>
                    {new Date(productAttribute.createdAt).toLocaleDateString()}
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
                          onClick={() =>
                            navigate(`/products/${productAttribute.productId}`)
                          }
                        >
                          <EyeIcon className="w-4 h-4 mr-2" />
                          View Product
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openEditDialog(productAttribute)}
                        >
                          <EditIcon className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setProductAttributeIdToDelete(productAttribute.id)
                          }
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
        isEmpty={!productAttributeValues || productAttributeValues.length === 0}
        emptyMessage="No product attributes found"
      />

      {/* Pagination */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={productAttributeValuesTotalPages}
        onPageChange={handlePageChange}
      />

      <DeleteConfirmDialog
        open={productAttributeIdToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setProductAttributeIdToDelete(null);
        }}
        title="Delete Product Attribute"
        description="Are you sure you want to delete this product attribute? This action cannot be undone."
        primaryLabel="Delete Product Attribute"
        onConfirm={() => {
          if (productAttributeIdToDelete !== null) {
            void handleDeleteProductAttribute(productAttributeIdToDelete);
          }
        }}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        title="Delete Multiple Product Attributes"
        description={`Are you sure you want to delete ${selectedProductAttributeIds.size} product attribute${selectedProductAttributeIds.size !== 1 ? "s" : ""}? This action cannot be undone.`}
        primaryLabel={`Delete ${selectedProductAttributeIds.size} Product Attribute${selectedProductAttributeIds.size !== 1 ? "s" : ""}`}
        onConfirm={confirmBulkDelete}
      />

      {/* Create Product Attribute Dialog */}
      <EntityDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Assign Attribute to Product"
        description="Assign an attribute with a value to a product for a specific store view."
        primaryLabel="Assign Attribute"
        onPrimary={handleCreateProductAttribute}
        contentClassName="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="productId">Product</Label>
              <SelectType
                options={products.map((product) => ({
                  value: product.id.toString() || "none",
                  name: `${product.sku} (${product.type})`,
                }))}
                onValueChange={(value) =>
                  setFormData({ ...formData, productId: value })
                }
              />
            </div>
            <div>
              <Label htmlFor="attributeId">Attribute</Label>
              <SelectType
                options={attributes.map((attribute) => ({
                  value: attribute.id.toString() || "none",
                  name: `${attribute.label} (${attribute.dataType})`,
                }))}
                onValueChange={(value) =>
                  setFormData({ ...formData, attributeId: value })
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="storeViewId">Store View</Label>
            <SelectType
              options={storeViews.map((storeView) => ({
                value: storeView.id.toString() || "none",
                name: `${storeView.name} (${storeView.locale?.value})`,
              }))}
              onValueChange={(value) =>
                setFormData({ ...formData, storeViewId: value })
              }
            />
          </div>

          {formData.attributeId && (() => {
            const selectedAttribute = attributes.find(
              (attr) => attr.id.toString() === formData.attributeId
            );
            if (!selectedAttribute) return null;

            switch (selectedAttribute.dataType) {
              case "STRING":
                return (
                  <div>
                    <Label htmlFor="valueString">Value (String)</Label>
                    <Input
                      id="valueString"
                      value={formData.valueString}
                      onChange={(e) =>
                        setFormData({ ...formData, valueString: e.target.value })
                      }
                      placeholder="Enter string value"
                    />
                  </div>
                );
              case "TEXT":
                return (
                  <div>
                    <Label htmlFor="valueText">Value (Text)</Label>
                    <textarea
                      id="valueText"
                      value={formData.valueText}
                      onChange={(e) =>
                        setFormData({ ...formData, valueText: e.target.value })
                      }
                      placeholder="Enter text value"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                );
              case "INTEGER":
                return (
                  <div>
                    <Label htmlFor="valueInt">Value (Integer)</Label>
                    <Input
                      id="valueInt"
                      type="number"
                      value={formData.valueInt}
                      onChange={(e) =>
                        setFormData({ ...formData, valueInt: e.target.value })
                      }
                      placeholder="Enter integer value"
                    />
                  </div>
                );
              case "DECIMAL":
                return (
                  <div>
                    <Label htmlFor="valueDecimal">Value (Decimal)</Label>
                    <Input
                      id="valueDecimal"
                      type="number"
                      step="0.01"
                      value={formData.valueDecimal}
                      onChange={(e) =>
                        setFormData({ ...formData, valueDecimal: e.target.value })
                      }
                      placeholder="Enter decimal value"
                    />
                  </div>
                );
              case "BOOLEAN":
                return (
                  <div>
                    <Label htmlFor="valueBoolean">Value (Boolean)</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        id="valueBoolean"
                        type="checkbox"
                        checked={formData.valueBoolean}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            valueBoolean: e.target.checked,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm">True/False</span>
                    </div>
                  </div>
                );
              default:
                return null;
            }
          })()}
        </div>
      </EntityDialog>

      {/* Edit Product Attribute Dialog */}
      <EntityDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Product Attribute"
        description="Update the attribute value for this product."
        primaryLabel="Update Product Attribute"
        onPrimary={handleEditProductAttribute}
        contentClassName="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-productId">Product</Label>
              <SelectType
                options={products.map((product) => ({
                  value: product.id.toString() || "none",
                  name: `${product.sku} (${product.type})`,
                }))}
                onValueChange={(value) =>
                  setFormData({ ...formData, productId: value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-attributeId">Attribute</Label>
              <SelectType
                options={attributes.map((attribute) => ({
                  value: attribute.id.toString() || "none",
                  name: `${attribute.label} (${attribute.dataType})`,
                }))}
                onValueChange={(value) =>
                  setFormData({ ...formData, attributeId: value })
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="edit-storeViewId">Store View</Label>
            <SelectType
              options={storeViews.map((storeView) => ({
                value: storeView.id.toString() || "none",
                name: `${storeView.name} (${storeView.locale?.value})`,
              }))}
              onValueChange={(value) =>
                setFormData({ ...formData, storeViewId: value })
              }
            />
          </div>

          {formData.attributeId && (() => {
            const selectedAttribute = attributes.find(
              (attr) => attr.id.toString() === formData.attributeId
            );
            if (!selectedAttribute) return null;

            switch (selectedAttribute.dataType) {
              case "STRING":
                return (
                  <div>
                    <Label htmlFor="edit-valueString">Value (String)</Label>
                    <Input
                      id="edit-valueString"
                      value={formData.valueString}
                      onChange={(e) =>
                        setFormData({ ...formData, valueString: e.target.value })
                      }
                      placeholder="Enter string value"
                    />
                  </div>
                );
              case "TEXT":
                return (
                  <div>
                    <Label htmlFor="edit-valueText">Value (Text)</Label>
                    <textarea
                      id="edit-valueText"
                      value={formData.valueText}
                      onChange={(e) =>
                        setFormData({ ...formData, valueText: e.target.value })
                      }
                      placeholder="Enter text value"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                );
              case "INTEGER":
                return (
                  <div>
                    <Label htmlFor="edit-valueInt">Value (Integer)</Label>
                    <Input
                      id="edit-valueInt"
                      type="number"
                      value={formData.valueInt}
                      onChange={(e) =>
                        setFormData({ ...formData, valueInt: e.target.value })
                      }
                      placeholder="Enter integer value"
                    />
                  </div>
                );
              case "DECIMAL":
                return (
                  <div>
                    <Label htmlFor="edit-valueDecimal">Value (Decimal)</Label>
                    <Input
                      id="edit-valueDecimal"
                      type="number"
                      step="0.01"
                      value={formData.valueDecimal}
                      onChange={(e) =>
                        setFormData({ ...formData, valueDecimal: e.target.value })
                      }
                      placeholder="Enter decimal value"
                    />
                  </div>
                );
              case "BOOLEAN":
                return (
                  <div>
                    <Label htmlFor="edit-valueBoolean">Value (Boolean)</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        id="edit-valueBoolean"
                        type="checkbox"
                        checked={formData.valueBoolean}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            valueBoolean: e.target.checked,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm">True/False</span>
                    </div>
                  </div>
                );
              default:
                return null;
            }
          })()}
        </div>
      </EntityDialog>
    </PageLayout>
  );
}
