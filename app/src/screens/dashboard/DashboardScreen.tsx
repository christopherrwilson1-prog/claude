// Dashboard Screen (Placeholder for MVP)

import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Button, Text, Card } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '../../stores/authStore'
import { useOrgStore } from '../../stores/orgStore'
import { spacing } from '../../theme'

export const DashboardScreen = () => {
  const user = useAuthStore((state) => state.user)
  const currentOrg = useOrgStore((state) => state.currentOrg)
  const signOut = useAuthStore((state) => state.signOut)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>
            Welcome! 👋
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            {user?.full_name || user?.email}
          </Text>
        </View>

        {currentOrg && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>
                {currentOrg.name}
              </Text>
              <Text variant="bodyMedium" style={styles.cardSubtitle}>
                {currentOrg.university}
              </Text>
              <View style={styles.trialBadge}>
                <Text variant="labelSmall" style={styles.trialText}>
                  ✨ Trial Active - {Math.ceil((new Date(currentOrg.trial_end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.comingSoon}>
              🚧 Coming Soon!
            </Text>
            <Text variant="bodyMedium" style={styles.comingSoonText}>
              We're building amazing features for you:
            </Text>
            <View style={styles.featureList}>
              <Text variant="bodyMedium">• Budget Planning</Text>
              <Text variant="bodyMedium">• Event Management</Text>
              <Text variant="bodyMedium">• Expense Tracking</Text>
              <Text variant="bodyMedium">• Professional Reports</Text>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="outlined"
          onPress={handleSignOut}
          style={styles.signOutButton}
        >
          Sign Out
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    marginBottom: spacing.md,
  },
  title: {
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: '#6B7280',
  },
  card: {
    borderRadius: 12,
    elevation: 2,
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    color: '#6B7280',
    marginBottom: spacing.md,
  },
  trialBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  trialText: {
    color: '#059669',
    fontWeight: '600',
  },
  comingSoon: {
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  comingSoonText: {
    color: '#6B7280',
    marginBottom: spacing.md,
  },
  featureList: {
    gap: spacing.sm,
    paddingLeft: spacing.md,
  },
  signOutButton: {
    marginTop: spacing.md,
    borderRadius: 12,
  },
})

export default DashboardScreen
