// Forgot Password Screen

import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useAuthStore } from '../../stores/authStore'
import { spacing } from '../../theme'

type NavigationProp = NativeStackNavigationProp<any>

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<NavigationProp>()
  const resetPassword = useAuthStore((state) => state.resetPassword)

  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState('')

  const validate = () => {
    if (!email.trim()) {
      setError('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email')
      return false
    }
    return true
  }

  const handleResetPassword = async () => {
    if (!validate()) return

    try {
      setIsLoading(true)
      setError('')
      await resetPassword(email.trim().toLowerCase())
      setEmailSent(true)
    } catch (error: any) {
      console.error('Reset password error:', error)
      Alert.alert(
        'Error',
        error.message || 'Unable to send reset email. Please try again.',
        [{ text: 'OK' }]
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.successContainer}>
            <Text variant="displaySmall" style={styles.successIcon}>
              ✉️
            </Text>
            <Text variant="headlineMedium" style={styles.successTitle}>
              Check Your Email
            </Text>
            <Text variant="bodyLarge" style={styles.successText}>
              We've sent password reset instructions to{'\n'}
              <Text style={styles.email}>{email}</Text>
            </Text>
            <Text variant="bodyMedium" style={styles.helperText}>
              Didn't receive the email? Check your spam folder or try again.
            </Text>
          </View>

          <View style={styles.actions}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Login')}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Back to Sign In
            </Button>
            <Button
              mode="text"
              onPress={() => {
                setEmailSent(false)
                setEmail('')
              }}
            >
              Try Different Email
            </Button>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text variant="headlineLarge" style={styles.title}>
              Forgot Password?
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              No worries! Enter your email and we'll send you reset instructions.
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text)
                if (error) setError('')
              }}
              mode="outlined"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              error={!!error}
              disabled={isLoading}
              style={styles.input}
            />
            {error && (
              <Text variant="bodySmall" style={styles.errorText}>
                {error}
              </Text>
            )}

            <Button
              mode="contained"
              onPress={handleResetPassword}
              loading={isLoading}
              disabled={isLoading}
              style={styles.resetButton}
              contentStyle={styles.buttonContent}
            >
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.goBack()}
              disabled={isLoading}
              style={styles.backButton}
            >
              Back to Sign In
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  title: {
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: '#6B7280',
  },
  form: {
    gap: spacing.md,
  },
  input: {
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#DC2626',
    marginTop: -spacing.sm,
  },
  resetButton: {
    marginTop: spacing.md,
    borderRadius: 12,
  },
  buttonContent: {
    height: 56,
  },
  backButton: {
    marginTop: spacing.sm,
  },
  successContainer: {
    alignItems: 'center',
    gap: spacing.md,
  },
  successIcon: {
    fontSize: 80,
  },
  successTitle: {
    fontWeight: '700',
    textAlign: 'center',
  },
  successText: {
    textAlign: 'center',
    color: '#374151',
    marginTop: spacing.sm,
  },
  email: {
    fontWeight: '600',
    color: '#1E40AF',
  },
  helperText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: spacing.md,
  },
  actions: {
    gap: spacing.sm,
  },
  button: {
    borderRadius: 12,
  },
})

export default ForgotPasswordScreen
