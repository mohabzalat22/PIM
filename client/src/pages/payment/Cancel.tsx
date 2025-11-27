import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from "lucide-react";

export default function Cancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-destructive/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 border-destructive/20 shadow-xl">
          <CardHeader className="text-center space-y-4 pb-4">
            <div className="flex justify-center">
              <XCircle className="w-20 h-20 text-destructive" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Payment Cancelled
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-center">
            <p className="text-lg">
              Your subscription payment was cancelled.
            </p>
            <p className="text-muted-foreground">
              No charges have been made to your account. You can try again whenever you're ready.
            </p>
            
            <div className="bg-muted/50 rounded-lg p-4 space-y-2 mt-6">
              <div className="flex items-start gap-2">
                <HelpCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-semibold">Need Help?</p>
                  <p className="text-sm text-muted-foreground">
                    If you encountered any issues during checkout, please contact our support team.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              onClick={() => navigate("/subscriptions")}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg group"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Try Again
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Questions? Contact us at support@xstore.com
        </p>
      </div>
    </div>
  );
}
