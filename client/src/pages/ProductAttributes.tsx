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
  TagIcon,
  PackageIcon,
  EyeIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type StoreView from "@/interfaces/storeView.interface";
interface ProductAttributeValue {
  id: number;
  productId: number;
  attributeId: number;
  storeViewId: number;
  valueString?: string;
  valueText?: string;
  valueInt?: number;
  valueDecimal?: number;
  valueBoolean?: boolean;
  createdAt: string;
  updatedAt: string;
  product?: Product;
  attribute?: Attribute;
  storeView?: StoreView;
}

interface Product {
  id: number;
  sku: string;
  type: string;
}

interface Attribute {
  id: number;
  code: string;
  label: string;
  dataType: string;
  inputType: string;
  isFilterable: boolean;
  isGlobal: boolean;
}

interface Filters {
  search: string;
  productId: string;
  attributeId: string;
  storeViewId: string;
  dataType: string;
  sortBy: string;
  sortOrder: string;
}

export default function ProductAttributes() {
  const navigate = useNavigate();
  const [productAttributeValues, setProductAttributeValues] = useState<ProductAttributeValue[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [storeViews, setStoreViews] = useState<StoreView[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [editingProductAttribute, setEditingProductAttribute] = useState<ProductAttributeValue | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    productId: '',
    attributeId: '',
    storeViewId: '',
    dataType: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

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

  const limit = 10;

  const dataTypes = [
    { value: 'STRING', label: 'String' },
    { value: 'TEXT', label: 'Text' },
    { value: 'INTEGER', label: 'Integer' },
    { value: 'DECIMAL', label: 'Decimal' },
    { value: 'BOOLEAN', label: 'Boolean' }
  ];

  const fetchProductAttributeValues = async (page: number = 1, currentFilters: Filters = filters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy: currentFilters.sortBy,
        sortOrder: currentFilters.sortOrder
      });

      if (currentFilters.search) params.append('search', currentFilters.search);
      if (currentFilters.productId) params.append('productId', currentFilters.productId);
      if (currentFilters.attributeId) params.append('attributeId', currentFilters.attributeId);
      if (currentFilters.storeViewId) params.append('storeViewId', currentFilters.storeViewId);
      if (currentFilters.dataType) params.append('dataType', currentFilters.dataType);

      const response = await axios.get(
        `http://localhost:3000/api/product-attributes?${params.toString()}`
      );
      
      setProductAttributeValues(response.data.data);
      setTotalPages(Math.ceil(response.data.meta.total / limit));
      setCurrentPage(page);
    } catch (err: any) {
      toast.error(`Failed to load product attributes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products?limit=100');
      setProducts(response.data.data);
    } catch (err: any) {
      console.error('Failed to load products:', err);
    }
  };

  const fetchAttributes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/attributes?limit=100');
      setAttributes(response.data.data);
    } catch (err: any) {
      console.error('Failed to load attributes:', err);
    }
  };

  const fetchStoreViews = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/store-views?limit=100');
      setStoreViews(response.data.data);
    } catch (err: any) {
      console.error('Failed to load store views:', err);
    }
  };

  useEffect(() => {
    fetchProductAttributeValues(currentPage);
    fetchProducts();
    fetchAttributes();
    fetchStoreViews();
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchProductAttributeValues(page);
    }
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchProductAttributeValues(1, newFilters);
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
    fetchProductAttributeValues(1, clearedFilters);
  };

  const handleCreateProductAttribute = async () => {
    try {
      const selectedAttribute = attributes.find(attr => attr.id.toString() === formData.attributeId);
      if (!selectedAttribute) {
        toast.error('Please select an attribute');
        return;
      }

      const attributeData: any = {
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

      await axios.post('http://localhost:3000/api/product-attributes', attributeData);
      toast.success('Product attribute assigned successfully');
      setShowCreateDialog(false);
      resetFormData();
      fetchProductAttributeValues(currentPage);
    } catch (err: any) {
      toast.error(`Failed to assign attribute: ${err.response?.data?.message || err.message}`);
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

      const attributeData: any = {
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

      await axios.put(`http://localhost:3000/api/product-attributes/${editingProductAttribute.id}`, attributeData);
      toast.success('Product attribute updated successfully');
      setShowEditDialog(false);
      setEditingProductAttribute(null);
      resetFormData();
      fetchProductAttributeValues(currentPage);
    } catch (err: any) {
      toast.error(`Failed to update attribute: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeleteProductAttribute = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product attribute?')) return;
    
    try {
      await axios.delete(`http://localhost:3000/api/product-attributes/${id}`);
      toast.success('Product attribute deleted successfully');
      fetchProductAttributeValues(currentPage);
    } catch (err: any) {
      toast.error(`Failed to delete product attribute: ${err.response?.data?.message || err.message}`);
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

  if (loading && productAttributeValues.length === 0) {
    return <div className="flex justify-center items-center h-64">
      <p className="text-blue-500">Loading product attributes...</p>
    </div>;
  }

  return (
    <div className="max-w-full p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product Attributes</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Assign Attribute
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
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
            >
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
                placeholder="Search by product SKU or attribute..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="min-w-[150px]">
            <Select value={filters.productId} onValueChange={(value) => handleFilterChange('productId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString() || "none"}>
                    {product.sku}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[150px]">
            <Select value={filters.attributeId} onValueChange={(value) => handleFilterChange('attributeId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Attribute" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Attributes</SelectItem>
                {attributes.map((attribute) => (
                  <SelectItem key={attribute.id} value={attribute.id.toString() || "none"}>
                    {attribute.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[150px]">
            <Select value={filters.storeViewId} onValueChange={(value) => handleFilterChange('storeViewId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Store View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Store Views</SelectItem>
                {storeViews.map((storeView) => (
                  <SelectItem key={storeView.id} value={storeView.id.toString() || "none"}>
                    {storeView.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[150px]">
            <Select value={filters.dataType} onValueChange={(value) => handleFilterChange('dataType', value)}>
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
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-4 pt-4 border-t">
            <div className="min-w-[150px]">
              <Label className="text-sm font-medium">Sort By</Label>
              <select 
                value={filters.sortBy} 
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
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
              <TableHead>Product</TableHead>
              <TableHead>Attribute</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Data Type</TableHead>
              <TableHead>Store View</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productAttributeValues.length > 0 ? (
              productAttributeValues.map((productAttribute) => (
                <TableRow key={productAttribute.id}>
                  <TableCell className="font-medium">{productAttribute.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <PackageIcon className="w-4 h-4 text-blue-500" />
                      <button
                        onClick={() => navigate(`/products/${productAttribute.productId}`)}
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
                    <span className={`px-2 py-1 rounded-full text-xs ${getDataTypeColor(productAttribute.attribute?.dataType || '')}`}>
                      {productAttribute.attribute?.dataType}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <EyeIcon className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">{productAttribute.storeView?.name}</span>
                      <span className="text-xs text-gray-500">({productAttribute.storeView?.locale})</span>
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
                        <DropdownMenuItem onClick={() => navigate(`/products/${productAttribute.productId}`)}>
                          <EyeIcon className="w-4 h-4 mr-2" />
                          View Product
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(productAttribute)}>
                          <EditIcon className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteProductAttribute(productAttribute.id)}
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
                <TableCell colSpan={8} className="text-center py-8">
                  No product attributes found
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
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationItem>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={() => handlePageChange(page)}
                    className={page === currentPage ? "bg-blue-600 text-white" : ""}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Create Product Attribute Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Attribute to Product</DialogTitle>
            <DialogDescription>
              Assign an attribute with a value to a product for a specific store view.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productId">Product</Label>
                <Select value={formData.productId} onValueChange={(value) => setFormData({ ...formData, productId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString() || "none"}>
                        {product.sku} ({product.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="attributeId">Attribute</Label>
                <Select value={formData.attributeId} onValueChange={(value) => setFormData({ ...formData, attributeId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select attribute" />
                  </SelectTrigger>
                  <SelectContent>
                    {attributes.map((attribute) => (
                      <SelectItem key={attribute.id} value={attribute.id.toString() || "none"}>
                        {attribute.label} ({attribute.dataType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="storeViewId">Store View</Label>
              <Select value={formData.storeViewId} onValueChange={(value) => setFormData({ ...formData, storeViewId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select store view" />
                </SelectTrigger>
                <SelectContent>
                  {storeViews.map((storeView) => (
                    <SelectItem key={storeView.id} value={storeView.id.toString() || "none"}>
                      {storeView.name} ({storeView.locale})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Dynamic value input based on selected attribute */}
            {formData.attributeId && (() => {
              const selectedAttribute = attributes.find(attr => attr.id.toString() === formData.attributeId);
              if (!selectedAttribute) return null;

              switch (selectedAttribute.dataType) {
                case 'STRING':
                  return (
                    <div>
                      <Label htmlFor="valueString">Value (String)</Label>
                      <Input
                        id="valueString"
                        value={formData.valueString}
                        onChange={(e) => setFormData({ ...formData, valueString: e.target.value })}
                        placeholder="Enter string value"
                      />
                    </div>
                  );
                case 'TEXT':
                  return (
                    <div>
                      <Label htmlFor="valueText">Value (Text)</Label>
                      <textarea
                        id="valueText"
                        value={formData.valueText}
                        onChange={(e) => setFormData({ ...formData, valueText: e.target.value })}
                        placeholder="Enter text value"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>
                  );
                case 'INTEGER':
                  return (
                    <div>
                      <Label htmlFor="valueInt">Value (Integer)</Label>
                      <Input
                        id="valueInt"
                        type="number"
                        value={formData.valueInt}
                        onChange={(e) => setFormData({ ...formData, valueInt: e.target.value })}
                        placeholder="Enter integer value"
                      />
                    </div>
                  );
                case 'DECIMAL':
                  return (
                    <div>
                      <Label htmlFor="valueDecimal">Value (Decimal)</Label>
                      <Input
                        id="valueDecimal"
                        type="number"
                        step="0.01"
                        value={formData.valueDecimal}
                        onChange={(e) => setFormData({ ...formData, valueDecimal: e.target.value })}
                        placeholder="Enter decimal value"
                      />
                    </div>
                  );
                case 'BOOLEAN':
                  return (
                    <div>
                      <Label htmlFor="valueBoolean">Value (Boolean)</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <input
                          id="valueBoolean"
                          type="checkbox"
                          checked={formData.valueBoolean}
                          onChange={(e) => setFormData({ ...formData, valueBoolean: e.target.checked })}
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProductAttribute}>
              Assign Attribute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Attribute Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product Attribute</DialogTitle>
            <DialogDescription>
              Update the attribute value for this product.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-productId">Product</Label>
                <Select value={formData.productId} onValueChange={(value) => setFormData({ ...formData, productId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString() || "none"}>
                        {product.sku} ({product.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-attributeId">Attribute</Label>
                <Select value={formData.attributeId} onValueChange={(value) => setFormData({ ...formData, attributeId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select attribute" />
                  </SelectTrigger>
                  <SelectContent>
                    {attributes.map((attribute) => (
                      <SelectItem key={attribute.id} value={attribute.id.toString() || "none"}>
                        {attribute.label} ({attribute.dataType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-storeViewId">Store View</Label>
              <Select value={formData.storeViewId} onValueChange={(value) => setFormData({ ...formData, storeViewId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select store view" />
                </SelectTrigger>
                <SelectContent>
                  {storeViews.map((storeView) => (
                    <SelectItem key={storeView.id} value={storeView.id.toString() || "none"}>
                      {storeView.name} ({storeView.locale})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Dynamic value input based on selected attribute */}
            {formData.attributeId && (() => {
              const selectedAttribute = attributes.find(attr => attr.id.toString() === formData.attributeId);
              if (!selectedAttribute) return null;

              switch (selectedAttribute.dataType) {
                case 'STRING':
                  return (
                    <div>
                      <Label htmlFor="edit-valueString">Value (String)</Label>
                      <Input
                        id="edit-valueString"
                        value={formData.valueString}
                        onChange={(e) => setFormData({ ...formData, valueString: e.target.value })}
                        placeholder="Enter string value"
                      />
                    </div>
                  );
                case 'TEXT':
                  return (
                    <div>
                      <Label htmlFor="edit-valueText">Value (Text)</Label>
                      <textarea
                        id="edit-valueText"
                        value={formData.valueText}
                        onChange={(e) => setFormData({ ...formData, valueText: e.target.value })}
                        placeholder="Enter text value"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>
                  );
                case 'INTEGER':
                  return (
                    <div>
                      <Label htmlFor="edit-valueInt">Value (Integer)</Label>
                      <Input
                        id="edit-valueInt"
                        type="number"
                        value={formData.valueInt}
                        onChange={(e) => setFormData({ ...formData, valueInt: e.target.value })}
                        placeholder="Enter integer value"
                      />
                    </div>
                  );
                case 'DECIMAL':
                  return (
                    <div>
                      <Label htmlFor="edit-valueDecimal">Value (Decimal)</Label>
                      <Input
                        id="edit-valueDecimal"
                        type="number"
                        step="0.01"
                        value={formData.valueDecimal}
                        onChange={(e) => setFormData({ ...formData, valueDecimal: e.target.value })}
                        placeholder="Enter decimal value"
                      />
                    </div>
                  );
                case 'BOOLEAN':
                  return (
                    <div>
                      <Label htmlFor="edit-valueBoolean">Value (Boolean)</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <input
                          id="edit-valueBoolean"
                          type="checkbox"
                          checked={formData.valueBoolean}
                          onChange={(e) => setFormData({ ...formData, valueBoolean: e.target.checked })}
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProductAttribute}>
              Update Attribute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
