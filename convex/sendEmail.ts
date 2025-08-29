import { action } from "./_generated/server";
import { v } from "convex/values";

// This function will be used when email service is properly configured
export const sendEmail = action({
  args: {
    to: v.string(),
    subject: v.string(),
    html: v.string(),
  },
  handler: async (ctx, args) => {
    const { to, subject, html } = args;
    
    // Check if we have the required environment variables
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    
    if (!apiKey) {
      throw new Error("RESEND_API_KEY not configured in Convex environment");
    }
    
    try {
      // Import Resend dynamically to avoid issues during deployment
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      
      const { data, error } = await resend.emails.send({
        from: `Expense Tracker <${fromEmail}>`,
        to,
        subject,
        html,
      });
      
      if (error) {
        throw new Error(`Email sending failed: ${error.message}`);
      }
      
      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error("Failed to send email:", error);
      throw error;
    }
  },
});
