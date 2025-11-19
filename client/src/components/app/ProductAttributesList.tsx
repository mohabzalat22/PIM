import { PlusIcon, TrashIcon, TagIcon, GlobeIcon, FolderIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

interface ProductAttributesListProps {
  productAttributes: ProductAttributeValue[];
  onAdd: () => void;
  onDelete: (id: number) => void;
  getAttributeValue: (productAttribute: ProductAttributeValue) => string;
  getAttributeGroupInfo: (attributeId: number) => { groupLabel: string; groupCode: string } | null;
  getDataTypeColor: (dataType: string) => string;
}

/**
 * Displays list of product attributes with actions
 */
export function ProductAttributesList({
  productAttributes,
  onAdd,
  onDelete,
  getAttributeValue,
  getAttributeGroupInfo,
  getDataTypeColor,
}: ProductAttributesListProps) {
  if (productAttributes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Attributes</CardTitle>
              <CardDescription>
                EAV attribute values for this product
              </CardDescription>
            </div>
            <Button onClick={onAdd}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Attribute
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground">
              No attributes assigned to this product
            </p>
            <Button onClick={onAdd} className="mt-4">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add First Attribute
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
            <CardTitle>Product Attributes</CardTitle>
            <CardDescription>
              EAV attribute values for this product
            </CardDescription>
          </div>
          <Button onClick={onAdd}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Attribute
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {productAttributes.map((productAttribute) => {
            const groupInfo = getAttributeGroupInfo(productAttribute.attributeId);
            return (
              <div key={productAttribute.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium">
                        {productAttribute.attribute?.label}
                      </span>
                      <Badge
                        className={getDataTypeColor(
                          productAttribute.attribute?.dataType || ""
                        )}
                      >
                        {productAttribute.attribute?.dataType}
                      </Badge>
                      <code className="text-xs bg-muted/60 px-2 py-1 rounded">
                        {productAttribute.attribute?.code}
                      </code>
                      {groupInfo && (
                        <Badge variant="outline" className="text-xs">
                          <FolderIcon className="h-3 w-3 mr-1" />
                          {groupInfo.groupLabel}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <GlobeIcon className="h-3 w-3" />
                        <span>{productAttribute.storeView?.name}</span>
                        <span>
                          (
                          {productAttribute.storeView?.locale?.value ||
                            productAttribute.storeView?.locale?.label ||
                            "No locale"}
                          )
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-lg font-medium">
                      {getAttributeValue(productAttribute)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(productAttribute.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
