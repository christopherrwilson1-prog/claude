# Setup & Deployment Guide

## Prerequisites

Before starting development, ensure you have:

### Required Accounts
- [ ] **Apple Developer Account** ($99/year) - For iOS development and App Store distribution
- [ ] **GitHub Account** (Free) - For version control
- [ ] **Supabase Account** (Free tier available) - Backend and database
- [ ] **RevenueCat Account** (Free tier available) - Subscription management

### Development Tools
- [ ] **macOS** (required for iOS development)
- [ ] **Xcode** 14+ with iOS 14+ SDK
- [ ] **Node.js** 18+ and npm
- [ ] **Git** for version control
- [ ] **VS Code** or preferred code editor

### Recommended
- iOS device for testing (optional but recommended)
- TestFlight app installed on device

---

## Phase 1: Initial Setup

### 1. Clone Repository

```bash
# Clone the repository
git clone <repository-url>
cd student-org-budget-app

# Checkout development branch
git checkout -b develop
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Expo CLI globally
npm install -g expo-cli

# Install EAS CLI for building
npm install -g eas-cli
```

---

## Phase 2: Supabase Configuration

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in details:
   - **Project name:** student-org-budget-app
   - **Database password:** (save this securely!)
   - **Region:** Choose closest to target users
   - **Pricing plan:** Free tier (upgrade later)

### 2. Configure Database

**Run SQL scripts in Supabase SQL Editor:**

```bash
# In Supabase Dashboard:
# 1. Go to SQL Editor
# 2. Create new query
# 3. Paste and run each file in order:
```

**Step 1: Create Schema**
```sql
-- Copy contents of database/schema.sql
-- Run this first to create all tables
```

**Step 2: Add RLS Policies**
```sql
-- Copy contents of database/rls_policies.sql
-- Run this to add security policies
```

**Step 3: Create Functions**
```sql
-- Copy contents of database/functions.sql
-- Run this to add database functions
```

**Step 4 (Optional): Add Seed Data**
```sql
-- Copy contents of database/seed_data.sql
-- Only for development/testing
```

### 3. Configure Storage

**Create Storage Bucket:**

1. In Supabase Dashboard, go to **Storage**
2. Click **New Bucket**
3. Name: `budgets`
4. Public: **No** (private bucket)
5. Click **Create**

**Add Storage Policies:**

```sql
-- In SQL Editor, run:

-- Allow users to upload to their org folder
CREATE POLICY "Users can upload to org folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'budgets'
  AND (storage.foldername(name))[1] IN (
    SELECT organization_id::text FROM organization_members
    WHERE user_id = auth.uid()
  )
);

-- Allow users to view their org's files
CREATE POLICY "Users can view org files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'budgets'
  AND (storage.foldername(name))[1] IN (
    SELECT organization_id::text FROM organization_members
    WHERE user_id = auth.uid()
  )
);

-- Allow admins to delete org files
CREATE POLICY "Admins can delete org files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'budgets'
  AND (storage.foldername(name))[1] IN (
    SELECT organization_id::text FROM organization_members
    WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer')
  )
);
```

### 4. Get API Credentials

1. In Supabase Dashboard, go to **Settings** > **API**
2. Copy the following:
   - **Project URL**
   - **anon/public key**
3. Save these for environment variables

### 5. Configure Authentication

1. In Supabase Dashboard, go to **Authentication** > **Settings**
2. Configure:
   - **Site URL:** Will be set later
   - **Redirect URLs:** Will be set later
   - **Email Templates:** Customize signup/reset emails (optional)
   - **Email Auth:** Enabled
   - **Confirm Email:** Enabled (recommended)

---

## Phase 3: RevenueCat Configuration

### 1. Create RevenueCat Account

