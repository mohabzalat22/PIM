import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <Select value={assetId} onValueChange={onAssetIdChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select asset" />
          </SelectTrigger>
          <SelectContent>
            {availableAssets.map((asset) => (
              <SelectItem key={asset.id} value={asset.id.toString()}>
                <div className="flex items-center space-x-2">
                  <span>{getMimeTypeIcon(asset.mimeType)}</span>
                  <span>{asset.filePath.split("/").pop()}</span>
                  <span className="text-xs text-muted-foreground">
                    ({asset.mimeType})
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
