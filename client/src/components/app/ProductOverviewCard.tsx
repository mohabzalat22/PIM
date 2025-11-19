import { PackageIcon, TagIcon, CalendarIcon, HashIcon, EditIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  sku: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductOverviewCardProps {
  product: Product;
  onEdit: () => void;
}

/**
 * Displays product overview with basic information
 */
export function ProductOverviewCard({ product, onEdit }: ProductOverviewCardProps) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <PackageIcon className="h-8 w-8 mr-3 text-blue-500" />
            {product.sku}
          </h1>
          <p className="text-muted-foreground">Product Details & Management</p>
        </div>
        <Button onClick={onEdit}>
          <EditIcon className="h-4 w-4 mr-2" />
          Edit Product
        </Button>
      </div>

      {/* Product Overview Card */}
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
              <p className="text-sm">
                {new Date(product.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
