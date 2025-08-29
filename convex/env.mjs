// Convex environment configuration
// This file sets up environment variables for Convex functions

export const config = {
  // Email service configuration
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
  
  // Other configuration
  NODE_ENV: process.env.NODE_ENV || "development",
};
