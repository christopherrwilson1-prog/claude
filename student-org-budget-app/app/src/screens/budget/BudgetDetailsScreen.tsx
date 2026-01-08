// Budget Details Screen - Shows budget items and summary

import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native'
import { Button, Text, Card, FAB, Chip, IconButton, Menu, Divider } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useBudgetStore } from '../../stores/budgetStore'
import { spacing } from '../../theme'
import type { BudgetItem } from '../../types/database'

export const BudgetDetailsScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { budgetId } = route.params as { budgetId: string }

  const currentBudget = useBudgetStore((state) => state.currentBudget)
  const budgetItems = useBudgetStore((state) => state.budgetItems)
  const loadBudgetById = useBudgetStore((state) => state.loadBudgetById)
  const deleteBudgetItem = useBudgetStore((state) => state.deleteBudgetItem)
  const getBudgetSummary = useBudgetStore((state) => state.getBudgetSummary)
  const isLoading = useBudgetStore((state) => state.isLoading)

  const [refreshing, setRefreshing] = useState(false)
  const [menuVisible, setMenuVisible] = useState<string | null>(null)

  useEffect(() => {
    loadBudgetById(budgetId)
  }, [budgetId])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadBudgetById(budgetId)
    setRefreshing(false)
  }

  const handleAddItem = (type: 'income' | 'expense') => {
    navigation.navigate('AddBudgetItem' as never, { budgetId, type } as never)
  }

  const handleEditItem = (item: BudgetItem) => {
    setMenuVisible(null)
    navigation.navigate('EditBudgetItem' as never, { budgetId, itemId: item.id, item } as never)
  }

  const handleDeleteItem = (itemId: string) => {
    setMenuVisible(null)
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this budget item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBudgetItem(itemId)
            } catch (error: any) {
              Alert.alert('Error', 'Failed to delete item')
            }
          },
        },
      ]
    )
  }

  const openMenu = (itemId: string) => setMenuVisible(itemId)
  const closeMenu = () => setMenuVisible(null)

  if (!currentBudget) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    )
  }

  const summary = getBudgetSummary(budgetId)
  const incomeItems = budgetItems.filter((item) => item.type === 'income')
  const expenseItems = budgetItems.filter((item) => item.type === 'expense')

  const renderBudgetItem = (item: BudgetItem) => (
    <Card key={item.id} style={styles.itemCard}>
      <Card.Content style={styles.itemContent}>
        <View style={styles.itemLeft}>
          <Text variant="titleMedium" style={styles.itemCategory}>
            {item.category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </Text>
          <Text variant="bodyMedium" style={styles.itemDescription}>
            {item.description}
          </Text>
          {item.notes && (
            <Text variant="bodySmall" style={styles.itemNotes}>
              Note: {item.notes}
            </Text>
          )}
        </View>

        <View style={styles.itemRight}>
          <Text
            variant="titleMedium"
            style={[
              styles.itemAmount,
              { color: item.type === 'income' ? '#059669' : '#DC2626' },
            ]}
          >
            ${item.amount.toLocaleString()}
          </Text>

          <Menu
            visible={menuVisible === item.id}
            onDismiss={closeMenu}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={20}
                onPress={() => openMenu(item.id)}
              />
            }
          >
            <Menu.Item
              onPress={() => handleEditItem(item)}
              title="Edit"
              leadingIcon="pencil"
            />
            <Divider />
            <Menu.Item
              onPress={() => handleDeleteItem(item.id)}
              title="Delete"
              leadingIcon="delete"
              titleStyle={{ color: '#DC2626' }}
            />
          </Menu>
        </View>
      </Card.Content>
    </Card>
  )

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Budget Header */}
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            {currentBudget.name}
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {currentBudget.academic_year} • {currentBudget.semester}
          </Text>
          {currentBudget.description && (
            <Text variant="bodyMedium" style={styles.description}>
              {currentBudget.description}
            </Text>
          )}
        </View>

        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.summaryTitle}>
              Budget Summary
            </Text>

            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text variant="labelSmall" style={styles.summaryLabel}>
                  TOTAL INCOME
                </Text>
                <Text variant="headlineSmall" style={styles.incomeText}>
                  ${summary.totalIncome.toLocaleString()}
                </Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <Text variant="labelSmall" style={styles.summaryLabel}>
                  TOTAL EXPENSES
                </Text>
                <Text variant="headlineSmall" style={styles.expenseText}>
                  ${summary.totalExpenses.toLocaleString()}
                </Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.netPositionContainer}>
              <Text variant="titleMedium" style={styles.netLabel}>
                Net Position
              </Text>
              <Text
                variant="headlineMedium"
                style={[
                  styles.netAmount,
                  { color: summary.netPosition >= 0 ? '#059669' : '#DC2626' },
                ]}
              >
                {summary.netPosition >= 0 ? '+' : ''}$
                {summary.netPosition.toLocaleString()}
              </Text>
            </View>

            {summary.netPosition < 0 && (
              <Card style={styles.warningCard}>
                <Card.Content style={styles.warningContent}>
                  <Text variant="bodySmall" style={styles.warningText}>
                    ⚠️ Budget is over allocated. Reduce expenses or increase income.
                  </Text>
                </Card.Content>
              </Card>
            )}
          </Card.Content>
        </Card>

        {/* Income Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              💰 Income
            </Text>
            <Button
              mode="outlined"
              onPress={() => handleAddItem('income')}
              icon="plus"
              compact
            >
              Add
            </Button>
          </View>

          {incomeItems.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Text variant="bodyMedium" style={styles.emptyText}>
                  No income sources yet. Add your first income source to get started.
                </Text>
              </Card.Content>
            </Card>
          ) : (
            incomeItems.map(renderBudgetItem)
          )}
        </View>

        {/* Expense Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              💳 Expenses
            </Text>
            <Button
              mode="outlined"
              onPress={() => handleAddItem('expense')}
              icon="plus"
              compact
            >
              Add
            </Button>
          </View>

          {expenseItems.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Text variant="bodyMedium" style={styles.emptyText}>
                  No expenses yet. Add your first expense category to track spending.
                </Text>
              </Card.Content>
            </Card>
          ) : (
            expenseItems.map(renderBudgetItem)
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        label="Add Item"
        onPress={() => handleAddItem('income')}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: '#6B7280',
  },
  description: {
    color: '#6B7280',
    marginTop: spacing.sm,
  },
  summaryCard: {
    borderRadius: 12,
    marginBottom: spacing.xl,
    elevation: 3,
    backgroundColor: '#FFFFFF',
  },
  summaryTitle: {
    fontWeight: '600',
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#6B7280',
    marginBottom: spacing.xs,
  },
  incomeText: {
    color: '#059669',
    fontWeight: '700',
  },
  expenseText: {
    color: '#DC2626',
    fontWeight: '700',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: spacing.md,
  },
  divider: {
    marginVertical: spacing.md,
  },
  netPositionContainer: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  netLabel: {
    color: '#6B7280',
    marginBottom: spacing.xs,
  },
  netAmount: {
    fontWeight: '700',
  },
  warningCard: {
    backgroundColor: '#FEE2E2',
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  warningContent: {
    paddingVertical: spacing.sm,
  },
  warningText: {
    color: '#991B1B',
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  itemCard: {
    marginBottom: spacing.md,
    borderRadius: 12,
    elevation: 1,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: {
    flex: 1,
    marginRight: spacing.md,
  },
  itemCategory: {
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  itemDescription: {
    color: '#6B7280',
  },
  itemNotes: {
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  itemRight: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  itemAmount: {
    fontWeight: '700',
  },
  emptyCard: {
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  emptyContent: {
    paddingVertical: spacing.lg,
  },
  emptyText: {
    color: '#6B7280',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    borderRadius: 16,
  },
})

export default BudgetDetailsScreen
