# Technical Architecture

## System Overview

The Student Organization Budget App follows a modern mobile-first architecture with a React Native frontend and Supabase backend. The system is designed for real-time collaboration, scalability, and ease of maintenance.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        iOS App Layer                         │
│                    (React Native + Expo)                     │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  Auth Screen │ Budget Views │ Event Planner│  Reports       │
│  Onboarding  │  Dashboard   │  Tracking    │  Settings      │
└──────┬───────┴──────┬───────┴──────┬───────┴────────┬───────┘
       │              │              │                │
       ▼              ▼              ▼                ▼
┌──────────────────────────────────────────────────────────────┐
│                    State Management                           │
│              (Zustand + React Query/SWR)                      │
└──────┬───────────────────────────────────────────┬───────────┘
       │                                           │
       ▼                                           ▼
┌──────────────────┐                     ┌─────────────────────┐
│   RevenueCat     │                     │     Supabase        │
│   SDK            │                     │     Client          │
└────────┬─────────┘                     └──────┬──────────────┘
         │                                      │
         │                                      │
    ┌────▼─────────┐                      ┌────▼──────────────┐
    │ Apple IAP    │                      │   Supabase        │
    │ Subscription │                      │   Cloud           │
    └──────────────┘                      └───┬───────────────┘
                                              │
                        ┌─────────────────────┼─────────────────┐
                        │                     │                 │
                  ┌─────▼──────┐      ┌──────▼──────┐   ┌─────▼────┐
                  │ PostgreSQL │      │  Supabase   │   │ Supabase │
                  │  Database  │      │  Auth       │   │ Storage  │
                  └────────────┘      └─────────────┘   └──────────┘
                        │
                  ┌─────▼──────┐
                  │  Realtime  │
                  │  Engine    │
                  └────────────┘
```

## Frontend Architecture

### Technology Stack
- **Framework:** React Native 0.74+
- **Build Tool:** Expo SDK 51+
- **Language:** TypeScript 5.x
- **UI Framework:** React Native Paper 5.x
- **Navigation:** React Navigation 6.x
- **State Management:** Zustand 4.x
- **Data Fetching:** React Query (TanStack Query)
- **Forms:** React Hook Form
- **Validation:** Zod
- **Charts:** Victory Native 36+
- **PDF Generation:** @react-pdf/renderer
- **Date Handling:** date-fns

### Folder Structure

```
app/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── common/          # Buttons, inputs, cards
│   │   ├── budget/          # Budget-specific components
│   │   ├── charts/          # Chart components
│   │   └── forms/           # Form components
│   ├── screens/             # Screen components
│   │   ├── auth/            # Login, signup, onboarding
│   │   ├── budget/          # Budget planning screens
│   │   ├── events/          # Event budget screens
│   │   ├── tracking/        # Expense tracking
│   │   ├── reports/         # Reports and exports
│   │   ├── settings/        # Settings and profile
│   │   └── dashboard/       # Main dashboard
│   ├── navigation/          # Navigation configuration
│   ├── services/            # Business logic
│   │   ├── supabase/        # Supabase client & queries
│   │   ├── revenuecat/      # Subscription logic
│   │   ├── calculations/    # Budget calculations
│   │   └── exports/         # PDF/Excel export logic
│   ├── stores/              # Zustand stores
│   │   ├── authStore.ts
│   │   ├── budgetStore.ts
│   │   ├── orgStore.ts
│   │   └── userStore.ts
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── constants/           # Constants and config
│   ├── types/               # TypeScript types
│   └── theme/               # Design system
├── assets/                  # Images, fonts, icons
├── app.json                 # Expo configuration
├── package.json
└── tsconfig.json
```

### Component Architecture

**Atomic Design Principles:**
1. **Atoms:** Basic UI elements (Button, Input, Text)
2. **Molecules:** Simple component groups (FormField, CardHeader)
3. **Organisms:** Complex UI sections (BudgetForm, EventCard)
4. **Templates:** Page layouts (DashboardTemplate)
5. **Pages:** Complete screens (DashboardScreen)

### State Management Strategy

**Zustand Stores:**
- `authStore`: User authentication state
- `orgStore`: Organization data and members
- `budgetStore`: Budget data (annual, events)
- `trackingStore`: Expense tracking data
- `settingsStore`: App preferences

**React Query for Server State:**
- Cache server data
- Auto-refetch on focus
- Optimistic updates
- Real-time sync with Supabase

## Backend Architecture

### Supabase Services

#### 1. Database (PostgreSQL)
- **Purpose:** Primary data storage
- **Features:** ACID compliance, relations, complex queries
- **Tables:** See DATABASE_SCHEMA.md for full schema

#### 2. Authentication
- **Methods:**
  - Email/Password
  - Magic Links (optional)
  - Social (Google, Apple) - future
- **Session Management:** JWT tokens
- **Security:** Automatic token refresh

#### 3. Realtime
- **Technology:** WebSockets via Supabase Realtime
- **Use Cases:**
  - Budget updates (multi-user editing)
  - Expense additions
  - Member activity
- **Channels:** Per-organization subscriptions

#### 4. Storage
- **Purpose:** Store generated PDFs and exported files
- **Structure:**
  ```
  budgets/
  ├── {org_id}/
  │   ├── allocation-requests/
  │   ├── year-end-reports/
  │   └── exports/
  ```
- **Security:** RLS policies for organization access

#### 5. Row Level Security (RLS)

**Key Policies:**

```sql
-- Users can only see their organization's data
CREATE POLICY "Users can view own org budgets"
ON budgets FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid()
  )
);

