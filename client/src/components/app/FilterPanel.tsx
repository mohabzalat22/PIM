import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { FilterIcon, XIcon } from "lucide-react";

interface FilterPanelProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  onClear: () => void;
  mainFilters: ReactNode;
  advancedFilters?: ReactNode;
}

export function FilterPanel({
  showFilters,
  onToggleFilters,
  onClear,
  mainFilters,
  advancedFilters,
}: FilterPanelProps) {
  return (
    <div className="border rounded-lg p-4 bg-muted/60">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FilterIcon className="w-4 h-4" />
          <span className="font-medium">Filters</span>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onToggleFilters}>
            {showFilters ? "Hide" : "Show"} Filters
          </Button>
          <Button variant="outline" size="sm" onClick={onClear}>
            <XIcon className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {mainFilters}

      {showFilters && advancedFilters && (
        <div className="pt-4 border-t">{advancedFilters}</div>
      )}
    </div>
  );
}
