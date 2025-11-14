import type { ReactNode } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";

interface DataTableProps {
  headerCells: ReactNode;
  rows: ReactNode;
  colSpan: number;
  isEmpty: boolean;
  emptyMessage: string;
}

export function DataTable({
  headerCells,
  rows,
  colSpan,
  isEmpty,
  emptyMessage,
}: DataTableProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>{headerCells}</TableRow>
        </TableHeader>
        <TableBody>
          {isEmpty ? (
            <TableRow>
              <TableCell colSpan={colSpan} className="text-center py-8">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows
          )}
        </TableBody>
      </Table>
    </div>
  );
}
