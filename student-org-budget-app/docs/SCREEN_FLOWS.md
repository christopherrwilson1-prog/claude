# Screen Flows & Navigation

## Navigation Architecture

### App Navigation Structure

```
Root Navigator (Stack)
├── Auth Stack
│   ├── Welcome Screen
│   ├── Login Screen
│   ├── Sign Up Screen
│   └── Forgot Password Screen
│
└── Main Tab Navigator
    ├── Dashboard Tab
    │   ├── Dashboard Screen
    │   └── Budget Details Screen (Modal)
    │
    ├── Budget Tab
    │   ├── Budget List Screen
    │   ├── Create/Edit Budget Screen
    │   ├── Budget Items Screen
    │   └── Add Budget Item Screen (Modal)
    │
    ├── Events Tab
    │   ├── Events List Screen
    │   ├── Event Details Screen
    │   ├── Create Event Screen
    │   └── Event Budget Breakdown Screen (Modal)
    │
    ├── Tracking Tab
    │   ├── Expense List Screen
    │   ├── Add Expense Screen (Modal)
    │   ├── Expense Details Screen
    │   └── Monthly View Screen
    │
    └── More Tab
        ├── Settings Screen
        ├── Organization Settings Screen
        ├── Team Members Screen
        ├── Invite Members Screen (Modal)
        ├── Reports Screen
        ├── Generate Report Screen
        ├── Subscription Screen
        └── Profile Screen
```

## User Flows

### 1. Onboarding Flow (New User)

```
App Launch
    ↓
[Splash Screen] (2s)
    ↓
Check Auth State
    ↓
Not Authenticated
    ↓
[Welcome Screen]
- "Welcome to BudgetPro"
- "Manage your student org budget like a pro"
- [Get Started Button]
- [Already have an account? Sign In]
    ↓
User taps "Get Started"
    ↓
[Sign Up Screen]
- Email input
- Password input
- Full name input
- [Create Account Button]
    ↓
Account Created
    ↓
[Organization Setup Screen]
- "Create Your Organization"
- Organization name
- University name (searchable dropdown)
- Organization type (dropdown)
- [Continue Button]
    ↓
Organization Created (7-day trial starts)
    ↓
[Role Selection Screen]
- "What's your role?"
- Radio buttons: Treasurer / President / Officer / Member
- [This helps us customize your experience]
- [Continue Button]
    ↓
[Quick Tour] (Optional, swipeable)
- Screen 1: "Create Your Annual Budget"
- Screen 2: "Plan Individual Events"
- Screen 3: "Track Expenses in Real-Time"
- Screen 4: "Generate Professional Reports"
- [Skip] / [Next] / [Get Started]
    ↓
[Dashboard Screen] (Main App)
```

### 2. Onboarding Flow (Invited User)

```
User Opens Invitation Link
    ↓
[App Opens to Invitation Screen]
- "You've been invited to join [Org Name]"
- Organization details shown
- Role being offered
- Invited by: [Name]
    ↓
Has Account?
    ├── Yes → [Login Screen] → Accept Invitation → [Dashboard]
    └── No → [Sign Up Screen] → Accept Invitation → [Dashboard]
```

### 3. Login Flow

```
[Welcome Screen]
    ↓
User taps "Sign In"
    ↓
[Login Screen]
- Email input
- Password input
- [Forgot Password?]
- [Sign In Button]
- [Don't have an account? Sign Up]
    ↓
Authentication Success
    ↓
Load User Data
    ↓
[Select Organization Screen] (if user belongs to multiple orgs)
- List of organizations
- Tap to select
    ↓
[Dashboard Screen]
```

### 4. Budget Creation Flow

