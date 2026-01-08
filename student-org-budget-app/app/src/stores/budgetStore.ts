// Budget Store - Zustand

import { create } from 'zustand'
import { supabase } from '../services/supabase/client'
import type { Budget, BudgetItem, BudgetStatus, Semester } from '../types/database'

interface BudgetState {
  // State
  budgets: Budget[]
  currentBudget: Budget | null
  budgetItems: BudgetItem[]
  isLoading: boolean
  error: string | null

  // Actions - Budgets
  loadBudgets: (organizationId: string) => Promise<void>
  createBudget: (data: {
    organizationId: string
    name: string
    academicYear: string
    semester: Semester
    description?: string
  }) => Promise<Budget>
  updateBudget: (budgetId: string, updates: Partial<Budget>) => Promise<void>
  deleteBudget: (budgetId: string) => Promise<void>
  setCurrentBudget: (budget: Budget | null) => void
  loadBudgetById: (budgetId: string) => Promise<void>

  // Actions - Budget Items
  loadBudgetItems: (budgetId: string) => Promise<void>
  createBudgetItem: (data: {
    budgetId: string
    category: string
    description: string
    amount: number
    type: 'income' | 'expense'
    notes?: string
  }) => Promise<BudgetItem>
  updateBudgetItem: (itemId: string, updates: Partial<BudgetItem>) => Promise<void>
  deleteBudgetItem: (itemId: string) => Promise<void>

  // Utilities
  clearBudgets: () => void
  getBudgetSummary: (budgetId: string) => {
    totalIncome: number
    totalExpenses: number
    netPosition: number
    itemCount: number
  }
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  // Initial state
  budgets: [],
  currentBudget: null,
  budgetItems: [],
  isLoading: false,
  error: null,

  // Load all budgets for an organization
  loadBudgets: async (organizationId: string) => {
    try {
      set({ isLoading: true, error: null })

      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })

      if (error) throw error

      set({ budgets: data || [], isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      console.error('Load budgets error:', error)
      throw error
    }
  },

  // Create new budget
  createBudget: async (data) => {
    try {
      set({ isLoading: true, error: null })

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // We need to get the organization ID from somewhere
      // This will be fixed by passing it from the component
      if (!data.organizationId) {
        throw new Error('No organization selected')
      }

      const { data: budget, error } = await supabase
        .from('budgets')
        .insert({
          organization_id: data.organizationId,
          name: data.name,
          academic_year: data.academicYear,
          semester: data.semester,
          description: data.description,
          status: 'draft' as BudgetStatus,
          created_by: user.id,
        })
        .select()
        .single()

      if (error) throw error

      // Add to budgets list
      set((state) => ({
        budgets: [budget, ...state.budgets],
        currentBudget: budget,
        isLoading: false,
      }))

      return budget
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      console.error('Create budget error:', error)
      throw error
    }
  },

  // Update budget
  updateBudget: async (budgetId: string, updates: Partial<Budget>) => {
    try {
      set({ isLoading: true, error: null })

      const { data, error } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', budgetId)
        .select()
        .single()

      if (error) throw error

      // Update in state
      set((state) => ({
        budgets: state.budgets.map((b) => (b.id === budgetId ? data : b)),
        currentBudget: state.currentBudget?.id === budgetId ? data : state.currentBudget,
        isLoading: false,
      }))
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      console.error('Update budget error:', error)
      throw error
    }
  },

  // Delete budget
  deleteBudget: async (budgetId: string) => {
    try {
      set({ isLoading: true, error: null })

      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', budgetId)

      if (error) throw error

      set((state) => ({
        budgets: state.budgets.filter((b) => b.id !== budgetId),
        currentBudget: state.currentBudget?.id === budgetId ? null : state.currentBudget,
        isLoading: false,
      }))
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      console.error('Delete budget error:', error)
      throw error
    }
  },

  // Set current budget
  setCurrentBudget: (budget) => set({ currentBudget: budget }),

  // Load budget by ID with all details
  loadBudgetById: async (budgetId: string) => {
    try {
      set({ isLoading: true, error: null })

      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('id', budgetId)
        .single()

      if (error) throw error

      set({ currentBudget: data, isLoading: false })

      // Also load budget items
      await get().loadBudgetItems(budgetId)
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      console.error('Load budget by ID error:', error)
      throw error
    }
  },

  // Load budget items for a budget
  loadBudgetItems: async (budgetId: string) => {
    try {
      set({ isLoading: true, error: null })

      const { data, error } = await supabase
        .from('budget_items')
        .select('*')
        .eq('budget_id', budgetId)
        .order('created_at', { ascending: false })

      if (error) throw error

      set({ budgetItems: data || [], isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      console.error('Load budget items error:', error)
      throw error
    }
  },

  // Create budget item
  createBudgetItem: async (data) => {
    try {
      set({ isLoading: true, error: null })

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: item, error } = await supabase
        .from('budget_items')
        .insert({
          budget_id: data.budgetId,
          category: data.category,
          description: data.description,
          amount: data.amount,
          type: data.type,
          notes: data.notes,
          created_by: user.id,
        })
        .select()
        .single()

      if (error) throw error

      // Add to items list
      set((state) => ({
        budgetItems: [item, ...state.budgetItems],
        isLoading: false,
      }))

      // Trigger budget totals update (handled by database trigger)
      // Reload current budget to get updated totals
      if (get().currentBudget?.id === data.budgetId) {
        await get().loadBudgetById(data.budgetId)
      }

      return item
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      console.error('Create budget item error:', error)
      throw error
    }
  },

  // Update budget item
  updateBudgetItem: async (itemId: string, updates: Partial<BudgetItem>) => {
    try {
      set({ isLoading: true, error: null })

      const { data, error } = await supabase
        .from('budget_items')
        .update(updates)
        .eq('id', itemId)
        .select()
        .single()

      if (error) throw error

      // Update in state
      set((state) => ({
        budgetItems: state.budgetItems.map((item) => (item.id === itemId ? data : item)),
        isLoading: false,
      }))

      // Reload current budget to get updated totals
      const budgetId = data.budget_id
      if (get().currentBudget?.id === budgetId) {
        await get().loadBudgetById(budgetId)
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      console.error('Update budget item error:', error)
      throw error
    }
  },

  // Delete budget item
  deleteBudgetItem: async (itemId: string) => {
    try {
      set({ isLoading: true, error: null })

      // Get the budget_id before deleting
      const item = get().budgetItems.find((i) => i.id === itemId)
      const budgetId = item?.budget_id

      const { error } = await supabase
        .from('budget_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      set((state) => ({
        budgetItems: state.budgetItems.filter((item) => item.id !== itemId),
        isLoading: false,
      }))

      // Reload current budget to get updated totals
      if (budgetId && get().currentBudget?.id === budgetId) {
        await get().loadBudgetById(budgetId)
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      console.error('Delete budget item error:', error)
      throw error
    }
  },

  // Clear budgets (on logout or org change)
  clearBudgets: () => set({
    budgets: [],
    currentBudget: null,
    budgetItems: [],
    error: null,
  }),

  // Get budget summary (calculate totals from items)
  getBudgetSummary: (budgetId: string) => {
    const items = get().budgetItems.filter((item) => item.budget_id === budgetId)

    const totalIncome = items
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + item.amount, 0)

    const totalExpenses = items
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0)

    const netPosition = totalIncome - totalExpenses
    const itemCount = items.length

    return {
      totalIncome,
      totalExpenses,
      netPosition,
      itemCount,
    }
  },
}))
