import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface option {
    value: string
    name: string
}

interface selectProps {
    initialValue: string;
    options: option[];
    onValueChange?: (value: string) => void;
}
export function SelectType(props: selectProps) {
    const {initialValue, options, onValueChange} = props;
    // Filter out any options with empty string values - Radix UI Select doesn't allow empty string values
    const validOptions = options.filter((element) => element.value && element.value.trim() !== "");
    
    // Use first valid option as default if initialValue is empty/invalid, or use initialValue if it's valid
    // If no valid options exist, defaultValue will be undefined (uncontrolled)
    const defaultValue = validOptions.length > 0
      ? ((initialValue && initialValue.trim() !== "" && validOptions.some(opt => opt.value === initialValue)) 
          ? initialValue 
          : validOptions[0].value)
      : undefined;
    const [value, setValue] = useState(defaultValue);
    
    const handleValueChange = (newValue: string) => {
      setValue(newValue);
      onValueChange?.(newValue);
    };

  // If no valid options, render select with placeholder only (no items)
  if (validOptions.length === 0) {
    return (
      <Select value={undefined} disabled>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="No options available" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel> No options available</SelectLabel>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>select an option</SelectLabel>
          {
            validOptions.map((element, index) =>
              <SelectItem key={element.value || `option-${index}`} value={element.value}>{element.name}</SelectItem>
            )
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
