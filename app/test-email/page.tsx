"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, CheckCircle, AlertCircle, MailCheck, Info } from "lucide-react";

export default function TestEmailPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const sendOtpMutation = useMutation(api.sendOtp.sendOtp);

  const handleTestEmail = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const result = await sendOtpMutation({ email });
      setResult(result);
      console.log("Full result:", result);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to send OTP");
      console.error("Error details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Email Test Page</h1>
          <p className="text-muted-foreground mt-2">
            Test email delivery for OTP authentication
          </p>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Testing Mode:</strong> During testing, emails can only be sent to <code className="bg-muted px-1 rounded">gajjelasaicharan2003@gmail.com</code> (your verified email). 
            For other email addresses, the OTP will be included in the response for testing purposes.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Test Email Sending
            </CardTitle>
            <CardDescription>
              Enter an email address to test OTP delivery
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="test@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Try: <code className="bg-muted px-1 rounded">gajjelasaicharan2003@gmail.com</code> for actual email delivery
              </p>
            </div>

            <Button
              onClick={handleTestEmail}
              disabled={isLoading || !email}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Email...
                </>
              ) : (
                "Test Email Delivery"
              )}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert>
                <div className="flex items-start gap-3">
                  {result.emailFailed ? (
                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                  ) : (
                    <MailCheck className="h-4 w-4 text-green-500 mt-0.5" />
                  )}
                  <AlertDescription>
                    <div className="space-y-2">
                      <p><strong>Status:</strong> {result.success ? "Success" : "Failed"}</p>
                      <p><strong>Message:</strong> {result.message}</p>
                      
                      {result.emailFailed ? (
                        <>
                          <p><strong>Email Failed:</strong> Yes</p>
                          {result.error && <p><strong>Error:</strong> {result.error}</p>}
                          <p><strong>OTP Code:</strong> <code className="bg-muted px-2 py-1 rounded">{result.otpCode}</code></p>
                          {result.note && (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {result.note}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <p><strong>Email Sent:</strong> Successfully!</p>
                          <p className="text-sm text-muted-foreground">
                            Check your email inbox and spam folder for the OTP
                          </p>
                        </>
                      )}
                    </div>
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-semibold">✅ API Key Configured</h4>
              <p className="text-sm text-muted-foreground">
                Resend API key is now hardcoded in the function
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Sandbox Domain Active</h4>
              <p className="text-sm text-muted-foreground">
                Using: onboarding@resend.dev (pre-verified domain)
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">⚠️ Testing Limitations</h4>
              <p className="text-sm text-muted-foreground">
                Can only send emails to your verified email: gajjelasaicharan2003@gmail.com
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Email Template Ready</h4>
              <p className="text-sm text-muted-foreground">
                Professional HTML email template with styling
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-semibold">1. Test with Your Email</h4>
              <p className="text-sm text-muted-foreground">
                Use gajjelasaicharan2003@gmail.com to test actual email delivery
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">2. Test with Other Emails</h4>
              <p className="text-sm text-muted-foreground">
                Use any other email to see OTP in response (for testing)
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">3. Check Email Inbox</h4>
              <p className="text-sm text-muted-foreground">
                Look for OTP email in your inbox and spam folder
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">4. Test on Mobile</h4>
              <p className="text-sm text-muted-foreground">
                Try logging in on mobile device to verify email delivery works
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Production Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-semibold">🚀 To Enable Full Email Delivery</h4>
              <p className="text-sm text-muted-foreground">
                1. Verify your domain at resend.com/domains
              </p>
              <p className="text-sm text-muted-foreground">
                2. Update the from email to use your verified domain
              </p>
              <p className="text-sm text-muted-foreground">
                3. Remove the email address restriction in the code
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
