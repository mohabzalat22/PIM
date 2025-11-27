import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function Success() {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 border-primary/20 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-4">
            <div className="flex justify-center">
              <div className={`relative ${showConfetti ? 'animate-bounce' : ''}`}>
                <CheckCircle2 className="w-20 h-20 text-primary" />
                {showConfetti && (
                  <>
                    <Sparkles className="w-6 h-6 text-primary absolute -top-2 -right-2 animate-pulse" />
                    <Sparkles className="w-4 h-4 text-primary absolute -bottom-1 -left-1 animate-pulse delay-100" />
                  </>
                )}
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Payment Successful!
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-center">
            <p className="text-lg font-medium">
              Welcome to MOLAB PIM! 🎉
            </p>
            <p className="text-muted-foreground">
              Your subscription has been activated successfully.
            </p>
            
            <div className="bg-primary/5 rounded-lg p-4 space-y-2 mt-6">
              <p className="text-sm font-semibold">What's Next?</p>
              <ul className="text-sm text-muted-foreground space-y-1 text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  Access unlimited products
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  View advanced analytics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  Collaborate with your team
                </li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg group"
              size="lg"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => navigate("/settings")}
              variant="outline"
              className="w-full"
            >
              View Subscription Details
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
