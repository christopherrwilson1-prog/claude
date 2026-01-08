-- Student Organization Budget App - Row Level Security Policies
-- Supabase RLS Policies
-- Version: 1.0
-- Last Updated: 2026-01-08

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- ORGANIZATIONS TABLE POLICIES
-- ============================================================================

CREATE POLICY "Users can view orgs they belong to"
  ON organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create organizations"
  ON organizations FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can update their org"
  ON organizations FOR UPDATE
  USING (
    id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer')
    )
  );

CREATE POLICY "Admins can delete their org"
  ON organizations FOR DELETE
  USING (
    id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- ORGANIZATION MEMBERS TABLE POLICIES
-- ============================================================================

CREATE POLICY "Users can view members of their orgs"
  ON organization_members FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can add members"
  ON organization_members FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer')
    )
  );

CREATE POLICY "Admins can remove members"
  ON organization_members FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer')
    )
  );

CREATE POLICY "Admins can update member roles"
  ON organization_members FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer')
    )
  );

-- ============================================================================
-- BUDGETS TABLE POLICIES
-- ============================================================================

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

CREATE POLICY "Treasurers can delete budgets"
  ON budgets FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer')
    )
  );

-- ============================================================================
-- BUDGET ITEMS TABLE POLICIES
-- ============================================================================

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

CREATE POLICY "Treasurers can create budget items"
  ON budget_items FOR INSERT
  WITH CHECK (
    budget_id IN (
      SELECT b.id FROM budgets b
      WHERE b.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer')
      )
    )
  );

CREATE POLICY "Treasurers can update budget items"
  ON budget_items FOR UPDATE
  USING (
    budget_id IN (
      SELECT b.id FROM budgets b
      WHERE b.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer')
      )
    )
  );

CREATE POLICY "Treasurers can delete budget items"
  ON budget_items FOR DELETE
  USING (
    budget_id IN (
      SELECT b.id FROM budgets b
      WHERE b.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer')
      )
    )
  );

-- ============================================================================
-- EVENTS TABLE POLICIES
-- ============================================================================

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

CREATE POLICY "Officers can create events"
  ON events FOR INSERT
  WITH CHECK (
    budget_id IN (
      SELECT b.id FROM budgets b
      WHERE b.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer', 'officer')
      )
    )
  );

CREATE POLICY "Officers can update own events"
  ON events FOR UPDATE
  USING (
    created_by = auth.uid()
    AND budget_id IN (
      SELECT b.id FROM budgets b
      WHERE b.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer', 'officer')
      )
    )
  );

CREATE POLICY "Treasurers can update any event"
  ON events FOR UPDATE
  USING (
    budget_id IN (
      SELECT b.id FROM budgets b
      WHERE b.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer')
      )
    )
  );

CREATE POLICY "Officers can delete own events"
  ON events FOR DELETE
  USING (
    created_by = auth.uid()
    AND budget_id IN (
      SELECT b.id FROM budgets b
      WHERE b.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer', 'officer')
      )
    )
  );

CREATE POLICY "Treasurers can delete any event"
  ON events FOR DELETE
  USING (
    budget_id IN (
      SELECT b.id FROM budgets b
      WHERE b.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer')
      )
    )
  );

-- ============================================================================
-- EXPENSES TABLE POLICIES
-- ============================================================================

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

CREATE POLICY "Officers can update own pending expenses"
  ON expenses FOR UPDATE
  USING (
    created_by = auth.uid()
    AND status = 'pending'
    AND budget_id IN (
      SELECT b.id FROM budgets b
      WHERE b.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer', 'officer')
      )
    )
  );

CREATE POLICY "Treasurers can update any expense"
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

CREATE POLICY "Officers can delete own pending expenses"
  ON expenses FOR DELETE
  USING (
    created_by = auth.uid()
    AND status = 'pending'
    AND budget_id IN (
      SELECT b.id FROM budgets b
      WHERE b.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer', 'officer')
      )
    )
  );

CREATE POLICY "Treasurers can delete any expense"
  ON expenses FOR DELETE
  USING (
    budget_id IN (
      SELECT b.id FROM budgets b
      WHERE b.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer')
      )
    )
  );

-- ============================================================================
-- INVITATIONS TABLE POLICIES
-- ============================================================================

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

CREATE POLICY "Admins can update invitations"
  ON invitations FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer')
    )
  );

CREATE POLICY "Admins can delete invitations"
  ON invitations FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer')
    )
  );

-- ============================================================================
-- ACTIVITY LOG TABLE POLICIES
-- ============================================================================

CREATE POLICY "Users can view their org's activity"
  ON activity_log FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert activity logs"
  ON activity_log FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- STORAGE POLICIES (for Supabase Storage)
-- ============================================================================

-- Note: These are created in the Supabase Storage UI or via SQL:

-- Bucket: budgets
-- Policies:
--   1. Users can upload to their org folder
--   2. Users can view their org's files
--   3. Users can delete their org's files (admins only)

-- Example storage policy SQL (run in Supabase SQL editor after creating bucket):
/*

-- Allow users to upload receipts to their org folder
CREATE POLICY "Users can upload receipts"
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

-- Allow admins to delete their org's files
CREATE POLICY "Admins can delete org files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'budgets'
  AND (storage.foldername(name))[1] IN (
    SELECT organization_id::text FROM organization_members
    WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer')
  )
);

*/
