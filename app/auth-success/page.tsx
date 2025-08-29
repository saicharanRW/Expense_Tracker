"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  
  const getOrCreateUser = useMutation(api.auth.getOrCreateUser);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const nameParam = searchParams.get('name');
    const pictureParam = searchParams.get('picture');
    const googleIdParam = searchParams.get('google_id');

    if (emailParam && nameParam && googleIdParam) {
      // Create or update user in Convex
      const createUser = async () => {
        try {
          const user = await getOrCreateUser({
            email: emailParam,
            name: nameParam,
            picture: pictureParam || "",
            googleId: googleIdParam,
          });

          // Login with the user data - temporary fix without name property
          login({
            _id: user._id,
            email: user.email,
            picture: user.picture || "",
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            provider: user.provider,
          } as any); // Temporary type assertion

          setStatus('success');
          
          // Redirect to main page after a short delay
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } catch (error) {
          console.error('Failed to create user:', error);
          setStatus('error');
          setErrorMessage('Failed to create user account. Please try again.');
        }
      };

      createUser();
    } else {
      // Missing parameters - redirect to login
      router.push("/login?error=missing_params");
    }
  }, [searchParams, login, router, getOrCreateUser]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Setting Up Your Account</CardTitle>
            <CardDescription>
              Please wait while we create your account...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>Creating your Expense Tracker account...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Account Setup Failed</CardTitle>
            <CardDescription>
              There was an error creating your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
            <div className="text-center">
              <button
                onClick={() => router.push('/login')}
                className="text-primary hover:underline"
              >
                Return to Login
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Authentication Successful!</CardTitle>
          <CardDescription>
            Setting up your account...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>Welcome to Expense Tracker!</strong></p>
                <p>Your account has been created successfully.</p>
                <p>Redirecting you to the dashboard...</p>
              </div>
            </AlertDescription>
          </Alert>

          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Please wait while we set up your account...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}