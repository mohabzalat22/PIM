import { ModeToggle } from "@/components/mode-toggle";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import apiClient from "@/api/apiClient";
import { asyncWrapper } from "@/utils/asyncWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SubscriptionButton from "@/components/app/subscription-button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

type SubscriptionStatus = "ACTIVE" | "INACTIVE" | "CANCELED" | "PAST_DUE";

interface Subscription {
  id: number;
  plan: string;
  status: SubscriptionStatus;
  startDate?: string;
  endDate?: string;
  stripeSubscriptionId?: string;
}

export default function Settings() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscription = async () => {
      setIsLoading(true);
      const result = await asyncWrapper(
        () => apiClient.get("/payment/checkout/subscription-status"),
        (error) => {
          console.error("Failed to fetch subscription:", error);
          setIsLoading(false);
        }
      );
      if (result) {
        setSubscription(result.data.data);
      }
      setIsLoading(false);
    };

    fetchSubscription();
  }, []);

  const getStatusBadgeVariant = (status: SubscriptionStatus) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "INACTIVE":
        return "secondary";
      case "CANCELED":
        return "destructive";
      case "PAST_DUE":
        return "outline";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your appearance and application preferences.
        </p>
      </div>

      <Card className="p-4 space-y-6">
        <div className="space-y-1">
          <h2 className="text-sm font-medium">Appearance</h2>
          <p className="text-xs text-muted-foreground">
            Choose between light and dark mode for the interface.
          </p>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-sm">Theme</span>
          <ModeToggle />
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-sm font-medium">Subscription</h2>
              <p className="text-xs text-muted-foreground">
                View and manage your subscription plan.
              </p>
            </div>

            <div className="mt-2 sm:mt-0 ml-0 sm:ml-4">
              {isLoading ? (
                <Skeleton className="h-7 w-28 rounded-md" />
              ) : subscription ? (
                // compact button on the right of the header
                <SubscriptionButton className="" />
              ) : (
                // when there's no subscription show the View Plans action on the right
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate("/subscriptions")}
                  className="h-7 text-xs px-2"
                >
                  View Plans
                </Button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : subscription ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Plan</span>
                <span className="text-sm font-medium capitalize">{subscription.plan}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge variant={getStatusBadgeVariant(subscription.status)}>
                  {subscription.status}
                </Badge>
              </div>
              {subscription.startDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Start Date</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(subscription.startDate)}
                  </span>
                </div>
              )}
              {subscription.endDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">End Date</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(subscription.endDate)}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                You don't have an active subscription.
              </p>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <h2 className="text-sm font-medium">Account</h2>
          <p className="text-xs text-muted-foreground">
            Manage your profile and sign out of XStore PIM.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm">User</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </Card>
    </div>
  );
}
