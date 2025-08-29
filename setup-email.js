#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Expense Tracker Email Setup\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function setupEmail() {
  try {
    // Check if .env.local already exists
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      console.log('⚠️  .env.local already exists. This will overwrite it.\n');
      const overwrite = await askQuestion('Do you want to continue? (y/N): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('Setup cancelled.');
        rl.close();
        return;
      }
    }

    console.log('📧 Setting up email service for OTP delivery...\n');

    // Get Resend API key
    const apiKey = await askQuestion('Enter your Resend API key: ');
    if (!apiKey || !apiKey.startsWith('re_')) {
      console.log('❌ Invalid Resend API key. It should start with "re_"');
      rl.close();
      return;
    }

    // Get from email
    const fromEmail = await askQuestion('Enter your from email (or press Enter for sandbox): ');
    const finalFromEmail = fromEmail || 'onboarding@resend.dev';

    // Create environment file content
    const envContent = `# Email Service Configuration
# Get your API key from https://resend.com
RESEND_API_KEY=${apiKey}

# Update the from email address with your verified domain
# Example: noreply@yourdomain.com
# For testing, you can use: onboarding@resend.dev
RESEND_FROM_EMAIL=${finalFromEmail}

# Convex Configuration (if not already set)
# NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
`;

    // Write to .env.local
    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ Environment file created successfully!');
    console.log(`📁 File location: ${envPath}`);
    console.log('\n📋 Next steps:');
    console.log('1. Restart your development server');
    console.log('2. Test email delivery at /test-email');
    console.log('3. Check your email inbox for OTP codes');
    
    if (finalFromEmail === 'onboarding@resend.dev') {
      console.log('\n⚠️  Note: Using sandbox domain. For production, verify your own domain.');
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

setupEmail();
