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
  signInWithGoogle: () => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  setUser: (user: User | null) => void
  setSession: (session: any | null) => void
  initialize: () => Promise<void>
  handleOAuthCallback: (url: string) => Promise<void>
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

  // Sign in with Google OAuth
  signInWithGoogle: async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'studentorgbudget://auth/callback',
        },
      })

      if (error) throw error

      // OAuth will redirect to browser, callback handled by handleOAuthCallback
    } catch (error) {
      console.error('Google sign in error:', error)
      throw error
    }
  },

  // Handle OAuth callback (called when redirecting back from Google)
  handleOAuthCallback: async (url: string) => {
    try {
      // Extract tokens from URL
      const { data, error } = await supabase.auth.getSessionFromUrl({ url })

      if (error) throw error
      if (!data.session) throw new Error('No session in callback')

      // Check if user profile exists
      const { data: existingProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.session.user.id)
        .single()

      // Create profile if doesn't exist (first time Google sign-in)
      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.session.user.id,
            email: data.session.user.email!,
            full_name: data.session.user.user_metadata.full_name || data.session.user.user_metadata.name || null,
            avatar_url: data.session.user.user_metadata.avatar_url || null,
            phone: null,
          })

        if (profileError) throw profileError
      }

      // Get user profile
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.session.user.id)
        .single()

      set({
        user: userProfile,
        session: data.session,
        isAuthenticated: true,
      })
    } catch (error) {
      console.error('OAuth callback error:', error)
      throw error
    }
  },

  // Set user manually (for updates)
  setUser: (user) => set({ user }),

  // Set session manually
  setSession: (session) => set({ session }),
}))
