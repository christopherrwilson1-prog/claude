-- Student Organization Budget App - Seed Data
-- Sample data for development and testing
-- Version: 1.0
-- Last Updated: 2026-01-08

-- WARNING: This file contains sample data for development/testing only
-- DO NOT run this in production!

-- ============================================================================
-- SAMPLE USERS
-- ============================================================================
-- Note: Users are created via Supabase Auth
-- This section shows the corresponding user profile data
-- In actual development, you'll create users through the app signup

-- Example user IDs (these would be real UUIDs from auth.users in practice)
-- User 1: sarah@university.edu (Admin/Treasurer)
-- User 2: john@university.edu (Officer)
-- User 3: maria@university.edu (Member)

-- ============================================================================
-- SAMPLE ORGANIZATION
-- ============================================================================

-- Insert sample organization
INSERT INTO organizations (
  id,
  name,
  org_type,
  university,
  description,
  subscription_status,
  trial_end_date
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Computer Science Club',
  'academic',
  'Example University',
  'Student organization for computer science majors and enthusiasts',
  'trial',
  NOW() + INTERVAL '7 days'
);

-- ============================================================================
-- SAMPLE ORGANIZATION MEMBERS
-- ============================================================================
-- Note: Replace the user_id values with actual auth.users IDs in development

-- Example organization members (commented out - needs real user IDs)
/*
INSERT INTO organization_members (organization_id, user_id, role) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '<sarah-user-id>', 'treasurer'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '<john-user-id>', 'officer'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '<maria-user-id>', 'member');
*/

-- ============================================================================
-- SAMPLE BUDGET
-- ============================================================================

INSERT INTO budgets (
  id,
  organization_id,
  fiscal_year,
  title,
  status,
  contingency_percentage
) VALUES (
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  2024,
  '2024-2025 Annual Budget',
  'active',
  10.00
);

-- ============================================================================
-- SAMPLE BUDGET ITEMS - INCOME
-- ============================================================================

INSERT INTO budget_items (budget_id, item_type, category, description, amount, fall_amount, spring_amount) VALUES
  -- Income
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'income', 'student_government_allocation', 'Annual Student Government Allocation', 15000.00, 7500.00, 7500.00),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'income', 'fundraising', 'Fall Hackathon Sponsorships', 3000.00, 3000.00, 0.00),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'income', 'fundraising', 'Spring Career Fair Fundraiser', 2500.00, 0.00, 2500.00),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'income', 'membership_dues', 'Semester Membership Dues', 1500.00, 750.00, 750.00),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'income', 'event_ticket_sales', 'Tech Talk Series Ticket Sales', 800.00, 400.00, 400.00),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'income', 'sponsorships', 'Corporate Partnership - TechCorp', 5000.00, 2500.00, 2500.00);

-- ============================================================================
-- SAMPLE BUDGET ITEMS - EXPENSES
-- ============================================================================

INSERT INTO budget_items (budget_id, item_type, category, description, amount, fall_amount, spring_amount) VALUES
  -- Expenses
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'expense', 'events_programming', 'Fall Hackathon', 4500.00, 4500.00, 0.00),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'expense', 'events_programming', 'Spring Career Fair', 3500.00, 0.00, 3500.00),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'expense', 'events_programming', 'Weekly Tech Talks', 2000.00, 1000.00, 1000.00),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'expense', 'food_catering', 'Meeting Refreshments', 3000.00, 1500.00, 1500.00),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'expense', 'food_catering', 'Event Catering', 4000.00, 2000.00, 2000.00),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'expense', 'marketing_printing', 'Promotional Materials', 1200.00, 600.00, 600.00),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'expense', 'marketing_printing', 'T-shirts and Merch', 1500.00, 750.00, 750.00),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'expense', 'travel_transportation', 'Conference Travel', 2500.00, 1250.00, 1250.00),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'expense', 'supplies_materials', 'General Supplies', 800.00, 400.00, 400.00),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'expense', 'speaker_performer_fees', 'Guest Speaker Fees', 3000.00, 1500.00, 1500.00),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'expense', 'equipment_technology', 'Software Licenses', 1000.00, 500.00, 500.00),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'expense', 'equipment_technology', 'Hardware for Projects', 1500.00, 750.00, 750.00),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'expense', 'administrative', 'Administrative Fees', 500.00, 250.00, 250.00);

-- Note: Budget totals will be automatically calculated by the trigger

