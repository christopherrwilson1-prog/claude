// Enhanced Login Screen with Google Sign-In

import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { Button, Text, TextInput, Divider } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useAuthStore } from '../../stores/authStore'
import { spacing } from '../../theme'

type NavigationProp = NativeStackNavigationProp<any>

export const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>()
  const { signIn, signInWithGoogle } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEmailLogin = async () => {
    if (!validate()) return

    try {
      setIsLoading(true)
      await signIn(email.trim().toLowerCase(), password)
      // Navigation handled by auth state change
    } catch (error: any) {
      console.error('Login error:', error)
      Alert.alert(
        'Login Failed',
        error.message || 'Invalid email or password. Please try again.',
        [{ text: 'OK' }]
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      await signInWithGoogle()
      // Will redirect to Google OAuth in browser
    } catch (error: any) {
      console.error('Google login error:', error)
      Alert.alert(
        'Google Sign-In Failed',
        error.message || 'Unable to sign in with Google. Please try again.',
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
              Welcome Back
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Sign in to continue
            </Text>
          </View>

          {/* Google Sign-In Button */}
          <Button
            mode="outlined"
            onPress={handleGoogleLogin}
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
              or sign in with email
            </Text>
            <Divider style={styles.divider} />
          </View>

          {/* Email/Password Form */}
          <View style={styles.form}>
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
              autoComplete="password"
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

            <Button
              mode="text"
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotButton}
              disabled={isLoading}
            >
              Forgot Password?
            </Button>

            <Button
              mode="contained"
              onPress={handleEmailLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('SignUp')}
              disabled={isLoading}
              style={styles.signUpButton}
            >
              Don't have an account? Sign Up
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
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -spacing.sm,
  },
  loginButton: {
    marginTop: spacing.md,
    borderRadius: 12,
  },
  buttonContent: {
    height: 56,
  },
  signUpButton: {
    marginTop: spacing.sm,
  },
})

export default LoginScreen
