# User Roles & Permissions Matrix

## Role Definitions

### Admin
**Full organizational control**
- Typically: President, Vice President
- Complete access to all features
- Can manage team members and roles
- Can delete organization
- Can manage subscriptions

### Treasurer
**Financial management authority**
- Typically: Treasurer, Finance Director
- Full budget and financial permissions
- Cannot manage organization settings or delete org
- Cannot change admin roles

### Officer
**Operational permissions**
- Typically: Secretary, Event Coordinators, Committee Chairs
- Can create events and expenses
- Cannot modify budgets
- Cannot manage team

### Member
**View-only access**
- Typically: General members
- Read-only access to budgets and events
- Cannot create or modify anything
- Good for transparency

## Permissions Matrix

| Feature                          | Admin | Treasurer | Officer | Member |
|----------------------------------|:-----:|:---------:|:-------:|:------:|
| **Organization Management**      |       |           |         |        |
| View organization details        | ✅    | ✅        | ✅      | ✅     |
| Edit organization details        | ✅    | ❌        | ❌      | ❌     |
| Delete organization              | ✅    | ❌        | ❌      | ❌     |
| Manage subscription              | ✅    | ✅        | ❌      | ❌     |
| View subscription status         | ✅    | ✅        | ✅      | ✅     |
| **Team Management**              |       |           |         |        |
| View team members                | ✅    | ✅        | ✅      | ✅     |
| Invite new members               | ✅    | ✅        | ❌      | ❌     |
| Remove members                   | ✅    | ✅        | ❌      | ❌     |
| Change member roles              | ✅    | ✅*       | ❌      | ❌     |
| View pending invitations         | ✅    | ✅        | ❌      | ❌     |
| **Budget Management**            |       |           |         |        |
| View budgets                     | ✅    | ✅        | ✅      | ✅     |
| Create budget                    | ✅    | ✅        | ❌      | ❌     |
| Edit budget                      | ✅    | ✅        | ❌      | ❌     |
| Delete budget                    | ✅    | ✅        | ❌      | ❌     |
| Submit budget for approval       | ✅    | ✅        | ❌      | ❌     |
| Approve budget                   | ✅    | ✅        | ❌      | ❌     |
| Add budget items                 | ✅    | ✅        | ❌      | ❌     |
| Edit budget items                | ✅    | ✅        | ❌      | ❌     |
| Delete budget items              | ✅    | ✅        | ❌      | ❌     |
| View budget analytics            | ✅    | ✅        | ✅      | ✅     |
| **Event Management**             |       |           |         |        |
| View events                      | ✅    | ✅        | ✅      | ✅     |
| Create event                     | ✅    | ✅        | ✅      | ❌     |
| Edit event                       | ✅    | ✅        | ✅**    | ❌     |
| Delete event                     | ✅    | ✅        | ✅**    | ❌     |
| Cancel event                     | ✅    | ✅        | ✅**    | ❌     |
| View event budget breakdown      | ✅    | ✅        | ✅      | ✅     |
| **Expense Tracking**             |       |           |         |        |
| View all expenses                | ✅    | ✅        | ✅      | ✅     |
| Create expense                   | ✅    | ✅        | ✅      | ❌     |
| Edit own expense                 | ✅    | ✅        | ✅      | ❌     |
| Edit any expense                 | ✅    | ✅        | ❌      | ❌     |
| Delete own expense (if pending)  | ✅    | ✅        | ✅      | ❌     |
| Delete any expense               | ✅    | ✅        | ❌      | ❌     |
| Approve/reject expenses          | ✅    | ✅        | ❌      | ❌     |
| Upload receipts                  | ✅    | ✅        | ✅      | ❌     |
| View receipts                    | ✅    | ✅        | ✅      | ✅     |
| **Reports**                      |       |           |         |        |
| View all reports                 | ✅    | ✅        | ✅      | ✅     |
| Generate allocation request      | ✅    | ✅        | ❌      | ❌     |
| Generate year-end report         | ✅    | ✅        | ❌      | ❌     |
| Generate event summary           | ✅    | ✅        | ✅      | ❌     |
| Generate monthly statement       | ✅    | ✅        | ❌      | ❌     |
| Generate expense report          | ✅    | ✅        | ✅      | ❌     |
| Export to PDF                    | ✅    | ✅        | ✅      | ❌     |
| Export to Excel                  | ✅    | ✅        | ✅      | ❌     |
| **Activity & Notifications**     |       |           |         |        |
| View activity log                | ✅    | ✅        | ✅      | ✅     |
| Receive notifications            | ✅    | ✅        | ✅      | ✅     |
| Configure notification prefs     | ✅    | ✅        | ✅      | ✅     |
| **Dashboard**                    |       |           |         |        |
| View dashboard                   | ✅    | ✅        | ✅      | ✅     |
| View budget health metrics       | ✅    | ✅        | ✅      | ✅     |
| View charts and analytics        | ✅    | ✅        | ✅      | ✅     |

