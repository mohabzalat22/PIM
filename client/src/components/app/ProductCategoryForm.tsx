import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <Select value={categoryId} onValueChange={onCategoryIdChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {availableCategories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.translations?.[0]?.name || `Category ${category.id}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
