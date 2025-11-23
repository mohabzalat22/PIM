import { PackageIcon, TagIcon, CalendarIcon, HashIcon, EditIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type ProductStatus = 'DRAFT' | 'ENRICHMENT' | 'VALIDATION' | 'APPROVAL' | 'PUBLISHING';

interface AssignedUser {
  id: number;
  name: string;
  email: string;
}

interface Product {
  id: number;
  sku: string;
  type: string;
  status?: ProductStatus;
  assignedTo?: number | null;
  assignedUser?: AssignedUser | null;
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <span className="text-sm font-medium">Status</span>
              </div>
              {product.status === "DRAFT" && (
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Draft</Badge>
              )}
              {product.status === "ENRICHMENT" && (
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Enrichment</Badge>
              )}
              {product.status === "VALIDATION" && (
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Validation</Badge>
              )}
              {product.status === "APPROVAL" && (
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Approval</Badge>
              )}
              {product.status === "PUBLISHING" && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Publishing</Badge>
              )}
              {!product.status && (
                <Badge variant="outline">No Status</Badge>
              )}
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
          {product.assignedUser && (
            <div className="mt-4 pt-4 border-t">
              <div className="space-y-2">
                <span className="text-sm font-medium">Assigned To</span>
                <p className="text-sm">
                  {product.assignedUser.name} ({product.assignedUser.email})
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
