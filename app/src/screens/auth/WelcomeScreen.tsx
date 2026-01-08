// Welcome Screen - App Entry Point

import React from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { spacing } from '../../theme'

type NavigationProp = NativeStackNavigationProp<any>

export const WelcomeScreen = () => {
  const navigation = useNavigation<NavigationProp>()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Icon Area */}
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text variant="displayMedium" style={styles.logoText}>
              💰
            </Text>
          </View>
          <Text variant="headlineLarge" style={styles.title}>
            Student Org Budget
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Manage your student organization budget like a pro
          </Text>
        </View>

        {/* Features List */}
        <View style={styles.features}>
          <FeatureItem
            icon="📊"
            text="Create professional budgets"
          />
          <FeatureItem
            icon="📅"
            text="Plan and track events"
          />
          <FeatureItem
            icon="💳"
            text="Manage expenses effortlessly"
          />
          <FeatureItem
            icon="📄"
            text="Generate allocation requests"
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('SignUp')}
          style={styles.primaryButton}
          contentStyle={styles.buttonContent}
        >
          Get Started
        </Button>
        <Button
          mode="text"
          onPress={() => navigation.navigate('Login')}
          style={styles.secondaryButton}
        >
          Already have an account? Sign In
        </Button>
      </View>
    </SafeAreaView>
  )
}

const FeatureItem = ({ icon, text }: { icon: string; text: string }) => (
  <View style={styles.featureItem}>
    <Text variant="headlineSmall" style={styles.featureIcon}>
      {icon}
    </Text>
    <Text variant="bodyLarge" style={styles.featureText}>
      {text}
    </Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoText: {
    fontSize: 64,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontWeight: '700',
  },
  subtitle: {
    textAlign: 'center',
    color: '#6B7280',
  },
  features: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureIcon: {
    fontSize: 32,
  },
  featureText: {
    flex: 1,
    color: '#374151',
  },
  actions: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  primaryButton: {
    borderRadius: 12,
  },
  buttonContent: {
    height: 56,
  },
  secondaryButton: {
    marginTop: spacing.sm,
  },
})

export default WelcomeScreen
