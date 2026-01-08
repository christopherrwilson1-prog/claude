# API Documentation

## Overview

The Student Organization Budget App uses Supabase as its backend, which provides:
1. **REST API** - Auto-generated from PostgreSQL schema
2. **Realtime API** - WebSocket subscriptions for live updates
3. **Auth API** - Authentication and user management
4. **Storage API** - File uploads and downloads

## Supabase Client Setup

### TypeScript Client Configuration

```typescript
import { createClient } from '@supabase/supabase-js'
import { Database } from './types/supabase'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
```

## Authentication API

### Sign Up

```typescript
const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) throw error

  // Create user profile
  if (data.user) {
    await supabase.from('users').insert({
      id: data.user.id,
      email: data.user.email!,
      full_name: fullName,
    })
  }

  return data
}
```

### Sign In

```typescript
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}
```

### Sign Out

```typescript
const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
```

### Get Current User

```typescript
const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}
```

### Listen to Auth Changes

```typescript
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // Handle sign in
  } else if (event === 'SIGNED_OUT') {
    // Handle sign out
  }
})
```

## Organizations API

### Create Organization

```typescript
const createOrganization = async (
  name: string,
  university: string,
  orgType: string,
  description?: string
) => {
  const { data: user } = await supabase.auth.getUser()

  // Create organization
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({
      name,
      university,
      org_type: orgType,
      description,
      created_by: user.user!.id,
    })
    .select()
    .single()

  if (orgError) throw orgError

  // Add creator as admin
  const { error: memberError } = await supabase
    .from('organization_members')
    .insert({
      organization_id: org.id,
      user_id: user.user!.id,
      role: 'admin',
    })

  if (memberError) throw memberError

  return org
}
```

### Get User's Organizations

