# Quick Start Guide

## Prerequisites

- Node.js 18+
- iOS Simulator (Xcode on macOS) or Expo Go app on your phone
- Supabase account (free tier: https://supabase.com)

## Setup Instructions

### 1. Install Dependencies

```bash
cd student-org-budget-app/app
npm install
```

### 2. Set Up Supabase

1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. In your Supabase project dashboard:
   - Go to **SQL Editor**
   - Run the scripts in this order:
     - `../database/schema.sql`
     - `../database/rls_policies.sql`
     - `../database/functions.sql`
     - `../database/seed_data.sql` (optional - sample data)

3. Get your Supabase credentials:
   - Go to **Settings** > **API**
   - Copy the **Project URL** and **anon/public key**

### 3. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Supabase credentials
# EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Configure Google Sign-In (Optional)

In your Supabase dashboard:
1. Go to **Authentication** > **Providers**
2. Enable **Google** provider
3. Add your Google OAuth client ID and secret
4. Add redirect URL: `studentorgbudget://auth/callback`

### 5. Run the App

```bash
# Start the development server
npm start

# Or run directly on iOS
npm run ios

# Or scan QR code with Expo Go app on your phone
```

## Testing the App

### Create an Account

1. **Option 1: Google Sign-In**
   - Tap "Continue with Google"
   - Authorize with your Google account
   - You'll be redirected back to create your organization

2. **Option 2: Email/Password**
   - Tap "Sign Up"
   - Enter your details
   - Create your account
   - You'll be redirected to create your organization

### Create Your Organization

After signing up, you'll be prompted to create your organization:
- Enter organization name (e.g., "Computer Science Club")
- Enter university name (e.g., "Example University")
- Select organization type
- (Optional) Add description

Your 7-day free trial starts automatically!

## Project Structure

```
app/
├── src/
│   ├── components/          # Reusable UI components (coming soon)
│   ├── screens/            # Screen components
│   │   ├── auth/          # ✅ Auth screens (Welcome, Login, SignUp, etc.)
│   │   └── dashboard/     # ✅ Dashboard screen
│   ├── navigation/        # ✅ Navigation setup
│   ├── services/          # ✅ Supabase client
│   ├── stores/            # ✅ Zustand state management
│   ├── types/             # ✅ TypeScript types
│   ├── constants/         # ✅ App constants
│   └── theme/             # ✅ Design system
├── App.tsx                 # ✅ Root component
├── .env                    # ⚠️  Your secrets (don't commit!)
└── package.json
```

## Current Features (Week 1)

✅ **Authentication**
- Google Sign-In
- Email/Password signup and login
- Password reset
- Session persistence

✅ **Organization Management**
- Create organization
- Organization types
- 7-day free trial

✅ **Basic Dashboard**
- Welcome screen
- Organization info
- Trial status

## Coming Soon (Week 2-8)

- Budget planning and management
- Event budgeting
- Expense tracking
- Professional PDF reports
- Team collaboration
- And much more!

## Troubleshooting

### "Configuration Error"

Make sure your `.env` file exists and has valid Supabase credentials.

### App won't start

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
expo start -c
```

### Google Sign-In not working

1. Make sure Google provider is enabled in Supabase
2. Check redirect URL is configured correctly
3. Test with email/password signup first

### Database errors

Make sure you ran all SQL scripts in the correct order:
1. schema.sql
2. rls_policies.sql
3. functions.sql

## Need Help?

- Check the full documentation in `/docs`
- Review the setup guide: `/docs/SETUP_GUIDE.md`
- Check database schema: `/docs/DATABASE_SCHEMA.md`

## Development Status

**Current Phase:** Phase 2 - Week 1 ✅ COMPLETE

- [x] Project setup
- [x] Authentication with Google + Email
- [x] Organization creation
- [x] Basic navigation
- [ ] Budget management (Week 3-4)
- [ ] Event planning (Week 5)
- [ ] Expense tracking (Week 5)
- [ ] Reports (Week 6)
- [ ] Subscriptions (Week 7)

---

**Last Updated:** January 8, 2026
**Version:** 0.1.0 (Week 1 MVP)
