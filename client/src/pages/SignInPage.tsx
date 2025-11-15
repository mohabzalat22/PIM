import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/40 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card/80 backdrop-blur-sm p-6 shadow-lg">
        <h1 className="text-xl font-semibold mb-2">Welcome back</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Sign in to access your XStore PIM workspace.
        </p>
        <SignIn routing="path" path="/sign-in" redirectUrl="/dashboard" />
      </div>
    </div>
  );
}
