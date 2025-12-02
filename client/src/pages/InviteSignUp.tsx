import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { SignUp } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Building2 } from "lucide-react";

export default function InviteSignUpPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();
  
  const token = searchParams.get("token") || "";
  const workspaceName = searchParams.get("workspace") || "a workspace";
  const role = searchParams.get("role") || "member";

  // Redirect to accept invitation if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn && token) {
      navigate(`/workspace/invite?token=${token}`);
    }
  }, [isLoaded, isSignedIn, token, navigate]);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Invalid Link</CardTitle>
            <CardDescription>
              No invitation token found. Please check your invitation link.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Build the redirect URL to return to the invitation after sign-up
  const redirectUrl = `/workspace/invite?token=${token}`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Invitation Info Card */}
        <Card className="w-full">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Mail className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl">Join Workspace</CardTitle>
            <CardDescription className="text-base">
              You've been invited to join a workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-lg truncate">{workspaceName}</p>
                  <p className="text-sm text-muted-foreground">
                    Role: <span className="font-medium capitalize">{role}</span>
                  </p>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Create an account to accept this invitation
            </p>
          </CardContent>
        </Card>

        {/* Clerk Sign Up Component */}
        <div className="flex items-center justify-center">
          <SignUp 
            routing="path" 
            path="/invite/sign-up"
            forceRedirectUrl={redirectUrl}
            signInUrl={`/invite/sign-in?token=${token}&workspace=${encodeURIComponent(workspaceName)}&role=${role}`}
          />
        </div>
      </div>
    </div>
  );
}
