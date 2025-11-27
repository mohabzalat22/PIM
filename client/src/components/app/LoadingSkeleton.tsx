import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  variant?: "table" | "card" | "form" | "text";
  rows?: number;
  className?: string;
}

export function LoadingSkeleton({
  variant = "card",
  rows = 3,
  className,
}: LoadingSkeletonProps) {
  if (variant === "table") {
    return (
      <div className={cn("space-y-3", className)}>
        {/* Table header */}
        <div className="flex gap-4 pb-3 border-b">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-muted rounded shimmer flex-1" />
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 py-3">
            {[1, 2, 3, 4, 5].map((j) => (
              <div key={j} className="h-4 bg-muted rounded shimmer flex-1" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-3", className)}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-6 space-y-3">
            <div className="h-4 bg-muted rounded shimmer w-3/4" />
            <div className="h-8 bg-muted rounded shimmer w-1/2" />
            <div className="h-3 bg-muted rounded shimmer w-full" />
            <div className="h-3 bg-muted rounded shimmer w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "form") {
    return (
      <div className={cn("space-y-6", className)}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-muted rounded shimmer w-24" />
            <div className="h-10 bg-muted rounded shimmer w-full" />
          </div>
        ))}
      </div>
    );
  }

  // text variant
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-muted rounded shimmer"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  );
}
