-- Student Organization Budget App - Database Functions
-- Supabase PostgreSQL Functions
-- Version: 1.0
-- Last Updated: 2026-01-08

-- ============================================================================
-- BUDGET CALCULATION FUNCTIONS
-- ============================================================================

-- Update Budget Totals Trigger Function
CREATE OR REPLACE FUNCTION update_budget_totals()
RETURNS TRIGGER AS $$
DECLARE
  v_budget_id UUID;
BEGIN
  -- Determine which budget to update
  IF TG_OP = 'DELETE' THEN
    v_budget_id := OLD.budget_id;
  ELSE
    v_budget_id := NEW.budget_id;
  END IF;

  -- Update budget totals
  UPDATE budgets
  SET
    total_income = (
      SELECT COALESCE(SUM(amount), 0)
      FROM budget_items
      WHERE budget_id = v_budget_id AND item_type = 'income'
    ),
    total_expenses = (
      SELECT COALESCE(SUM(amount), 0)
      FROM budget_items
      WHERE budget_id = v_budget_id AND item_type = 'expense'
    ),
    updated_at = NOW()
  WHERE id = v_budget_id;

  -- Update contingency amount (10% of expenses)
  UPDATE budgets
  SET contingency_amount = total_expenses * (contingency_percentage / 100)
  WHERE id = v_budget_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for budget items
DROP TRIGGER IF EXISTS trigger_update_budget_totals ON budget_items;
CREATE TRIGGER trigger_update_budget_totals
AFTER INSERT OR UPDATE OR DELETE ON budget_items
FOR EACH ROW
EXECUTE FUNCTION update_budget_totals();

-- ============================================================================
-- ACTIVITY LOGGING FUNCTION
-- ============================================================================

-- Log Activity Function
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SUBSCRIPTION MANAGEMENT FUNCTIONS
-- ============================================================================

