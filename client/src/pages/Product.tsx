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
  DialogTrigger,
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
  EyeIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SelectType } from "@/components/app/select-type";
import { MultiSelectType } from "@/components/app/multiselect-type";
import { DateType } from "@/components/app/date-type";

interface ProductAsset {
  id: number;
  productId: number;
  assetId: number;
  position: number;
  type: string;
}

interface ProductCategory {
  id: number;
  productId: number;
  categoryId: number;
  createdAt: string;
}

interface Product {
  id: number;
  sku: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  productAssets?: ProductAsset[];
  productCategories?: ProductCategory[];
  productAttributeValues?: ProductAttributeValue[];
}

interface Category {
  id: number;
  parentId?: number;
  translations?: Array<{
    name: string;
    slug: string;
  }>;
}

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
}

interface Attribute {
  id: number;
  code: string;
  label: string;
  dataType: string;
  inputType: string;
  isFilterable: boolean;
  productAttributeValues: ProductAttributeValue[];
}

interface Filters {
  search: string;
  type: string;
  categoryId: string;
  attributeFilters: Record<string, string>;
  sortBy: string;
  sortOrder: string;
}

export default function Product() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    type: '',
    categoryId: '',
    attributeFilters: {},
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [formData, setFormData] = useState({
    sku: '',
    type: 'SIMPLE'
  });

  const limit = 10;

  const productTypes = [
    { value: 'SIMPLE', label: 'Simple' },
    { value: 'CONFIGURABLE', label: 'Configurable' },
    { value: 'BUNDLE', label: 'Bundle' },
    { value: 'VIRTUAL', label: 'Virtual' },
    { value: 'DOWNLOADABLE', label: 'Downloadable' }
  ];

  const fetchProducts = async (page: number = 1, currentFilters: Filters = filters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy: currentFilters.sortBy,
        sortOrder: currentFilters.sortOrder
      });

      if (currentFilters.search) params.append('search', currentFilters.search);
      if (currentFilters.type) params.append('type', currentFilters.type);
      if (currentFilters.categoryId) params.append('categoryId', currentFilters.categoryId);
      if (Object.keys(currentFilters.attributeFilters).length > 0) {
        params.append('attributes', JSON.stringify(currentFilters.attributeFilters));
      }

      const response = await axios.get(
        `http://localhost:3000/api/products?${params.toString()}`
      );
      
      setProducts(response.data.data);
      setTotalPages(Math.ceil(response.data.meta.total / limit));
      setCurrentPage(page);
    } catch (err: any) {
      toast.error(`Failed to load products: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/categories?limit=100');
      setCategories(response.data.data);
    } catch (err: any) {
      console.error('Failed to load categories:', err);
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

  useEffect(() => {
    fetchProducts(currentPage);
    fetchCategories();
    fetchAttributes();
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchProducts(page);
    }
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchProducts(1, newFilters);
  };

  const handleAttributeFilterChange = (attributeCode: string, value: string) => {
    const newAttributeFilters = { ...filters.attributeFilters };
    if (value) {
      newAttributeFilters[attributeCode] = value;
    } else {
      delete newAttributeFilters[attributeCode];
    }
    const newFilters = { ...filters, attributeFilters: newAttributeFilters };
    setFilters(newFilters);
    fetchProducts(1, newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      type: '',
      categoryId: '',
      attributeFilters: {},
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setFilters(clearedFilters);
    fetchProducts(1, clearedFilters);
  };

  const handleCreateProduct = async () => {
    try {
      await axios.post('http://localhost:3000/api/products', formData);
      toast.success('Product created successfully');
      setShowCreateDialog(false);
      setFormData({ sku: '', type: 'SIMPLE' });
      fetchProducts(currentPage);
    } catch (err: any) {
      toast.error(`Failed to create product: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;
    
    try {
      await axios.put(`http://localhost:3000/api/products/${editingProduct.id}`, formData);
      toast.success('Product updated successfully');
      setShowEditDialog(false);
      setEditingProduct(null);
      setFormData({ sku: '', type: 'SIMPLE' });
      fetchProducts(currentPage);
    } catch (err: any) {
      toast.error(`Failed to update product: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`);
      toast.success('Product deleted successfully');
      fetchProducts(currentPage);
    } catch (err: any) {
      toast.error(`Failed to delete product: ${err.response?.data?.message || err.message}`);
    }
  };
  console.log(attributes);

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku,
      type: product.type
    });
    setShowEditDialog(true);
  };

  const renderFilterComponent = (attribute: Attribute) => {
    switch (attribute.inputType) {
      case 'TEXT':
        return (
          <Input type="text" value={filters.attributeFilters[attribute.code] || ""} onChange={(e) => handleAttributeFilterChange(attribute.code, e.target.value)} placeholder={attribute.label} />
        )
      case 'SELECT':
        return (
          <SelectType initialValue={"none"} 
          options={
            attribute.productAttributeValues.map((element) => 
              { 
                const value = element.valueString ?? element.valueText ?? element.valueInt?.toString() ?? element.valueDecimal?.toString() ?? element.valueBoolean?.toString();
                if (value) {
                  return { name: value, value: value };
                }

                return null;
              }).filter((item): item is { name: string; value: string } => item !== null)

          }
          onValueChange={(value) => handleAttributeFilterChange(attribute.code, value)}
          />)
          
      case 'MULTISELECT':
        return (  
        
        <MultiSelectType  
        
        options={
            attribute.productAttributeValues.map((element) => 
              { 
                const value = element.valueString ?? element.valueText ?? element.valueInt?.toString() ?? element.valueDecimal?.toString() ?? element.valueBoolean?.toString();
                if (value) {
                  return { name: value, value: value };
                }

                return null;
              }).filter((item): item is { name: string; value: string } => item !== null)

          }
        onValueChange={(values) => handleAttributeFilterChange(attribute.code, values.join(','))}
          />)
      case 'MEDIA':
        // Media attributes are not filterable - they store file references, not filterable values
        return null;
      case 'DATE':
        return (
          <DateType
            initialValue={filters.attributeFilters[attribute.code] || ""}
            onValueChange={(value) => handleAttributeFilterChange(attribute.code, value)}
            placeholder={attribute.label}
          />
        );
      default:
        return null;
  }
}

  if (loading && products.length === 0) {
    return <div className="flex justify-center items-center h-64">
      <p className="text-blue-500">Loading products...</p>
    </div>;
  }

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
                placeholder="Search by SKU..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="min-w-[150px]">
            <Select value={filters.type || "all"} onValueChange={(value) => handleFilterChange('type', value === "all" ? "" : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Product Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {productTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[150px]">
            <Select value={filters.categoryId || "all"} onValueChange={(value) => handleFilterChange('categoryId', value === "all" ? "" : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.translations?.[0]?.name || `Category ${category.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {showFilters && (
          <div className="space-y-4 pt-4 border-t">
            {/* Attribute Filters */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Attribute Filters</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attributes
                  .filter(attr => 
                    // Exclude MEDIA: Media attributes store file references and should never be filterable
                    // (aligns with Magento's behavior - media attributes are excluded from layered navigation)
                    // 
                    // DATE attributes are now supported for filtering with date range support
                    attr.isFilterable && 
                    attr.inputType !== 'MEDIA'
                  )
                  .map((attribute) => {
                    const filterComponent = renderFilterComponent(attribute);
                    // Only render if the component returns something (exclude null returns)
                    if (!filterComponent) return null;
                    
                    return (
                      <div key={attribute.id} className="space-y-1">
                        <Label className="text-xs text-gray-600">{attribute.label}</Label>
                        {filterComponent}
                      </div>
                    );
                  })
                  .filter(Boolean)}
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex flex-wrap gap-4">
              <div className="min-w-[150px]">
                <Label className="text-sm font-medium">Sort By</Label>
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
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
                <Select value={filters.sortOrder} onValueChange={(value) => handleFilterChange('sortOrder', value)}>
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
            {products.length > 0 ? (
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
                        <DropdownMenuItem onClick={() => navigate(`/products/${product.id}`)}>
                          <EyeIcon className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(product)}>
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
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Enter product SKU"
              />
            </div>
            <div>
              <Label htmlFor="type">Product Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
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
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProduct}>
              Create Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-sku">SKU</Label>
              <Input
                id="edit-sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Enter product SKU"
              />
            </div>
            <div>
              <Label htmlFor="edit-type">Product Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
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
            <Button onClick={handleEditProduct}>
              Update Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
