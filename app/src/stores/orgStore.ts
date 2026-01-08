// Organization Store - Zustand

import { create } from 'zustand'
import { supabase } from '../services/supabase/client'
import type { Organization, OrganizationMember, OrgType } from '../types/database'

interface OrgState {
  // State
  currentOrg: Organization | null
  currentMember: OrganizationMember | null
  isLoading: boolean

  // Actions
  createOrganization: (data: {
    name: string
    university: string
    orgType: OrgType
    description?: string
  }) => Promise<Organization>
  loadCurrentOrganization: (userId: string) => Promise<void>
  updateOrganization: (orgId: string, updates: Partial<Organization>) => Promise<void>
  setCurrentOrg: (org: Organization | null) => void
  clearOrganization: () => void
}

export const useOrgStore = create<OrgState>((set, get) => ({
  // Initial state
  currentOrg: null,
  currentMember: null,
  isLoading: false,

  // Create new organization
  createOrganization: async (data) => {
    try {
      set({ isLoading: true })

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: data.name,
          university: data.university,
          org_type: data.orgType,
          description: data.description,
          created_by: user.id,
        })
        .select()
        .single()

      if (orgError) throw orgError

      // Add creator as admin
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: org.id,
          user_id: user.id,
          role: 'admin',
        })

      if (memberError) throw memberError

      // Get member record
      const { data: member } = await supabase
        .from('organization_members')
        .select('*')
        .eq('organization_id', org.id)
        .eq('user_id', user.id)
        .single()

      set({
        currentOrg: org,
        currentMember: member,
        isLoading: false,
      })

      return org
    } catch (error) {
      set({ isLoading: false })
      console.error('Create organization error:', error)
      throw error
    }
  },

  // Load user's current organization (for MVP: first org they're a member of)
  loadCurrentOrganization: async (userId: string) => {
    try {
      set({ isLoading: true })

      // Get user's organization memberships
      const { data: memberships, error: memberError } = await supabase
        .from('organization_members')
        .select(`
          *,
          organizations (*)
        `)
        .eq('user_id', userId)
        .order('joined_at', { ascending: false })

      if (memberError) throw memberError

      if (memberships && memberships.length > 0) {
        const firstMembership = memberships[0]

        set({
          currentOrg: firstMembership.organizations as any,
          currentMember: {
            id: firstMembership.id,
            organization_id: firstMembership.organization_id,
            user_id: firstMembership.user_id,
            role: firstMembership.role,
            joined_at: firstMembership.joined_at,
            invited_by: firstMembership.invited_by,
          },
          isLoading: false,
        })
      } else {
        set({
          currentOrg: null,
          currentMember: null,
          isLoading: false,
        })
      }
    } catch (error) {
      set({ isLoading: false })
      console.error('Load organization error:', error)
      throw error
    }
  },

  // Update organization
  updateOrganization: async (orgId: string, updates: Partial<Organization>) => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', orgId)
        .select()
        .single()

      if (error) throw error

      set({ currentOrg: data })
    } catch (error) {
      console.error('Update organization error:', error)
      throw error
    }
  },

  // Set current organization manually
  setCurrentOrg: (org) => set({ currentOrg: org }),

  // Clear organization (on logout)
  clearOrganization: () => set({
    currentOrg: null,
    currentMember: null,
  }),
}))