**Notes:**
- \* Treasurer can change roles but cannot promote to Admin or demote Admins
- \** Officer can only edit/delete events they created

## Role-Based UI Variations

### Dashboard View

**Admin/Treasurer:**
```
- Full budget health card with edit access
- All quick actions visible
- "Manage Team" section
- Pending approvals badge
- Subscription status
```

**Officer:**
```
- Budget health card (view only)
- Limited quick actions: Add Expense, Create Event
- No team management
- No pending approvals
```

**Member:**
```
- Budget health card (view only)
- No quick actions
- Read-only activity feed
- "Suggest an Expense" (creates draft for approval)
```

### Budget Screen

**Admin/Treasurer:**
```
- [+ Add Income] [+ Add Expense] buttons
- [Edit] [Delete] icons on all items
- [Submit for Approval] button
- Full edit mode
```

**Officer/Member:**
```
- View-only mode
- No action buttons
- Can export/share
- "Request Budget Change" button (sends message to treasurer)
```

### Expense Screen

**Admin/Treasurer:**
```
- All expenses visible
- [Approve] [Reject] buttons on pending
- Can edit any expense
- Bulk actions available
```

**Officer:**
```
- Can create new expenses
- Can edit own pending expenses
- Can delete own pending expenses
- Cannot approve/reject
```

**Member:**
```
- View-only
- Can suggest expenses (creates draft)
```

## Permission Checks in Code

### React Component Example

```typescript
import { useUserRole } from '@/hooks/useUserRole'

const BudgetItemCard = ({ item }) => {
  const { canEdit, canDelete } = useUserRole()

  return (
    <Card>
      <Text>{item.description}</Text>
      {canEdit('budget_items') && (
        <Button onPress={handleEdit}>Edit</Button>
      )}
      {canDelete('budget_items') && (
        <Button onPress={handleDelete}>Delete</Button>
      )}
    </Card>
  )
}
```

### Custom Hook: useUserRole

```typescript
import { useOrgStore } from '@/stores/orgStore'

export const useUserRole = () => {
  const { currentMember } = useOrgStore()

  const permissions = {
    admin: {
      budgets: { view: true, create: true, edit: true, delete: true },
      expenses: { view: true, create: true, edit: true, delete: true, approve: true },
      events: { view: true, create: true, edit: true, delete: true },
      team: { view: true, invite: true, remove: true, changeRole: true },
      org: { view: true, edit: true, delete: true },
      reports: { view: true, generate: true, export: true },
    },
    treasurer: {
      budgets: { view: true, create: true, edit: true, delete: true },
      expenses: { view: true, create: true, edit: true, delete: true, approve: true },
      events: { view: true, create: true, edit: true, delete: true },
      team: { view: true, invite: true, remove: true, changeRole: 'limited' },
      org: { view: true, edit: false, delete: false },
      reports: { view: true, generate: true, export: true },
    },
    officer: {
      budgets: { view: true, create: false, edit: false, delete: false },
      expenses: { view: true, create: true, edit: 'own', delete: 'own', approve: false },
      events: { view: true, create: true, edit: 'own', delete: 'own' },
      team: { view: true, invite: false, remove: false, changeRole: false },
      org: { view: true, edit: false, delete: false },
      reports: { view: true, generate: 'limited', export: true },
    },
    member: {
      budgets: { view: true, create: false, edit: false, delete: false },
      expenses: { view: true, create: false, edit: false, delete: false, approve: false },
      events: { view: true, create: false, edit: false, delete: false },
      team: { view: true, invite: false, remove: false, changeRole: false },
      org: { view: true, edit: false, delete: false },
      reports: { view: true, generate: false, export: false },
    },
  }

  const userPermissions = permissions[currentMember?.role || 'member']

  const can = (resource: string, action: string, entity?: any) => {
    const resourcePerms = userPermissions[resource]
    if (!resourcePerms) return false

    const actionPerm = resourcePerms[action]

    // Handle special cases
    if (actionPerm === 'own' && entity) {
      return entity.created_by === currentMember?.user_id
    }

    if (actionPerm === 'limited') {
      // Handle limited permissions (e.g., treasurer can't demote admins)
      return true // Add specific logic as needed
    }

    return actionPerm === true
  }

  return {
    role: currentMember?.role,
    isAdmin: currentMember?.role === 'admin',
    isTreasurer: currentMember?.role === 'treasurer',
    isOfficer: currentMember?.role === 'officer',
    isMember: currentMember?.role === 'member',
    can,
    canView: (resource: string) => can(resource, 'view'),
    canCreate: (resource: string) => can(resource, 'create'),
    canEdit: (resource: string, entity?: any) => can(resource, 'edit', entity),
    canDelete: (resource: string, entity?: any) => can(resource, 'delete', entity),
  }
}
```

