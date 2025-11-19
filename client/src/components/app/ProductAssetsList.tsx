import { PlusIcon, TrashIcon, EyeIcon, ImageIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Asset {
  id: number;
  filePath: string;
  mimeType: string;
  createdAt: string;
}

interface ProductAsset {
  id: number;
  productId: number;
  assetId: number;
  type: string;
  asset?: Asset;
}

interface ProductAssetsListProps {
  productAssets: ProductAsset[];
  onAdd: () => void;
  onView: (asset: ProductAsset) => void;
  onDelete: (asset: ProductAsset) => void;
  getMimeTypeIcon: (mimeType: string) => string;
}

/**
 * Displays list of product assets with actions
 */
export function ProductAssetsList({
  productAssets,
  onAdd,
  onView,
  onDelete,
  getMimeTypeIcon,
}: ProductAssetsListProps) {
  if (productAssets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Assets</CardTitle>
              <CardDescription>
                Images and files associated with this product
              </CardDescription>
            </div>
            <Button onClick={onAdd}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground">
              No assets assigned to this product
            </p>
            <Button onClick={onAdd} className="mt-4">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add First Asset
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
            <CardTitle>Product Assets</CardTitle>
            <CardDescription>
              Images and files associated with this product
            </CardDescription>
          </div>
          <Button onClick={onAdd}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productAssets.map((productAsset) => (
            <div key={productAsset.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">
                      {getMimeTypeIcon(productAsset.asset?.mimeType || "")}
                    </span>
                    <span className="font-medium truncate">
                      {productAsset.asset?.filePath.split("/").pop()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {productAsset.asset?.mimeType}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Added{" "}
                    {new Date(
                      productAsset.asset?.createdAt || ""
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(productAsset)}
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(productAsset)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
