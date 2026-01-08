# MVP Specifications

## Overview

The MVP (Minimum Viable Product) focuses on core budget management features that deliver immediate value to student organization treasurers. The goal is to launch a functional, reliable app that solves the primary pain point: creating and tracking annual budgets.

**MVP Timeline:** 6-8 weeks
**Target:** 10-20 beta organizations
**Goal:** Validate product-market fit before building advanced features

## MVP Philosophy

### What's IN the MVP ✅
- Features that solve core budget management
- Essential collaboration (view-only)
- Basic expense tracking
- Simple report generation
- Clean, professional UI

### What's OUT of the MVP ❌
- Real-time collaboration (WebSocket updates)
- Advanced analytics and charts
- Push notifications
- Complex approval workflows
- Offline mode
- Advanced reporting templates
- Social features
- Integrations

## MVP Feature Set

### 1. Authentication & Onboarding

**Features:**
- Email/password sign up
- Email/password login
- Forgot password flow
- Basic profile setup
- Simple onboarding (3 screens max)

**Screens:**
- Welcome screen
- Login screen
- Sign up screen
- Forgot password screen
- Create organization screen
- Quick tour (3 slides, skippable)

**Acceptance Criteria:**
- [ ] User can create account with email/password
- [ ] Email validation enforced
- [ ] Password requirements: 8+ chars
- [ ] User can reset forgotten password
- [ ] Session persists across app restarts
- [ ] User creates organization during onboarding
- [ ] User selects their role (informational only for MVP)

**Out of Scope:**
- Social login (Google, Apple)
- Magic links
- Multi-org support (comes in v2)
- Team invitations (comes in v2)

---

### 2. Organization Management

**Features:**
- Create organization
- View organization details
- Edit organization details
- Single organization per user (for MVP)

**Screens:**
- Organization creation (during onboarding)
- Organization settings screen

**Acceptance Criteria:**
- [ ] User creates org with name, university, type
- [ ] Org details editable by creator
- [ ] University field is searchable dropdown
- [ ] Org type dropdown with predefined options

**Out of Scope:**
- Delete organization
- Organization logo upload
- Multiple organizations per user
- Organization switching

---

### 3. Budget Management (CORE)

**Features:**
- Create annual budget
- View budget overview
- Add income line items
- Add expense line items
- Edit line items
- Delete line items
- Automatic total calculations
- Contingency fund (10% default)
- Budget status indicator

**Screens:**
- Budget list screen (simplified - just current budget)
- Budget details screen
- Add/edit budget item modal
- Budget summary view

**Data:**
**Income Categories:**
- Student Government Allocation
- Fundraising
- Membership Dues
- Event Ticket Sales
- Sponsorships
- Donations
- Grants
- Other Income

**Expense Categories:**
- Events & Programming
- Food & Catering
- Marketing & Printing
- Travel & Transportation
- Supplies & Materials
- Speaker/Performer Fees
- Equipment & Technology
- Administrative Costs
- Other Expenses

**Acceptance Criteria:**
- [ ] User can create budget for fiscal year
- [ ] User can add income line items with category, description, amount
- [ ] User can add expense line items with category, description, amount
- [ ] Income/expense totals auto-calculate
- [ ] Net position (income - expenses) displays
- [ ] Visual indicator shows budget balance status
- [ ] Contingency fund auto-calculates at 10%
- [ ] User can edit existing line items
- [ ] User can delete line items
- [ ] Semester breakdown (fall/spring) for each item
- [ ] Changes save automatically (debounced)

**Out of Scope:**
- Multiple budgets
- Budget templates
- Budget approval workflow
- Budget comparison (year-over-year)
- Budget versioning/history

---

### 4. Simple Dashboard

**Features:**
- Budget health summary card
- Quick stats (total income, expenses, balance)
- Budget status indicator
- Quick access to add expense

**Screens:**
- Dashboard (home screen)