```
[Dashboard] or [Budget List]
    ↓
User taps "Create Budget" FAB
    ↓
[Create Budget Screen]
- Fiscal Year (auto-populated: current year)
- Budget Title (e.g., "2024-2025 Annual Budget")
- [Create Budget Button]
    ↓
Budget Created (status: draft)
    ↓
[Budget Items Screen]
- Empty state: "Add your first income or expense"
- [Add Income Button]
- [Add Expense Button]
    ↓
User taps "Add Income"
    ↓
[Add Budget Item Modal]
- Type: Income (toggle: Income/Expense)
- Category (dropdown)
  * Student Government Allocation
  * Fundraising
  * Membership Dues
  * Event Ticket Sales
  * Sponsorships
  * Donations
  * Grants
  * Other Income
- Description
- Amount ($)
- Fall Semester Amount ($)
- Spring Semester Amount ($)
- Notes (optional)
- [Save Button]
    ↓
Item Added
    ↓
[Budget Items Screen] (updated)
- Shows added item
- Running totals at bottom:
  * Total Income: $X
  * Total Expenses: $Y
  * Net Position: $Z
  * Status indicator (green if balanced, red if deficit)
    ↓
User continues adding items
    ↓
Budget Complete
    ↓
User taps "Submit for Approval" (if treasurer)
    ↓
[Confirmation Dialog]
- "Submit budget for approval?"
- "You'll be able to edit after approval if needed"
- [Cancel] [Submit]
    ↓
Budget Status: Submitted
```

### 5. Event Planning Flow

```
[Events Tab]
    ↓
User taps "Create Event" FAB
    ↓
[Create Event Screen]
Section 1: Event Details
- Event Name
- Description
- Event Date (date picker)
- Location
- Expected Attendance (number input)
- Ticket Price ($ - optional)

Section 2: Budget
- Select Budget (dropdown of active budgets)
- Total Event Budget ($)

Section 3: Expected Income
- Ticket Sales (auto-calculated: attendance × ticket price)
- Sponsorships ($)
- Other Revenue ($)
→ Total Expected Revenue: $X

Section 4: Expected Expenses
- Quick Add Buttons:
  * [+ Venue]
  * [+ Food/Catering]
  * [+ Entertainment]
  * [+ Marketing]
  * [+ Supplies]
  * [+ Other]

[Add Expense Line Item]
- Category (dropdown)
- Description
- Estimated Cost ($)
- [Add]

[Expense List]
- Shows all added expenses
- Swipe to edit/delete
- Running total

[Bottom Summary Card]
- Total Budget: $X
- Expected Revenue: $Y
- Expected Expenses: $Z
- Net Position: $(X+Y-Z)
- Per Attendee Cost: $W
- Break-even Attendance: N people

[Save Draft] [Create Event]
    ↓
Event Created
    ↓
[Event Details Screen]
- All event info
- Budget breakdown (chart)
- [Track Actual Expenses] button
- [Edit Event]
- [Cancel Event]
```

### 6. Expense Tracking Flow

```
[Tracking Tab]
    ↓
[Add Expense FAB]
    ↓
[Add Expense Modal]
- Description
- Amount ($)
- Date (default: today)
- Category (dropdown)
- Related Event (dropdown - optional)
- Related Budget Item (dropdown - optional)
- Vendor
- Payment Method (dropdown: Cash, Card, Check, Venmo, etc.)
- [Upload Receipt] (optional)
- Notes

[Submit for Approval] [Save as Draft]
    ↓
Expense Added (status: pending)
    ↓
[Expense List Screen] (updated)
- Grouped by status:
  * Pending Approval
  * Approved
  * Paid
  * Rejected

[Treasurer View]
- Sees notification badge
- Taps on pending expense
- [Expense Details Screen]
  * All expense info
  * Receipt image (if uploaded)
  * [Approve] [Reject] buttons
    ↓
Approve/Reject
    ↓
Expense Status Updated
    ↓
Creator gets notification
```

### 7. Dashboard Flow

