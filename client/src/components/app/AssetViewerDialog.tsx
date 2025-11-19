import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SkeletonImage } from "@/components/app/SkeletonImage";

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

interface AssetViewerDialogProps {
  asset: ProductAsset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getAssetUrl: (filePath: string) => string;
}

/**
 * Dialog for viewing asset details and preview
 */
export function AssetViewerDialog({
  asset,
  open,
  onOpenChange,
  getAssetUrl,
}: AssetViewerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>View Asset</DialogTitle>
          <DialogDescription>Preview of the selected asset.</DialogDescription>
        </DialogHeader>
        {asset?.asset && (
          <div className="mt-4">
            <SkeletonImage
              src={getAssetUrl(asset.asset.filePath)}
              alt="Asset preview"
              className="max-h-[70vh] w-auto mx-auto rounded border"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
