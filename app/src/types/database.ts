// Database Types - Generated from Supabase Schema
// Last Updated: 2026-01-08

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type OrgType =
  | 'academic'
  | 'cultural'
  | 'social'
  | 'service'
  | 'professional'
  | 'athletic'
  | 'greek'
  | 'special_interest'
  | 'other'

export type SubscriptionStatus =
  | 'trial'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'expired'

export type MemberRole =
  | 'admin'
  | 'treasurer'
  | 'officer'
  | 'member'

export type BudgetStatus =
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'active'
  | 'closed'

export type ItemType = 'income' | 'expense'

export type EventStatus =
  | 'planning'
  | 'approved'
  | 'upcoming'
  | 'completed'
  | 'canceled'

export type ExpenseStatus =
  | 'pending'
  | 'approved'
  | 'paid'
  | 'rejected'

export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  name: string
  org_type: OrgType
  university: string
  description: string | null
  logo_url: string | null
  subscription_status: SubscriptionStatus
  subscription_start_date: string
  subscription_end_date: string | null
  trial_end_date: string
  revenuecat_customer_id: string | null
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface OrganizationMember {
  id: string
  organization_id: string
  user_id: string
  role: MemberRole
  joined_at: string
  invited_by: string | null
}

export interface Budget {
  id: string
  organization_id: string
  fiscal_year: number
  title: string
  status: BudgetStatus
  total_income: number
  total_expenses: number
  contingency_amount: number
  contingency_percentage: number
  created_at: string
  updated_at: string
  created_by: string | null
  submitted_at: string | null
  approved_at: string | null
  approved_by: string | null
}

export interface BudgetItem {
  id: string
  budget_id: string
  item_type: ItemType
  category: string
  description: string
  amount: number
  fall_amount: number
  spring_amount: number
  actual_amount: number
  notes: string | null
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface Event {
  id: string
  budget_id: string
  name: string
  description: string | null
  event_date: string | null
  event_status: EventStatus
  budgeted_amount: number
  expected_attendance: number | null
  ticket_price: number
  expected_revenue: number
  actual_amount: number
  actual_attendance: number | null
  actual_revenue: number
  location: string | null
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface Expense {
  id: string
  budget_id: string
  event_id: string | null
  budget_item_id: string | null
  description: string
  amount: number
  expense_date: string
  category: string
  status: ExpenseStatus
  approved_by: string | null
  approved_at: string | null
  receipt_url: string | null
  vendor: string | null
  payment_method: string | null
  notes: string | null
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface ActivityLog {
  id: string
  organization_id: string
  user_id: string | null
  activity_type: string
  entity_type: string
  entity_id: string | null
  description: string
  metadata: Json | null
  created_at: string
}

export interface BudgetSummary {
  total_income: number
  total_expenses: number
  net_position: number
  contingency: number
  actual_spent: number
  remaining_budget: number
  percent_spent: number
}

// Extended types with relations
export interface BudgetWithItems extends Budget {
  budget_items: BudgetItem[]
}

export interface ExpenseWithDetails extends Expense {
  event?: Pick<Event, 'name'>
  budget_item?: Pick<BudgetItem, 'category' | 'description'>
}

export interface OrganizationWithMembers extends Organization {
  organization_members: (OrganizationMember & {
    users: Pick<User, 'id' | 'email' | 'full_name' | 'avatar_url'>
  })[]
}

// Database interface for Supabase client
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
      }
      organizations: {
        Row: Organization
        Insert: Omit<Organization, 'id' | 'created_at' | 'updated_at' | 'subscription_start_date' | 'trial_end_date'>
        Update: Partial<Omit<Organization, 'id' | 'created_at' | 'updated_at'>>
      }
      organization_members: {
        Row: OrganizationMember
        Insert: Omit<OrganizationMember, 'id' | 'joined_at'>
        Update: Partial<Omit<OrganizationMember, 'id' | 'joined_at'>>
      }
      budgets: {
        Row: Budget
        Insert: Omit<Budget, 'id' | 'created_at' | 'updated_at' | 'total_income' | 'total_expenses' | 'contingency_amount'>
        Update: Partial<Omit<Budget, 'id' | 'created_at' | 'updated_at'>>
      }
      budget_items: {
        Row: BudgetItem
        Insert: Omit<BudgetItem, 'id' | 'created_at' | 'updated_at' | 'fall_amount' | 'spring_amount' | 'actual_amount'>
        Update: Partial<Omit<BudgetItem, 'id' | 'created_at' | 'updated_at'>>
      }
      events: {
        Row: Event
        Insert: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'actual_amount' | 'actual_revenue'>
        Update: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>
      }
      expenses: {
        Row: Expense
        Insert: Omit<Expense, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Expense, 'id' | 'created_at' | 'updated_at'>>
      }
      activity_log: {
        Row: ActivityLog
        Insert: Omit<ActivityLog, 'id' | 'created_at'>
        Update: never
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_budget_summary: {
        Args: { p_budget_id: string }
        Returns: BudgetSummary[]
      }
      check_subscription_active: {
        Args: { p_org_id: string }
        Returns: boolean
      }
    }
    Enums: {
      org_type: OrgType
      subscription_status: SubscriptionStatus
      member_role: MemberRole
      budget_status: BudgetStatus
      item_type: ItemType
      event_status: EventStatus
      expense_status: ExpenseStatus
    }
  }
}
