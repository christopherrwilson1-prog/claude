// Student Org Budget App - Root Component

import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { Provider as PaperProvider, Text } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useAuthStore } from './src/stores/authStore'
import { useOrgStore } from './src/stores/orgStore'
import RootNavigator from './src/navigation'
import theme from './src/theme'
import { isConfigValid } from './src/constants/config'

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [configError, setConfigError] = useState(false)
  const initialize = useAuthStore((state) => state.initialize)
  const loadCurrentOrganization = useOrgStore((state) => state.loadCurrentOrganization)
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    const initApp = async () => {
      try {
        // Check configuration
        if (!isConfigValid()) {
          setConfigError(true)
          setIsInitialized(true)
          return
        }

        // Initialize auth
        await initialize()

        // If user is authenticated, load their organization
        if (user) {
          await loadCurrentOrganization(user.id)
        }

        setIsInitialized(true)
      } catch (error) {
        console.error('App initialization error:', error)
        setIsInitialized(true)
      }
    }

    initApp()
  }, [])

  // Watch for user changes to load organization
  useEffect(() => {
    if (user) {
      loadCurrentOrganization(user.id)
    }
  }, [user?.id])

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E40AF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  // Show configuration error
  if (configError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Configuration Error</Text>
        <Text style={styles.errorText}>
          Supabase is not configured.{'\n\n'}
          Please set up your .env file with:{'\n'}
          EXPO_PUBLIC_SUPABASE_URL{'\n'}
          EXPO_PUBLIC_SUPABASE_ANON_KEY
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="auto" />
        <RootNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 20,
  },
})
