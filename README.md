# Expense Tracker with OTP Authentication

A modern expense tracking application built with Next.js, Convex, and TypeScript. Features user authentication via OTP verification and user-specific data storage.

## Features

- **Secure Authentication**: OTP-based email verification
- **User-Specific Data**: Each user sees only their own expenses
- **Real-time Updates**: Built with Convex for instant data synchronization
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Comprehensive Analytics**: Charts and insights for spending patterns
- **Category Management**: Organize expenses by predefined categories
- **Email Delivery**: OTP codes sent directly to user's email inbox

## Authentication Flow

1. **Email Entry**: User enters their email address
2. **OTP Generation**: System generates a 6-digit OTP and sends it via email
3. **OTP Verification**: User enters the OTP from their email to verify
4. **Account Creation/Login**: New users get accounts created automatically
5. **User-Specific Dashboard**: Each user sees only their own expense data

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Convex account and project
- Email service account (Resend recommended)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Expense_Tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up your Convex project:
   - Create a new project at [convex.dev](https://convex.dev)
   - Update the Convex URL in `app/providers.tsx`

4. Set up email service:
   - Create an account at [resend.com](https://resend.com)
   - Get your API key from the dashboard
   - Verify your domain (or use the sandbox domain for testing)

5. Configure environment variables:
   ```bash
   # Copy the example file
   cp env.example .env.local
   
   # Edit .env.local with your actual values
   RESEND_API_KEY=your_actual_api_key_here
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   ```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

### Email Service Setup

#### Option 1: Resend (Recommended)
1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Verify your domain (or use sandbox for testing)
4. Update `.env.local` with your API key

#### Option 2: Custom Email Provider
1. Update `lib/email.ts` with your email service
2. Modify the `sendEmail` function to use your provider
3. Update environment variables accordingly

### Database Migration (Important!)

If you have existing expense data from the previous version, you need to run the migration:

1. **Visit the Admin Page**: Navigate to `/admin`
2. **Run Migration**: Click "Run Migration" to update existing records
3. **Cleanup (Optional)**: Click "Cleanup Orphaned Data" to remove legacy records
4. **Test**: Verify that the application works correctly

### First Time Setup

1. Navigate to `/login`
2. Enter your email address
3. Click "Send OTP"
4. **Check your email inbox** for the OTP code
5. Enter the OTP and click "Verify & Sign In"
6. You'll be redirected to the main dashboard

## Database Schema

### Users Table
- `email`: User's email address (unique)
- `isVerified`: Boolean indicating if email is verified
- `createdAt`: Timestamp of account creation

### OTP Codes Table
- `email`: Email associated with the OTP
- `code`: 6-digit verification code
- `expiresAt`: Expiration timestamp (10 minutes)
- `isUsed`: Boolean indicating if OTP has been used

### Expenses Table
- `userId`: Reference to the user who owns this expense (optional for legacy records)
- `amount`: Expense amount
- `category`: Expense category
- `description`: Expense description
- `date`: Date of the expense
- `createdAt`: Timestamp of expense creation (optional for legacy records)

## Migration Functions

The application includes built-in migration functions to handle schema updates:

- **`migrateExpenses`**: Updates existing records with missing fields
- **`cleanupOrphanedExpenses`**: Removes records without userId
- **Admin Interface**: Accessible at `/admin` for easy migration management

## Security Features

- **OTP Expiration**: Codes expire after 10 minutes
- **Single Use**: Each OTP can only be used once
- **User Isolation**: Users can only access their own data
- **Email Validation**: Basic email format validation
- **Secure Email Delivery**: OTP sent via secure email service

## Production Considerations

For production deployment, consider:

1. **Email Service Integration**: ✅ Already implemented with Resend
2. **Rate Limiting**: Implement rate limiting for OTP requests
3. **Environment Variables**: Move all sensitive data to environment variables
4. **HTTPS**: Ensure all communications are encrypted
5. **Session Management**: Implement proper session handling
6. **Migration Strategy**: Plan database migrations carefully for production
7. **Domain Verification**: Verify your domain with the email service provider

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Convex (serverless backend)
- **Database**: Convex (built on top of PostgreSQL)
- **Email Service**: Resend (with fallback to console for development)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **UI Components**: Radix UI primitives

## File Structure

```
app/
├── admin/
│   └── page.tsx              # Database migration admin page
├── components/
│   ├── ExpenseTracker.tsx    # Main expense tracking component
│   ├── ProtectedRoute.tsx    # Authentication guard
│   └── ui/                   # Reusable UI components
├── contexts/
│   └── AuthContext.tsx       # User authentication context
├── login/
│   └── page.tsx              # Login page with OTP
├── layout.tsx                # Root layout with providers
├── page.tsx                  # Home page with auth check
└── providers.tsx             # Convex and Auth providers

convex/
├── schema.ts                 # Database schema definition
├── sendOtp.ts               # OTP generation and email sending
├── verifyOtp.ts             # OTP verification function
├── addExpense.ts            # Add expense mutation
├── getExpenses.ts           # Get user expenses query
├── migrateExpenses.ts       # Database migration function
└── cleanupOrphanedExpenses.ts # Cleanup orphaned data function

lib/
└── email.ts                 # Email service utilities
```

## Troubleshooting

### Schema Validation Errors

If you encounter schema validation errors:

1. **Check Migration Status**: Visit `/admin` to see if migration is needed
2. **Run Migration**: Use the migration function to update existing records
3. **Verify Schema**: Ensure all new records include required fields
4. **Check Convex Console**: Look for any deployment issues

### Email Delivery Issues

If OTP emails are not being delivered:

1. **Check API Key**: Verify your Resend API key is correct
2. **Domain Verification**: Ensure your domain is verified with Resend
3. **Environment Variables**: Confirm `.env.local` is properly configured
4. **Console Fallback**: Check browser console for OTP codes during development
5. **Rate Limits**: Check if you've hit email service rate limits

### Common Issues

- **Missing createdAt field**: Run the migration function
- **Missing userId field**: Legacy data needs migration or cleanup
- **Authentication errors**: Check OTP expiration and usage status
- **Email not received**: Check spam folder and email service configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
