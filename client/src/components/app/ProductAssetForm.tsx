import { Label } from "@/components/ui/label";
import { SelectType } from "@/components/app/select-type";

interface Asset {
  id: number;
  filePath: string;
  mimeType: string;
  createdAt: string;
}

interface ProductAssetFormProps {
  availableAssets: Asset[];
  assetId: string;
  onAssetIdChange: (assetId: string) => void;
  getMimeTypeIcon: (mimeType: string) => string;
}

/**
 * Form component for adding assets to a product
 */
export function ProductAssetForm({
  availableAssets,
  assetId,
  onAssetIdChange,
  getMimeTypeIcon,
}: ProductAssetFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="assetId">Asset</Label>
        <SelectType
          initialValue={assetId}
          options={availableAssets.map((asset) => ({
            value: asset.id.toString(),
            name: `${getMimeTypeIcon(asset.mimeType)} ${asset.filePath.split("/").pop()} (${asset.mimeType})`,
          }))}
          onValueChange={onAssetIdChange}
        />
      </div>
    </div>
  );
}
