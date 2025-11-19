import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeftIcon, PackageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeleteConfirmDialog } from "@/components/app/DeleteConfirmDialog";
import { EntityDialog } from "@/components/app/EntityDialog";
import { SelectType } from "@/components/app/select-type";
import { ProductOverviewCard } from "@/components/app/ProductOverviewCard";
import { AttributeSetDisplay } from "@/components/app/AttributeSetDisplay";
import { ProductAttributesList } from "@/components/app/ProductAttributesList";
import { ProductCategoriesList } from "@/components/app/ProductCategoriesList";
import { ProductAssetsList } from "@/components/app/ProductAssetsList";
import { AssetViewerDialog } from "@/components/app/AssetViewerDialog";
import { ProductAttributeForm } from "@/components/app/ProductAttributeForm";
import { ProductCategoryForm } from "@/components/app/ProductCategoryForm";
import { ProductAssetForm } from "@/components/app/ProductAssetForm";
import { ProductService } from "@/services/product.service";
import { AttributeService } from "@/services/attribute.service";
import { StoreViewService } from "@/services/storeView.service";
import { CategoryService } from "@/services/category.service";
import { AssetService } from "@/services/asset.service";
import { ProductAttributeValueService } from "@/services/productAttributeValue.service";
import { ProductCategoryService } from "@/services/productCategory.service";
import { ProductAssetService } from "@/services/productAsset.service";

type ApiError = {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
};

interface AttributeSetAttribute {
  id: number;
  attributeSetId: number;
  attributeId: number;
  sortOrder: number;
  attribute: Attribute;
}

interface AttributeGroupAttribute {
  id: number;
  attributeGroupId: number;
  attributeId: number;
  sortOrder: number;
  attribute: Attribute;
}

interface AttributeGroup {
  id: number;
  code: string;
  label: string;
  sortOrder: number;
  attributeSetId: number;
  groupAttributes: AttributeGroupAttribute[];
}

interface AttributeSet {
  id: number;
  code: string;
  label: string;
  productType: string | null;
  isDefault: boolean;
  groups: AttributeGroup[];
  setAttributes: AttributeSetAttribute[];
}

interface Product {
  id: number;
  sku: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  attributeSetId?: number | null;
  attributeSet?: AttributeSet | null;
  productAssets?: ProductAsset[];
  productCategories?: ProductCategory[];
  productAttributeValues?: ProductAttributeValue[];
}

interface ProductAsset {
  id: number;
  productId: number;
  assetId: number;
  type: string;
  asset?: Asset;
}

interface Asset {
  id: number;
  filePath: string;
  mimeType: string;
  createdAt: string;
}

interface ProductCategory {
  id: number;
  productId: number;
  categoryId: number;
  category?: Category;
}

interface Category {
  id: number;
  parentId?: number;
  translations?: CategoryTranslation[];
}

interface CategoryTranslation {
  id: number;
  categoryId: number;
  storeViewId: number;
  name: string;
  slug: string;
  storeView?: StoreView;
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
  attribute?: Attribute;
  storeView?: StoreView;
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

interface StoreView {
  id: number;
  code: string;
  name: string;
  localeId: number;
  locale?: {
    id: number;
    value: string;
    label: string;
  };
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [availableAttributes, setAvailableAttributes] = useState<Attribute[]>([]);
  const [storeViews, setStoreViews] = useState<StoreView[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);

  // Dialog states
  const [showAddAttributeDialog, setShowAddAttributeDialog] = useState<boolean>(false);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState<boolean>(false);
  const [showAddAssetDialog, setShowAddAssetDialog] = useState<boolean>(false);
  const [showEditProductDialog, setShowEditProductDialog] = useState<boolean>(false);
  const [attributeIdToDelete, setAttributeIdToDelete] = useState<number | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<ProductAsset | null>(null);
  const [assetToView, setAssetToView] = useState<ProductAsset | null>(null);

