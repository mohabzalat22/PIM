import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PackageIcon, UserIcon } from "lucide-react";
import type Product from "@/interfaces/product.interface";
import { useNavigate } from "react-router-dom";

interface KanbanCardProps {
  product: Product;
  isDragging?: boolean;
}

export function KanbanCard({ product, isDragging = false }: KanbanCardProps) {
  const navigate = useNavigate();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const handleClick = () => {
    // Only navigate if not dragging
    if (!isSortableDragging && !isDragging) {
      navigate(`/products/${product.id}`);
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
        isDragging ? "shadow-lg ring-2 ring-blue-500" : ""
      }`}
      onClick={handleClick}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <PackageIcon className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono text-sm font-semibold">{product.sku}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {product.type}
          </Badge>
        </div>

        {product.assignedUser && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <UserIcon className="h-3 w-3" />
            <span>{product.assignedUser.name}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {product.productCategories?.length || 0} categories
          </span>
          <span>
            {product.productAttributeValues?.length || 0} attributes
          </span>
        </div>

        <div className="text-xs text-muted-foreground">
          Created: {new Date(product.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}
