import { Resend } from 'resend';

// Get API key from environment - works in both client and server
const apiKey = process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY;

// Initialize Resend with API key from environment
const resend = apiKey ? new Resend(apiKey) : null;

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    // Check if API key is configured
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured. Please check your environment variables.');
    }

    if (!resend) {
      throw new Error('Resend client not initialized. Check your API key configuration.');
    }

    // Use environment variable for from email or fallback to sandbox
    const fromEmail = process.env.RESEND_FROM_EMAIL || process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    console.log('Attempting to send email:', {
      from: fromEmail,
      to: options.to,
      subject: options.subject,
      hasApiKey: !!apiKey
    });

    const { data, error } = await resend.emails.send({
      from: `Expense Tracker <${fromEmail}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error('Resend API error:', error);
      throw new Error(`Email sending failed: ${error.message}`);
    }

    console.log('Email sent successfully:', data);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
}

export function generateOTPEmail(email: string, otp: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Verification - Expense Tracker</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background-color: white;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
        }
        .otp-container {
          text-align: center;
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin: 30px 0;
        }
        .otp-code {
          font-size: 32px;
          font-weight: bold;
          color: #2563eb;
          letter-spacing: 8px;
          font-family: 'Courier New', monospace;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #6b7280;
          font-size: 14px;
        }
        .warning {
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          color: #92400e;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">💰 Expense Tracker</div>
          <h1>OTP Verification</h1>
        </div>
        
        <p>Hello!</p>
        
        <p>You've requested to sign in to your Expense Tracker account. Use the OTP code below to complete your verification:</p>
        
        <div class="otp-container">
          <div class="otp-code">${otp}</div>
        </div>
        
        <p>This code will expire in <strong>10 minutes</strong> for security reasons.</p>
        
        <div class="warning">
          <strong>⚠️ Security Notice:</strong> Never share this OTP with anyone. Our team will never ask for your verification code.
        </div>
        
        <p>If you didn't request this code, please ignore this email.</p>
        
        <div class="footer">
          <p>This is an automated message from Expense Tracker.</p>
          <p>© ${new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    to: email,
    subject: 'Your OTP Code - Expense Tracker',
    html: html
  };
}
