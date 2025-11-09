import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface dateTypeProps {
  initialValue?: string; // Format: "fromDate:toDate" or "fromDate" or "toDate"
  placeholder?: string;
  onValueChange?: (value: string) => void; // Returns date range string or empty string
}

export function DateType(props: dateTypeProps) {
  const { initialValue = "", onValueChange, placeholder = "Select date range" } = props;
  
  // Parse initial value - format: "fromDate:toDate" or single date
  const parseInitialValue = (value: string): { from: string; to: string } => {
    if (!value) return { from: "", to: "" };
    const parts = value.split(":");
    return {
      from: parts[0] || "",
      to: parts[1] || "",
    };
  };

  const [fromDate, setFromDate] = useState(parseInitialValue(initialValue).from);
  const [toDate, setToDate] = useState(parseInitialValue(initialValue).to);

  // Update local state when initialValue prop changes
  useEffect(() => {
    const parsed = parseInitialValue(initialValue);
    setFromDate(parsed.from);
    setToDate(parsed.to);
  }, [initialValue]);

  // Format value for parent component: "fromDate:toDate" or "fromDate" or "toDate" or ""
  const formatValue = (from: string, to: string): string => {
    if (from && to) {
      return `${from}:${to}`;
    } else if (from) {
      return from;
    } else if (to) {
      return `:${to}`;
    }
    return "";
  };

  const handleFromDateChange = (value: string) => {
    setFromDate(value);
    const newValue = formatValue(value, toDate);
    onValueChange?.(newValue);
  };

  const handleToDateChange = (value: string) => {
    setToDate(value);
    const newValue = formatValue(fromDate, value);
    onValueChange?.(newValue);
  };

  const clearDates = () => {
    setFromDate("");
    setToDate("");
    onValueChange?.("");
  };

  const hasValue = fromDate || toDate;

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center gap-2">
        <div className="flex-1 space-y-1">
          <Label htmlFor="from-date" className="text-xs text-muted-foreground">
            From Date
          </Label>
          <Input
            id="from-date"
            type="date"
            value={fromDate}
            onChange={(e) => handleFromDateChange(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex-1 space-y-1">
          <Label htmlFor="to-date" className="text-xs text-muted-foreground">
            To Date
          </Label>
          <Input
            id="to-date"
            type="date"
            value={toDate}
            onChange={(e) => handleToDateChange(e.target.value)}
            className="w-full"
            min={fromDate || undefined} // Ensure to date is not before from date
          />
        </div>
        {hasValue && (
          <div className="flex items-end pb-0.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearDates}
              className="h-9 w-9 p-0"
              title="Clear dates"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      {fromDate && toDate && fromDate > toDate && (
        <p className="text-xs text-red-500">
          To date must be after from date
        </p>
      )}
    </div>
  );
}

