import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { WorkspaceInviteService } from "@/services/workspaceInvite.service";
import { asyncWrapper } from "@/utils/asyncWrapper";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, Loader2 } from "lucide-react";

export default function AcceptInvitation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();
  
  const [isValidating, setIsValidating] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    message?: string;
    workspace?: { id: number; name: string };
    role?: string;
    email?: string;
  } | null>(null);

  const token: string = searchParams.get("token") || "";

  // Validate token on mount (works for both authenticated and unauthenticated users)
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setValidationResult({
          valid: false,
          message: "No invitation token provided",
        });
        setIsValidating(false);
        return;
      }

      await asyncWrapper(
        async () => {
          const response = await WorkspaceInviteService.validateToken(token);
          setValidationResult({
            valid: true,
            workspace: response.data.workspace,
            role: response.data.role,
            email: response.data.email,
          });
        },
        (error) => {
          setValidationResult({
            valid: false,
            message: error.message || "Invalid or expired invitation",
          });
        }
      );
      setIsValidating(false);
    };

    if (isLoaded) {
      validateToken();
    }
  }, [token, isLoaded]);

  // Auto-redirect unauthenticated users to sign-up AFTER validation
  useEffect(() => {
    if (isLoaded && !isSignedIn && validationResult?.valid) {
      const workspaceName = validationResult.workspace?.name || "";
      const role = validationResult.role || "";
      navigate(`/invite/sign-up?token=${token}&workspace=${encodeURIComponent(workspaceName)}&role=${role}`);
    }
  }, [isLoaded, isSignedIn, validationResult, token, navigate]);



  const handleAcceptInvitation = async () => {
    if (!token) return;

    setIsAccepting(true);
    await asyncWrapper(async () => {
      const response = await WorkspaceInviteService.acceptInvitation({ token });
      
      toast.success(`Successfully joined ${response.data.workspace.name}!`);
      
      // Redirect to workspaces page
      navigate(`/workspaces`);
    });
    setIsAccepting(false);
  };

  // Auto-accept if user is signed in and invitation is valid
  useEffect(() => {
    if (
      isLoaded &&
      isSignedIn &&
      validationResult?.valid &&
      !isAccepting
    ) {
      handleAcceptInvitation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, validationResult]);

  // Loading state
  if (!isLoaded || isValidating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">
              Validating invitation...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invalid invitation
  if (!validationResult?.valid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle>Invalid Invitation</CardTitle>
            <CardDescription>
              {validationResult?.message || "This invitation link is invalid or has expired."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate("/")}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Accepting invitation
  if (isAccepting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">
              Joining workspace...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User not signed in - redirecting automatically
  if (!isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">
              Redirecting to sign up...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Should not reach here as auto-accept handles signed-in users
  return null;
}