**Acceptance Criteria:**
- [ ] Shows current budget name and year
- [ ] Displays total income, expenses, net position
- [ ] Shows visual budget health (green/yellow/red)
- [ ] Quick action button to add expense
- [ ] Tap cards to navigate to details
- [ ] Pull to refresh

**Out of Scope:**
- Activity feed
- Upcoming events widget
- Alerts and notifications
- Charts and graphs
- Recent activity timeline

---

### 5. Expense Tracking (Basic)

**Features:**
- Add expense
- View expense list
- Edit own expense (if pending)
- Delete own expense (if pending)
- Filter by status (all, pending, approved, paid)
- Upload receipt photo
- Basic expense details

**Screens:**
- Expense list screen
- Add expense modal
- Expense details screen

**Acceptance Criteria:**
- [ ] User can create expense with description, amount, date, category
- [ ] User can upload receipt photo (iOS image picker)
- [ ] User can select category from dropdown
- [ ] Expenses display in list, grouped by status
- [ ] User can tap expense to view details
- [ ] User can edit pending expenses
- [ ] User can delete pending expenses
- [ ] Receipt photos are viewable
- [ ] Expenses automatically marked as "pending"

**Out of Scope:**
- Expense approval workflow (all expenses auto-approved for MVP)
- Recurring expenses
- Expense analytics
- Expense export
- Bulk expense upload
- Expense comments/notes

---

### 6. Event Planning (Basic)

**Features:**
- Create event
- View event list
- Event budget summary
- Link expenses to events

**Screens:**
- Event list screen
- Create event screen
- Event details screen

**Acceptance Criteria:**
- [ ] User can create event with name, date, budget amount
- [ ] User can add expected attendance and ticket price
- [ ] Auto-calculate expected revenue (attendance × price)
- [ ] Show simple budget breakdown
- [ ] User can view list of events
- [ ] Events sorted by date (upcoming first)
- [ ] User can link expenses to event when creating expense

**Out of Scope:**
- Event templates
- Event status workflow
- Complex event budgeting (multiple line items)
- Break-even analysis
- Event analytics
- Event calendar view

---

### 7. Simple Reports

**Features:**
- Budget summary PDF
- Basic allocation request template
- Export budget to PDF

**Screens:**
- Reports screen (simple list)
- PDF preview screen
- Share sheet integration

**Acceptance Criteria:**
- [ ] User can generate budget summary PDF
- [ ] PDF includes org name, budget details, line items
- [ ] PDF formatted professionally (clean layout)
- [ ] User can share PDF via iOS share sheet
- [ ] User can generate allocation request PDF with org info and budget

**Out of Scope:**
- Year-end reports
- Custom report templates
- Report scheduling
- Excel export
- Email reports directly from app
- Report history

---

### 8. Settings & Profile

**Features:**
- View profile
- Edit profile (name, email)
- Change password
- View organization details
- Basic app settings

**Screens:**
- Settings screen
- Edit profile screen
- Change password screen

**Acceptance Criteria:**
- [ ] User can view and edit their name
- [ ] User can change password
- [ ] User can view organization details
- [ ] User can log out
- [ ] App version displayed

**Out of Scope:**
- Avatar upload
- Notification preferences
- App theme selection
- Export all data
- Delete account

---

### 9. Subscription (Basic)

**Features:**
- 7-day free trial (automatic)
- Trial status indicator
- Simple subscription screen
- iOS in-app purchase integration
- Basic subscription management

**Screens:**
- Subscription screen
- Trial expiration banner

**Acceptance Criteria:**
- [ ] Trial starts automatically on org creation
- [ ] User sees trial days remaining in settings
- [ ] User prompted to subscribe on day 6
- [ ] User can subscribe via iOS IAP ($5/month)
- [ ] Subscription status syncs with RevenueCat
- [ ] App locks features after trial expires (paywall)
- [ ] User can view subscription status
- [ ] User directed to iOS Settings to manage subscription

