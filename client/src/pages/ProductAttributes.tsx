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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  MoreHorizontalIcon, 
  FilterIcon, 
  PlusIcon, 
  EditIcon, 
  TrashIcon,
  SearchIcon,
  XIcon,
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
    productAttributeValuesErrors,
    productAttributeValuesTotalPages,
    refetchProductAttributeValues,
  ] = useProductAttributeValues(currentPage, limit, filters);
  const [products, productsLoading, productsErrors] = useProducts(currentPage, limit);
  const [attributes, attributesLoading, attributesErrors] = useAttributes<Attribute>(currentPage, limit);

  const [storeViews, storeViewsLoading, storeViewErrors] = useStoreViews<StoreView>(currentPage,limit);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [editingProductAttribute, setEditingProductAttribute] =
    useState<ProductAttributeValue | null>(null);
  const [productAttributeIdToDelete, setProductAttributeIdToDelete] =
    useState<number | null>(null);

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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <PageLayout
      title="Product Attributes"
      actions={
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Assign Attribute
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
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Attribute</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Data Type</TableHead>
            <TableHead>Store View</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </>
        }
        rows={
          <>
            {productAttributeValues?.map((productAttribute) => (
              <TableRow key={productAttribute.id}>
                <TableCell className="font-medium">
                  {productAttribute.id}
                </TableCell>
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
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <TagIcon className="w-4 h-4 text-green-500" />
                    <span>{productAttribute.attribute?.label}</span>
                    <code className="px-1 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                      {productAttribute.attribute?.code}
                    </code>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    {getAttributeValue(productAttribute)}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getDataTypeColor(
                      productAttribute.attribute?.dataType || ""
                    )}`}
                  >
                    {productAttribute.attribute?.dataType}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <EyeIcon className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">
                      {productAttribute.storeView?.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({productAttribute.storeView?.locale})
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(productAttribute.createdAt).toLocaleDateString()}
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
              </TableRow>
            ))}
          </>
        }
        colSpan={8}
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
              <Select
                value={formData.productId}
                onValueChange={(value) =>
                  setFormData({ ...formData, productId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem
                      key={product.id}
                      value={product.id.toString() || "none"}
                    >
                      {product.sku} ({product.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="attributeId">Attribute</Label>
              <Select
                value={formData.attributeId}
                onValueChange={(value) =>
                  setFormData({ ...formData, attributeId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select attribute" />
                </SelectTrigger>
                <SelectContent>
                  {attributes.map((attribute) => (
                    <SelectItem
                      key={attribute.id}
                      value={attribute.id.toString() || "none"}
                    >
                      {attribute.label} ({attribute.dataType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="storeViewId">Store View</Label>
            <Select
              value={formData.storeViewId}
              onValueChange={(value) =>
                setFormData({ ...formData, storeViewId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select store view" />
              </SelectTrigger>
              <SelectContent>
                {storeViews.map((storeView) => (
                  <SelectItem
                    key={storeView.id}
                    value={storeView.id.toString() || "none"}
                  >
                    {storeView.name} ({storeView.locale})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <Select
                value={formData.productId}
                onValueChange={(value) =>
                  setFormData({ ...formData, productId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem
                      key={product.id}
                      value={product.id.toString() || "none"}
                    >
                      {product.sku} ({product.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-attributeId">Attribute</Label>
              <Select
                value={formData.attributeId}
                onValueChange={(value) =>
                  setFormData({ ...formData, attributeId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select attribute" />
                </SelectTrigger>
                <SelectContent>
                  {attributes.map((attribute) => (
                    <SelectItem
                      key={attribute.id}
                      value={attribute.id.toString() || "none"}
                    >
                      {attribute.label} ({attribute.dataType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="edit-storeViewId">Store View</Label>
            <Select
              value={formData.storeViewId}
              onValueChange={(value) =>
                setFormData({ ...formData, storeViewId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select store view" />
              </SelectTrigger>
              <SelectContent>
                {storeViews.map((storeView) => (
                  <SelectItem
                    key={storeView.id}
                    value={storeView.id.toString() || "none"}
                  >
                    {storeView.name} ({storeView.locale})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
