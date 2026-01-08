// Create Budget Screen - Form to create a new budget

import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, Alert } from 'react-native'
import { Button, Text, TextInput, SegmentedButtons, Card } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useBudgetStore } from '../../stores/budgetStore'
import { useOrgStore } from '../../stores/orgStore'
import { spacing } from '../../theme'
import type { Semester } from '../../types/database'

const SEMESTER_OPTIONS = [
  { value: 'fall', label: '🍂 Fall' },
  { value: 'spring', label: '🌸 Spring' },
  { value: 'summer', label: '☀️ Summer' },
  { value: 'full_year', label: '📅 Full Year' },
]

export const CreateBudgetScreen = () => {
  const navigation = useNavigation()
  const currentOrg = useOrgStore((state) => state.currentOrg)
  const createBudget = useBudgetStore((state) => state.createBudget)
  const isLoading = useBudgetStore((state) => state.isLoading)

  const [budgetName, setBudgetName] = useState('')
  const [academicYear, setAcademicYear] = useState('')
  const [semester, setSemester] = useState<Semester>('fall')
  const [description, setDescription] = useState('')

  // Generate suggested academic year (e.g., "2025-2026")
  const getSuggestedYear = () => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1 // 1-12

    // If it's August or later, suggest current year - next year
    // If it's before August, suggest last year - current year
    if (currentMonth >= 8) {
      return `${currentYear}-${currentYear + 1}`
    } else {
      return `${currentYear - 1}-${currentYear}`
    }
  }

  const handleSuggestYear = () => {
    setAcademicYear(getSuggestedYear())
  }

  const handleCreateBudget = async () => {
    // Validation
    if (!budgetName.trim()) {
      Alert.alert('Validation Error', 'Please enter a budget name')
      return
    }

    if (!academicYear.trim()) {
      Alert.alert('Validation Error', 'Please enter an academic year')
      return
    }

    // Validate academic year format (e.g., "2025-2026")
    const yearPattern = /^\d{4}-\d{4}$/
    if (!yearPattern.test(academicYear.trim())) {
      Alert.alert(
        'Invalid Format',
        'Academic year should be in format: YYYY-YYYY (e.g., 2025-2026)'
      )
      return
    }

    if (!currentOrg) {
      Alert.alert('Error', 'No organization selected')
      return
    }

    try {
      // Create budget with organization ID
      const budget = await createBudget({
        organizationId: currentOrg.id,
        name: budgetName.trim(),
        academicYear: academicYear.trim(),
        semester,
        description: description.trim() || undefined,
      })

      Alert.alert(
        'Success',
        'Budget created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack()
              // Navigate to budget details
              navigation.navigate('BudgetDetails' as never, { budgetId: budget.id } as never)
            },
          },
        ]
      )
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create budget')
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="displaySmall" style={styles.icon}>
            📊
          </Text>
          <Text variant="headlineLarge" style={styles.title}>
            Create Budget
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Set up a new budget for {currentOrg?.name}
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Budget Information
            </Text>

            <TextInput
              label="Budget Name *"
              value={budgetName}
              onChangeText={setBudgetName}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., Fall 2025 Operating Budget"
            />

            <View style={styles.yearInputContainer}>
              <TextInput
                label="Academic Year *"
                value={academicYear}
                onChangeText={setAcademicYear}
                mode="outlined"
                style={[styles.input, styles.yearInput]}
                placeholder="YYYY-YYYY"
                keyboardType="numeric"
              />
              <Button
                mode="outlined"
                onPress={handleSuggestYear}
                style={styles.suggestButton}
              >
                Suggest
              </Button>
            </View>

            <Text variant="labelMedium" style={styles.label}>
              Semester / Period *
            </Text>
            <SegmentedButtons
              value={semester}
              onValueChange={(value) => setSemester(value as Semester)}
              buttons={SEMESTER_OPTIONS}
              style={styles.segmentedButtons}
            />

            <TextInput
              label="Description (Optional)"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              style={styles.input}
              placeholder="Add notes about this budget..."
              multiline
              numberOfLines={3}
            />
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleSmall" style={styles.infoTitle}>
              💡 What happens next?
            </Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              After creating your budget, you'll be able to:
            </Text>
            <View style={styles.infoList}>
              <Text variant="bodyMedium">• Add income sources</Text>
              <Text variant="bodyMedium">• Track expense categories</Text>
              <Text variant="bodyMedium">• Monitor your net position</Text>
              <Text variant="bodyMedium">• Generate reports</Text>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleCreateBudget}
            style={styles.createButton}
            loading={isLoading}
            disabled={isLoading}
          >
            Create Budget
          </Button>
        </View>

        <Text variant="bodySmall" style={styles.disclaimer}>
          * Required fields
        </Text>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  title: {
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: '#6B7280',
    textAlign: 'center',
  },
  card: {
    borderRadius: 12,
    marginBottom: spacing.lg,
    elevation: 2,
  },
  cardContent: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  yearInputContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-end',
  },
  yearInput: {
    flex: 1,
  },
  suggestButton: {
    height: 56,
    justifyContent: 'center',
  },
  label: {
    color: '#374151',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  segmentedButtons: {
    marginBottom: spacing.sm,
  },
  infoCard: {
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  infoTitle: {
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: spacing.sm,
  },
  infoText: {
    color: '#1E3A8A',
    marginBottom: spacing.sm,
  },
  infoList: {
    gap: spacing.xs,
    paddingLeft: spacing.sm,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
  },
  createButton: {
    flex: 2,
    borderRadius: 12,
  },
  disclaimer: {
    color: '#6B7280',
    textAlign: 'center',
  },
})

export default CreateBudgetScreen