```
[Dashboard Screen]

Top Section: Organization Header
- Org logo & name
- Switch org button (if member of multiple)

Card 1: Budget Health
- Current Budget: "[Budget Title]"
- Visual gauge (0-100% spent)
- Total Budget: $X
- Spent: $Y
- Remaining: $Z
- Status: [On Track] / [Warning] / [Over Budget]
- Tap to view details

Card 2: Quick Stats
- Total Events: N (M upcoming)
- Pending Expenses: N ($X)
- Team Members: N
- Tap any stat to drill down

Card 3: Recent Activity
- Last 5 activities
- Icons + descriptions
- Timestamps
- "View All" button

Card 4: Upcoming Events
- Next 3 events
- Date, name, budget status
- Tap to view event details

Card 5: Alerts & Notifications
- Trial ending soon
- Expenses pending approval
- Budget milestones
- Overspent categories

Bottom Section: Quick Actions
- [Add Expense]
- [Create Event]
- [View Reports]
```

### 8. Report Generation Flow

```
[More Tab] → [Reports]
    ↓
[Reports Screen]
- Available Reports:
  1. Allocation Request
  2. Year-End Report
  3. Event Summary
  4. Monthly Statement
  5. Expense Report
    ↓
User selects "Allocation Request"
    ↓
[Generate Allocation Request Screen]
- Select Budget (dropdown)
- Select Reporting Period
- Include Sections (checkboxes):
  ☑ Organization Overview
  ☑ Budget Summary
  ☑ Income Breakdown
  ☑ Expense Breakdown
  ☑ Event Plans
  ☑ Past Year Performance (if available)
- Additional Notes (text area)
- Recipient (optional)

[Preview] [Generate PDF]
    ↓
User taps "Generate PDF"
    ↓
[Loading Screen]
"Generating your professional report..."
    ↓
PDF Generated
    ↓
[Report Preview Screen]
- PDF viewer
- [Share] [Download] [Email]
    ↓
User shares via iOS share sheet
```

### 9. Team Management Flow

```
[More Tab] → [Team Members]
    ↓
[Team Members Screen]
- List of members
  * Avatar, name, role
  * Last active timestamp
  * [Role indicator badge]
- [Invite Member] FAB
    ↓
User taps "Invite Member"
    ↓
[Invite Member Modal]
- Email Address
- Role (dropdown):
  * Admin - Full access
  * Treasurer - Financial permissions
  * Officer - Can add expenses
  * Member - View only
- Personal message (optional)
- [Send Invitation]
    ↓
Invitation Sent
    ↓
[Pending Invitations Section]
- Shows invited emails
- Status: Sent, Accepted, Expired
- [Resend] [Cancel] options
```

### 10. Subscription Management Flow

```
Day 1: Trial starts automatically
    ↓
Day 5: In-app banner
"2 days left in your free trial"
[Subscribe Now]
    ↓
Day 7: Trial expires
    ↓
[Subscription Required Screen]
- Feature list
- Pricing: $5/month
- [Start Subscription]
- "7-day free trial, then $5/month"
- "Cancel anytime"
    ↓
User taps "Start Subscription"
    ↓
[iOS Subscription Sheet] (native)
- Managed by Apple
- Shows pricing, terms
- Face ID / Touch ID to confirm
    ↓
Subscription Active
    ↓
[Confirmation Screen]
"You're all set! 🎉"
"Your subscription is now active"
[Continue to Dashboard]
    ↓

[Settings] → [Subscription]
    ↓
[Subscription Screen]
- Status: Active
- Next billing date
- Amount: $5/month
- [Manage Subscription] (opens iOS Settings)
- [Receipt History]
- [Cancel Subscription]
```

## Screen Specifications

### 1. Dashboard Screen

**Purpose:** Central hub showing budget health and activity

**Layout:**
```
┌─────────────────────────────────┐
│ ← [Org Name]          [Switch] │
├─────────────────────────────────┤
│                                 │
│  ┌─ Budget Health ───────────┐ │
│  │ [Circular Progress: 65%]  │ │
│  │ Spent: $13,000 / $20,000  │ │
│  │ Status: On Track ✓        │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌─ Quick Stats ─────────────┐ │
│  │ 📅 8 Events  💰 5 Pending │ │
│  │ 👥 12 Members  📊 Active  │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌─ Recent Activity ─────────┐ │
│  │ 🔹 John added expense     │ │
│  │ 🔹 Budget approved        │ │
│  │ 🔹 Event created          │ │
│  │            [View All →]   │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌─ Upcoming Events ─────────┐ │
│  │ Apr 15 - Spring Gala      │ │
│  │ Apr 22 - Speaker Series   │ │
│  │            [View All →]   │ │
│  └───────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
│  🏠   💰   📅   📊   •••     │
└─────────────────────────────────┘
```

