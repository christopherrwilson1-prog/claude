# Database Schema

## Overview

This document defines the complete PostgreSQL database schema for the Student Organization Budget App. The schema is designed for Supabase with Row Level Security (RLS) policies for multi-tenant data isolation.

## Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│   users     │────┐    │  organizations   │    ┌────│   budgets   │
│             │    │    │                  │    │    │             │
│ - id        │    │    │ - id             │◄───┤    │ - id        │
│ - email     │    │    │ - name           │    │    │ - org_id    │
│ - name      │    │    │ - type           │    │    │ - year      │
└─────────────┘    │    │ - subscription   │    │    │ - status    │
                   │    └──────────────────┘    │    └─────────────┘
                   │             ▲              │            │
                   │             │              │            │
                   │    ┌────────┴──────────┐   │    ┌───────▼──────────┐
                   └───►│ org_members       │   │    │ budget_items     │
                        │                   │   │    │                  │
                        │ - org_id          │   │    │ - budget_id      │
                        │ - user_id         │   │    │ - category       │
                        │ - role            │   │    │ - type           │
                        │ - joined_at       │   │    │ - amount         │
                        └───────────────────┘   │    └──────────────────┘
                                                │
                        ┌───────────────────┐   │    ┌──────────────────┐
                        │  events           │◄──┘    │  expenses        │
                        │                   │        │                  │
                        │ - id              │        │ - id             │
                        │ - budget_id       │◄───────│ - budget_id      │
                        │ - name            │        │ - event_id       │
                        │ - date            │        │ - description    │
                        │ - budget_amount   │        │ - amount         │
                        └───────────────────┘        │ - date           │
                                                     │ - created_by     │
                                                     └──────────────────┘

                        ┌───────────────────┐        ┌──────────────────┐
                        │  activity_log     │        │  invitations     │
                        │                   │        │                  │
                        │ - id              │        │ - id             │
                        │ - org_id          │        │ - org_id         │
                        │ - user_id         │        │ - email          │
                        │ - action          │        │ - role           │
                        │ - details         │        │ - token          │
                        │ - timestamp       │        │ - status         │
                        └───────────────────┘        └──────────────────┘
```

## Core Tables

### 1. users

**Purpose:** Store user profiles (extends Supabase auth.users)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

### 2. organizations

**Purpose:** Student organization profiles

```sql
CREATE TYPE org_type AS ENUM (
  'academic',
  'cultural',
  'social',
  'service',
  'professional',
  'athletic',
  'greek',
  'special_interest',
  'other'
);

CREATE TYPE subscription_status AS ENUM (
  'trial',
  'active',
  'past_due',
  'canceled',
  'expired'
);

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  org_type org_type NOT NULL DEFAULT 'other',
  university TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,

  -- Subscription
  subscription_status subscription_status NOT NULL DEFAULT 'trial',
  subscription_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  trial_end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days',
  revenuecat_customer_id TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id),

  CONSTRAINT org_name_unique_per_university UNIQUE(name, university)
);

-- Indexes
CREATE INDEX idx_orgs_subscription_status ON organizations(subscription_status);
CREATE INDEX idx_orgs_university ON organizations(university);
CREATE INDEX idx_orgs_created_by ON organizations(created_by);

-- RLS Policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view orgs they belong to"
  ON organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update their org"
  ON organizations FOR UPDATE
  USING (
    id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer')
    )
  );
```

### 3. organization_members

**Purpose:** User membership in organizations with roles

```sql
CREATE TYPE member_role AS ENUM (
  'admin',      -- Full permissions
  'treasurer',  -- Financial permissions
  'officer',    -- Can view and add expenses
  'member'      -- View-only
);

CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role member_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_by UUID REFERENCES users(id),

  UNIQUE(organization_id, user_id)
);

-- Indexes
CREATE INDEX idx_org_members_org_id ON organization_members(organization_id);
CREATE INDEX idx_org_members_user_id ON organization_members(user_id);
CREATE INDEX idx_org_members_role ON organization_members(organization_id, role);

-- RLS Policies
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view members of their orgs"
  ON organization_members FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage members"
  ON organization_members FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer')
    )
  );
```

### 4. budgets

**Purpose:** Annual budget plans for organizations

```sql
CREATE TYPE budget_status AS ENUM (
  'draft',
  'submitted',
  'approved',
  'active',
  'closed'
);

CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Budget Info
  fiscal_year INTEGER NOT NULL,
  title TEXT NOT NULL,
  status budget_status NOT NULL DEFAULT 'draft',

  -- Totals (cached for performance)
  total_income DECIMAL(12, 2) DEFAULT 0,
  total_expenses DECIMAL(12, 2) DEFAULT 0,
  contingency_amount DECIMAL(12, 2) DEFAULT 0,
  contingency_percentage DECIMAL(5, 2) DEFAULT 10.00,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES users(id),

  UNIQUE(organization_id, fiscal_year)
);

