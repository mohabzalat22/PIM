import { PackageIcon, TagIcon, HashIcon, Edit2Icon, TrashIcon, PlusIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Attribute {
  id: number;
  code: string;
  label: string;
  dataType: string;
  inputType: string;
  isFilterable: boolean;
  isGlobal: boolean;
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
}

interface AttributeSetDisplayProps {
  attributeSet: AttributeSet | null;
  onAssign?: () => void;
  onChange?: () => void;
  onRemove?: () => void;
}

/**
 * Displays attribute set information with groups and attributes
 */
export function AttributeSetDisplay({ attributeSet, onAssign, onChange, onRemove }: AttributeSetDisplayProps) {
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

  if (!attributeSet) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              No attribute set assigned to this product
            </p>
            {onAssign && (
              <Button onClick={onAssign} variant="outline">
                <PlusIcon className="h-4 w-4 mr-2" />
                Assign Attribute Set
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Attribute Set Information</CardTitle>
              <CardDescription>Overview of the assigned attribute set</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {onChange && (
                <Button onClick={onChange} variant="outline" size="sm">
                  <Edit2Icon className="h-4 w-4 mr-2" />
                  Change
                </Button>
              )}
              {onRemove && (
                <Button onClick={onRemove} variant="destructive" size="sm">
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <HashIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Code</span>
              </div>
              <p className="font-mono text-sm">{attributeSet.code}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <TagIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Label</span>
              </div>
              <p className="font-semibold">{attributeSet.label}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <PackageIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Product Type</span>
              </div>
              <Badge variant="outline">
                {attributeSet.productType || "All Types"}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Default Set</span>
              </div>
              <Badge
                variant={attributeSet.isDefault ? "default" : "secondary"}
              >
                {attributeSet.isDefault ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {attributeSet.groups && attributeSet.groups.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Attribute Groups</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attributeSet.groups.map((group) => (
              <Card key={group.id} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{group.label}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {group.groupAttributes?.length || 0} attributes
                    </Badge>
                  </div>
                  <CardDescription className="text-xs font-mono">
                    {group.code}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {group.groupAttributes && group.groupAttributes.length > 0 ? (
                    <div className="space-y-2">
                      {group.groupAttributes.map((groupAttr) => (
                        <div
                          key={groupAttr.id}
                          className="flex items-center justify-between p-2 rounded border bg-muted/30"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {groupAttr.attribute.label}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {groupAttr.attribute.code}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="secondary"
                              className={`text-xs ${getDataTypeColor(
                                groupAttr.attribute.dataType
                              )}`}
                            >
                              {groupAttr.attribute.dataType}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {groupAttr.attribute.inputType}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No attributes in this group
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              No attribute groups defined for this attribute set
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