1. Go to [https://www.revenuecat.com](https://www.revenuecat.com)
2. Sign up for free account
3. Create new project: "Student Org Budget App"

### 2. Configure App

1. In RevenueCat Dashboard, click **Apps**
2. Click **+ New App**
3. Fill in:
   - **App name:** Student Org Budget App
   - **Bundle ID:** com.yourcompany.studentorgbudget (choose yours)
   - **Platform:** iOS

### 3. Create Products

**Create In-App Purchase Products:**

1. Go to **Products** in RevenueCat
2. Click **+ New**
3. Create product:
   - **Identifier:** `monthly_subscription`
   - **Type:** Auto-renewable subscription
   - **Price:** $4.99/month (Apple keeps 30%, you get $3.50)

### 4. Create Entitlements

1. Go to **Entitlements**
2. Click **+ New Entitlement**
3. Create:
   - **Identifier:** `pro_features`
   - **Products:** Add `monthly_subscription`

### 5. Get API Keys

1. Go to **API Keys**
2. Copy **Public API Key** (starts with `appl_`)
3. Save for environment variables

---

## Phase 4: Apple Developer Setup

### 1. Create App ID

1. Go to [Apple Developer Portal](https://developer.apple.com)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** > **+**
4. Select **App IDs** > **Continue**
5. Fill in:
   - **Description:** Student Org Budget App
   - **Bundle ID:** com.yourcompany.studentorgbudget (explicit)
   - **Capabilities:** Check "In-App Purchase"
6. Click **Register**

### 2. Create App in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **My Apps** > **+** > **New App**
3. Fill in:
   - **Platform:** iOS
   - **Name:** Student Org Budget
   - **Language:** English
   - **Bundle ID:** Select the one created above
   - **SKU:** studentorgbudget (unique identifier)
   - **User Access:** Full Access
4. Click **Create**

### 3. Create In-App Purchase

1. In App Store Connect, open your app
2. Go to **In-App Purchases**
3. Click **+** to create
4. Select **Auto-Renewable Subscription**
5. Fill in:
   - **Reference Name:** Monthly Subscription
   - **Product ID:** `monthly_subscription` (must match RevenueCat)
   - **Subscription Group:** Create new "Standard Subscriptions"
6. Add pricing: $4.99 USD
7. Add localization and review info
8. Submit for review

---

## Phase 5: Project Configuration

### 1. Initialize Expo Project

```bash
# Create new Expo project
npx create-expo-app app --template expo-template-blank-typescript

# Navigate to app directory
cd app

# Install dependencies
npm install @supabase/supabase-js
npm install react-native-purchases
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-paper
npm install zustand
npm install @tanstack/react-query
npm install react-hook-form
npm install zod
npm install date-fns
npm install @react-pdf/renderer
npm install expo-image-picker
npm install expo-secure-store

# Install dev dependencies
npm install --save-dev @types/react @types/react-native
```

### 2. Configure Environment Variables

Create `.env` file in app root:

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# RevenueCat
EXPO_PUBLIC_REVENUECAT_API_KEY=appl_your_key

# Environment
EXPO_PUBLIC_ENV=development
```

Add `.env` to `.gitignore`:

```bash
echo ".env" >> .gitignore
```

### 3. Configure app.json

```json
{
  "expo": {
    "name": "Student Org Budget",
    "slug": "student-org-budget",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.studentorgbudget",
      "buildNumber": "1",
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "Allow access to upload receipt photos"
      }
    },
    "plugins": [
      "expo-secure-store"
    ],
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

### 4. Configure EAS Build

```bash
# Login to Expo
eas login

# Configure EAS
eas build:configure

# Update eas.json
```

**eas.json:**
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "ios": {
        "simulator": false
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your@email.com",
        "ascAppId": "your-app-id",
        "appleTeamId": "your-team-id"
      }
    }
  }
}
```

---

## Phase 6: Development

### 1. Project Structure

Create the following structure:

```
app/
├── src/
│   ├── components/      # Reusable components
│   ├── screens/         # Screen components
│   ├── navigation/      # Navigation setup
│   ├── services/        # API services
│   ├── stores/          # Zustand stores
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript types
│   ├── constants/       # Constants
│   └── theme/           # Design system
├── assets/              # Images, fonts
├── App.tsx              # Root component
├── app.json             # Expo config
├── package.json
└── tsconfig.json
```

### 2. Start Development

```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on physical device
# Scan QR code with Expo Go app
```

### 3. Development Workflow

**Daily:**
1. Pull latest from develop branch
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Commit and push
6. Create pull request

**Git Branches:**
```bash
# Feature branch
git checkout -b feature/budget-creation

# Bug fix branch
git checkout -b fix/calculation-error

# When complete
git push origin feature/budget-creation
```

---

## Phase 7: Testing

### 1. Local Testing

```bash
# Run on iOS simulator
npm run ios

# Run tests (when added)
npm test

# Type checking
npm run tsc
```

### 2. TestFlight Beta Testing

**Build for TestFlight:**

```bash
# Build for iOS
eas build --platform ios --profile preview

