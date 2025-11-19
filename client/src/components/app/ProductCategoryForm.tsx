import { Label } from "@/components/ui/label";
import { SelectType } from "@/components/app/select-type";

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

interface ProductCategoryFormProps {
  availableCategories: Category[];
  categoryId: string;
  onCategoryIdChange: (categoryId: string) => void;
}

/**
 * Form component for adding categories to a product
 */
export function ProductCategoryForm({
  availableCategories,
  categoryId,
  onCategoryIdChange,
}: ProductCategoryFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="categoryId">Category</Label>
        <SelectType
          initialValue={categoryId}
          options={availableCategories.map((category) => ({
            value: category.id.toString(),
            name: category.translations?.[0]?.name || `Category ${category.id}`,
          }))}
          onValueChange={onCategoryIdChange}
        />
      </div>
    </div>
  );
}
