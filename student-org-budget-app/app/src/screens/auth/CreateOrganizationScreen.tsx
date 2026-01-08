// Create Organization Screen (Onboarding)

import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { Button, Text, TextInput, SegmentedButtons } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useOrgStore } from '../../stores/orgStore'
import { ORG_TYPES } from '../../constants/categories'
import { spacing } from '../../theme'
import type { OrgType } from '../../types/database'

type NavigationProp = NativeStackNavigationProp<any>

export const CreateOrganizationScreen = () => {
  const navigation = useNavigation<NavigationProp>()
  const createOrganization = useOrgStore((state) => state.createOrganization)

  const [orgName, setOrgName] = useState('')
  const [university, setUniversity] = useState('')
  const [orgType, setOrgType] = useState<OrgType>('other')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ orgName?: string; university?: string }>({})

  const validate = () => {
    const newErrors: any = {}

    if (!orgName.trim()) {
      newErrors.orgName = 'Organization name is required'
    }

    if (!university.trim()) {
      newErrors.university = 'University name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateOrganization = async () => {
    if (!validate()) return

    try {
      setIsLoading(true)
      await createOrganization({
        name: orgName.trim(),
        university: university.trim(),
        orgType,
        description: description.trim() || undefined,
      })
      // Navigation handled by auth state change or explicitly navigate to Dashboard
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      })
    } catch (error: any) {
      console.error('Create organization error:', error)
      Alert.alert(
        'Error Creating Organization',
        error.message || 'Unable to create organization. Please try again.',
        [{ text: 'OK' }]
      )
    } finally {
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
            <Text variant="displaySmall" style={styles.icon}>
              🎓
            </Text>
            <Text variant="headlineLarge" style={styles.title}>
              Create Your Organization
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Tell us about your student organization to get started
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Organization Name"
              value={orgName}
              onChangeText={(text) => {
                setOrgName(text)
                if (errors.orgName) setErrors({ ...errors, orgName: undefined })
              }}
              mode="outlined"
              autoCapitalize="words"
              error={!!errors.orgName}
              disabled={isLoading}
              style={styles.input}
              placeholder="e.g., Computer Science Club"
            />
            {errors.orgName && (
              <Text variant="bodySmall" style={styles.errorText}>
                {errors.orgName}
              </Text>
            )}

            <TextInput
              label="University/College"
              value={university}
              onChangeText={(text) => {
                setUniversity(text)
                if (errors.university) setErrors({ ...errors, university: undefined })
              }}
              mode="outlined"
              autoCapitalize="words"
              error={!!errors.university}
              disabled={isLoading}
              style={styles.input}
              placeholder="e.g., Example University"
            />
            {errors.university && (
              <Text variant="bodySmall" style={styles.errorText}>
                {errors.university}
              </Text>
            )}

            <View style={styles.fieldContainer}>
              <Text variant="titleMedium" style={styles.fieldLabel}>
                Organization Type
              </Text>
              <View style={styles.typeGrid}>
                {ORG_TYPES.map((type) => (
                  <Button
                    key={type.value}
                    mode={orgType === type.value ? 'contained' : 'outlined'}
                    onPress={() => setOrgType(type.value as OrgType)}
                    disabled={isLoading}
                    style={styles.typeButton}
                    compact
                  >
                    {type.label}
                  </Button>
                ))}
              </View>
            </View>

            <TextInput
              label="Description (Optional)"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={3}
              disabled={isLoading}
              style={styles.input}
              placeholder="Brief description of your organization..."
            />

            <Button
              mode="contained"
              onPress={handleCreateOrganization}
              loading={isLoading}
              disabled={isLoading}
              style={styles.createButton}
              contentStyle={styles.buttonContent}
            >
              {isLoading ? 'Creating...' : 'Create Organization'}
            </Button>

            <Text variant="bodySmall" style={styles.trialNote}>
              🎉 Your 7-day free trial starts now! No credit card required.
            </Text>
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
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  icon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: '#6B7280',
    textAlign: 'center',
  },
  form: {
    gap: spacing.lg,
  },
  input: {
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#DC2626',
    marginTop: -spacing.md,
  },
  fieldContainer: {
    gap: spacing.sm,
  },
  fieldLabel: {
    fontWeight: '600',
    color: '#374151',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeButton: {
    borderRadius: 8,
  },
  createButton: {
    marginTop: spacing.md,
    borderRadius: 12,
  },
  buttonContent: {
    height: 56,
  },
  trialNote: {
    textAlign: 'center',
    color: '#059669',
    backgroundColor: '#D1FAE5',
    padding: spacing.md,
    borderRadius: 8,
  },
})

export default CreateOrganizationScreen
