import { Button } from "@/components/ui/button";
import apiClient from "@/api/apiClient";
import { asyncWrapper } from "@/utils/asyncWrapper";
import { useState } from "react";

interface Props {
  className?: string;
  /** Render a more compact/smaller button. Defaults to true to make the button unobtrusive in settings. */
  compact?: boolean;
}

export function SubscriptionButton({ className, compact = true }: Props) {
  const [loading, setLoading] = useState(false);

  const handleManage = async () => {
    setLoading(true);
    const result = await asyncWrapper(
      () => apiClient.post('/payment/checkout/create-portal-session'),
      (error) => {
        console.error('Failed to create portal session:', error);
      }
    );
    setLoading(false);

    const url = result?.data?.data?.url;
    if (url) {
      // redirect to Stripe portal session
      window.location.href = url;
    }
  };

  // compact: slightly smaller height, smaller text and padding
  const compactClass = compact ? "h-7 text-xs px-2 has-[>svg]:px-2" : "";

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleManage}
      className={["flex items-center justify-center gap-2", compactClass, className]
        .filter(Boolean)
        .join(" ")}
      aria-label="Manage subscription"
    >
      {/* Credit-card style icon (keeps dependencies minimal) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <path d="M1 10h22" />
      </svg>

      <span>{loading ? 'Opening...' : 'Manage Subscription'}</span>
    </Button>
  );
}

export default SubscriptionButton;