-- ============================================================================
-- SAMPLE EVENTS
-- ============================================================================

INSERT INTO events (
  id,
  budget_id,
  name,
  description,
  event_date,
  event_status,
  budgeted_amount,
  expected_attendance,
  ticket_price,
  expected_revenue,
  location
) VALUES
  (
    'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'Fall Hackathon 2024',
    '24-hour coding competition with prizes and workshops',
    '2024-10-15',
    'completed',
    4500.00,
    120,
    0.00,
    3000.00,
    'Engineering Building'
  ),
  (
    'e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'Spring Career Fair',
    'Career fair with tech companies and recruiters',
    '2025-03-20',
    'upcoming',
    3500.00,
    200,
    10.00,
    2500.00,
    'Student Union Ballroom'
  ),
  (
    'e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'AI Workshop Series',
    'Monthly workshops on artificial intelligence and machine learning',
    '2025-02-15',
    'upcoming',
    1000.00,
    50,
    5.00,
    250.00,
    'CS Building Room 101'
  );

-- ============================================================================
-- SAMPLE EXPENSES
-- ============================================================================

INSERT INTO expenses (
  budget_id,
  event_id,
  description,
  amount,
  expense_date,
  category,
  status,
  vendor,
  payment_method
) VALUES
  (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'Pizza and drinks for hackathon',
    850.00,
    '2024-10-15',
    'food_catering',
    'paid',
    'Campus Pizza',
    'Card'
  ),
  (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'Hackathon prizes',
    1500.00,
    '2024-10-15',
    'events_programming',
    'paid',
    'Amazon',
    'Card'
  ),
  (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'Event t-shirts',
    450.00,
    '2024-10-10',
    'marketing_printing',
    'paid',
    'CustomInk',
    'Card'
  ),
  (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    NULL,
    'General meeting snacks - September',
    125.00,
    '2024-09-15',
    'food_catering',
    'paid',
    'Costco',
    'Cash'
  ),
  (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    NULL,
    'GitHub Team subscription',
    90.00,
    '2024-09-01',
    'equipment_technology',
    'paid',
    'GitHub',
    'Card'
  ),
  (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'Career fair booth materials',
    350.00,
    '2025-03-01',
    'marketing_printing',
    'pending',
    'Office Depot',
    'Card'
  ),
  (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'Catering deposit for career fair',
    500.00,
    '2025-02-15',
    'food_catering',
    'approved',
    'University Catering',
    'Check'
  );

-- ============================================================================
-- SAMPLE INVITATIONS
-- ============================================================================

INSERT INTO invitations (
  organization_id,
  email,
  role,
  token,
  status
) VALUES
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'newmember@university.edu',
    'member',
    'invite-token-123abc',
    'pending'
  );

-- ============================================================================
-- SAMPLE ACTIVITY LOG
-- ============================================================================

INSERT INTO activity_log (
  organization_id,
  activity_type,
  entity_type,
  entity_id,
  description
) VALUES
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'budget_created',
    'budget',
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'Created 2024-2025 Annual Budget'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'event_created',
    'event',
    'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'Created event: Fall Hackathon 2024'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'expense_created',
    'expense',
    NULL,
    'Added expense: Pizza and drinks for hackathon ($850.00)'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'expense_approved',
    'expense',
    NULL,
    'Approved expense: Catering deposit for career fair ($500.00)'
  );

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- These queries can be run to verify the seed data was inserted correctly:

-- Check organization
-- SELECT * FROM organizations WHERE name = 'Computer Science Club';

-- Check budget with totals
-- SELECT * FROM budgets WHERE title = '2024-2025 Annual Budget';

-- Check budget summary
-- SELECT * FROM get_budget_summary('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22');

-- Check income items
-- SELECT category, description, amount FROM budget_items
-- WHERE budget_id = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22' AND item_type = 'income';

-- Check expense items
-- SELECT category, description, amount FROM budget_items
-- WHERE budget_id = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22' AND item_type = 'expense';

-- Check events
-- SELECT name, event_date, budgeted_amount, expected_attendance FROM events;

-- Check expenses
-- SELECT description, amount, expense_date, status FROM expenses ORDER BY expense_date DESC;

-- Check budget health
-- SELECT
--   total_income,
--   total_expenses,
--   net_position,
--   percent_spent
-- FROM budget_overview
-- WHERE id = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';