-- Only treasurer and admin can modify budgets
CREATE POLICY "Only treasurer can update budgets"
ON budgets FOR UPDATE
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid()
    AND role IN ('treasurer', 'admin')
  )
);
```

### Database Functions

**Custom PostgreSQL Functions:**

1. **calculate_budget_totals()**
   - Calculates total income, expenses, net position
   - Triggered on budget item changes

2. **check_subscription_status()**
   - Validates org subscription before writes
   - Called by RLS policies

3. **log_activity()**
   - Records user actions for audit trail
   - Async trigger

4. **generate_budget_summary()**
   - Returns formatted budget summary
   - Used for reports

## Data Flow

### 1. User Authentication Flow

```
User Opens App
    ↓
Check Auth State (Supabase)
    ↓
├─ Authenticated ──→ Load User Profile ──→ Dashboard
│                        ↓
│                   Load Organizations
│                        ↓
│                   Check Subscription
│                        ↓
│                   Set Active Org
│
└─ Not Authenticated ──→ Show Login/Signup
                             ↓
                        Authenticate
                             ↓
                        Onboarding Flow
```

### 2. Budget Creation Flow

```
User Creates Budget
    ↓
Form Validation (Zod)
    ↓
Optimistic UI Update (React Query)
    ↓
Supabase Insert
    ↓
├─ Success ──→ Update Cache ──→ Broadcast via Realtime
│                                    ↓
│                              Other Users See Update
│
└─ Error ──→ Rollback UI ──→ Show Error Message
```

### 3. Real-time Collaboration Flow

```
User A Edits Budget
    ↓
Local State Update
    ↓
Debounced Save (500ms)
    ↓
Supabase Update
    ↓
Realtime Broadcast
    ↓
User B Receives Event
    ↓
React Query Cache Invalidation
    ↓
UI Auto-updates
    ↓
Show "Updated by User A" indicator
```

### 4. Subscription Flow

```
User Creates Org
    ↓
7-Day Free Trial Starts
    ↓
RevenueCat Tracks Usage
    ↓
Day 7: Show Upgrade Prompt
    ↓
User Subscribes via IAP
    ↓
Apple Processes Payment
    ↓
RevenueCat Webhook to Supabase
    ↓
Update Org Subscription Status
    ↓
