"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import GoogleSignIn from "@/components/GoogleSignIn";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    // Check for error or success messages from OAuth callback
    const errorParam = searchParams.get("error");
    const emailParam = searchParams.get("email");
    const nameParam = searchParams.get("name");
    const pictureParam = searchParams.get("picture");
    const googleIdParam = searchParams.get("google_id");

    if (errorParam) {
      setError(getErrorMessage(errorParam));
    }

    if (emailParam && nameParam && googleIdParam) {
      // OAuth successful - create user session
      const user = {
        _id: googleIdParam,
        email: emailParam,
        name: nameParam,
        picture: pictureParam || "",
        isVerified: true,
        createdAt: Date.now(),
        provider: "google",
      };

      login(user);
      setInfo("Login successful! Redirecting to dashboard...");

      setTimeout(() => {
        router.push("/");
      }, 1500);
    }
  }, [searchParams, login, router]);

  const getErrorMessage = (error: string) => {
    switch (error) {
      case "no_code":
        return "Authentication was cancelled. Please try again.";
      case "token_exchange_failed":
        return "Authentication failed. Please try again.";
      case "user_info_failed":
        return "Could not retrieve user information. Please try again.";
      case "callback_error":
        return "An error occurred during authentication. Please try again.";
      default:
        return "Authentication failed. Please try again.";
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Sign in to Expense Tracker
          </CardTitle>
          <CardDescription>
            Track your spending and stay on top of your budget
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {info && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{info}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <GoogleSignIn />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Secure authentication powered by Google
              </p>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>
                  <strong>Why Google Sign-In?</strong>
                </p>
                <ul className="text-sm space-y-1">
                  <li>• No passwords to remember</li>
                  <li>• Works perfectly on mobile</li>
                  <li>• Secure and verified by Google</li>
                  <li>• One-click authentication</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Don&apos;t have an account?{" "}
              <span className="text-primary cursor-pointer hover:underline">
                Just sign in with Google above
              </span>
            </p>
            <p className="mt-2 text-xs">
              We&apos;ll create an account for you automatically
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
