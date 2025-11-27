import apiClient from "@/api/apiClient";
import { asyncWrapper } from "@/utils/asyncWrapper";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

type SubscriptionStatus = "ACTIVE" | "INACTIVE" | "CANCELED" | "PAST_DUE";

interface Subscription {
  id: number;
  plan: string;
  status: SubscriptionStatus;
  startDate?: string;
  endDate?: string;
  stripeSubscriptionId?: string;
}

export function Subscriptions() {
  const [selectedPriceId, setSelectedPriceId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [isFetchingSubscription, setIsFetchingSubscription] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentSubscription = async () => {
      setIsFetchingSubscription(true);
      const result = await asyncWrapper(
        () => apiClient.get('/payment/checkout/subscription-status'),
        (error) => {
          console.error('Failed to fetch subscription:', error);
          setIsFetchingSubscription(false);
        }
      );
      if (result) {
        setCurrentSubscription(result.data.data);
      }
      setIsFetchingSubscription(false);
    };

    fetchCurrentSubscription();
  }, []);

  useEffect(() => {
    if (selectedPriceId) {
      const subscribe = async () => {
        setIsLoading(true);
        setError('');
        const result = await asyncWrapper(
          () => apiClient.post('/payment/checkout', { priceId: selectedPriceId }),
          (error: unknown) => {
            console.error('Subscription error:', error);
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create subscription. Please try again.';
            setError(errorMessage);
            setIsLoading(false);
          }
        );
        if (result) {
          window.location.href = result.data.data.url;
        } else {
          setIsLoading(false);
        }
      };
      subscribe();
    }
  }, [selectedPriceId]);

  const plans = [
    {
      id: 'plan_1',
      name: 'Basic Plan',
      price: '$5',
      period: 'month',
      priceId: 'price_1SWyzxFagVeiLfmKkpeIqCCN',
      features: [
        'Unlimited Products',
        'Advanced Analytics',
        'Priority Support',
        'Team Collaboration',
      ],
    },
  ];

  const handleSubscribe = (priceId: string) => {
    if (!isLoading && !hasActiveSubscription) {
      setSelectedPriceId(priceId);
    }
  };

  const hasActiveSubscription = currentSubscription?.status === "ACTIVE";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Unlock the full potential of XStore PIM
          </p>
        </div>

        {/* Current Subscription Status */}
        {!isFetchingSubscription && currentSubscription && (
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Current Plan: <span className="capitalize">{currentSubscription.plan}</span></p>
                    <p className="text-sm text-muted-foreground">
                      Status: <Badge variant={currentSubscription.status === "ACTIVE" ? "default" : "secondary"}>
                        {currentSubscription.status}
                      </Badge>
                    </p>
                  </div>
                </div>
                {currentSubscription.status === "ACTIVE" && (
                  <Button
                    onClick={() => navigate("/dashboard")}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-semibold text-destructive">Subscription Error</p>
                  <p className="text-sm text-destructive/90">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plans Grid */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          {plans.map((planItem) => (
            <Card 
              key={planItem.id} 
              className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
            >
              {/* Gradient Background Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />
              
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">{planItem.name}</CardTitle>
                  {hasActiveSubscription && currentSubscription?.plan.toLowerCase() === planItem.name.toLowerCase().split(' ')[0] && (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {planItem.price}
                  </span>
                  <span className="text-muted-foreground">/{planItem.period}</span>
                </div>

                <ul className="space-y-3">
                  {planItem.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
                    hasActiveSubscription
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5'
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                  onClick={() => handleSubscribe(planItem.priceId)}
                  disabled={isLoading || hasActiveSubscription}
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : hasActiveSubscription ? (
                    'Already Subscribed'
                  ) : (
                    'Subscribe Now'
                  )}
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Secure payment powered by Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
