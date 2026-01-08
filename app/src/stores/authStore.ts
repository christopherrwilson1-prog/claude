// Authentication Store - Zustand

import { create } from 'zustand'
import { supabase } from '../services/supabase/client'
import type { User } from '../types/database'

interface AuthState {
  // State
  user: User | null
  session: any | null
  isLoading: boolean
  isAuthenticated: boolean

  // Actions
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  setUser: (user: User | null) => void
  setSession: (session: any | null) => void
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,

  // Initialize auth state (call on app start)
  initialize: async () => {
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        // Get user profile
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        set({
          session,
          user: userProfile,
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        set({ isLoading: false })
      }

      // Listen to auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: userProfile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          set({
            session,
            user: userProfile,
            isAuthenticated: true,
          })
        } else if (event === 'SIGNED_OUT') {
          set({
            user: null,
            session: null,
            isAuthenticated: false,
          })
        }
      })
    } catch (error) {
      console.error('Auth initialization error:', error)
      set({ isLoading: false })
    }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Get user profile
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()

      set({
        user: userProfile,
        session: data.session,
        isAuthenticated: true,
      })
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  },

  // Sign up with email, password, and full name
  signUp: async (email: string, password: string, fullName: string) => {
    try {
      // Create auth user
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
      if (!data.user) throw new Error('User creation failed')

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName,
          avatar_url: null,
          phone: null,
        })

      if (profileError) throw profileError

      // Get created profile
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()

      set({
        user: userProfile,
        session: data.session,
        isAuthenticated: true,
      })
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      set({
        user: null,
        session: null,
        isAuthenticated: false,
      })
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  },

  // Reset password
  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'studentorgbudget://reset-password',
      })

      if (error) throw error
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    }
  },

  // Set user manually (for updates)
  setUser: (user) => set({ user }),

  // Set session manually
  setSession: (session) => set({ session }),
}))
