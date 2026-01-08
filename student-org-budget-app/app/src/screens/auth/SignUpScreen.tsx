// Sign Up Screen with Google Sign-In

import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { Button, Text, TextInput, Divider, Checkbox } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useAuthStore } from '../../stores/authStore'
import { spacing } from '../../theme'

type NavigationProp = NativeStackNavigationProp<any>

export const SignUpScreen = () => {
  const navigation = useNavigation<NavigationProp>()
  const { signUp, signInWithGoogle } = useAuthStore()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    fullName?: string
    email?: string
    password?: string
    confirmPassword?: string
    terms?: string
  }>({})

  const validate = () => {
    const newErrors: any = {}

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the Terms of Service'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEmailSignUp = async () => {
    if (!validate()) return

    try {
      setIsLoading(true)
      await signUp(email.trim().toLowerCase(), password, fullName.trim())
      // Navigation handled by auth state change
    } catch (error: any) {
      console.error('Sign up error:', error)
      Alert.alert(
        'Sign Up Failed',
        error.message || 'Unable to create account. Please try again.',
        [{ text: 'OK' }]
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    if (!agreedToTerms) {
      Alert.alert(
        'Terms Required',
        'Please agree to the Terms of Service and Privacy Policy to continue.',
        [{ text: 'OK' }]
      )
      return
    }

    try {
      setIsLoading(true)
      await signInWithGoogle()
      // Will redirect to Google OAuth in browser
    } catch (error: any) {
      console.error('Google sign up error:', error)
      Alert.alert(
        'Google Sign-Up Failed',
        error.message || 'Unable to sign up with Google. Please try again.',
        [{ text: 'OK' }]
      )
      setIsLoading(false)
    }
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
              Create Account
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Get started with Student Org Budget
            </Text>
          </View>

          {/* Google Sign-Up Button */}
          <Button
            mode="outlined"
            onPress={handleGoogleSignUp}
            disabled={isLoading}
            style={styles.googleButton}
            contentStyle={styles.buttonContent}
            icon="google"
          >
            Continue with Google
          </Button>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <Divider style={styles.divider} />
            <Text variant="bodyMedium" style={styles.dividerText}>
              or sign up with email
            </Text>
            <Divider style={styles.divider} />
          </View>

          {/* Email/Password Form */}
          <View style={styles.form}>
            <TextInput
              label="Full Name"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text)
                if (errors.fullName) setErrors({ ...errors, fullName: undefined })
              }}
              mode="outlined"
              autoCapitalize="words"
              autoComplete="name"
              error={!!errors.fullName}
              disabled={isLoading}
              style={styles.input}
            />
            {errors.fullName && (
              <Text variant="bodySmall" style={styles.errorText}>
                {errors.fullName}
              </Text>
            )}

            <TextInput
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text)
                if (errors.email) setErrors({ ...errors, email: undefined })
              }}
              mode="outlined"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              error={!!errors.email}
              disabled={isLoading}
              style={styles.input}
            />
            {errors.email && (
              <Text variant="bodySmall" style={styles.errorText}>
                {errors.email}
              </Text>
            )}

            <TextInput
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text)
                if (errors.password) setErrors({ ...errors, password: undefined })
              }}
              mode="outlined"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password-new"
              error={!!errors.password}
              disabled={isLoading}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              style={styles.input}
            />
            {errors.password && (
              <Text variant="bodySmall" style={styles.errorText}>
                {errors.password}
              </Text>
            )}
            {!errors.password && password.length > 0 && (
              <Text variant="bodySmall" style={styles.helperText}>
                Must be at least 8 characters
              </Text>
            )}

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text)
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined })
              }}
              mode="outlined"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              error={!!errors.confirmPassword}
              disabled={isLoading}
              style={styles.input}
            />
            {errors.confirmPassword && (
              <Text variant="bodySmall" style={styles.errorText}>
                {errors.confirmPassword}
              </Text>
            )}

            {/* Terms and Conditions */}
            <View style={styles.termsContainer}>
              <Checkbox
                status={agreedToTerms ? 'checked' : 'unchecked'}
                onPress={() => {
                  setAgreedToTerms(!agreedToTerms)
                  if (errors.terms) setErrors({ ...errors, terms: undefined })
                }}
                disabled={isLoading}
              />
              <Text variant="bodyMedium" style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.link}>Terms of Service</Text> and{' '}
                <Text style={styles.link}>Privacy Policy</Text>
              </Text>
            </View>
            {errors.terms && (
              <Text variant="bodySmall" style={styles.errorText}>
                {errors.terms}
              </Text>
            )}

            <Button
              mode="contained"
              onPress={handleEmailSignUp}
              loading={isLoading}
              disabled={isLoading}
              style={styles.signUpButton}
              contentStyle={styles.buttonContent}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              disabled={isLoading}
              style={styles.loginButton}
            >
              Already have an account? Sign In
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
    paddingBottom: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: '#6B7280',
  },
  googleButton: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    marginBottom: spacing.lg,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
    gap: spacing.md,
  },
  divider: {
    flex: 1,
  },
  dividerText: {
    color: '#9CA3AF',
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
  helperText: {
    color: '#6B7280',
    marginTop: -spacing.sm,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  termsText: {
    flex: 1,
    color: '#374151',
  },
  link: {
    color: '#1E40AF',
    fontWeight: '600',
  },
  signUpButton: {
    marginTop: spacing.md,
    borderRadius: 12,
  },
  buttonContent: {
    height: 56,
  },
  loginButton: {
    marginTop: spacing.sm,
  },
})

export default SignUpScreen
