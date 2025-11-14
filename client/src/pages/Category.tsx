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
  FilterIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
  XIcon,
  FolderIcon,
  FolderOpenIcon,
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
import { useCategories } from "@/hooks/useCategories";
import type Filters from "@/interfaces/category/category.filters.interface";
import type CategoryInterface from "@/interfaces/category/category.interface";
import type StoreView from "@/interfaces/category/storeView.interface";
import { CategoryService } from "@/services/category.service";
import { StoreViewService } from "@/services/storeView.service";

export default function Category() {
  const limit = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    parentId: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [
    categories,
    categoriesLoading,
    categoriesErrors,
    categoriesTotalPages,
    refetchCategories,
  ] = useCategories<CategoryInterface>(currentPage, limit, filters);
  const [filterCategories, setFilterCategories] = useState<CategoryInterface[]>([]);
  const [storeViews, setStoreViews] = useState<StoreView[]>([]);

  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<CategoryInterface | null>(
    null
  );
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<number | null>(
    null
  );
 
  const [formData, setFormData] = useState({
    parentId: "",
    translations: [
      {
        name: "",
        slug: "",
        description: "",
        storeViewId: 1,
      },
    ],
  });


  const fetchStoreViews = async () => {
    try {
      const response = await StoreViewService.getAll(currentPage, limit);
      setStoreViews(response.data);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to load store views: ${error.message}`);
    }
  };

  const fetchFilterCategories = async () => {
    try {
      const response = await CategoryService.getAll(currentPage, limit);
      setFilterCategories(response.data);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to load filter categories: ${error.message}`);
    }
  };


  useEffect(() => {
    fetchFilterCategories();
    fetchStoreViews();
  }, []);

  const [showPageLoader, setShowPageLoader] = useState(true);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= categoriesTotalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (key: keyof Filters, value: string | null) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      parentId: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
  };

  const handleCreateCategory = async () => {
    try {
      const cleanedTranslations = formData.translations.filter(
        (t) => t.name.trim() !== ""
      );

      const categoryData = {
        parentId: formData.parentId ? parseInt(formData.parentId) : null,
        translations: cleanedTranslations.length
          ? {
              create: cleanedTranslations.map((t) => ({
                name: t.name,
                slug: t.slug,
                description: t.description,
                storeViewId: t.storeViewId,
              })),
            }
          : undefined,
      };

      await CategoryService.create(
        categoryData as unknown as Partial<CategoryInterface>
      );
      await refetchCategories();
      toast.success("Category created successfully");
      setShowCreateDialog(false);
      setFormData({
        parentId: "",
        translations: [
          {
            name: "",
            slug: "",
            description: "",
            storeViewId: 1,
          },
        ],
      });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to create category: ${error.message}`);
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory) return;

    try {
      const cleanedTranslations = formData.translations.filter(
        (t) => t.name.trim() !== ""
      );

      const categoryData = {
        parentId: formData.parentId ? parseInt(formData.parentId) : null,
        translations: cleanedTranslations.length
          ? {
              deleteMany: { categoryId: editingCategory.id },
              create: cleanedTranslations.map((t) => ({
                name: t.name,
                slug: t.slug,
                description: t.description,
                storeViewId: t.storeViewId,
              })),
            }
          : undefined,
      };

      await CategoryService.update(
        editingCategory.id,
        categoryData as unknown as Partial<CategoryInterface>
      );
      await refetchCategories();
      toast.success("Category updated successfully");
      setShowEditDialog(false);
      setEditingCategory(null);
      setFormData({
        parentId: "",
        translations: [
          {
            name: "",
            slug: "",
            description: "",
            storeViewId: 1,
          },
        ],
      });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to update category: ${error.message}`);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await CategoryService.remove(id);
      await refetchCategories();
      toast.success("Category deleted successfully");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to delete category: ${error.message}`);
    }
  };

  const openEditDialog = (category: CategoryInterface) => {
    setEditingCategory(category);
    setFormData({
      parentId: category.parentId?.toString() || "",
      translations: category.translations?.length
        ? category.translations.map((t) => ({
            name: t.name || "",
            slug: t.slug || "",
            description: t.description || "",
            storeViewId: t.storeViewId,
          }))
        : [
            {
              name: "",
              slug: "",
              description: "",
              storeViewId: 1,
            },
          ],
    });
    setShowEditDialog(true);
  };

  const addTranslation = () => {
    setFormData({
      ...formData,
      translations: [
        ...formData.translations,
        {
          name: "",
          slug: "",
          description: "",
          storeViewId: 1,
        },
      ],
    });
  };

  const removeTranslation = (index: number) => {
    if (formData.translations.length > 1) {
      setFormData({
        ...formData,
        translations: formData.translations.filter((_, i) => i !== index),
      });
    }
  };

  const updateTranslation = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedTranslations = [...formData.translations];
    updatedTranslations[index] = {
      ...updatedTranslations[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      translations: updatedTranslations,
    });
  };

  useEffect(() => {
    if (!categoriesLoading) {
      setShowPageLoader(false);
    }
  }, [categoriesLoading]);

  if (showPageLoader && categoriesLoading) {
    return <Loading />;
  }
  return (
    <PageLayout
      title="Categories"
      actions={
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Category
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
            <div className="flex-1 min-w-[200px] mt-6">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="min-w-[150px]">
              <label className="text-sm font-bold" htmlFor="parent-category">
                Parent Category
              </label>
              <SelectType
                initialValue={filters.parentId || "all"}
                options={[
                  { value: "all", name: "All Categories" },
                  ...filterCategories.map((category) => ({
                    value: category.id.toString(),
                    name:
                      category.translations?.[0]?.name ||
                      `Category ${category.id}`,
                  })),
                ]}
                onValueChange={(value) =>
                  handleFilterChange("parentId", value === "all" ? "" : value)
                }
              />
            </div>
          </div>
        }
        advancedFilters={
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
                  <SelectItem value="name">Name</SelectItem>
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
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Parent</TableHead>
            <TableHead>Subcategories</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </>
        }
        rows={
          <>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.id}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {category.parentId ? (
                      <FolderIcon className="w-4 h-4 text-gray-400" />
                    ) : (
                      <FolderOpenIcon className="w-4 h-4 text-blue-500" />
                    )}
                    <span>
                      {category.translations?.[0]?.name || "No name"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {category.translations?.[0]?.slug || "-"}
                </TableCell>
                <TableCell>
                  {category.parent ? (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                      {category.parent.translations?.[0]?.name ||
                        `Category ${category.parent.id}`}
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
                      <DropdownMenuItem
                        onClick={() => openEditDialog(category)}
                      >
                        <EditIcon className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setCategoryIdToDelete(category.id)}
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
        isEmpty={categories.length === 0}
        emptyMessage="No categories found"
      />

      {/* Pagination */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={categoriesTotalPages}
        onPageChange={handlePageChange}
      />

      <DeleteConfirmDialog
        open={categoryIdToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setCategoryIdToDelete(null);
        }}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        primaryLabel="Delete Category"
        onConfirm={() => {
          if (categoryIdToDelete !== null) {
            void handleDeleteCategory(categoryIdToDelete);
          }
        }}
      />

      {/* Create Category Dialog */}
      <EntityDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Create New Category"
        description="Add a new category to your catalog."
        primaryLabel="Create Category"
        onPrimary={handleCreateCategory}
        contentClassName="max-w-2xl"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="parentId">Parent Category</Label>
            <Select
              value={formData.parentId}
              onValueChange={(value) =>
                setFormData({ ...formData, parentId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select parent category (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">No parent (Root category)</SelectItem>
                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id.toString()}
                  >
                    {category.translations?.[0]?.name ||
                      `Category ${category.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Translations</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTranslation}
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                Add CategoryTranslation
              </Button>
            </div>
            {formData.translations.map((CategoryTranslation, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    CategoryTranslation {index + 1}
                  </span>
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
                      value={CategoryTranslation.name}
                      onChange={(e) =>
                        updateTranslation(index, "name", e.target.value)
                      }
                      placeholder="Category name"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`slug-${index}`}>Slug</Label>
                    <Input
                      id={`slug-${index}`}
                      value={CategoryTranslation.slug}
                      onChange={(e) =>
                        updateTranslation(index, "slug", e.target.value)
                      }
                      placeholder="category-slug"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`description-${index}`}>Description</Label>
                  <Input
                    id={`description-${index}`}
                    value={CategoryTranslation.description}
                    onChange={(e) =>
                      updateTranslation(index, "description", e.target.value)
                    }
                    placeholder="Category description"
                  />
                </div>
                <div>
                  <Label htmlFor={`storeView-${index}`}>Store View</Label>
                  <Select
                    value={CategoryTranslation.storeViewId.toString()}
                    onValueChange={(value) =>
                      updateTranslation(index, "storeViewId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {storeViews.map((storeView) => (
                        <SelectItem
                          key={storeView.id}
                          value={storeView.id.toString()}
                        >
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
      </EntityDialog>

      {/* Edit Category Dialog */}
      <EntityDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Category"
        description="Update category information."
        primaryLabel="Update Category"
        onPrimary={handleEditCategory}
        contentClassName="max-w-2xl"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-parentId">Parent Category</Label>
            <SelectType
              initialValue={formData.parentId || "all"}
              options={[
                { value: "all", name: "No parent (Root category)" },
                ...categories
                  .filter((c) => c.id !== editingCategory?.id)
                  .map((category) => ({
                    value: category.id.toString(),
                    name:
                      category.translations?.[0]?.name ||
                      `Category ${category.id}`,
                  })),
              ]}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  parentId: value === "all" ? "" : value,
                })
              }
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Translations</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTranslation}
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                Add CategoryTranslation
              </Button>
            </div>
            {formData.translations.map((CategoryTranslation, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    CategoryTranslation {index + 1}
                  </span>
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
                      value={CategoryTranslation.name}
                      onChange={(e) =>
                        updateTranslation(index, "name", e.target.value)
                      }
                      placeholder="Category name"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`edit-slug-${index}`}>Slug</Label>
                    <Input
                      id={`edit-slug-${index}`}
                      value={CategoryTranslation.slug}
                      onChange={(e) =>
                        updateTranslation(index, "slug", e.target.value)
                      }
                      placeholder="category-slug"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`edit-description-${index}`}>
                    Description
                  </Label>
                  <Input
                    id={`edit-description-${index}`}
                    value={CategoryTranslation.description}
                    onChange={(e) =>
                      updateTranslation(index, "description", e.target.value)
                    }
                    placeholder="Category description"
                  />
                </div>
                <div>
                  <Label htmlFor={`edit-storeView-${index}`}>
                    Store View
                  </Label>
                  <Select
                    value={CategoryTranslation.storeViewId.toString()}
                    onValueChange={(value) =>
                      updateTranslation(index, "storeViewId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
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
              </div>
            ))}
          </div>
        </div>
      </EntityDialog>
    </PageLayout>
  );
}
