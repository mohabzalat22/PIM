import { PlusIcon, TrashIcon, FolderIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CategoryTranslation {
  id: number;
  categoryId: number;
  storeViewId: number;
  name: string;
  slug: string;
}

interface Category {
  id: number;
  parentId?: number;
  translations?: CategoryTranslation[];
}

interface ProductCategory {
  id: number;
  productId: number;
  categoryId: number;
  category?: Category;
}

interface ProductCategoriesListProps {
  productCategories: ProductCategory[];
  onAdd: () => void;
  onDelete: (category: ProductCategory) => void;
}

/**
 * Displays list of product categories with actions
 */
export function ProductCategoriesList({
  productCategories,
  onAdd,
  onDelete,
}: ProductCategoriesListProps) {
  if (productCategories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Categories</CardTitle>
              <CardDescription>
                Categories this product belongs to
              </CardDescription>
            </div>
            <Button onClick={onAdd}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FolderIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground">
              No categories assigned to this product
            </p>
            <Button onClick={onAdd} className="mt-4">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add First Category
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Product Categories</CardTitle>
            <CardDescription>
              Categories this product belongs to
            </CardDescription>
          </div>
          <Button onClick={onAdd}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productCategories.map((productCategory) => (
            <div key={productCategory.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <FolderIcon className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">
                      {productCategory.category?.translations?.[0]?.name ||
                        `Category ${productCategory.categoryId}`}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ID: {productCategory.categoryId}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(productCategory)}
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