  // Form data states
  const [attributeFormData, setAttributeFormData] = useState({
    attributeId: "",
    storeViewId: "",
    valueString: "",
    valueText: "",
    valueInt: "",
    valueDecimal: "",
    valueBoolean: false,
    valueJson: "",
  });

  const [categoryFormData, setCategoryFormData] = useState("");
  const [assetFormData, setAssetFormData] = useState("");
  const [productFormData, setProductFormData] = useState({
    sku: "",
    type: "SIMPLE",
  });

  const [activeTab, setActiveTab] = useState<string>("attribute-set");

  const productTypes = [
    { value: "SIMPLE", label: "Simple" },
    { value: "CONFIGURABLE", label: "Configurable" },
    { value: "BUNDLE", label: "Bundle" },
    { value: "VIRTUAL", label: "Virtual" },
    { value: "DOWNLOADABLE", label: "Downloadable" },
  ];

  const getAssetUrl = (filePath: string) => {
    if (!filePath) return "";
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }
    return `http://localhost:3000${filePath.startsWith("/") ? "" : "/"}${filePath}`;
  };

  const fetchProduct = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await ProductService.getById(parseInt(id, 10));
      setProduct(response.data as Product);
    } catch (err) {
      const error = err as ApiError;
      toast.error(`Failed to load product: ${error.message || "Unknown error"}`);
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableData = async () => {
    try {
      const [
        attributesResponse,
        storeViewsResponse,
        categoriesResponse,
        assetsResponse,
      ] = await Promise.all([
        AttributeService.getAll(1, 100),
        StoreViewService.getAll(1, 100),
        CategoryService.getAll(1, 100),
        AssetService.getAll(1, 100, {
          search: "",
          mimeType: "",
          sortBy: "createdAt",
          sortOrder: "desc",
        }),
      ]);

      const cleanAttributes = (attributesResponse.data as Attribute[]).map(
        (attr: Attribute) => ({
          id: attr.id,
          code: attr.code,
          label: attr.label,
          dataType: attr.dataType,
          inputType: attr.inputType,
          isFilterable: attr.isFilterable,
          isGlobal: attr.isGlobal,
        })
      );

      setAvailableAttributes(cleanAttributes as Attribute[]);
      setStoreViews(storeViewsResponse.data as StoreView[]);
      setAvailableCategories(categoriesResponse.data as Category[]);
      setAvailableAssets(assetsResponse.data as Asset[]);
    } catch {
      toast.error("Failed to load available data");
    }
  };

  useEffect(() => {
    void fetchProduct();
    void fetchAvailableData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddAttribute = async () => {
    if (!product) return;

    try {
      const selectedAttribute = availableAttributes.find(
        (attr) => attr.id.toString() === attributeFormData.attributeId
      );
      if (!selectedAttribute) {
        toast.error("Please select an attribute");
        return;
      }

      const attributeData: Record<string, string | number | boolean | object> = {
        productId: product.id,
        attributeId: parseInt(attributeFormData.attributeId),
        storeViewId: parseInt(attributeFormData.storeViewId),
      };

      switch (selectedAttribute.dataType) {
        case "STRING":
          attributeData.valueString = attributeFormData.valueString;
          break;
        case "TEXT":
          attributeData.valueText = attributeFormData.valueText;
          break;
        case "INT":
          attributeData.valueInt = parseInt(attributeFormData.valueInt) || 0;
          break;
        case "DECIMAL":
          attributeData.valueDecimal =
            parseFloat(attributeFormData.valueDecimal) || 0;
          break;
        case "BOOLEAN":
          attributeData.valueBoolean = attributeFormData.valueBoolean;
          break;
        case "JSON":
          try {
            attributeData.valueJson = JSON.parse(attributeFormData.valueJson);
          } catch {
            toast.error("Invalid JSON format. Please check your input.");
            return;
          }
          break;
      }

      await ProductAttributeValueService.create(attributeData);
      toast.success("Attribute added successfully");
      setShowAddAttributeDialog(false);
      setAttributeFormData({
        attributeId: "",
        storeViewId: "",
        valueString: "",
        valueText: "",
        valueInt: "",
        valueDecimal: "",
        valueBoolean: false,
        valueJson: "",
      });
      await fetchProduct();
    } catch (err) {
      const error = err as ApiError;
      toast.error(
        `Failed to add attribute: ${
          error.response?.data?.message || error.message || "Unknown error"
        }`
      );
    }
  };

  const handleAddCategory = async () => {
    if (!product) return;

    try {
      await ProductCategoryService.create({
        productId: product.id,
        categoryId: parseInt(categoryFormData, 10),
      });
      toast.success("Category added successfully");
      setShowAddCategoryDialog(false);
      setCategoryFormData("");
      await fetchProduct();
    } catch (err) {
      const error = err as ApiError;
      toast.error(
        `Failed to add category: ${
          error.response?.data?.message || error.message || "Unknown error"
        }`
      );
    }
  };

  const handleAddAsset = async () => {
    if (!product) return;

    try {
      const selectedAsset = availableAssets.find(
        (asset) => asset.id === parseInt(assetFormData, 10)
      );

      const mimeType = selectedAsset?.mimeType || "";
      let type = "image";

      if (mimeType.startsWith("video/")) {
        type = "video";
      } else if (mimeType.includes("pdf")) {
        type = "pdf";
      } else if (!mimeType && !selectedAsset) {
        type = "manual";
      }

      await ProductAssetService.create({
        productId: product.id,
        assetId: parseInt(assetFormData, 10),
        type,
      });
      toast.success("Asset added successfully");
      setShowAddAssetDialog(false);
      setAssetFormData("");
      await fetchProduct();
    } catch (err) {
      const error = err as ApiError;
      toast.error(
        `Failed to add asset: ${
          error.response?.data?.message || error.message || "Unknown error"
        }`
      );
    }
  };

  const handleRemoveAttribute = async (attributeId: number) => {
    try {
      await ProductAttributeValueService.remove(attributeId);
      toast.success("Attribute removed successfully");
      setAttributeIdToDelete(null);
      await fetchProduct();
    } catch (err) {
      const error = err as ApiError;
      toast.error(
        `Failed to remove attribute: ${
          error.response?.data?.message || error.message || "Unknown error"
        }`
      );
    }
  };

  const handleRemoveCategory = async (productCategory: ProductCategory) => {
    try {
      await ProductCategoryService.remove(
        productCategory.productId,
        productCategory.categoryId
      );
      toast.success("Category removed successfully");
      setCategoryToDelete(null);
      await fetchProduct();
    } catch (err) {
      const error = err as ApiError;
      toast.error(
        `Failed to remove category: ${
          error.response?.data?.message || error.message || "Unknown error"
        }`
      );
    }
  };

  const handleRemoveAsset = async (productAsset: ProductAsset) => {
    try {
      await ProductAssetService.remove(
        productAsset.productId,
        productAsset.assetId,
        productAsset.type
      );
      toast.success("Asset removed successfully");
      setAssetToDelete(null);
      await fetchProduct();
    } catch (err) {
      const error = err as ApiError;
      toast.error(
        `Failed to remove asset: ${
          error.response?.data?.message || error.message || "Unknown error"
        }`
      );
    }
  };

  const handleOpenEditProduct = () => {
    if (!product) return;
    setProductFormData({
      sku: product.sku,
      type: product.type,
    });
    setShowEditProductDialog(true);
  };

  const handleEditProduct = async () => {
    if (!product) return;

    try {
      await ProductService.update(product.id, productFormData);
      toast.success("Product updated successfully");
      setShowEditProductDialog(false);
      await fetchProduct();
    } catch (err) {
      const error = err as ApiError;
      toast.error(
        `Failed to update product: ${
          error.response?.data?.message || error.message || "Unknown error"
        }`
      );
    }
  };

  const getAttributeValue = (productAttribute: ProductAttributeValue) => {
    if (productAttribute.valueString) return productAttribute.valueString;
    if (productAttribute.valueText) return productAttribute.valueText;
    if (
      productAttribute.valueInt !== null &&
      productAttribute.valueInt !== undefined
    )
      return productAttribute.valueInt.toString();
    if (
      productAttribute.valueDecimal !== null &&
      productAttribute.valueDecimal !== undefined
    )
      return productAttribute.valueDecimal.toString();
    if (
      productAttribute.valueBoolean !== null &&
      productAttribute.valueBoolean !== undefined
    )
      return productAttribute.valueBoolean ? "Yes" : "No";
    return "No value";
  };

  const getAttributeGroupInfo = (
    attributeId: number
  ): { groupLabel: string; groupCode: string } | null => {
    if (!product?.attributeSet?.groups) return null;

    for (const group of product.attributeSet.groups) {
      const hasAttribute = group.groupAttributes?.some(
        (ga) => ga.attribute.id === attributeId
      );
      if (hasAttribute) {
        return { groupLabel: group.label, groupCode: group.code };
      }
    }
    return null;
  };

  const getDataTypeColor = (dataType: string) => {
    switch (dataType) {
      case "STRING":
        return "bg-blue-100 text-blue-800";
      case "TEXT":
        return "bg-green-100 text-green-800";
      case "INT":
        return "bg-purple-100 text-purple-800";
      case "DECIMAL":
        return "bg-orange-100 text-orange-800";
      case "BOOLEAN":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-muted/60 text-gray-800";
    }
  };

  const getMimeTypeIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return "🖼️";
    if (mimeType.startsWith("video/")) return "🎥";
    if (mimeType.startsWith("audio/")) return "🎵";
    if (mimeType.includes("pdf")) return "📄";
    return "📁";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <PackageIcon className="h-8 w-8 animate-pulse text-blue-500 mx-auto mb-2" />
          <p className="text-blue-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500">Product not found</p>
          <Button onClick={() => navigate("/products")} className="mt-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full p-4 space-y-6">
      {/* Back Button */}
      <Button variant="outline" onClick={() => navigate("/products")}>
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Products
      </Button>

      {/* Product Overview */}
      <ProductOverviewCard product={product} onEdit={handleOpenEditProduct} />

      {/* Tabs for different sections */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="attribute-set">Attribute Set</TabsTrigger>
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
        </TabsList>

        {/* Attribute Set Tab */}
        <TabsContent value="attribute-set" className="space-y-4">
          <AttributeSetDisplay attributeSet={product.attributeSet || null} />
        </TabsContent>

        {/* Attributes Tab */}
        <TabsContent value="attributes" className="space-y-4">
          <ProductAttributesList
            productAttributes={product.productAttributeValues || []}
            onAdd={() => setShowAddAttributeDialog(true)}
            onDelete={setAttributeIdToDelete}
            getAttributeValue={getAttributeValue}
            getAttributeGroupInfo={getAttributeGroupInfo}
            getDataTypeColor={getDataTypeColor}
          />
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <ProductCategoriesList
            productCategories={product.productCategories || []}
            onAdd={() => setShowAddCategoryDialog(true)}
            onDelete={setCategoryToDelete}
          />
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-4">
          <ProductAssetsList
            productAssets={product.productAssets || []}
            onAdd={() => setShowAddAssetDialog(true)}
            onView={setAssetToView}
            onDelete={setAssetToDelete}
            getMimeTypeIcon={getMimeTypeIcon}
          />
        </TabsContent>
      </Tabs>

      {/* Add Attribute Dialog */}
      <EntityDialog
        open={showAddAttributeDialog}
        onOpenChange={setShowAddAttributeDialog}
        title="Add Attribute to Product"
        description="Assign an attribute with a value to this product for a specific store view."
        primaryLabel="Add Attribute"
        onPrimary={handleAddAttribute}
        contentClassName="max-w-2xl"
      >
        <ProductAttributeForm
          availableAttributes={availableAttributes}
          storeViews={storeViews}
          formData={attributeFormData}
          onFormDataChange={setAttributeFormData}
        />
      </EntityDialog>

      {/* Add Category Dialog */}
      <EntityDialog
        open={showAddCategoryDialog}
        onOpenChange={setShowAddCategoryDialog}
        title="Add Category to Product"
        description="Assign this product to a category."
        primaryLabel="Add Category"
        onPrimary={handleAddCategory}
      >
        <ProductCategoryForm
          availableCategories={availableCategories}
          categoryId={categoryFormData}
          onCategoryIdChange={setCategoryFormData}
        />
      </EntityDialog>

      {/* Add Asset Dialog */}
      <EntityDialog
        open={showAddAssetDialog}
        onOpenChange={setShowAddAssetDialog}
        title="Add Asset to Product"
        description="Associate an asset with this product."
        primaryLabel="Add Asset"
        onPrimary={handleAddAsset}
      >
        <ProductAssetForm
          availableAssets={availableAssets}
          assetId={assetFormData}
          onAssetIdChange={setAssetFormData}
          getMimeTypeIcon={getMimeTypeIcon}
        />
      </EntityDialog>

      {/* Edit Product Dialog */}
      <EntityDialog
        open={showEditProductDialog}
        onOpenChange={setShowEditProductDialog}
        title="Edit Product"
        description="Update basic product information."
        primaryLabel="Update Product"
        onPrimary={handleEditProduct}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-sku">SKU</Label>
            <Input
              id="edit-sku"
              value={productFormData.sku}
              onChange={(e) =>
                setProductFormData({ ...productFormData, sku: e.target.value })
              }
              placeholder="Enter product SKU"
            />
          </div>
          <div>
            <Label htmlFor="edit-type">Product Type</Label>
            <SelectType
              initialValue={productFormData.type}
              options={productTypes.map((type) => ({
                name: type.label,
                value: type.value,
              }))}
              onValueChange={(value) =>
                setProductFormData({ ...productFormData, type: value })
              }
            />
          </div>
        </div>
      </EntityDialog>

      {/* Delete Attribute Dialog */}
      <DeleteConfirmDialog
        open={attributeIdToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setAttributeIdToDelete(null);
        }}
        title="Remove Attribute"
        description="Are you sure you want to remove this attribute from the product? This action cannot be undone."
        primaryLabel="Remove Attribute"
        onConfirm={() => {
          if (attributeIdToDelete !== null) {
            void handleRemoveAttribute(attributeIdToDelete);
          }
        }}
      />

      {/* Delete Category Dialog */}
      <DeleteConfirmDialog
        open={categoryToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setCategoryToDelete(null);
        }}
        title="Remove Category"
        description="Are you sure you want to remove this category from the product? This action cannot be undone."
        primaryLabel="Remove Category"
        onConfirm={() => {
          if (categoryToDelete !== null) {
            void handleRemoveCategory(categoryToDelete);
          }
        }}
      />

      {/* Delete Asset Dialog */}
      <DeleteConfirmDialog
        open={assetToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setAssetToDelete(null);
        }}
        title="Remove Asset"
        description="Are you sure you want to remove this asset from the product? This action cannot be undone."
        primaryLabel="Remove Asset"
        onConfirm={() => {
          if (assetToDelete !== null) {
            void handleRemoveAsset(assetToDelete);
          }
        }}
      />

      {/* Asset Viewer Dialog */}
      <AssetViewerDialog
        asset={assetToView}
        open={assetToView !== null}
        onOpenChange={(open) => {
          if (!open) setAssetToView(null);
        }}
        getAssetUrl={getAssetUrl}
      />
    </div>
  );
}
