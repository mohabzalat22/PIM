import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SelectType } from "@/components/app/select-type";

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

interface ProductAttributeFormData {
  attributeId: string;
  storeViewId: string;
  valueString: string;
  valueText: string;
  valueInt: string;
  valueDecimal: string;
  valueBoolean: boolean;
  valueJson: string;
}

interface ProductAttributeFormProps {
  availableAttributes: Attribute[];
  storeViews: StoreView[];
  formData: ProductAttributeFormData;
  onFormDataChange: (data: ProductAttributeFormData) => void;
}

/**
 * Form component for adding product attributes
 * Handles dynamic form fields based on selected attribute data type
 */
export function ProductAttributeForm({
  availableAttributes,
  storeViews,
  formData,
  onFormDataChange,
}: ProductAttributeFormProps) {
  const selectedAttribute = availableAttributes.find(
    (attr) => attr.id.toString() === formData.attributeId
  );

  const renderValueInput = () => {
    if (!selectedAttribute) return null;

    switch (selectedAttribute.dataType) {
      case "STRING":
        return (
          <div>
            <Label htmlFor="valueString">Value (String)</Label>
            <Input
              id="valueString"
              value={formData.valueString}
              onChange={(e) =>
                onFormDataChange({ ...formData, valueString: e.target.value })
              }
              placeholder="Enter string value"
            />
          </div>
        );

      case "TEXT":
        return (
          <div>
            <Label htmlFor="valueText">Value (Text)</Label>
            <textarea
              id="valueText"
              value={formData.valueText}
              onChange={(e) =>
                onFormDataChange({ ...formData, valueText: e.target.value })
              }
              placeholder="Enter text value"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
        );

      case "INT":
        return (
          <div>
            <Label htmlFor="valueInt">Value (Integer)</Label>
            <Input
              id="valueInt"
              type="number"
              value={formData.valueInt}
              onChange={(e) =>
                onFormDataChange({ ...formData, valueInt: e.target.value })
              }
              placeholder="Enter integer value"
            />
          </div>
        );

      case "DECIMAL":
        return (
          <div>
            <Label htmlFor="valueDecimal">Value (Decimal)</Label>
            <Input
              id="valueDecimal"
              type="number"
              step="0.01"
              value={formData.valueDecimal}
              onChange={(e) =>
                onFormDataChange({ ...formData, valueDecimal: e.target.value })
              }
              placeholder="Enter decimal value"
            />
          </div>
        );

      case "BOOLEAN":
        return (
          <div>
            <Label htmlFor="valueBoolean">Value (Boolean)</Label>
            <div className="flex items-center space-x-2 mt-2">
              <input
                id="valueBoolean"
                type="checkbox"
                checked={formData.valueBoolean}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    valueBoolean: e.target.checked,
                  })
                }
                className="w-4 h-4"
              />
              <span className="text-sm">True/False</span>
            </div>
          </div>
        );

      case "JSON":
        return (
          <div>
            <Label htmlFor="valueJson">Value (JSON)</Label>
            <textarea
              id="valueJson"
              value={formData.valueJson}
              onChange={(e) =>
                onFormDataChange({ ...formData, valueJson: e.target.value })
              }
              placeholder='Enter valid JSON (e.g., {"key": "value"} or [1, 2, 3])'
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Must be valid JSON format
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="attributeId">Attribute</Label>
          <SelectType
            initialValue={formData.attributeId}
            options={availableAttributes.map((attribute) => ({
              value: attribute.id.toString(),
              name: `${attribute.label || attribute.code} (${attribute.dataType})`,
            }))}
            onValueChange={(value) =>
              onFormDataChange({ ...formData, attributeId: value })
            }
          />
        </div>
        <div>
          <Label htmlFor="storeViewId">Store View</Label>
          <SelectType
            initialValue={formData.storeViewId}
            options={storeViews.map((storeView) => ({
              value: storeView.id.toString(),
              name: `${storeView.name} (${storeView.locale?.value || storeView.locale?.label || "No locale"})`,
            }))}
            onValueChange={(value) =>
              onFormDataChange({ ...formData, storeViewId: value })
            }
          />
        </div>
      </div>

      {renderValueInput()}
    </div>
  );
}