**Out of Scope:**
- Annual pricing option
- Team billing
- Discount codes
- Multiple pricing tiers
- Grace period
- Detailed billing history in-app

---

## MVP Technical Specifications

### Database Tables (MVP)

**Required Tables:**
1. `users` - User profiles
2. `organizations` - Organization details
3. `organization_members` - User-org relationships (single member for MVP)
4. `budgets` - Annual budgets
5. `budget_items` - Income/expense line items
6. `events` - Event planning
7. `expenses` - Expense tracking

**Deferred Tables:**
- `invitations` (v2 - team invitations)
- `activity_log` (v2 - activity tracking)
- Advanced subscription tables

### API Endpoints (MVP)

**Authentication:**
- POST /auth/signup
- POST /auth/login
- POST /auth/logout
- POST /auth/reset-password

**Organizations:**
- POST /organizations (create)
- GET /organizations/:id (read)
- PATCH /organizations/:id (update)

**Budgets:**
- POST /budgets (create)
- GET /budgets/:id (read)
- PATCH /budgets/:id (update)
- GET /organizations/:id/budgets (list)

**Budget Items:**
- POST /budget-items (create)
- PATCH /budget-items/:id (update)
- DELETE /budget-items/:id (delete)

**Events:**
- POST /events (create)
- GET /events/:id (read)
- GET /budgets/:id/events (list)

**Expenses:**
- POST /expenses (create)
- GET /expenses/:id (read)
- PATCH /expenses/:id (update)
- DELETE /expenses/:id (delete)
- GET /budgets/:id/expenses (list)

**Storage:**
- POST /upload/receipt (upload image)

### Core Screens (MVP)

**Total Screens: 15**

1. Welcome
2. Login
3. Sign Up
4. Forgot Password
5. Create Organization
6. Onboarding Tour
7. Dashboard
8. Budget Details
9. Add/Edit Budget Item (Modal)
10. Event List
11. Create Event
12. Event Details
13. Expense List
14. Add Expense (Modal)
15. Settings

### Key Technologies

**Required:**
- React Native + Expo
- TypeScript
- Supabase (Auth, Database, Storage)
- React Navigation
- Zustand (state management)
- React Query (data fetching)
- React Hook Form (forms)
- Zod (validation)
- React Native Paper (UI components)
- @react-pdf/renderer (PDF generation)
- RevenueCat (subscriptions)
- date-fns (date handling)

**Not Needed for MVP:**
- Victory Native (charts - v2)
- WebSocket/Realtime (v2)
- Push notifications (v2)

## MVP User Flow

```
1. User downloads app
   ↓
2. Creates account
   ↓
3. Creates organization (trial starts)
   ↓
4. Views quick tour (skippable)
   ↓
5. Lands on dashboard (empty state)
   ↓
6. Taps "Create Budget"
   ↓
7. Adds income items
   ↓
8. Adds expense items
   ↓
9. Reviews budget summary (balanced/deficit)
   ↓
10. Generates allocation request PDF
    ↓
11. Shares PDF via email/messages
    ↓
12. Adds expenses as they occur
    ↓
13. Links expenses to events
    ↓
14. Tracks budget vs actual
    ↓
15. (Day 7) Subscribes for $5/month
    ↓
16. Continues using app
```

## MVP Success Metrics

### Technical Metrics
- [ ] App launches successfully on iOS 14+
- [ ] Average load time < 2 seconds
- [ ] Zero critical bugs in core flows
- [ ] 99% uptime for backend services
- [ ] All Supabase RLS policies working
- [ ] PDF generation < 5 seconds

### User Metrics
- [ ] 10-20 beta organizations signed up
- [ ] 80%+ complete onboarding
- [ ] 60%+ create a budget
- [ ] 40%+ add expenses
- [ ] 20%+ generate PDF report
- [ ] 50%+ convert from trial to paid

