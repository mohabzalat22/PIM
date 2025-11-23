export interface WorkflowHistoryEntry {
  id: number;
  productId: number;
  fromStatus: string | null;
  toStatus: string;
  changedById: number | null;
  notes: string | null;
  createdAt: string;
  changedBy?: {
    id: number;
    name: string;
    email: string;
  } | null;
}