## RLS Policy Implementation

### Budget Items (Edit/Delete)

```sql
CREATE POLICY "Treasurers can edit budget items"
ON budget_items FOR UPDATE
USING (
  budget_id IN (
    SELECT b.id FROM budgets b
    WHERE b.organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'treasurer')
    )
  )
);
```

### Expenses (Officers can edit own)

```sql
CREATE POLICY "Officers can edit own expenses"
ON expenses FOR UPDATE
USING (
  created_by = auth.uid()
  AND status = 'pending'
  AND budget_id IN (
    SELECT b.id FROM budgets b
    WHERE b.organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'treasurer', 'officer')
    )
  )
);

CREATE POLICY "Treasurers can edit any expense"
ON expenses FOR UPDATE
USING (
  budget_id IN (
    SELECT b.id FROM budgets b
    WHERE b.organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'treasurer')
    )
  )
);
```

### Team Management (Treasurer limitations)

```sql
-- Function to check if role change is allowed
CREATE OR REPLACE FUNCTION can_change_role(
  p_org_id UUID,
  p_target_member_id UUID,
  p_new_role member_role
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_user_role member_role;
  v_target_current_role member_role;
BEGIN
  -- Get current user's role
  SELECT role INTO v_current_user_role
  FROM organization_members
  WHERE organization_id = p_org_id
    AND user_id = auth.uid();

  -- Get target member's current role
  SELECT role INTO v_target_current_role
  FROM organization_members
  WHERE id = p_target_member_id;

  -- Admins can change anyone's role
  IF v_current_user_role = 'admin' THEN
    RETURN TRUE;
  END IF;

  -- Treasurers can't promote to admin or demote admins
  IF v_current_user_role = 'treasurer' THEN
    IF p_new_role = 'admin' OR v_target_current_role = 'admin' THEN
      RETURN FALSE;
    END IF;
    RETURN TRUE;
  END IF;

  -- Others can't change roles
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Notification Preferences by Role

### Admin/Treasurer
- Budget submitted for approval ✅
- New expense pending approval ✅
- Member joined organization ✅
- Budget milestones (50%, 75%, 100% spent) ✅
- Subscription expiring ✅
- Monthly financial summary ✅

### Officer
- Expense approved/rejected ✅
- Event date approaching ✅
- Budget updates (optional) ☑️

### Member
- Major organization updates (optional) ☑️
- Event announcements ✅

## Future Enhancements

### Custom Roles (v2)
Allow organizations to create custom roles with granular permissions:
```
Custom Role: "Event Chair"
- Can create/edit/delete events
- Can approve expenses for their events only
- Cannot access global budget
```

### Temporary Permissions
Grant temporary elevated permissions:
```
"Grant [User] budget edit access until [Date]"
Useful for specific projects or transitions
```

### Approval Workflows
Multi-level approval for large expenses:
```
Expense > $500:
  Step 1: Officer approval
  Step 2: Treasurer approval
  Step 3: Admin approval (if > $2000)
```

---

**Last Updated:** January 8, 2026
**Version:** 1.0
**Status:** Specification Phase