### Feature Completion
- [ ] All 9 feature areas implemented
- [ ] All 15 screens functional
- [ ] All acceptance criteria met
- [ ] App passes Apple review
- [ ] TestFlight beta deployed

## MVP Constraints

### What We Won't Compromise On:
1. **Data Security** - RLS policies must be perfect
2. **Core Budget Features** - Must work flawlessly
3. **Professional PDF Output** - Must look polished
4. **iOS Guidelines** - Must pass App Store review
5. **Subscription Integration** - Must work reliably

### What We Can Simplify:
1. UI polish (use default React Native Paper components)
2. Advanced animations
3. Edge case error handling
4. Comprehensive help documentation
5. Multiple language support

## MVP Timeline Estimate

### Week 1-2: Foundation
- [ ] Expo project setup
- [ ] Supabase configuration
- [ ] Database schema + RLS policies
- [ ] Authentication flows
- [ ] Navigation structure
- [ ] Basic UI theme

### Week 3-4: Core Features
- [ ] Budget creation and management
- [ ] Budget items (CRUD operations)
- [ ] Dashboard
- [ ] Auto-calculations
- [ ] Form validation

### Week 5-6: Additional Features
- [ ] Event management
- [ ] Expense tracking
- [ ] Receipt uploads
- [ ] PDF generation
- [ ] Settings screens

### Week 7: Polish & Testing
- [ ] UI refinements
- [ ] Bug fixes
- [ ] Error handling
- [ ] Loading states
- [ ] Empty states
- [ ] Manual testing

### Week 8: Launch Prep
- [ ] RevenueCat integration
- [ ] Subscription flow
- [ ] TestFlight setup
- [ ] Beta tester recruitment
- [ ] Analytics integration
- [ ] Submit to TestFlight

## MVP vs. Full Version

| Feature | MVP | Full Version |
|---------|-----|--------------|
| Budget creation | ✅ Single budget | Multiple budgets |
| Team collaboration | ❌ Single user | Multi-user w/ roles |
| Real-time updates | ❌ Manual refresh | WebSocket updates |
| Expense approval | ❌ Auto-approved | Approval workflow |
| Reports | Basic PDF | Advanced templates |
| Analytics | ❌ Basic totals | Charts & insights |
| Notifications | ❌ None | Push + in-app |
| Invitations | ❌ None | Email invites |
| Activity log | ❌ None | Full audit trail |
| Multiple orgs | ❌ One per user | Multiple + switching |

## Post-MVP Roadmap Preview

### Version 1.1 (Month 2)
- Team invitations
- Multi-user support
- Basic activity log
- Improved reports

### Version 1.2 (Month 3)
- Real-time collaboration
- Expense approval workflow
- Push notifications
- Charts and analytics

### Version 2.0 (Month 6)
- Multiple organizations per user
- Advanced reporting
- Budget templates
- Export to Excel
- Year-over-year comparison

## MVP Go/No-Go Criteria

**Before moving to full build:**
- [ ] All technical specs reviewed and approved
- [ ] Supabase account created and configured
- [ ] Apple Developer account active
- [ ] RevenueCat account set up
- [ ] Design system finalized
- [ ] Database schema validated
- [ ] Development environment ready

**Before TestFlight beta:**
- [ ] All core features working
- [ ] Critical bugs fixed
- [ ] Basic error handling in place
- [ ] Subscription flow tested
- [ ] 5+ internal testers approve
- [ ] Legal: Privacy policy ready
- [ ] Legal: Terms of service ready

**Before App Store submission:**
- [ ] 10+ beta testers using app
- [ ] No critical bugs in last 2 weeks
- [ ] Average session rating 4+/5
- [ ] Subscription payments working
- [ ] App store assets prepared
- [ ] Marketing website live

---

**Last Updated:** January 8, 2026
**Version:** 1.0
**Status:** Specification Phase
