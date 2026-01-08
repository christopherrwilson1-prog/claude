// App Configuration and Environment Variables

// NOTE: In production, these should come from environment variables
// For now, we'll use placeholders that need to be replaced

export const CONFIG = {
  // Supabase Configuration
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key',
  },

  // RevenueCat Configuration
  revenuecat: {
    apiKey: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || 'appl_your_key',
  },

  // App Configuration
  app: {
    name: 'Student Org Budget',
    version: '1.0.0',
    environment: process.env.EXPO_PUBLIC_ENV || 'development',
  },

  // Feature Flags (for gradual rollout)
  features: {
    realTimeUpdates: false, // v2
    pushNotifications: false, // v2
    multiOrg: false, // v2
    advancedReports: false, // v2
  },
} as const

// Validation
export const isConfigValid = () => {
  if (CONFIG.supabase.url.includes('your-project')) {
    console.warn('⚠️  Supabase URL not configured. Please set EXPO_PUBLIC_SUPABASE_URL')
    return false
  }
  if (CONFIG.supabase.anonKey.includes('your-anon-key')) {
    console.warn('⚠️  Supabase Anon Key not configured. Please set EXPO_PUBLIC_SUPABASE_ANON_KEY')
    return false
  }
  return true
}