-- Indexes
CREATE INDEX idx_budgets_org_id ON budgets(organization_id);
CREATE INDEX idx_budgets_fiscal_year ON budgets(fiscal_year);
CREATE INDEX idx_budgets_status ON budgets(status);

-- RLS Policies
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their org's budgets"
  ON budgets FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Treasurers can create budgets"
  ON budgets FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer')
    )
  );

CREATE POLICY "Treasurers can update budgets"
  ON budgets FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer')
    )
  );
```

### 5. budget_items

**Purpose:** Individual income and expense line items in budgets

```sql
CREATE TYPE item_type AS ENUM ('income', 'expense');

CREATE TYPE income_category AS ENUM (
  'student_government_allocation',
  'fundraising',
  'membership_dues',
  'event_ticket_sales',
  'sponsorships',
  'donations',
  'grants',
  'other_income'
);

CREATE TYPE expense_category AS ENUM (
  'events_programming',
  'food_catering',
  'marketing_printing',
  'travel_transportation',
  'supplies_materials',
  'speaker_performer_fees',
  'equipment_technology',
  'administrative',
  'venue_rental',
  'insurance',
  'other_expense'
);

CREATE TABLE budget_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,

  -- Item Details
  item_type item_type NOT NULL,
  category TEXT NOT NULL, -- Maps to income_category or expense_category
  description TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount >= 0),

  -- Semester Allocation
  fall_amount DECIMAL(12, 2) DEFAULT 0,
  spring_amount DECIMAL(12, 2) DEFAULT 0,

  -- Tracking
  actual_amount DECIMAL(12, 2) DEFAULT 0,

  -- Metadata
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_budget_items_budget_id ON budget_items(budget_id);
CREATE INDEX idx_budget_items_type ON budget_items(item_type);
CREATE INDEX idx_budget_items_category ON budget_items(category);

-- RLS Policies
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view budget items"
  ON budget_items FOR SELECT
  USING (
    budget_id IN (
      SELECT b.id FROM budgets b
      WHERE b.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Treasurers can manage budget items"
  ON budget_items FOR ALL
  USING (
    budget_id IN (
      SELECT b.id FROM budgets b
      WHERE b.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer')
      )
    )
  );
```

### 6. events

**Purpose:** Individual event budgets and planning

```sql
CREATE TYPE event_status AS ENUM (
  'planning',
  'approved',
  'upcoming',
  'completed',
  'canceled'
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,

  -- Event Info
  name TEXT NOT NULL,
  description TEXT,
  event_date DATE,
  event_status event_status NOT NULL DEFAULT 'planning',

  -- Budget
  budgeted_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  expected_attendance INTEGER,
  ticket_price DECIMAL(10, 2) DEFAULT 0,
  expected_revenue DECIMAL(12, 2) DEFAULT 0,

  -- Actuals
  actual_amount DECIMAL(12, 2) DEFAULT 0,
  actual_attendance INTEGER,
  actual_revenue DECIMAL(12, 2) DEFAULT 0,

  -- Metadata
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_events_budget_id ON events(budget_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_status ON events(event_status);

-- RLS Policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their org's events"
  ON events FOR SELECT
  USING (
    budget_id IN (
      SELECT b.id FROM budgets b
      WHERE b.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Officers can manage events"
  ON events FOR ALL
  USING (
    budget_id IN (
      SELECT b.id FROM budgets b
      WHERE b.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer', 'officer')
      )
    )
  );
```

### 7. expenses

**Purpose:** Track actual expenses against budget

```sql
CREATE TYPE expense_status AS ENUM (
  'pending',
  'approved',
  'paid',
  'rejected'
);

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  budget_item_id UUID REFERENCES budget_items(id) ON DELETE SET NULL,

  -- Expense Details
  description TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  expense_date DATE NOT NULL,
  category TEXT NOT NULL,

  -- Approval
  status expense_status NOT NULL DEFAULT 'pending',
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,

  -- Documentation
  receipt_url TEXT,
  vendor TEXT,
  payment_method TEXT,
  notes TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_expenses_budget_id ON expenses(budget_id);
CREATE INDEX idx_expenses_event_id ON expenses(event_id);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_created_by ON expenses(created_by);

-- RLS Policies
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their org's expenses"
  ON expenses FOR SELECT
  USING (
    budget_id IN (
      SELECT b.id FROM budgets b
      WHERE b.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Officers can create expenses"
  ON expenses FOR INSERT
  WITH CHECK (
    budget_id IN (
      SELECT b.id FROM budgets b
      WHERE b.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer', 'officer')
      )
    )
  );

CREATE POLICY "Treasurers can approve expenses"
  ON expenses FOR UPDATE
  USING (
    budget_id IN (
      SELECT b.id FROM budgets b
      WHERE b.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer')
      )
    )
  );
```

### 8. invitations

**Purpose:** Invite new members to organizations

```sql
CREATE TYPE invitation_status AS ENUM (
  'pending',
  'accepted',
  'declined',
  'expired'
);

CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Invitation Details
  email TEXT NOT NULL,
  role member_role NOT NULL DEFAULT 'member',
  token TEXT NOT NULL UNIQUE,
  status invitation_status NOT NULL DEFAULT 'pending',

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days',
  invited_by UUID NOT NULL REFERENCES users(id),
  accepted_at TIMESTAMP WITH TIME ZONE,
  accepted_by UUID REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_invitations_org_id ON invitations(organization_id);
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_status ON invitations(status);

-- RLS Policies
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their org's invitations"
  ON invitations FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
    OR email = (SELECT email FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can create invitations"
  ON invitations FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer')
    )
  );
```

### 9. activity_log

**Purpose:** Audit trail of user actions

```sql
CREATE TYPE activity_type AS ENUM (
  'budget_created',
  'budget_updated',
  'budget_submitted',
  'budget_approved',
  'item_added',
  'item_updated',
  'item_deleted',
  'event_created',
  'event_updated',
  'expense_created',
  'expense_approved',
  'expense_rejected',
  'member_added',
  'member_removed',
  'role_changed'
);

CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Activity Details
  activity_type activity_type NOT NULL,
  entity_type TEXT NOT NULL,  -- 'budget', 'event', 'expense', etc.
  entity_id UUID,
  description TEXT NOT NULL,
  metadata JSONB,

  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_activity_log_org_id ON activity_log(organization_id);
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at DESC);
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);

-- RLS Policies
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their org's activity"
  ON activity_log FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );
