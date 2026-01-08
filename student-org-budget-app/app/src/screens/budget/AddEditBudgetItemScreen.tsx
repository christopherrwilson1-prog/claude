// Add/Edit Budget Item Screen - Universal form for creating/editing budget items

import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ScrollView, Alert } from 'react-native'
import { Button, Text, TextInput, SegmentedButtons, Menu, Divider } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useBudgetStore } from '../../stores/budgetStore'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../constants/categories'
import { spacing } from '../../theme'
import type { BudgetItem } from '../../types/database'

export const AddEditBudgetItemScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const params = route.params as {
    budgetId: string
    type?: 'income' | 'expense'
    itemId?: string
    item?: BudgetItem
  }

  const createBudgetItem = useBudgetStore((state) => state.createBudgetItem)
  const updateBudgetItem = useBudgetStore((state) => state.updateBudgetItem)
  const isLoading = useBudgetStore((state) => state.isLoading)

  const isEditMode = !!params.itemId
  const initialType = params.type || params.item?.type || 'income'

  const [type, setType] = useState<'income' | 'expense'>(initialType)
  const [category, setCategory] = useState(params.item?.category || '')
  const [description, setDescription] = useState(params.item?.description || '')
  const [amount, setAmount] = useState(params.item?.amount.toString() || '')
  const [notes, setNotes] = useState(params.item?.notes || '')
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false)

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const handleSave = async () => {
    // Validation
    if (!category) {
      Alert.alert('Validation Error', 'Please select a category')
      return
    }

    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please enter a description')
      return
    }

    const amountValue = parseFloat(amount)
    if (isNaN(amountValue) || amountValue <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid amount greater than 0')
      return
    }

    try {
      if (isEditMode && params.itemId) {
        // Update existing item
        await updateBudgetItem(params.itemId, {
          category,
          description: description.trim(),
          amount: amountValue,
          notes: notes.trim() || null,
          type,
        })

        Alert.alert('Success', 'Budget item updated successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ])
      } else {
        // Create new item
        await createBudgetItem({
          budgetId: params.budgetId,
          category,
          description: description.trim(),
          amount: amountValue,
          type,
          notes: notes.trim() || undefined,
        })

        Alert.alert('Success', 'Budget item added successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ])
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save budget item')
    }
  }

  const getCategoryLabel = (value: string) => {
    const cat = categories.find((c) => c.value === value)
    return cat?.label || 'Select Category'
  }

  const typeOptions = [
    { value: 'income', label: '💰 Income' },
    { value: 'expense', label: '💳 Expense' },
  ]

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>
            {isEditMode ? 'Edit Budget Item' : 'Add Budget Item'}
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            {isEditMode
              ? 'Update the details of your budget item'
              : 'Add income or expense to your budget'}
          </Text>
        </View>

        <View style={styles.form}>
          {/* Type Selector - Only show in add mode */}
          {!isEditMode && (
            <>
              <Text variant="labelMedium" style={styles.label}>
                Item Type *
              </Text>
              <SegmentedButtons
                value={type}
                onValueChange={(value) => {
                  setType(value as 'income' | 'expense')
                  setCategory('') // Reset category when type changes
                }}
                buttons={typeOptions}
                style={styles.typeButtons}
              />
            </>
          )}

          {/* Category Dropdown */}
          <Text variant="labelMedium" style={styles.label}>
            Category *
          </Text>
          <Menu
            visible={categoryMenuVisible}
            onDismiss={() => setCategoryMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setCategoryMenuVisible(true)}
                icon="chevron-down"
                contentStyle={styles.categoryButtonContent}
                style={styles.categoryButton}
              >
                {getCategoryLabel(category)}
              </Button>
            }
          >
            {categories.map((cat) => (
              <Menu.Item
                key={cat.value}
                onPress={() => {
                  setCategory(cat.value)
                  setCategoryMenuVisible(false)
                }}
                title={cat.label}
              />
            ))}
          </Menu>

          {/* Description */}
          <TextInput
            label="Description *"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., Spring Formal Event"
          />

          {/* Amount */}
          <TextInput
            label="Amount *"
            value={amount}
            onChangeText={setAmount}
            mode="outlined"
            style={styles.input}
            placeholder="0.00"
            keyboardType="decimal-pad"
            left={<TextInput.Affix text="$" />}
          />

          {/* Notes */}
          <TextInput
            label="Notes (Optional)"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            style={styles.input}
            placeholder="Additional details..."
            multiline
            numberOfLines={3}
          />

          {/* Preview Card */}
          <View
            style={[
              styles.previewCard,
              {
                backgroundColor: type === 'income' ? '#D1FAE5' : '#FEE2E2',
                borderColor: type === 'income' ? '#059669' : '#DC2626',
              },
            ]}
          >
            <Text variant="labelSmall" style={styles.previewLabel}>
              PREVIEW
            </Text>
            <Text variant="titleMedium" style={styles.previewCategory}>
              {getCategoryLabel(category)}
            </Text>
            <Text variant="bodyMedium" style={styles.previewDescription}>
              {description || 'Enter description...'}
            </Text>
            <Text
              variant="headlineSmall"
              style={[
                styles.previewAmount,
                { color: type === 'income' ? '#059669' : '#DC2626' },
              ]}
            >
              ${amount || '0.00'}
            </Text>
          </View>
        </View>

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
            onPress={handleSave}
            style={styles.saveButton}
            loading={isLoading}
            disabled={isLoading}
          >
            {isEditMode ? 'Update' : 'Add'} Item
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
    marginBottom: spacing.xl,
  },
  title: {
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: '#6B7280',
  },
  form: {
    gap: spacing.md,
  },
  label: {
    color: '#374151',
    marginBottom: spacing.xs,
  },
  typeButtons: {
    marginBottom: spacing.md,
  },
  categoryButton: {
    borderRadius: 8,
    borderColor: '#D1D5DB',
  },
  categoryButtonContent: {
    justifyContent: 'space-between',
    height: 56,
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  previewCard: {
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 2,
    marginTop: spacing.lg,
  },
  previewLabel: {
    color: '#6B7280',
    marginBottom: spacing.xs,
  },
  previewCategory: {
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  previewDescription: {
    color: '#6B7280',
    marginBottom: spacing.md,
  },
  previewAmount: {
    fontWeight: '700',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
  },
  saveButton: {
    flex: 2,
    borderRadius: 12,
  },
  disclaimer: {
    color: '#6B7280',
    textAlign: 'center',
  },
})

export default AddEditBudgetItemScreen
