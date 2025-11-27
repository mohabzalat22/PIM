import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface option {
  value: string;
  name: string;
}

interface multiSelectProps {
  initialValue?: string[];
  options: option[];
  placeholder?: string;
  onValueChange?: (values: string[]) => void;
}

export function MultiSelectType(props: multiSelectProps) {
  const { initialValue = [], options, onValueChange } = props;
  const [selectedValues, setSelectedValues] = useState<string[]>(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Update selected values when initialValue prop changes
  useEffect(() => {
    setSelectedValues(initialValue);
  }, []);

  // Filter out any options with empty string values
  const validOptions = options.filter((element) => element.value && element.value.trim() !== "");

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleOption = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    
    setSelectedValues(newValues);
    onValueChange?.(newValues);
  };

  // Unused functions - kept for future use
  // const removeValue = (value: string, e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   const newValues = selectedValues.filter((v) => v !== value);
  //   setSelectedValues(newValues);
  //   onValueChange?.(newValues);
  // };

  // const clearAll = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   setSelectedValues([]);
  //   onValueChange?.([]);
  // };

  // If no valid options, render disabled button
  if (validOptions.length === 0) {
    return (
      <Button
        variant="outline"
        className="w-full justify-between"
        disabled
      >
        <span className="text-muted-foreground text-sm">No options available</span>
        <ChevronDownIcon className="h-4 w-4 opacity-50" />
      </Button>
    );
  }

  return (
    <div className="relative w-full">
      <Button
        ref={buttonRef}
        variant="outline"
        type="button"
        className={cn(
          "w-full min-h-9 h-auto py-2 px-3 justify-start text-left",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        )}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
            {selectedValues.length === 0 ? (
              <span className="text-muted-foreground text-sm">Select multiple options</span>
            ) : selectedValues.length <= 2 ? (
              selectedValues.map((value) => {
                const option = validOptions.find((opt) => opt.value === value);
                return (
                  <span
                    key={value}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium whitespace-nowrap"
                  >
                    <span className="truncate max-w-[100px]">{option?.name || value}</span>
                  </span>
                );
              })
            ) : (
              <>
                {selectedValues.slice(0, 2).map((value) => {
                  const option = validOptions.find((opt) => opt.value === value);
                  return (
                    <span
                      key={value}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium whitespace-nowrap"
                    >
                      <span className="truncate max-w-[80px]">{option?.name || value}</span>
                    </span>
                  );
                })}
                <span className="inline-flex items-center px-2 py-0.5 text-xs text-muted-foreground font-medium whitespace-nowrap">
                  +{selectedValues.length - 2} more
                </span>
              </>
            )}
          </div>
        </div>
      </Button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground border rounded-md shadow-lg p-1 max-h-[300px] overflow-y-auto"
        >
          <div className="space-y-0.5">
            {validOptions.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <div
                  key={option.value}
                  className={cn(
                    "relative flex items-center gap-2 px-2 py-2 text-sm rounded-sm cursor-pointer transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isSelected && "bg-accent/50"
                  )}
                  onClick={() => toggleOption(option.value)}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-4 h-4 border-2 rounded-sm transition-all flex-shrink-0",
                      isSelected 
                        ? "bg-primary border-primary" 
                        : "border-muted-foreground/30 bg-background"
                    )}
                  >
                    {isSelected && (
                      <CheckIcon className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                  <span className="flex-1 truncate">{option.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

