# Convex Email Setup Guide

This guide explains how to properly configure email service in your Convex backend.

## 🚨 Current Issue

The error you're seeing occurs because:
1. Convex functions run in a serverless environment
2. Environment variables from `.env.local` are not accessible to Convex
3. The Resend client needs to be initialized with an API key

## 🔧 Solution: Configure Environment in Convex

### Step 1: Set Environment Variables in Convex Dashboard

1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Select your project: `prestigious-crow-853`
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

```
RESEND_API_KEY=re_your_actual_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### Step 2: Get Your Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up/login to your account
3. Go to **API Keys** section
4. Create a new API key
5. Copy the key (starts with `re_`)

### Step 3: Update Your sendOtp Function

Once environment variables are configured, you can update `convex/sendOtp.ts` to use email:

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { sendEmail } from "./sendEmail";

export const sendOtp = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const { email } = args;
    
    // Generate OTP and store in database
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    
    // Store OTP in database
    await ctx.db.insert("otpCodes", {
      email,
      code: otpCode,
      expiresAt,
      isUsed: false,
    });
    
    try {
      // Send email using Convex action
      const emailHtml = `
        <h1>Your OTP Code</h1>
        <p>Your verification code is: <strong>${otpCode}</strong></p>
        <p>This code expires in 10 minutes.</p>
      `;
      
      await ctx.scheduler.runAfter(0, "sendEmail", {
        to: email,
        subject: "OTP Verification - Expense Tracker",
        html: emailHtml,
      });
      
      return { 
        success: true, 
        message: "OTP sent successfully to your email!" 
      };
    } catch (error) {
      console.error("Email failed:", error);
      return { 
        success: true, 
        message: "OTP generated but email failed. Check console for code.",
        emailFailed: true,
        otpCode: otpCode
      };
    }
  },
});
```

## 🧪 Testing the Setup

### 1. Deploy to Convex

```bash
npx convex dev
```

### 2. Test Email Delivery

Visit `/test-email` to test if emails are being sent.

### 3. Check Convex Logs

In Convex dashboard, check the **Functions** → **Logs** section for any errors.

## 🔄 Alternative: Use Convex Actions

If you prefer to keep email logic in Convex, use the `sendEmail` action:

```typescript
// In your sendOtp function
await ctx.scheduler.runAfter(0, "sendEmail", {
  to: email,
  subject: "OTP Verification",
  html: `<p>Your OTP: ${otpCode}</p>`
});
```

## 📱 Why This Matters for Mobile Users

- **Console Not Accessible**: Mobile users can't see browser console
- **Email Required**: OTP must be delivered via email for mobile authentication
- **Professional Experience**: Email delivery provides better user experience
- **Cross-Platform**: Works on all devices and platforms

## 🚀 Production Deployment

### Vercel + Convex

1. Set environment variables in Vercel dashboard
2. Set environment variables in Convex dashboard
3. Deploy both services

### Other Platforms

1. Set environment variables in your hosting platform
2. Set environment variables in Convex dashboard
3. Ensure both services can communicate

## ❌ Common Issues

### Issue: "RESEND_API_KEY not configured"

**Solution**: Set the environment variable in Convex dashboard

### Issue: "Email sending failed: Unauthorized"

**Solution**: Verify your API key is correct and active

### Issue: "Email sending failed: Forbidden"

**Solution**: Check if your domain is verified in Resend

## ✅ Success Checklist

- [ ] Environment variables set in Convex dashboard
- [ ] Resend API key is valid and active
- [ ] Convex deployment successful
- [ ] Email test page working
- [ ] OTP emails being delivered
- [ ] Mobile users can authenticate

## 🔄 Current Status

**Development Mode**: OTP codes are logged to console and returned in response
**Production Ready**: When environment variables are configured, emails will be sent automatically

## 📞 Getting Help

1. Check Convex dashboard for environment variable configuration
2. Verify Resend API key in Resend dashboard
3. Check Convex function logs for errors
4. Test with `/test-email` page
5. Review this troubleshooting guide

## 🎯 Next Steps

1. **Configure Environment Variables** in Convex dashboard
2. **Deploy Updated Functions** to Convex
3. **Test Email Delivery** with `/test-email` page
4. **Verify Mobile Authentication** works properly
5. **Monitor Email Delivery** in Resend dashboard
