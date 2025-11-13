import type ProductCategory from "@/interfaces/productCategory.interface";
import type CategoryTranslation from "@/interfaces/categoryTranslation.interface";

export default interface CategoryInterface {
  id: number;
  parentId?: number;
  createdAt: string;
  updatedAt: string;
  parent?: CategoryInterface;
  subcategory?: CategoryInterface[];
  productCategories?: ProductCategory[];
  translations?: CategoryTranslation[];
}