**Components:**
- Scrollable content
- Refresh control (pull to refresh)
- Tap cards to navigate to details
- Real-time updates via WebSocket

### 2. Budget Items Screen

**Purpose:** View and manage income/expense line items

**Layout:**
```
┌─────────────────────────────────┐
│ ← 2024-2025 Annual Budget   ⋮  │
├─────────────────────────────────┤
│ [Income] [Expenses] [Summary]   │ (Tabs)
├─────────────────────────────────┤
│                                 │
│ ► STUDENT GOVERNMENT            │
│   Allocation Request  $15,000   │
│   Fall: $7,500 | Spring: $7,500 │
│                                 │
│ ► FUNDRAISING                   │
│   Spring Fundraiser    $3,000   │
│   Fall: $0 | Spring: $3,000     │
│                                 │
│ ► MEMBERSHIP DUES               │
│   Annual Dues          $2,000   │
│   Fall: $1,000 | Spring: $1,000 │
│                                 │
├─────────────────────────────────┤
│ Total Income:          $20,000  │
│ Total Expenses:        $18,000  │
│ Contingency (10%):      $1,800  │
│ Net Position:             $200  │
│                           ✓     │
└─────────────────────────────────┘
│              [+]                │ (FAB)
└─────────────────────────────────┘
```

**Interactions:**
- Swipe left on item: Edit / Delete
- Tap item: Expand to show details
- Tap (+): Add new income/expense
- Tabs to switch between income/expenses/summary
- Color coding: Green for income, red for expenses

### 3. Event Details Screen

**Purpose:** View event budget and track progress

**Layout:**
```
┌─────────────────────────────────┐
│ ← Spring Gala 2024          ⋮  │
├─────────────────────────────────┤
│ 📅 April 15, 2024               │
│ 📍 Student Center Ballroom      │
│ 👥 150 expected attendees       │
│ 🎫 $20 ticket price             │
├─────────────────────────────────┤
│                                 │
│ [Pie Chart: Budget Breakdown]   │
│   Food: 45%                     │
│   Entertainment: 30%            │
│   Venue: 15%                    │
│   Marketing: 10%                │
│                                 │
│ ┌─ Budget Summary ────────────┐│
│ │ Total Budget      $5,000    ││
│ │ Expected Revenue  $3,000    ││
│ │ Expected Expenses $4,500    ││
│ │ Net from Budget   $1,500    ││
│ │                             ││
│ │ Break-even: 113 attendees   ││
│ │ Cost per person: $30        ││
│ └─────────────────────────────┘│
│                                 │
│ ┌─ Expense Breakdown ─────────┐│
│ │ 🍕 Catering      $2,250     ││
│ │ 🎤 DJ Service    $1,500     ││
│ │ 🏛️  Venue Rental   $750     ││
│ │ 📢 Marketing       $500     ││
│ └─────────────────────────────┘│
│                                 │
│ [Track Actual Expenses]         │
│ [Edit Event]                    │
└─────────────────────────────────┘
```

### 4. Add Expense Modal

**Purpose:** Quick expense entry

