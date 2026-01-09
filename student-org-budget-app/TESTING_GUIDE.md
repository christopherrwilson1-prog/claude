# Testing Guide - Student Org Budget App

## Prerequisites

Before testing, ensure you have:

1. **Node.js** (v18 or higher)
   ```bash
   node --version  # Should be v18+
   ```

2. **npm** or **yarn**
   ```bash
   npm --version
   ```

3. **Expo CLI** (optional - will be installed with the project)

4. **Expo Go App** on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Step 1: Set Up Environment Variables

Create a `.env` file in the `app` directory:

```bash
cd /home/user/claude/student-org-budget-app/app
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_PUBLIC_REVENUECAT_API_KEY=appl_your_key_here
EXPO_PUBLIC_ENV=development
```

### Getting Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Settings** > **API**
4. Copy:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Setting Up Supabase Database

1. In Supabase dashboard, go to **SQL Editor**
2. Run the following SQL files in order:
   ```sql
   -- File 1: schema.sql (creates tables)
   -- File 2: rls_policies.sql (sets up security)
   -- File 3: functions.sql (creates database functions)
   -- File 4: seed_data.sql (optional - adds sample data)
   ```

3. Enable Google OAuth (for Google Sign-In):
   - Go to **Authentication** > **Providers**
   - Enable **Google** provider
   - Add your Google OAuth credentials

## Step 2: Install Dependencies

```bash
cd /home/user/claude/student-org-budget-app/app
npm install
```

This will install all required packages including:
- React Native
- Expo
- Supabase
- React Navigation
- React Native Paper
- Zustand
- And all other dependencies

## Step 3: Start the Development Server

```bash
npx expo start
```

You should see:

```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
```

## Step 4: Test on Your Device

### Option A: Test on Physical Device (Recommended)

1. **Install Expo Go** on your phone (see prerequisites)

2. **Scan the QR code**:
   - **iOS**: Open the Camera app and scan the QR code
   - **Android**: Open the Expo Go app and scan the QR code

3. The app will load on your device!

### Option B: Test on iOS Simulator (Mac Only)

```bash
# Press 'i' in the terminal after running 'npx expo start'
# Or run:
npx expo start --ios
```

Requirements:
- macOS
- Xcode installed
- iOS Simulator set up

### Option C: Test on Android Emulator

```bash
# Press 'a' in the terminal after running 'npx expo start'
# Or run:
npx expo start --android
```

Requirements:
- Android Studio installed
- Android emulator set up

### Option D: Test in Web Browser (Limited Features)

```bash
# Press 'w' in the terminal
# Or run:
npx expo start --web
```

**Note**: Some mobile features may not work in web mode (camera, native modules, etc.)

## Step 5: Test the Features

### Testing Authentication Flow

1. **Welcome Screen**: Should see landing page with "Get Started" button
2. **Sign Up**:
   - Try creating account with email/password
   - Try "Continue with Google" (requires Google OAuth setup)
3. **Login**:
   - Test email/password login
   - Test Google Sign-In
4. **Forgot Password**: Test password reset flow
5. **Create Organization**: After signup, create your first organization

### Testing Budget Management

1. **Dashboard**:
   - Should show empty state first time
   - Click "Create Budget"

2. **Create Budget**:
   - Enter budget name (e.g., "Fall 2025 Operating Budget")
   - Click "Suggest" for academic year
   - Select semester (Fall/Spring/Summer/Full Year)
   - Add description
   - Click "Create Budget"

3. **Budget Details**:
   - Click "Add" in Income section
   - Add income source (e.g., "Student Government Allocation" - $5,000)
   - Click "Add" in Expense section
   - Add expense (e.g., "Events & Programming" - $2,000)
   - Verify totals update automatically
   - Verify net position shows correctly

4. **Budget List**:
   - Navigate back to see budget list
   - Try search functionality
   - Pull down to refresh

5. **Edit/Delete Items**:
   - In budget details, tap three-dot menu on any item
   - Test edit functionality
   - Test delete functionality
   - Verify confirmation dialog appears

## Troubleshooting

### Issue: "Supabase URL not configured" error

**Solution**: Make sure `.env` file exists and has valid Supabase credentials

### Issue: App won't load on phone

**Solutions**:
1. Make sure phone and computer are on the same WiFi network
2. Try restarting the Expo server: Press `r` in terminal
3. Check firewall settings

### Issue: "Network request failed" errors

**Solutions**:
1. Verify Supabase credentials in `.env`
2. Check internet connection
3. Verify Supabase project is active (not paused)
4. Check Supabase dashboard for any errors

### Issue: Google Sign-In not working

**Solutions**:
1. Verify Google OAuth is enabled in Supabase dashboard
2. Add proper redirect URLs in Google Cloud Console
3. Test with email/password first to isolate issue

### Issue: Database errors (RLS policy violations)

**Solutions**:
1. Verify all SQL files were run in Supabase
2. Check that RLS policies are enabled
3. Check Supabase logs: **Logs** > **Postgres Logs**

### Issue: "Cannot find module" errors

**Solution**:
```bash
cd app
rm -rf node_modules package-lock.json
npm install
```

## Testing Without Supabase (Mock Mode)

If you want to test UI without backend:

1. Comment out Supabase calls in stores
2. Use mock data:

```typescript
// In stores/budgetStore.ts
const mockBudgets = [
  {
    id: '1',
    name: 'Fall 2025 Budget',
    academic_year: '2025-2026',
    semester: 'fall',
    total_income: 10000,
    total_expenses: 7500,
    net_position: 2500,
    status: 'active',
  },
]
```

## Development Tips

### Hot Reload
- Save any file and the app will automatically reload
- Press `r` in terminal to manually reload

### Debug Menu
- Shake your device (or press Cmd+D in iOS simulator)
- Access React DevTools, Performance Monitor, etc.

### Viewing Logs
- Check terminal for console.log output
- Use React Native Debugger for advanced debugging

### Clearing Cache
If experiencing weird issues:
```bash
npx expo start --clear
```

## Next Steps After Testing

1. **Fix any bugs** you encounter
2. **Test all user flows** thoroughly
3. **Test with real data** (create multiple budgets, items)
4. **Test edge cases** (empty states, errors, invalid input)
5. **Test on both iOS and Android** if possible

## Production Testing (TestFlight - iOS)

Once satisfied with local testing:

1. Build production app:
   ```bash
   npm install -g eas-cli
   eas build --platform ios
   ```

2. Submit to TestFlight:
   ```bash
   eas submit --platform ios
   ```

3. Invite beta testers via App Store Connect

## Support

If you encounter issues:

1. Check [Expo Documentation](https://docs.expo.dev)
2. Check [Supabase Documentation](https://supabase.com/docs)
3. Review error messages in terminal
4. Check Supabase dashboard logs
5. Review the codebase for any configuration issues

---

**Happy Testing! 🚀**
