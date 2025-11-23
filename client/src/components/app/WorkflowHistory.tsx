import { useEffect, useState } from "react";
import { Clock, User, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WorkflowHistoryEntry } from "@/interfaces/workflowHistory.interface";
import { ProductWorkflowHistoryService } from "@/services/productWorkflowHistory.service";
import { toast } from "sonner";

interface WorkflowHistoryProps {
  productId: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "DRAFT":
      return "bg-gray-100 text-gray-800";
    case "ENRICHMENT":
      return "bg-yellow-100 text-yellow-800";
    case "VALIDATION":
      return "bg-orange-100 text-orange-800";
    case "APPROVAL":
      return "bg-purple-100 text-purple-800";
    case "PUBLISHING":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "DRAFT":
      return "Draft";
    case "ENRICHMENT":
      return "Enrichment";
    case "VALIDATION":
      return "Validation";
    case "APPROVAL":
      return "Approval";
    case "PUBLISHING":
      return "Publishing";
    default:
      return status;
  }
};

export function WorkflowHistory({ productId }: WorkflowHistoryProps) {
  const [history, setHistory] = useState<WorkflowHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await ProductWorkflowHistoryService.getByProductId(productId);
        setHistory(response.data || []);
      } catch (error) {
        toast.error("Failed to load workflow history");
      } finally {
        setLoading(false);
      }
    };

    void fetchHistory();
  }, [productId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workflow History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Loading history...</p>
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workflow History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No workflow history available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((entry, index) => (
            <div
              key={entry.id}
              className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0"
            >
              {/* Timeline indicator */}
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mt-1" />
                {index < history.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-200 mt-2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {entry.fromStatus && (
                    <Badge className={getStatusColor(entry.fromStatus)}>
                      {getStatusLabel(entry.fromStatus)}
                    </Badge>
                  )}
                  {entry.fromStatus && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                  <Badge className={getStatusColor(entry.toStatus)}>
                    {getStatusLabel(entry.toStatus)}
                  </Badge>
                </div>

                {entry.notes && (
                  <p className="text-sm text-muted-foreground">{entry.notes}</p>
                )}

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {entry.changedBy && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{entry.changedBy.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(entry.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