# Wait for build to complete (~20 minutes)
# Download build or submit to TestFlight
eas submit --platform ios
```

**Add Beta Testers:**

1. In App Store Connect, go to **TestFlight**
2. Click **App Store Connect Users** or **External Groups**
3. Add testers by email
4. They'll receive invitation to download TestFlight

### 3. Monitoring

**During Beta:**
- Monitor TestFlight crash reports
- Check Supabase logs for errors
- Track usage in RevenueCat dashboard
- Collect feedback via form/email

---

## Phase 8: Production Deployment

### 1. Pre-Launch Checklist

**Technical:**
- [ ] All features tested and working
- [ ] No critical bugs
- [ ] Performance optimized
- [ ] Database backups configured
- [ ] RLS policies tested
- [ ] Subscription flow tested end-to-end

**Legal:**
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Support email configured
- [ ] App Store description finalized

**Assets:**
- [ ] App icon (1024x1024)
- [ ] Screenshots for all required sizes
- [ ] App preview video (optional)

### 2. Build Production Version

```bash
# Create production build
eas build --platform ios --profile production

# Wait for build completion
```

### 3. Submit to App Store

```bash
# Submit build
eas submit --platform ios --profile production

# Or submit via App Store Connect
```

**In App Store Connect:**

1. Open your app
2. Click **+ Version or Platform** > **iOS**
3. Enter version number (1.0.0)
4. Fill in **App Information:**
   - Description
   - Keywords
   - Support URL
   - Marketing URL (optional)
   - Privacy Policy URL
5. Add **Screenshots** for all required sizes
6. Select build from TestFlight
7. Fill in **App Review Information:**
   - Contact info
   - Demo account (if needed)
   - Notes for reviewer
8. Click **Submit for Review**

### 4. App Review Process

**Timeline:**
- Usually 24-48 hours
- Can take up to 5 business days

**Common Rejection Reasons:**
- Missing privacy policy
- Broken features
- Subscription not working
- Unclear app purpose
- Missing required screenshots

**If Rejected:**
1. Read feedback carefully
2. Fix issues
3. Build new version
4. Resubmit

### 5. Post-Launch

**Day 1:**
- Monitor for crashes
- Watch App Store reviews
- Check subscription purchases
- Verify all features working

**Week 1:**
- Respond to user reviews
- Monitor key metrics
- Fix any critical bugs
- Plan first update

---

## Ongoing Maintenance

### Database Backups

**Supabase:**
- Free tier: Daily backups (7-day retention)
- Pro tier: Point-in-time recovery
- Manual backups: SQL Editor > Export

### Updates

**Bug Fixes:**
```bash
# Increment build number
# Build and submit update
eas build --platform ios --profile production
eas submit --platform ios
```

**New Features:**
- Follow full development cycle
- Thorough testing
- Beta test before production
- Increment version number

### Monitoring

**Key Metrics:**
- Daily Active Users (Supabase Dashboard)
- Subscription Revenue (RevenueCat)
- Crash Rate (TestFlight/App Store Connect)
- App Store Rating
- User Feedback

---

## Troubleshooting

### Common Issues

**Build Fails:**
```bash
# Clear cache
expo start -c

# Update dependencies
npm update

# Check eas.json configuration
```

**Supabase Connection Issues:**
- Check API keys in .env
- Verify RLS policies
- Check network connectivity
- Review Supabase logs

**RevenueCat Not Working:**
- Verify API key
- Check product IDs match
- Test in sandbox mode first
- Review RevenueCat logs

**App Store Rejection:**
- Read feedback completely
- Check required metadata
- Test subscription flow
- Verify privacy policy

### Getting Help

- **Expo Docs:** https://docs.expo.dev
- **Supabase Docs:** https://supabase.com/docs
- **RevenueCat Docs:** https://www.revenuecat.com/docs
- **React Native Paper:** https://callstack.github.io/react-native-paper
- **Stack Overflow:** Tag questions with relevant libraries

---

## Security Best Practices

### Environment Variables
- Never commit `.env` to git
- Use different keys for dev/production
- Rotate keys if compromised

### Database
- Keep RLS policies strict
- Regular security audits
- Monitor for suspicious activity
- Keep Supabase updated

### App
- Validate all user input
- Sanitize data before display
- Use HTTPS only
- Keep dependencies updated

---

**Last Updated:** January 8, 2026
**Guide Version:** 1.0
**Status:** Phase 1 Complete - Ready for Phase 2 Development
