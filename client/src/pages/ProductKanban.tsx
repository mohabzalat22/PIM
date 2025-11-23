import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { PageLayout } from "@/components/app/PageLayout";
import { KanbanColumn } from "@/components/app/KanbanColumn";
import { KanbanCard } from "@/components/app/KanbanCard";
import { ProductService } from "@/services/product.service";
import type Product from "@/interfaces/product.interface";
import type { ProductStatus } from "@/interfaces/product.interface";
import { asyncWrapper } from "@/utils/asyncWrapper";
import Loading from "@/components/app/loading";

const WORKFLOW_STAGES: { id: ProductStatus; label: string; color: string }[] = [
  { id: "DRAFT", label: "Draft", color: "bg-gray-100 border-gray-300" },
  { id: "ENRICHMENT", label: "Enrichment", color: "bg-yellow-100 border-yellow-300" },
  { id: "VALIDATION", label: "Validation", color: "bg-orange-100 border-orange-300" },
  { id: "APPROVAL", label: "Approval", color: "bg-purple-100 border-purple-300" },
  { id: "PUBLISHING", label: "Publishing", color: "bg-green-100 border-green-300" },
];

export default function ProductKanban() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductService.getAll(1, 1000, {
        search: "",
        type: "",
        status: "",
        categoryId: "",
        attributeFilters: {},
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setProducts(response.data as Product[]);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProducts();
  }, []);

  const getProductsByStatus = (status: ProductStatus) => {
    return products.filter((product) => product.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeProduct = products.find((p) => p.id === active.id);
    if (!activeProduct) return;

    // Check if dragging over a column (container)
    const overStatus = over.id as ProductStatus;
    if (WORKFLOW_STAGES.some((stage) => stage.id === overStatus)) {
      if (activeProduct.status !== overStatus) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === active.id
              ? { ...product, status: overStatus }
              : product
          )
        );
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeProduct = products.find((p) => p.id === active.id);
    if (!activeProduct) return;

    const newStatus = activeProduct.status;
    if (!newStatus) return;

    // Update product status in backend
    await asyncWrapper(async () => {
      await ProductService.update(activeProduct.id, { status: newStatus });
      toast.success(`Product moved to ${WORKFLOW_STAGES.find((s) => s.id === newStatus)?.label}`);
      await fetchProducts();
    });
  };

  const activeProduct = activeId ? products.find((p) => p.id === activeId) : null;

  if (loading) {
    return <Loading />;
  }

  return (
    <PageLayout
      title="Product Workflow"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {WORKFLOW_STAGES.map((stage) => (
            <KanbanColumn
              key={stage.id}
              id={stage.id}
              title={stage.label}
              color={stage.color}
              products={getProductsByStatus(stage.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeProduct ? <KanbanCard product={activeProduct} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </PageLayout>
  );
}