-- Check Subscription Status
CREATE OR REPLACE FUNCTION check_subscription_active(p_org_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_status subscription_status;
  v_trial_end TIMESTAMP WITH TIME ZONE;
  v_subscription_end TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT subscription_status, trial_end_date, subscription_end_date
  INTO v_status, v_trial_end, v_subscription_end
  FROM organizations
  WHERE id = p_org_id;

  -- Active subscription
  IF v_status = 'active' THEN
    -- Check if subscription hasn't expired
    IF v_subscription_end IS NULL OR v_subscription_end > NOW() THEN
      RETURN TRUE;
    END IF;
  END IF;

  -- Still in trial period
  IF v_status = 'trial' AND v_trial_end > NOW() THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update Subscription from RevenueCat Webhook
CREATE OR REPLACE FUNCTION update_subscription_from_webhook(
  p_org_id UUID,
  p_status TEXT,
  p_revenuecat_customer_id TEXT,
  p_subscription_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_new_status subscription_status;
BEGIN
  -- Map RevenueCat status to our enum
  v_new_status := CASE p_status
    WHEN 'active' THEN 'active'::subscription_status
    WHEN 'canceled' THEN 'canceled'::subscription_status
    WHEN 'expired' THEN 'expired'::subscription_status
    WHEN 'billing_issue' THEN 'past_due'::subscription_status
    ELSE 'trial'::subscription_status
  END;

  UPDATE organizations
  SET
    subscription_status = v_new_status,
    revenuecat_customer_id = p_revenuecat_customer_id,
    subscription_end_date = p_subscription_end_date,
    updated_at = NOW()
  WHERE id = p_org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- BUDGET SUMMARY FUNCTIONS
-- ============================================================================

-- Get Budget Summary
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get Budget Items by Category
CREATE OR REPLACE FUNCTION get_budget_items_by_category(
  p_budget_id UUID,
  p_item_type item_type
)
RETURNS TABLE (
  category TEXT,
  total_budgeted DECIMAL,
  total_actual DECIMAL,
  variance DECIMAL,
  variance_percentage DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    bi.category,
    SUM(bi.amount) as total_budgeted,
    SUM(bi.actual_amount) as total_actual,
    SUM(bi.amount) - SUM(bi.actual_amount) as variance,
    CASE
      WHEN SUM(bi.amount) > 0
      THEN ((SUM(bi.actual_amount) / SUM(bi.amount)) * 100)
      ELSE 0
    END as variance_percentage
  FROM budget_items bi
  WHERE bi.budget_id = p_budget_id AND bi.item_type = p_item_type
  GROUP BY bi.category
  ORDER BY total_budgeted DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- EVENT CALCULATION FUNCTIONS
-- ============================================================================

-- Calculate Event Break-even Attendance
CREATE OR REPLACE FUNCTION calculate_event_breakeven(
  p_event_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  v_budgeted_amount DECIMAL;
  v_expected_revenue DECIMAL;
  v_ticket_price DECIMAL;
  v_net_cost DECIMAL;
  v_breakeven INTEGER;
BEGIN
  SELECT budgeted_amount, expected_revenue, ticket_price
  INTO v_budgeted_amount, v_expected_revenue, v_ticket_price
  FROM events
  WHERE id = p_event_id;

  -- Net cost is budgeted amount minus expected non-ticket revenue
  v_net_cost := v_budgeted_amount - (v_expected_revenue - (v_ticket_price * COALESCE((SELECT expected_attendance FROM events WHERE id = p_event_id), 0)));

  -- Calculate breakeven
  IF v_ticket_price > 0 THEN
    v_breakeven := CEIL(v_net_cost / v_ticket_price);
  ELSE
    v_breakeven := NULL;
  END IF;

  RETURN v_breakeven;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- EXPENSE TRACKING FUNCTIONS
-- ============================================================================

-- Update Budget Item Actual Amounts from Expenses
CREATE OR REPLACE FUNCTION update_budget_item_actuals()
RETURNS TRIGGER AS $$
DECLARE
  v_budget_item_id UUID;
BEGIN
  -- Only update if expense is paid
  IF NEW.status = 'paid' AND NEW.budget_item_id IS NOT NULL THEN
    v_budget_item_id := NEW.budget_item_id;

    UPDATE budget_items
    SET actual_amount = (
      SELECT COALESCE(SUM(amount), 0)
      FROM expenses
      WHERE budget_item_id = v_budget_item_id AND status = 'paid'
    )
    WHERE id = v_budget_item_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for expense updates
DROP TRIGGER IF EXISTS trigger_update_budget_item_actuals ON expenses;
CREATE TRIGGER trigger_update_budget_item_actuals
AFTER INSERT OR UPDATE ON expenses
FOR EACH ROW
EXECUTE FUNCTION update_budget_item_actuals();

-- Update Event Actual Amounts from Expenses
CREATE OR REPLACE FUNCTION update_event_actuals()
RETURNS TRIGGER AS $$
DECLARE
  v_event_id UUID;
BEGIN
  IF NEW.event_id IS NOT NULL THEN
    v_event_id := NEW.event_id;

    UPDATE events
    SET actual_amount = (
      SELECT COALESCE(SUM(amount), 0)
      FROM expenses
      WHERE event_id = v_event_id AND status = 'paid'
    )
    WHERE id = v_event_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for event expense updates
DROP TRIGGER IF EXISTS trigger_update_event_actuals ON expenses;
CREATE TRIGGER trigger_update_event_actuals
AFTER INSERT OR UPDATE ON expenses
FOR EACH ROW
EXECUTE FUNCTION update_event_actuals();

-- ============================================================================
-- PERMISSION HELPER FUNCTIONS
-- ============================================================================

-- Check if user can modify budget
CREATE OR REPLACE FUNCTION can_modify_budget(
  p_budget_id UUID,
  p_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_org_id UUID;
  v_user_role member_role;
BEGIN
  -- Get organization ID from budget
  SELECT organization_id INTO v_org_id
  FROM budgets
  WHERE id = p_budget_id;

  -- Get user's role in organization
  SELECT role INTO v_user_role
  FROM organization_members
  WHERE organization_id = v_org_id AND user_id = p_user_id;

  -- Check if role allows modification
  RETURN v_user_role IN ('admin', 'treasurer');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user can approve expenses
CREATE OR REPLACE FUNCTION can_approve_expense(
  p_expense_id UUID,
  p_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_org_id UUID;
  v_user_role member_role;
BEGIN
  -- Get organization ID from expense
  SELECT b.organization_id INTO v_org_id
  FROM expenses e
  JOIN budgets b ON e.budget_id = b.id
  WHERE e.id = p_expense_id;

  -- Get user's role in organization
  SELECT role INTO v_user_role
  FROM organization_members
  WHERE organization_id = v_org_id AND user_id = p_user_id;

  -- Check if role allows approval
  RETURN v_user_role IN ('admin', 'treasurer');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- DATA CLEANUP FUNCTIONS
-- ============================================================================

-- Expire old invitations
CREATE OR REPLACE FUNCTION expire_old_invitations()
RETURNS VOID AS $$
BEGIN
  UPDATE invitations
  SET status = 'expired'
  WHERE status = 'pending'
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Archive old budgets (optional)
CREATE OR REPLACE FUNCTION archive_old_budgets()
RETURNS VOID AS $$
BEGIN
  UPDATE budgets
  SET status = 'closed'
  WHERE status = 'active'
    AND fiscal_year < EXTRACT(YEAR FROM CURRENT_DATE) - 2;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Get organization member count
CREATE OR REPLACE FUNCTION get_org_member_count(p_org_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM organization_members
  WHERE organization_id = p_org_id;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get organization budget years
CREATE OR REPLACE FUNCTION get_org_budget_years(p_org_id UUID)
RETURNS INTEGER[] AS $$
DECLARE
  v_years INTEGER[];
BEGIN
  SELECT ARRAY_AGG(DISTINCT fiscal_year ORDER BY fiscal_year DESC) INTO v_years
  FROM budgets
  WHERE organization_id = p_org_id;

  RETURN v_years;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