**Layout:**
```
┌─────────────────────────────────┐
│          Add Expense        ✕   │
├─────────────────────────────────┤
│                                 │
│ Description                     │
│ ┌─────────────────────────────┐│
│ │ Pizzas for general meeting  ││
│ └─────────────────────────────┘│
│                                 │
│ Amount                          │
│ ┌─────────────────────────────┐│
│ │ $ 85.50                     ││
│ └─────────────────────────────┘│
│                                 │
│ Date                            │
│ ┌─────────────────────────────┐│
│ │ 04/10/2024             📅   ││
│ └─────────────────────────────┘│
│                                 │
│ Category                        │
│ ┌─────────────────────────────┐│
│ │ Food & Catering        ▼   ││
│ └─────────────────────────────┘│
│                                 │
│ Related Event (Optional)        │
│ ┌─────────────────────────────┐│
│ │ None                   ▼   ││
│ └─────────────────────────────┘│
│                                 │
│ Receipt (Optional)              │
│ ┌─────────────────────────────┐│
│ │   📷  📁  Take or Upload    ││
│ └─────────────────────────────┘│
│                                 │
│                                 │
│ [Cancel]         [Add Expense]  │
└─────────────────────────────────┘
```

### 5. Reports Screen

**Purpose:** Generate and access financial reports

**Layout:**
```
┌─────────────────────────────────┐
│ ← Reports                       │
├─────────────────────────────────┤
│                                 │
│ 📄 Allocation Request           │
│    Professional budget request  │
│    for student government       │
│                            →    │
│                                 │
│ 📊 Year-End Report              │
│    Comprehensive financial      │
│    summary and achievements     │
│                            →    │
│                                 │
│ 📅 Event Summary Report         │
│    Individual or all events     │
│    performance analysis         │
│                            →    │
│                                 │
│ 💳 Monthly Statement            │
│    Month-by-month income and    │
│    expense tracking             │
│                            →    │
│                                 │
│ 🧾 Expense Report               │
│    Detailed expense breakdown   │
│    by category or date range    │
│                            →    │
│                                 │
│ ┌─ Recent Reports ────────────┐│
│ │ 📄 2024 Allocation Request  ││
│ │    Generated: Apr 1, 2024   ││
│ │                             ││
│ │ 📊 Fall Semester Report     ││
│ │    Generated: Dec 15, 2023  ││
│ └─────────────────────────────┘│
└─────────────────────────────────┘
```

## Interaction Patterns

### Real-time Collaboration Indicators

When another user is editing:
```
┌─────────────────────────────────┐
│ Budget Items                    │
│ 👤 John is editing...       [👁]│
├─────────────────────────────────┤
│ [Gentle pulsing highlight]      │
│ ► FUNDRAISING                   │
│   Spring Event         $3,000   │
│                                 │
```

### Optimistic UI Updates

```
User taps "Add Expense"
    ↓
Immediately show expense in list (dimmed)
    ↓
Sync to server in background
    ↓
Success: Remove dimming, show check mark briefly
Failure: Remove from list, show error toast, undo option
```

### Loading States

```
[Shimmer loading cards while fetching data]

┌─────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░    │
│ ▓▓▓▓▓░░░░░░░                    │
│                                 │
│ ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░        │
│ ▓▓▓▓░░░░░░                      │
└─────────────────────────────────┘
```

### Error States

```
┌─────────────────────────────────┐
│         🌐                      │
│    Connection Lost              │
│                                 │
│  Unable to load budget data     │
│  Please check your connection   │
│                                 │
│     [Try Again]                 │
└─────────────────────────────────┘
```

### Empty States

```
┌─────────────────────────────────┐
│         📋                      │
│    No Expenses Yet              │
│                                 │
│  Track your first expense to    │
│  start managing your budget     │
│                                 │
│     [Add Expense]               │
└─────────────────────────────────┘
```

## Gestures & Interactions

- **Pull to refresh:** All list screens
- **Swipe left:** Edit/Delete on list items
- **Long press:** Quick actions menu
- **Pinch to zoom:** PDF viewer
- **Tap outside:** Dismiss modals
- **Swipe down:** Dismiss full-screen modals

## Notifications

### Push Notifications (Future)
- Expense approved/rejected
- Budget submitted for approval
- New member joined
- Trial ending soon
- Monthly budget reminder

### In-App Notifications
- Real-time activity feed
- Badge counts on tabs
- Toast messages for actions

---

**Last Updated:** January 8, 2026
**Version:** 1.0
**Status:** Specification Phase
