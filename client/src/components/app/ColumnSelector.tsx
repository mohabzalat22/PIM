import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnsIcon } from "lucide-react";

export interface Column {
  id: string;
  label: string;
  visible: boolean;
  locked?: boolean; // Columns that can't be hidden
}

interface ColumnSelectorProps {
  columns: Column[];
  onColumnChange: (columnId: string, visible: boolean) => void;
}

export function ColumnSelector({ columns, onColumnChange }: ColumnSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <ColumnsIcon className="w-4 h-4 mr-2" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.visible}
            onCheckedChange={(checked) => onColumnChange(column.id, checked)}
            disabled={column.locked}
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