```typescript
const getUserOrganizations = async () => {
  const { data, error } = await supabase
    .from('organizations')
    .select(`
      *,
      organization_members!inner (
        role,
        joined_at
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
```

### Get Organization Details

```typescript
const getOrganization = async (orgId: string) => {
  const { data, error } = await supabase
    .from('organizations')
    .select(`
      *,
      organization_members (
        id,
        role,
        joined_at,
        users (
          id,
          email,
          full_name,
          avatar_url
        )
      )
    `)
    .eq('id', orgId)
    .single()

  if (error) throw error
  return data
}
```

### Update Organization

```typescript
const updateOrganization = async (
  orgId: string,
  updates: Partial<Organization>
) => {
  const { data, error } = await supabase
    .from('organizations')
    .update(updates)
    .eq('id', orgId)
    .select()
    .single()

  if (error) throw error
  return data
}
```

## Budgets API

### Create Budget

```typescript
const createBudget = async (
  organizationId: string,
  fiscalYear: number,
  title: string
) => {
  const { data: user } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('budgets')
    .insert({
      organization_id: organizationId,
      fiscal_year: fiscalYear,
      title,
      status: 'draft',
      created_by: user.user!.id,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
```

### Get Organization Budgets

```typescript
const getOrganizationBudgets = async (organizationId: string) => {
  const { data, error } = await supabase
    .from('budgets')
    .select(`
      *,
      budget_items (
        id,
        item_type,
        category,
        amount
      )
    `)
    .eq('organization_id', organizationId)
    .order('fiscal_year', { ascending: false })

  if (error) throw error
  return data
}
```

### Get Budget Details with Summary

```typescript
const getBudgetWithSummary = async (budgetId: string) => {
  // Get budget
  const { data: budget, error: budgetError } = await supabase
    .from('budgets')
    .select(`
      *,
      budget_items (
        id,
        item_type,
        category,
        description,
        amount,
        fall_amount,
        spring_amount,
        actual_amount,
        notes
      ),
      events (
        id,
        name,
        event_date,
        budgeted_amount,
        actual_amount
      )
    `)
    .eq('id', budgetId)
    .single()

  if (budgetError) throw budgetError

  // Get summary using database function
  const { data: summary, error: summaryError } = await supabase
    .rpc('get_budget_summary', { p_budget_id: budgetId })

  if (summaryError) throw summaryError

  return {
    ...budget,
    summary: summary[0],
  }
}
```

### Update Budget

```typescript
const updateBudget = async (
  budgetId: string,
  updates: Partial<Budget>
) => {
  const { data, error } = await supabase
    .from('budgets')
    .update(updates)
    .eq('id', budgetId)
    .select()
    .single()

  if (error) throw error
  return data
}
```

### Submit Budget for Approval

```typescript
const submitBudget = async (budgetId: string) => {
  const { data, error } = await supabase
    .from('budgets')
    .update({
      status: 'submitted',
      submitted_at: new Date().toISOString(),
    })
    .eq('id', budgetId)
    .select()
    .single()

  if (error) throw error

  // Log activity
  await logActivity(
    data.organization_id,
    'budget_submitted',
    'budget',
    budgetId,
    'Budget submitted for approval'
  )

  return data
}
```

## Budget Items API

### Add Budget Item

```typescript
const addBudgetItem = async (
  budgetId: string,
  item: {
    itemType: 'income' | 'expense'
    category: string
    description: string
    amount: number
    fallAmount?: number
    springAmount?: number
    notes?: string
  }
) => {
  const { data: user } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('budget_items')
    .insert({
      budget_id: budgetId,
      item_type: item.itemType,
      category: item.category,
      description: item.description,
      amount: item.amount,
      fall_amount: item.fallAmount || 0,
      spring_amount: item.springAmount || 0,
      notes: item.notes,
      created_by: user.user!.id,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
```

### Update Budget Item

```typescript
const updateBudgetItem = async (
  itemId: string,
  updates: Partial<BudgetItem>
) => {
  const { data, error } = await supabase
    .from('budget_items')
    .update(updates)
    .eq('id', itemId)
    .select()
    .single()

  if (error) throw error
  return data
}
```

### Delete Budget Item

```typescript
const deleteBudgetItem = async (itemId: string) => {
  const { error } = await supabase
    .from('budget_items')
    .delete()
    .eq('id', itemId)

  if (error) throw error
}
```

### Get Budget Items by Type

```typescript
const getBudgetItems = async (
  budgetId: string,
  itemType?: 'income' | 'expense'
) => {
  let query = supabase
    .from('budget_items')
    .select('*')
    .eq('budget_id', budgetId)

  if (itemType) {
    query = query.eq('item_type', itemType)
  }

  const { data, error } = await query.order('created_at', { ascending: true })

  if (error) throw error
  return data
}
```

## Events API

### Create Event

```typescript
const createEvent = async (event: {
  budgetId: string
  name: string
  description?: string
  eventDate?: string
  location?: string
  expectedAttendance?: number
  ticketPrice?: number
  budgetedAmount: number
}) => {
  const { data: user } = await supabase.auth.getUser()

  const expectedRevenue =
    (event.expectedAttendance || 0) * (event.ticketPrice || 0)

  const { data, error } = await supabase
    .from('events')
    .insert({
      budget_id: event.budgetId,
      name: event.name,
      description: event.description,
      event_date: event.eventDate,
      location: event.location,
      expected_attendance: event.expectedAttendance,
      ticket_price: event.ticketPrice,
      budgeted_amount: event.budgetedAmount,
      expected_revenue: expectedRevenue,
      created_by: user.user!.id,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
```

### Get Organization Events

```typescript
const getOrganizationEvents = async (
  organizationId: string,
  filters?: {
    status?: string
    upcoming?: boolean
  }
) => {
  let query = supabase
    .from('events')
    .select(`
      *,
      budgets!inner (
        organization_id
      )
    `)
    .eq('budgets.organization_id', organizationId)

  if (filters?.status) {
    query = query.eq('event_status', filters.status)
  }

  if (filters?.upcoming) {
    query = query.gte('event_date', new Date().toISOString())
  }

  const { data, error } = await query.order('event_date', { ascending: true })

  if (error) throw error
  return data
}
```

### Update Event

```typescript
const updateEvent = async (
  eventId: string,
  updates: Partial<Event>
) => {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', eventId)
    .select()
    .single()

  if (error) throw error
  return data
}
```

## Expenses API

### Create Expense

```typescript
const createExpense = async (expense: {
  budgetId: string
  eventId?: string
  budgetItemId?: string
  description: string
  amount: number
  expenseDate: string
  category: string
  vendor?: string
  paymentMethod?: string
  receiptUrl?: string
  notes?: string
}) => {
  const { data: user } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('expenses')
    .insert({
      ...expense,
      expense_date: expense.expenseDate,
      payment_method: expense.paymentMethod,
      receipt_url: expense.receiptUrl,
      status: 'pending',
      created_by: user.user!.id,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
```

### Get Organization Expenses

```typescript
const getOrganizationExpenses = async (
  organizationId: string,
  filters?: {
    status?: string
    budgetId?: string
    eventId?: string
    startDate?: string
    endDate?: string
  }
) => {
  let query = supabase
    .from('expenses')
    .select(`
      *,
      budgets!inner (
        organization_id
      ),
      events (
        name
      ),
      budget_items (
        category,
        description
      )
    `)
    .eq('budgets.organization_id', organizationId)

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.budgetId) {
    query = query.eq('budget_id', filters.budgetId)
  }

  if (filters?.eventId) {
    query = query.eq('event_id', filters.eventId)
  }

  if (filters?.startDate) {
    query = query.gte('expense_date', filters.startDate)
  }

  if (filters?.endDate) {
    query = query.lte('expense_date', filters.endDate)
  }

  const { data, error } = await query.order('expense_date', { ascending: false })

  if (error) throw error
  return data
}
```

### Approve/Reject Expense

```typescript
const updateExpenseStatus = async (
  expenseId: string,
  status: 'approved' | 'rejected' | 'paid'
) => {
  const { data: user } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('expenses')
    .update({
      status,
      approved_by: user.user!.id,
      approved_at: new Date().toISOString(),
    })
    .eq('id', expenseId)
    .select()
    .single()

  if (error) throw error
  return data
}
```

## Team Management API

### Invite Member

```typescript
const inviteMember = async (
  organizationId: string,
  email: string,
  role: 'admin' | 'treasurer' | 'officer' | 'member'
) => {
  const { data: user } = await supabase.auth.getUser()

  // Generate unique token
  const token = crypto.randomUUID()

  const { data, error } = await supabase
    .from('invitations')
    .insert({
      organization_id: organizationId,
      email,
      role,
      token,
      invited_by: user.user!.id,
    })
    .select()
    .single()

  if (error) throw error

  // TODO: Send invitation email

  return data
}
```

### Accept Invitation

```typescript
const acceptInvitation = async (token: string) => {
  const { data: user } = await supabase.auth.getUser()

  // Get invitation
  const { data: invitation, error: invError } = await supabase
    .from('invitations')
    .select('*')
    .eq('token', token)
    .eq('status', 'pending')
    .single()

  if (invError) throw invError

  // Check if expired
  if (new Date(invitation.expires_at) < new Date()) {
    throw new Error('Invitation has expired')
  }

  // Add member
  const { error: memberError } = await supabase
    .from('organization_members')
    .insert({
      organization_id: invitation.organization_id,
      user_id: user.user!.id,
      role: invitation.role,
      invited_by: invitation.invited_by,
    })

  if (memberError) throw memberError

  // Update invitation
  await supabase
    .from('invitations')
    .update({
      status: 'accepted',
      accepted_at: new Date().toISOString(),
      accepted_by: user.user!.id,
    })
    .eq('id', invitation.id)

  return invitation.organization_id
}
```

### Update Member Role

```typescript
const updateMemberRole = async (
  memberId: string,
  role: 'admin' | 'treasurer' | 'officer' | 'member'
) => {
  const { data, error } = await supabase
    .from('organization_members')
    .update({ role })
    .eq('id', memberId)
    .select()
    .single()

  if (error) throw error
  return data
}
```

### Remove Member

```typescript
const removeMember = async (memberId: string) => {
  const { error } = await supabase
    .from('organization_members')
    .delete()
    .eq('id', memberId)

  if (error) throw error
}
```

## Activity Log API

### Log Activity

```typescript
const logActivity = async (
  organizationId: string,
  activityType: string,
  entityType: string,
  entityId: string,
  description: string,
  metadata?: any
) => {
  const { data: user } = await supabase.auth.getUser()

  const { error } = await supabase.rpc('log_activity', {
    p_org_id: organizationId,
    p_user_id: user.user!.id,
    p_activity_type: activityType,
    p_entity_type: entityType,
    p_entity_id: entityId,
    p_description: description,
    p_metadata: metadata,
  })

  if (error) throw error
}
```

### Get Activity Log

```typescript
const getActivityLog = async (
  organizationId: string,
  limit: number = 50
) => {
  const { data, error } = await supabase
    .from('activity_log')
    .select(`
      *,
      users (
        full_name,
        avatar_url
      )
    `)
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}
```

## Real-time Subscriptions

### Subscribe to Budget Changes

```typescript
const subscribeToBudgetChanges = (budgetId: string, callback: Function) => {
  const channel = supabase
    .channel(`budget:${budgetId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'budget_items',
        filter: `budget_id=eq.${budgetId}`,
      },
      (payload) => {
        callback(payload)
      }
    )
    .subscribe()

  return channel
}
```

### Subscribe to Organization Activity

```typescript
const subscribeToOrgActivity = (organizationId: string, callback: Function) => {
  const channel = supabase
    .channel(`org:${organizationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'activity_log',
        filter: `organization_id=eq.${organizationId}`,
      },
      (payload) => {
        callback(payload.new)
      }
    )
    .subscribe()

  return channel
}
```

### Subscribe to Expense Updates

```typescript
const subscribeToExpenses = (budgetId: string, callback: Function) => {
  const channel = supabase
    .channel(`expenses:${budgetId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'expenses',
        filter: `budget_id=eq.${budgetId}`,
      },
      (payload) => {
        callback(payload)
      }
    )
    .subscribe()

  return channel
}
```

### Unsubscribe

```typescript
const unsubscribe = (channel: RealtimeChannel) => {
  supabase.removeChannel(channel)
}
```

## Storage API

### Upload Receipt

```typescript
const uploadReceipt = async (
  organizationId: string,
  expenseId: string,
  file: File | Blob
) => {
  const fileExt = file.name?.split('.').pop() || 'jpg'
  const fileName = `${expenseId}-${Date.now()}.${fileExt}`
  const filePath = `${organizationId}/receipts/${fileName}`

  const { data, error } = await supabase.storage
    .from('budgets')
    .upload(filePath, file)

  if (error) throw error

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('budgets')
    .getPublicUrl(filePath)

  return publicUrl
}
```

### Download Report

```typescript
const downloadReport = async (filePath: string) => {
  const { data, error } = await supabase.storage
    .from('budgets')
    .download(filePath)

  if (error) throw error
  return data
}
```

## Error Handling

### Standard Error Response

```typescript
interface ApiError {
  code: string
  message: string
  details?: any
  hint?: string
}

const handleApiError = (error: any): ApiError => {
  console.error('API Error:', error)

  // Supabase specific errors
  if (error.code === 'PGRST116') {
    return {
      code: 'NOT_FOUND',
      message: 'Resource not found',
    }
  }

  if (error.code === '23505') {
    return {
      code: 'DUPLICATE',
      message: 'This record already exists',
    }
  }

  if (error.code === '23503') {
    return {
      code: 'FOREIGN_KEY_VIOLATION',
      message: 'Referenced record does not exist',
    }
  }

  // RLS policy violations
  if (error.code === '42501') {
    return {
      code: 'PERMISSION_DENIED',
      message: 'You do not have permission to perform this action',
    }
  }

  // Network errors
  if (error.message?.includes('fetch')) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Network error. Please check your connection.',
    }
  }

  // Default
  return {
    code: 'UNKNOWN_ERROR',
    message: error.message || 'An unexpected error occurred',
    details: error,
  }
}
```

## React Query Integration

### Example: Budget Queries

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Fetch budget
export const useBudget = (budgetId: string) => {
  return useQuery({
    queryKey: ['budget', budgetId],
    queryFn: () => getBudgetWithSummary(budgetId),
    enabled: !!budgetId,
  })
}

// Create budget item
export const useCreateBudgetItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addBudgetItem,
    onSuccess: (data, variables) => {
      // Invalidate budget query to refetch
      queryClient.invalidateQueries({ queryKey: ['budget', variables.budgetId] })
    },
  })
}

// Update budget item
export const useUpdateBudgetItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, updates }: { itemId: string; updates: any }) =>
      updateBudgetItem(itemId, updates),
    onMutate: async ({ itemId, updates }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['budget'] })

      const previousData = queryClient.getQueryData(['budget'])

      queryClient.setQueryData(['budget'], (old: any) => {
        // Update budget item optimistically
        return {
          ...old,
          budget_items: old.budget_items.map((item: any) =>
            item.id === itemId ? { ...item, ...updates } : item
          ),
        }
      })

      return { previousData }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(['budget'], context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['budget'] })
    },
  })
}
```

## Rate Limiting

Supabase enforces rate limits:
- **Free tier:** 500 requests per second
- **Pro tier:** 1000 requests per second

Implement client-side throttling for real-time updates:

```typescript
import { debounce } from 'lodash'

const debouncedUpdate = debounce(
  (itemId: string, updates: any) => {
    updateBudgetItem(itemId, updates)
  },
  500
)
```

---

**Last Updated:** January 8, 2026
**API Version:** 1.0
**Status:** Specification Phase
