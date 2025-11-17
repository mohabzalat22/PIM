import { Button } from "@/components/ui/button";
import { Trash2Icon, XIcon } from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
  onDelete: () => void;
  onClearSelection: () => void;
}

export function BulkActionBar({
  selectedCount,
  onDelete,
  onClearSelection,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
        >
          <Trash2Icon className="w-4 h-4 mr-2" />
          Delete Selected
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearSelection}
        >
          <XIcon className="w-4 h-4 mr-2" />
          Clear Selection
        </Button>
      </div>
    </div>
  );
}
