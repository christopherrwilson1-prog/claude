-- Student Organization Budget App - Database Schema
-- Supabase PostgreSQL Schema
-- Version: 1.0
-- Last Updated: 2026-01-08

-- ============================================================================
-- ENUMS
-- ============================================================================

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

CREATE TYPE member_role AS ENUM (
  'admin',
  'treasurer',
  'officer',
  'member'
);

CREATE TYPE budget_status AS ENUM (
  'draft',
  'submitted',
  'approved',
  'active',
  'closed'
);

CREATE TYPE item_type AS ENUM (
  'income',
  'expense'
);

CREATE TYPE event_status AS ENUM (
  'planning',
  'approved',
  'upcoming',
  'completed',
  'canceled'
);

CREATE TYPE expense_status AS ENUM (
  'pending',
  'approved',
  'paid',
  'rejected'
);

CREATE TYPE invitation_status AS ENUM (
  'pending',
  'accepted',
  'declined',
  'expired'
);

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

-- ============================================================================
-- TABLES
-- ============================================================================

-- Users Table (extends auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organizations Table
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

-- Organization Members Table
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role member_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_by UUID REFERENCES users(id),

  UNIQUE(organization_id, user_id)
);

-- Budgets Table
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

  UNIQUE(organization_id, fiscal_year),
  CONSTRAINT check_fiscal_year CHECK (fiscal_year >= 2020 AND fiscal_year <= 2100)
);

-- Budget Items Table
CREATE TABLE budget_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,

  -- Item Details
  item_type item_type NOT NULL,
  category TEXT NOT NULL,
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
  created_by UUID REFERENCES users(id),

  CONSTRAINT check_positive_amount CHECK (amount >= 0),
  CONSTRAINT check_semester_allocation CHECK (fall_amount + spring_amount <= amount)
);

-- Events Table
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
  created_by UUID REFERENCES users(id),

  CONSTRAINT check_positive_attendance CHECK (expected_attendance IS NULL OR expected_attendance > 0)
);

-- Expenses Table
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

-- Invitations Table
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

-- Activity Log Table
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Activity Details
  activity_type activity_type NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  description TEXT NOT NULL,
  metadata JSONB,

  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Users
CREATE INDEX idx_users_email ON users(email);

-- Organizations
CREATE INDEX idx_orgs_subscription_status ON organizations(subscription_status);
CREATE INDEX idx_orgs_university ON organizations(university);
CREATE INDEX idx_orgs_created_by ON organizations(created_by);

-- Organization Members
CREATE INDEX idx_org_members_org_id ON organization_members(organization_id);
CREATE INDEX idx_org_members_user_id ON organization_members(user_id);
CREATE INDEX idx_org_members_role ON organization_members(organization_id, role);

-- Budgets
CREATE INDEX idx_budgets_org_id ON budgets(organization_id);
CREATE INDEX idx_budgets_fiscal_year ON budgets(fiscal_year);
CREATE INDEX idx_budgets_status ON budgets(status);
CREATE INDEX idx_composite_budget_org_year ON budgets(organization_id, fiscal_year);

-- Budget Items
CREATE INDEX idx_budget_items_budget_id ON budget_items(budget_id);
CREATE INDEX idx_budget_items_type ON budget_items(item_type);
CREATE INDEX idx_budget_items_category ON budget_items(category);

-- Events
CREATE INDEX idx_events_budget_id ON events(budget_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_status ON events(event_status);
CREATE INDEX idx_composite_events_budget_date ON events(budget_id, event_date);

-- Expenses
CREATE INDEX idx_expenses_budget_id ON expenses(budget_id);
CREATE INDEX idx_expenses_event_id ON expenses(event_id);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_created_by ON expenses(created_by);
CREATE INDEX idx_composite_expense_budget_status ON expenses(budget_id, status);

-- Invitations
CREATE INDEX idx_invitations_org_id ON invitations(organization_id);
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_status ON invitations(status);

-- Activity Log
CREATE INDEX idx_activity_log_org_id ON activity_log(organization_id);
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at DESC);
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_items_updated_at BEFORE UPDATE ON budget_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Organization Members View (with user details)
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

-- Budget Overview View
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

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Note: RLS policies are defined in rls_policies.sql
