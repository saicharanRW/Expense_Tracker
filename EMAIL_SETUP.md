# Email Setup Guide for OTP Authentication

This guide will help you set up email delivery for OTP codes in your Expense Tracker application.

## Quick Setup (Resend - Recommended)

### Step 1: Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### Step 2: Get API Key
1. Log into your Resend dashboard
2. Go to "API Keys" section
3. Click "Create API Key"
4. Copy the generated API key

### Step 3: Configure Environment
1. Copy the example environment file:
   ```bash
   cp env.example .env.local
   ```

2. Edit `.env.local` and add your API key:
   ```bash
   RESEND_API_KEY=re_1234567890abcdef...
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   ```

### Step 4: Domain Verification
1. In Resend dashboard, go to "Domains"
2. Add your domain (e.g., `yourdomain.com`)
3. Follow the DNS verification steps
4. Wait for verification (usually takes a few minutes)

**For Testing (No Domain Required):**
- Resend provides a sandbox domain: `onboarding@resend.dev`
- Update your `.env.local`:
  ```bash
  RESEND_FROM_EMAIL=onboarding@resend.dev
  ```

## Alternative Email Providers

### Option 1: SendGrid
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Get API key from dashboard
3. Update `lib/email.ts` to use SendGrid SDK

### Option 2: AWS SES
1. Set up AWS account
2. Configure SES in your region
3. Get access keys and update email service

### Option 3: Custom SMTP
1. Use your own email server
2. Update `lib/email.ts` with SMTP configuration
3. Configure authentication and security

## Testing Email Delivery

### Development Testing
1. Start your development server: `npm run dev`
2. Go to `/login`
3. Enter your email address
4. Click "Send OTP"
5. Check your email inbox (and spam folder)

### Troubleshooting
- **Email not received**: Check spam folder, verify API key
- **API errors**: Check Resend dashboard for error logs
- **Domain issues**: Ensure domain is verified and DNS is correct

## Production Considerations

### Security
- Keep API keys secure in environment variables
- Use verified domains only
- Implement rate limiting for OTP requests

### Reliability
- Monitor email delivery rates
- Set up webhook notifications for failures
- Have fallback email providers

### Compliance
- Ensure GDPR compliance for EU users
- Include unsubscribe options in emails
- Follow email marketing best practices

## Environment Variables Reference

```bash
# Required
RESEND_API_KEY=your_api_key_here

# Optional (defaults to onboarding@resend.dev for testing)
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Convex (if not already set)
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```

## Email Template Customization

The email template is located in `lib/email.ts`. You can customize:

- **Styling**: Update CSS in the HTML template
- **Content**: Modify the email text and layout
- **Branding**: Add your logo and company information
- **Localization**: Support multiple languages

## Support

If you encounter issues:

1. Check the [Resend documentation](https://resend.com/docs)
2. Verify your environment configuration
3. Check the browser console for error messages
4. Review the troubleshooting section in the main README

## Migration from Console Logging

The system automatically falls back to console logging if email delivery fails:

1. **Development**: OTP codes still appear in console for testing
2. **Production**: Ensure email service is properly configured
3. **Fallback**: Users get clear messages about email delivery status
