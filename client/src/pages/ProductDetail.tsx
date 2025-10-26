import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { 
  ArrowLeftIcon,
  PackageIcon, 
  TagIcon, 
  FolderIcon, 
  ImageIcon,
  EditIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  GlobeIcon,
  CalendarIcon,
  HashIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

interface ProductAsset {
  id: number;
  productId: number;
  assetId: number;
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
  locale: string;
}

interface AvailableAttribute {
  id: number;
  code: string;
  label: string;
  dataType: string;
  inputType: string;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [availableAttributes, setAvailableAttributes] = useState<AvailableAttribute[]>([]);
  const [storeViews, setStoreViews] = useState<StoreView[]>([]);
  const [showAddAttributeDialog, setShowAddAttributeDialog] = useState<boolean>(false);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState<boolean>(false);
  const [showAddAssetDialog, setShowAddAssetDialog] = useState<boolean>(false);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);

  const [attributeFormData, setAttributeFormData] = useState({
    attributeId: '',
    storeViewId: '',
    valueString: '',
    valueText: '',
    valueInt: '',
    valueDecimal: '',
    valueBoolean: false
  });

  const [categoryFormData, setCategoryFormData] = useState({
    categoryId: ''
  });

  const [assetFormData, setAssetFormData] = useState({
    assetId: ''
  });

  const fetchProduct = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/products/${id}`);
      setProduct(response.data.data);
    } catch (err: any) {
      toast.error(`Failed to load product: ${err.message}`);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableData = async () => {
    try {
      const [attributesResponse, storeViewsResponse, categoriesResponse, assetsResponse] = await Promise.all([
        axios.get('http://localhost:3000/api/attributes?limit=100'),
        axios.get('http://localhost:3000/api/store-views?limit=100'),
        axios.get('http://localhost:3000/api/categories?limit=100'),
        axios.get('http://localhost:3000/api/assets?limit=100')
      ]);

      setAvailableAttributes(attributesResponse.data.data);
      setStoreViews(storeViewsResponse.data.data);
      setAvailableCategories(categoriesResponse.data.data);
      setAvailableAssets(assetsResponse.data.data);
    } catch (err: any) {
      console.error('Failed to load available data:', err);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchAvailableData();
  }, [id]);

  const handleAddAttribute = async () => {
    if (!product) return;

    try {
      const selectedAttribute = availableAttributes.find(attr => attr.id.toString() === attributeFormData.attributeId);
      if (!selectedAttribute) {
        toast.error('Please select an attribute');
        return;
      }

      const attributeData: any = {
        productId: product.id,
        attributeId: parseInt(attributeFormData.attributeId),
        storeViewId: parseInt(attributeFormData.storeViewId)
      };

      // Add value based on data type
      switch (selectedAttribute.dataType) {
        case 'STRING':
          attributeData.valueString = attributeFormData.valueString;
          break;
        case 'TEXT':
          attributeData.valueText = attributeFormData.valueText;
          break;
        case 'INTEGER':
          attributeData.valueInt = parseInt(attributeFormData.valueInt) || 0;
          break;
        case 'DECIMAL':
          attributeData.valueDecimal = parseFloat(attributeFormData.valueDecimal) || 0;
          break;
        case 'BOOLEAN':
          attributeData.valueBoolean = attributeFormData.valueBoolean;
          break;
      }

      await axios.post('http://localhost:3000/api/product-attributes', attributeData);
      toast.success('Attribute added successfully');
      setShowAddAttributeDialog(false);
      setAttributeFormData({
        attributeId: '',
        storeViewId: '',
        valueString: '',
        valueText: '',
        valueInt: '',
        valueDecimal: '',
        valueBoolean: false
      });
      fetchProduct();
    } catch (err: any) {
      toast.error(`Failed to add attribute: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleAddCategory = async () => {
    if (!product) return;

    try {
      await axios.post('http://localhost:3000/api/product-categories', {
        productId: product.id,
        categoryId: parseInt(categoryFormData.categoryId)
      });
      toast.success('Category added successfully');
      setShowAddCategoryDialog(false);
      setCategoryFormData({ categoryId: '' });
      fetchProduct();
    } catch (err: any) {
      toast.error(`Failed to add category: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleAddAsset = async () => {
    if (!product) return;

    try {
      await axios.post('http://localhost:3000/api/product-assets', {
        productId: product.id,
        assetId: parseInt(assetFormData.assetId)
      });
      toast.success('Asset added successfully');
      setShowAddAssetDialog(false);
      setAssetFormData({ assetId: '' });
      fetchProduct();
    } catch (err: any) {
      toast.error(`Failed to add asset: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleRemoveAttribute = async (attributeId: number) => {
    if (!confirm('Are you sure you want to remove this attribute?')) return;

    try {
      await axios.delete(`http://localhost:3000/api/product-attributes/${attributeId}`);
      toast.success('Attribute removed successfully');
      fetchProduct();
    } catch (err: any) {
      toast.error(`Failed to remove attribute: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleRemoveCategory = async (categoryId: number) => {
    if (!confirm('Are you sure you want to remove this category?')) return;

    try {
      await axios.delete(`http://localhost:3000/api/product-categories/${categoryId}`);
      toast.success('Category removed successfully');
      fetchProduct();
    } catch (err: any) {
      toast.error(`Failed to remove category: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleRemoveAsset = async (assetId: number) => {
    if (!confirm('Are you sure you want to remove this asset?')) return;

    try {
      await axios.delete(`http://localhost:3000/api/product-assets/${assetId}`);
      toast.success('Asset removed successfully');
      fetchProduct();
    } catch (err: any) {
      toast.error(`Failed to remove asset: ${err.response?.data?.message || err.message}`);
    }
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

  const getMimeTypeIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.includes('pdf')) return '📄';
    return '📁';
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
          <Button onClick={() => navigate('/products')} className="mt-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/products')}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <PackageIcon className="h-8 w-8 mr-3 text-blue-500" />
              {product.sku}
            </h1>
            <p className="text-muted-foreground">Product Details & Management</p>
          </div>
        </div>
        <Button>
          <EditIcon className="h-4 w-4 mr-2" />
          Edit Product
        </Button>
      </div>

      {/* Product Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Product Overview</CardTitle>
          <CardDescription>Basic product information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <HashIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">SKU</span>
              </div>
              <p className="text-lg font-mono">{product.sku}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <TagIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Type</span>
              </div>
              <Badge variant="outline">{product.type}</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Created</span>
              </div>
              <p className="text-sm">{new Date(product.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="attributes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
        </TabsList>

        {/* Attributes Tab */}
        <TabsContent value="attributes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Product Attributes</CardTitle>
                  <CardDescription>EAV attribute values for this product</CardDescription>
                </div>
                <Button onClick={() => setShowAddAttributeDialog(true)}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Attribute
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {product.productAttributeValues && product.productAttributeValues.length > 0 ? (
                <div className="space-y-4">
                  {product.productAttributeValues.map((productAttribute) => (
                    <div key={productAttribute.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium">{productAttribute.attribute?.label}</span>
                            <Badge className={getDataTypeColor(productAttribute.attribute?.dataType || '')}>
                              {productAttribute.attribute?.dataType}
                            </Badge>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {productAttribute.attribute?.code}
                            </code>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <GlobeIcon className="h-3 w-3" />
                              <span>{productAttribute.storeView?.name}</span>
                              <span>({productAttribute.storeView?.locale})</span>
                            </div>
                          </div>
                          <p className="mt-2 text-lg font-medium">
                            {getAttributeValue(productAttribute)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveAttribute(productAttribute.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">No attributes assigned to this product</p>
                  <Button onClick={() => setShowAddAttributeDialog(true)} className="mt-4">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add First Attribute
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Product Categories</CardTitle>
                  <CardDescription>Categories this product belongs to</CardDescription>
                </div>
                <Button onClick={() => setShowAddCategoryDialog(true)}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {product.productCategories && product.productCategories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.productCategories.map((productCategory) => (
                    <div key={productCategory.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <FolderIcon className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">
                              {productCategory.category?.translations?.[0]?.name || `Category ${productCategory.categoryId}`}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            ID: {productCategory.categoryId}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveCategory(productCategory.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FolderIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">No categories assigned to this product</p>
                  <Button onClick={() => setShowAddCategoryDialog(true)} className="mt-4">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add First Category
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Product Assets</CardTitle>
                  <CardDescription>Images and files associated with this product</CardDescription>
                </div>
                <Button onClick={() => setShowAddAssetDialog(true)}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Asset
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {product.productAssets && product.productAssets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.productAssets.map((productAsset) => (
                    <div key={productAsset.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-2xl">{getMimeTypeIcon(productAsset.asset?.mimeType || '')}</span>
                            <span className="font-medium truncate">
                              {productAsset.asset?.filePath.split('/').pop()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {productAsset.asset?.mimeType}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Added {new Date(productAsset.asset?.createdAt || '').toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveAsset(productAsset.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">No assets assigned to this product</p>
                  <Button onClick={() => setShowAddAssetDialog(true)} className="mt-4">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add First Asset
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Attribute Dialog */}
      <Dialog open={showAddAttributeDialog} onOpenChange={setShowAddAttributeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Attribute to Product</DialogTitle>
            <DialogDescription>
              Assign an attribute with a value to this product for a specific store view.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="attributeId">Attribute</Label>
                <Select value={attributeFormData.attributeId} onValueChange={(value) => setAttributeFormData({ ...attributeFormData, attributeId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select attribute" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAttributes.map((attribute) => (
                      <SelectItem key={attribute.id} value={attribute.id.toString()}>
                        {attribute.label} ({attribute.dataType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="storeViewId">Store View</Label>
                <Select value={attributeFormData.storeViewId} onValueChange={(value) => setAttributeFormData({ ...attributeFormData, storeViewId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select store view" />
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
            
            {/* Dynamic value input based on selected attribute */}
            {attributeFormData.attributeId && (() => {
              const selectedAttribute = availableAttributes.find(attr => attr.id.toString() === attributeFormData.attributeId);
              if (!selectedAttribute) return null;

              switch (selectedAttribute.dataType) {
                case 'STRING':
                  return (
                    <div>
                      <Label htmlFor="valueString">Value (String)</Label>
                      <Input
                        id="valueString"
                        value={attributeFormData.valueString}
                        onChange={(e) => setAttributeFormData({ ...attributeFormData, valueString: e.target.value })}
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
                        value={attributeFormData.valueText}
                        onChange={(e) => setAttributeFormData({ ...attributeFormData, valueText: e.target.value })}
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
                        value={attributeFormData.valueInt}
                        onChange={(e) => setAttributeFormData({ ...attributeFormData, valueInt: e.target.value })}
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
                        value={attributeFormData.valueDecimal}
                        onChange={(e) => setAttributeFormData({ ...attributeFormData, valueDecimal: e.target.value })}
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
                          checked={attributeFormData.valueBoolean}
                          onChange={(e) => setAttributeFormData({ ...attributeFormData, valueBoolean: e.target.checked })}
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
            <Button variant="outline" onClick={() => setShowAddAttributeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAttribute}>
              Add Attribute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={showAddCategoryDialog} onOpenChange={setShowAddCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category to Product</DialogTitle>
            <DialogDescription>
              Assign this product to a category.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="categoryId">Category</Label>
              <Select value={categoryFormData.categoryId} onValueChange={(value) => setCategoryFormData({ ...categoryFormData, categoryId: value })}>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCategoryDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Asset Dialog */}
      <Dialog open={showAddAssetDialog} onOpenChange={setShowAddAssetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Asset to Product</DialogTitle>
            <DialogDescription>
              Associate an asset with this product.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="assetId">Asset</Label>
              <Select value={assetFormData.assetId} onValueChange={(value) => setAssetFormData({ ...assetFormData, assetId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  {availableAssets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id.toString()}>
                      <div className="flex items-center space-x-2">
                        <span>{getMimeTypeIcon(asset.mimeType)}</span>
                        <span>{asset.filePath.split('/').pop()}</span>
                        <span className="text-xs text-muted-foreground">({asset.mimeType})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAssetDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAsset}>
              Add Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