Unlock Full Features
```

## Security Architecture

### Authentication & Authorization

**Layers:**
1. **Supabase Auth:** JWT-based authentication
2. **RLS Policies:** Database-level access control
3. **App-level Checks:** UI permission validation
4. **API Validation:** Server-side function guards

### Data Protection

**At Rest:**
- PostgreSQL encryption
- Supabase managed security
- No sensitive data in app storage

**In Transit:**
- HTTPS/TLS for all API calls
- WebSocket encryption for Realtime
- Certificate pinning (future)

### Privacy

**User Data:**
- Minimal personal data collection
- Email required, name optional
- No financial account linking
- GDPR/CCPA compliant

**Organization Data:**
- Isolated by organization
- No cross-org data access
- Activity logging for audit

## Performance Optimization

### Frontend

**Strategies:**
1. **Code Splitting:** Lazy load screens
2. **Memoization:** React.memo, useMemo, useCallback
3. **Virtualized Lists:** FlatList for long lists
4. **Image Optimization:** Compressed assets, lazy loading
5. **Bundle Size:** Tree shaking, dynamic imports

### Backend

**Strategies:**
1. **Database Indexing:** On foreign keys, frequently queried columns
2. **Query Optimization:** Use database views for complex queries
3. **Caching:** React Query cache + Supabase cache
4. **Connection Pooling:** Supabase managed
5. **Realtime Throttling:** Debounce updates

### Caching Strategy

**React Query Cache:**
```typescript
{
  staleTime: 5 * 60 * 1000,      // 5 minutes
  cacheTime: 10 * 60 * 1000,     // 10 minutes
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
}
```

**Realtime Update Strategy:**
- Optimistic updates for instant UI
- Server reconciliation on success
- Conflict resolution: last-write-wins

## Scalability Considerations

### Current Architecture (0-10K users)
- Supabase free/pro tier
- Single region deployment
- Standard caching

### Future Scaling (10K-100K users)
- Upgrade Supabase tier
- CDN for static assets
- Database read replicas
- Advanced caching (Redis)

### Enterprise Scaling (100K+ users)
- Multi-region deployment
- Dedicated database instances
- Load balancing
- Message queues for async tasks

## Error Handling

### Frontend Error Boundaries

```typescript
<ErrorBoundary fallback={<ErrorScreen />}>
  <App />
</ErrorBoundary>
```

### API Error Handling

**Error Types:**
1. **Network Errors:** Retry with exponential backoff
2. **Validation Errors:** Show user-friendly messages
3. **Auth Errors:** Redirect to login
4. **Permission Errors:** Show access denied
5. **Server Errors:** Log and show generic message

### Logging & Monitoring

**Tools (Future):**
- Sentry for error tracking
- Analytics for user behavior
- Performance monitoring

## Offline Support

**Phase 1 (MVP):** Online-only
**Phase 2 (Future):**
- Local SQLite cache
- Offline read access
- Queue writes for sync
- Conflict resolution

## Testing Strategy

### Unit Tests
- **Tool:** Jest
- **Coverage:** Utilities, calculations, business logic
- **Target:** 80%+ coverage

### Integration Tests
- **Tool:** React Native Testing Library
- **Coverage:** Component integration, user flows
- **Target:** Critical paths

### E2E Tests
- **Tool:** Detox
- **Coverage:** Main user journeys
- **Frequency:** Before releases

## Deployment Architecture

### Expo EAS Build
- **iOS:** Build for App Store
- **Provisioning:** Automatic signing
- **CI/CD:** GitHub Actions integration

### Environment Management

```
Development:
- Supabase Dev Project
- RevenueCat Sandbox
- Local testing

Staging:
- Supabase Staging Project
- RevenueCat Sandbox
- TestFlight

Production:
- Supabase Production
- RevenueCat Production
- App Store
```

## API Versioning

**Strategy:** URL-based versioning (future)
```
/api/v1/budgets
/api/v2/budgets  (when needed)
```

**Supabase:** No versioning needed (client SDK handles)

## Third-Party Dependencies

### Critical
- **expo:** ~51.0.0
- **react-native:** 0.74.x
- **@supabase/supabase-js:** ^2.39.0
- **react-native-purchases:** ^7.0.0

### UI/UX
- **react-native-paper:** ^5.12.0
- **react-navigation:** ^6.1.0
- **victory-native:** ^36.9.0

### Utilities
- **date-fns:** ^3.0.0
- **zod:** ^3.22.0
- **react-hook-form:** ^7.49.0

## Security Considerations

### Mobile-Specific
- **Keychain:** Secure token storage (expo-secure-store)
- **Biometrics:** Optional Face ID/Touch ID
- **SSL Pinning:** Future enhancement
- **Code Obfuscation:** Production builds

### Backend
- **Rate Limiting:** Supabase built-in
- **SQL Injection:** Parameterized queries
- **XSS Prevention:** Input sanitization
- **CSRF:** Not applicable (mobile app)

## Compliance

### App Store Guidelines
- Privacy policy required
- In-app purchase rules
- Data collection transparency
- Age rating: 4+

### Data Privacy
- GDPR compliant
- CCPA compliant
- Data export capability
- Right to deletion

---

**Last Updated:** January 8, 2026
**Architecture Version:** 1.0
**Status:** Specification Phase
