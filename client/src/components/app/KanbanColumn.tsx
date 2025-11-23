import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanCard } from "./KanbanCard";
import type Product from "@/interfaces/product.interface";
import type { ProductStatus } from "@/interfaces/product.interface";

interface KanbanColumnProps {
  id: ProductStatus;
  title: string;
  color: string;
  products: Product[];
}

export function KanbanColumn({ id, title, color, products }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-80 rounded-lg border-2 ${color} ${
        isOver ? "ring-2 ring-blue-500 ring-offset-2" : ""
      } transition-all duration-200`}
    >
      <div className="p-4 border-b border-gray-300">
        <h3 className="font-semibold text-lg flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm font-normal text-muted-foreground bg-white px-2 py-1 rounded-full">
            {products.length}
          </span>
        </h3>
      </div>

      <div className="p-4 space-y-3 min-h-[500px] max-h-[calc(100vh-300px)] overflow-y-auto">
        <SortableContext
          items={products.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {products.map((product) => (
            <KanbanCard key={product.id} product={product} />
          ))}
        </SortableContext>

        {products.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            No products in this stage
          </div>
        )}
      </div>
    </div>
  );
}
