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
  FolderIcon,
  FolderOpenIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Category {
  id: number;
  parentId?: number;
  createdAt: string;
  updatedAt: string;
  parent?: Category;
  subcategory?: Category[];
  productCategories?: any[];
  translations?: Array<{
    id: number;
    name: string;
    slug: string;
    description?: string;
    storeViewId: number;
  }>;
}

interface StoreView {
  id: number;
  code: string;
  name: string;
  locale: string;
}

interface Filters {
  search: string;
  parentId: string;
  sortBy: string;
  sortOrder: string;
}

export default function Category() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [storeViews, setStoreViews] = useState<StoreView[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    parentId: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [formData, setFormData] = useState({
    parentId: '',
    translations: [{
      name: '',
      slug: '',
      description: '',
      storeViewId: 1
    }]
  });

  const limit = 10;

  const fetchCategories = async (page: number = 1, currentFilters: Filters = filters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy: currentFilters.sortBy,
        sortOrder: currentFilters.sortOrder
      });

      if (currentFilters.search) params.append('search', currentFilters.search);
      if (currentFilters.parentId !== '') params.append('parentId', currentFilters.parentId);

      const response = await axios.get(
        `http://localhost:3000/api/categories?${params.toString()}`
      );
      
      setCategories(response.data.data);
      setTotalPages(Math.ceil(response.data.meta.total / limit));
      setCurrentPage(page);
    } catch (err: any) {
      toast.error(`Failed to load categories: ${err.message}`);
    } finally {
      setLoading(false);
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
    fetchCategories(currentPage);
    fetchStoreViews();
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchCategories(page);
    }
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchCategories(1, newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      parentId: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setFilters(clearedFilters);
    fetchCategories(1, clearedFilters);
  };

  const handleCreateCategory = async () => {
    try {
      const categoryData = {
        parentId: formData.parentId ? parseInt(formData.parentId) : null,
        translations: formData.translations.filter(t => t.name.trim() !== '')
      };
      
      await axios.post('http://localhost:3000/api/categories', categoryData);
      toast.success('Category created successfully');
      setShowCreateDialog(false);
      setFormData({
        parentId: '',
        translations: [{
          name: '',
          slug: '',
          description: '',
          storeViewId: 1
        }]
      });
      fetchCategories(currentPage);
    } catch (err: any) {
      toast.error(`Failed to create category: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory) return;
    
    try {
      const categoryData = {
        parentId: formData.parentId ? parseInt(formData.parentId) : null,
        translations: formData.translations.filter(t => t.name.trim() !== '')
      };
      
      await axios.put(`http://localhost:3000/api/categories/${editingCategory.id}`, categoryData);
      toast.success('Category updated successfully');
      setShowEditDialog(false);
      setEditingCategory(null);
      setFormData({
        parentId: '',
        translations: [{
          name: '',
          slug: '',
          description: '',
          storeViewId: 1
        }]
      });
      fetchCategories(currentPage);
    } catch (err: any) {
      toast.error(`Failed to update category: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await axios.delete(`http://localhost:3000/api/categories/${id}`);
      toast.success('Category deleted successfully');
      fetchCategories(currentPage);
    } catch (err: any) {
      toast.error(`Failed to delete category: ${err.response?.data?.message || err.message}`);
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      parentId: category.parentId?.toString() || '',
      translations: category.translations?.length ? category.translations.map(t => ({
        name: t.name || '',
        slug: t.slug || '',
        description: t.description || '',
        storeViewId: t.storeViewId
      })) : [{
        name: '',
        slug: '',
        description: '',
        storeViewId: 1
      }]
    });
    setShowEditDialog(true);
  };

  const addTranslation = () => {
    setFormData({
      ...formData,
      translations: [...formData.translations, {
        name: '',
        slug: '',
        description: '',
        storeViewId: 1
      }]
    });
  };

  const removeTranslation = (index: number) => {
    if (formData.translations.length > 1) {
      setFormData({
        ...formData,
        translations: formData.translations.filter((_, i) => i !== index)
      });
    }
  };

  const updateTranslation = (index: number, field: string, value: string | number) => {
    const updatedTranslations = [...formData.translations];
    updatedTranslations[index] = {
      ...updatedTranslations[index],
      [field]: value
    };
    setFormData({
      ...formData,
      translations: updatedTranslations
    });
  };

  if (loading && categories.length === 0) {
    return <div className="flex justify-center items-center h-64">
      <p className="text-blue-500">Loading categories...</p>
    </div>;
  }

  return (
    <div className="max-w-full p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Category
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
                placeholder="Search by name..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="min-w-[150px]">
            <Select value={filters.parentId} onValueChange={(value) => handleFilterChange('parentId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Parent Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="null">Root Categories</SelectItem>
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
          <div className="flex flex-wrap gap-4 pt-4 border-t">
            <div className="min-w-[150px]">
              <Label className="text-sm font-medium">Sort By</Label>
              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
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
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Subcategories</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {category.parentId ? (
                        <FolderIcon className="w-4 h-4 text-gray-400" />
                      ) : (
                        <FolderOpenIcon className="w-4 h-4 text-blue-500" />
                      )}
                      <span>{category.translations?.[0]?.name || 'No name'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{category.translations?.[0]?.slug || '-'}</TableCell>
                  <TableCell>
                    {category.parent ? (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                        {category.parent.translations?.[0]?.name || `Category ${category.parent.id}`}
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        Root
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {category.subcategory?.length || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                      {category.productCategories?.length || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(category.createdAt).toLocaleDateString()}
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
                        <DropdownMenuItem onClick={() => openEditDialog(category)}>
                          <EditIcon className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteCategory(category.id)}
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
                  No categories found
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

      {/* Create Category Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new category to your catalog.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="parentId">Parent Category</Label>
              <Select value={formData.parentId} onValueChange={(value) => setFormData({ ...formData, parentId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No parent (Root category)</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.translations?.[0]?.name || `Category ${category.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Translations</Label>
                <Button type="button" variant="outline" size="sm" onClick={addTranslation}>
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Add Translation
                </Button>
              </div>
              {formData.translations.map((translation, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Translation {index + 1}</span>
                    {formData.translations.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTranslation(index)}
                      >
                        <XIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`name-${index}`}>Name</Label>
                      <Input
                        id={`name-${index}`}
                        value={translation.name}
                        onChange={(e) => updateTranslation(index, 'name', e.target.value)}
                        placeholder="Category name"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`slug-${index}`}>Slug</Label>
                      <Input
                        id={`slug-${index}`}
                        value={translation.slug}
                        onChange={(e) => updateTranslation(index, 'slug', e.target.value)}
                        placeholder="category-slug"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    <Input
                      id={`description-${index}`}
                      value={translation.description}
                      onChange={(e) => updateTranslation(index, 'description', e.target.value)}
                      placeholder="Category description"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`storeView-${index}`}>Store View</Label>
                    <Select 
                      value={translation.storeViewId.toString()} 
                      onValueChange={(value) => updateTranslation(index, 'storeViewId', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {storeViews.map((storeView) => (
                          <SelectItem key={storeView.id} value={storeView.id.toString()}>
                            {storeView.name} ({storeView.locale})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCategory}>
              Create Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-parentId">Parent Category</Label>
              <Select value={formData.parentId} onValueChange={(value) => setFormData({ ...formData, parentId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No parent (Root category)</SelectItem>
                  {categories.filter(c => c.id !== editingCategory?.id).map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.translations?.[0]?.name || `Category ${category.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Translations</Label>
                <Button type="button" variant="outline" size="sm" onClick={addTranslation}>
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Add Translation
                </Button>
              </div>
              {formData.translations.map((translation, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Translation {index + 1}</span>
                    {formData.translations.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTranslation(index)}
                      >
                        <XIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`edit-name-${index}`}>Name</Label>
                      <Input
                        id={`edit-name-${index}`}
                        value={translation.name}
                        onChange={(e) => updateTranslation(index, 'name', e.target.value)}
                        placeholder="Category name"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`edit-slug-${index}`}>Slug</Label>
                      <Input
                        id={`edit-slug-${index}`}
                        value={translation.slug}
                        onChange={(e) => updateTranslation(index, 'slug', e.target.value)}
                        placeholder="category-slug"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`edit-description-${index}`}>Description</Label>
                    <Input
                      id={`edit-description-${index}`}
                      value={translation.description}
                      onChange={(e) => updateTranslation(index, 'description', e.target.value)}
                      placeholder="Category description"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`edit-storeView-${index}`}>Store View</Label>
                    <Select 
                      value={translation.storeViewId.toString()} 
                      onValueChange={(value) => updateTranslation(index, 'storeViewId', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {storeViews.map((storeView) => (
                          <SelectItem key={storeView.id} value={storeView.id.toString()}>
                            {storeView.name} ({storeView.locale})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory}>
              Update Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