```

## Database Functions

### 1. Update Budget Totals Trigger

```sql
CREATE OR REPLACE FUNCTION update_budget_totals()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE budgets
  SET
    total_income = (
      SELECT COALESCE(SUM(amount), 0)
      FROM budget_items
      WHERE budget_id = NEW.budget_id AND item_type = 'income'
    ),
    total_expenses = (
      SELECT COALESCE(SUM(amount), 0)
      FROM budget_items
      WHERE budget_id = NEW.budget_id AND item_type = 'expense'
    ),
    updated_at = NOW()
  WHERE id = NEW.budget_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_budget_totals
AFTER INSERT OR UPDATE OR DELETE ON budget_items
FOR EACH ROW
EXECUTE FUNCTION update_budget_totals();
```

### 2. Log Activity Function

```sql
CREATE OR REPLACE FUNCTION log_activity(
  p_org_id UUID,
  p_user_id UUID,
  p_activity_type activity_type,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_description TEXT,
  p_metadata JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO activity_log (
    organization_id,
    user_id,
    activity_type,
    entity_type,
    entity_id,
    description,
    metadata
  )
  VALUES (
    p_org_id,
    p_user_id,
    p_activity_type,
    p_entity_type,
    p_entity_id,
    p_description,
    p_metadata
  );
END;
$$ LANGUAGE plpgsql;
```

### 3. Check Subscription Status

```sql
CREATE OR REPLACE FUNCTION check_subscription_active(p_org_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_status subscription_status;
  v_trial_end TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT subscription_status, trial_end_date
  INTO v_status, v_trial_end
  FROM organizations
  WHERE id = p_org_id;

  -- Active subscription
  IF v_status = 'active' THEN
    RETURN TRUE;
  END IF;

  -- Still in trial period
  IF v_status = 'trial' AND v_trial_end > NOW() THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;
```

### 4. Calculate Budget Summary

```sql
CREATE OR REPLACE FUNCTION get_budget_summary(p_budget_id UUID)
RETURNS TABLE (
  total_income DECIMAL,
  total_expenses DECIMAL,
  net_position DECIMAL,
  contingency DECIMAL,
  actual_spent DECIMAL,
  remaining_budget DECIMAL,
  percent_spent DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE WHEN bi.item_type = 'income' THEN bi.amount ELSE 0 END), 0) as total_income,
    COALESCE(SUM(CASE WHEN bi.item_type = 'expense' THEN bi.amount ELSE 0 END), 0) as total_expenses,
    COALESCE(SUM(CASE WHEN bi.item_type = 'income' THEN bi.amount ELSE -bi.amount END), 0) as net_position,
    (SELECT b.contingency_amount FROM budgets b WHERE b.id = p_budget_id) as contingency,
    COALESCE((SELECT SUM(e.amount) FROM expenses e WHERE e.budget_id = p_budget_id AND e.status = 'paid'), 0) as actual_spent,
    COALESCE(SUM(CASE WHEN bi.item_type = 'expense' THEN bi.amount ELSE 0 END), 0) -
      COALESCE((SELECT SUM(e.amount) FROM expenses e WHERE e.budget_id = p_budget_id AND e.status = 'paid'), 0) as remaining_budget,
    CASE
      WHEN COALESCE(SUM(CASE WHEN bi.item_type = 'expense' THEN bi.amount ELSE 0 END), 0) > 0
      THEN (COALESCE((SELECT SUM(e.amount) FROM expenses e WHERE e.budget_id = p_budget_id AND e.status = 'paid'), 0) /
            COALESCE(SUM(CASE WHEN bi.item_type = 'expense' THEN bi.amount ELSE 0 END), 1)) * 100
      ELSE 0
    END as percent_spent
  FROM budget_items bi
  WHERE bi.budget_id = p_budget_id;
END;
$$ LANGUAGE plpgsql;
```

## Views

### 1. Organization Members View (with user details)

```sql
CREATE VIEW org_members_view AS
SELECT
  om.id,
  om.organization_id,
  om.user_id,
  om.role,
  om.joined_at,
  u.email,
  u.full_name,
  u.avatar_url
FROM organization_members om
JOIN users u ON om.user_id = u.id;
```

### 2. Budget Overview View

```sql
CREATE VIEW budget_overview AS
SELECT
  b.id,
  b.organization_id,
  b.fiscal_year,
  b.title,
  b.status,
  b.total_income,
  b.total_expenses,
  b.total_income - b.total_expenses as net_position,
  b.contingency_amount,
  COALESCE(SUM(e.amount) FILTER (WHERE e.status = 'paid'), 0) as total_spent,
  b.total_expenses - COALESCE(SUM(e.amount) FILTER (WHERE e.status = 'paid'), 0) as remaining_budget,
  CASE
    WHEN b.total_expenses > 0
    THEN (COALESCE(SUM(e.amount) FILTER (WHERE e.status = 'paid'), 0) / b.total_expenses) * 100
    ELSE 0
  END as percent_spent,
  b.created_at,
  b.updated_at,
  o.name as org_name
FROM budgets b
JOIN organizations o ON b.organization_id = o.id
LEFT JOIN expenses e ON e.budget_id = b.id
GROUP BY b.id, o.name;
```

## Indexes Summary

```sql
-- Performance indexes for common queries
CREATE INDEX idx_composite_budget_org_year ON budgets(organization_id, fiscal_year);
CREATE INDEX idx_composite_expense_budget_status ON expenses(budget_id, status);
CREATE INDEX idx_composite_events_budget_date ON events(budget_id, event_date);
```

## Data Validation Constraints

```sql
-- Ensure fiscal year is reasonable
ALTER TABLE budgets ADD CONSTRAINT check_fiscal_year
  CHECK (fiscal_year >= 2020 AND fiscal_year <= 2100);

-- Ensure amounts are non-negative where appropriate
ALTER TABLE budget_items ADD CONSTRAINT check_positive_amount
  CHECK (amount >= 0);

-- Ensure semester allocations don't exceed total
ALTER TABLE budget_items ADD CONSTRAINT check_semester_allocation
  CHECK (fall_amount + spring_amount <= amount);

-- Ensure event attendance is positive
ALTER TABLE events ADD CONSTRAINT check_positive_attendance
  CHECK (expected_attendance IS NULL OR expected_attendance > 0);
```

## Sample Queries

### Get organization's current budget with summary

```sql
SELECT * FROM budget_overview
WHERE organization_id = '...'
  AND fiscal_year = EXTRACT(YEAR FROM CURRENT_DATE)
ORDER BY created_at DESC
LIMIT 1;
```

### Get all expenses for a budget with variance

```sql
SELECT
  e.*,
  bi.amount as budgeted,
  bi.amount - COALESCE(
    (SELECT SUM(e2.amount)
     FROM expenses e2
     WHERE e2.budget_item_id = bi.id AND e2.status = 'paid'), 0
  ) as remaining
FROM expenses e
LEFT JOIN budget_items bi ON e.budget_item_id = bi.id
WHERE e.budget_id = '...'
ORDER BY e.expense_date DESC;
```

### Get upcoming events with budget status

```sql
SELECT
  ev.*,
  ev.budgeted_amount - COALESCE(SUM(ex.amount), 0) as remaining_budget
FROM events ev
LEFT JOIN expenses ex ON ex.event_id = ev.id AND ex.status IN ('approved', 'paid')
WHERE ev.budget_id = '...'
  AND ev.event_date >= CURRENT_DATE
  AND ev.event_status != 'canceled'
GROUP BY ev.id
ORDER BY ev.event_date;
```

---

**Last Updated:** January 8, 2026
**Schema Version:** 1.0
**Status:** Specification Phase
