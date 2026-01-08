// Budget List Screen - Shows all budgets for the organization

import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native'
import { Button, Text, Card, FAB, Chip, IconButton, Searchbar } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useBudgetStore } from '../../stores/budgetStore'
import { useOrgStore } from '../../stores/orgStore'
import { spacing } from '../../theme'
import type { Budget } from '../../types/database'

export const BudgetListScreen = () => {
  const navigation = useNavigation()
  const currentOrg = useOrgStore((state) => state.currentOrg)
  const budgets = useBudgetStore((state) => state.budgets)
  const loadBudgets = useBudgetStore((state) => state.loadBudgets)
  const setCurrentBudget = useBudgetStore((state) => state.setCurrentBudget)
  const isLoading = useBudgetStore((state) => state.isLoading)

  const [searchQuery, setSearchQuery] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (currentOrg) {
      loadBudgets(currentOrg.id)
    }
  }, [currentOrg?.id])

  const handleRefresh = async () => {
    if (currentOrg) {
      setRefreshing(true)
      await loadBudgets(currentOrg.id)
      setRefreshing(false)
    }
  }

  const handleBudgetPress = (budget: Budget) => {
    setCurrentBudget(budget)
    navigation.navigate('BudgetDetails' as never, { budgetId: budget.id } as never)
  }

  const handleCreateBudget = () => {
    navigation.navigate('CreateBudget' as never)
  }

  // Filter budgets by search query
  const filteredBudgets = budgets.filter((budget) =>
    budget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    budget.academic_year.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group budgets by academic year
  const groupedBudgets = filteredBudgets.reduce((acc, budget) => {
    const year = budget.academic_year
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(budget)
    return acc
  }, {} as Record<string, Budget[]>)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#059669' // Green
      case 'active':
        return '#3B82F6' // Blue
      case 'archived':
        return '#6B7280' // Gray
      default:
        return '#F59E0B' // Yellow/Orange for draft
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const getSemesterIcon = (semester: string) => {
    switch (semester) {
      case 'fall':
        return '🍂'
      case 'spring':
        return '🌸'
      case 'summer':
        return '☀️'
      default:
        return '📅'
    }
  }

  if (!currentOrg) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text variant="headlineSmall">No Organization Selected</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Budgets
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {currentOrg.name}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search budgets..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {filteredBudgets.length === 0 && !isLoading && (
          <View style={styles.emptyContainer}>
            <Text variant="displaySmall" style={styles.emptyIcon}>
              📊
            </Text>
            <Text variant="headlineSmall" style={styles.emptyTitle}>
              No Budgets Yet
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              Create your first budget to start tracking your organization's finances
            </Text>
            <Button
              mode="contained"
              onPress={handleCreateBudget}
              style={styles.emptyButton}
            >
              Create Budget
            </Button>
          </View>
        )}

        {Object.keys(groupedBudgets)
          .sort()
          .reverse()
          .map((year) => (
            <View key={year} style={styles.yearSection}>
              <Text variant="titleLarge" style={styles.yearTitle}>
                {year}
              </Text>

              {groupedBudgets[year].map((budget) => (
                <Card
                  key={budget.id}
                  style={styles.budgetCard}
                  onPress={() => handleBudgetPress(budget)}
                >
                  <Card.Content>
                    <View style={styles.cardHeader}>
                      <View style={styles.cardTitleRow}>
                        <Text variant="titleMedium" style={styles.budgetName}>
                          {getSemesterIcon(budget.semester)} {budget.name}
                        </Text>
                        <Chip
                          style={[
                            styles.statusChip,
                            { backgroundColor: getStatusColor(budget.status) + '20' },
                          ]}
                          textStyle={{ color: getStatusColor(budget.status) }}
                        >
                          {getStatusLabel(budget.status)}
                        </Chip>
                      </View>
                    </View>

                    {budget.description && (
                      <Text
                        variant="bodySmall"
                        style={styles.budgetDescription}
                        numberOfLines={2}
                      >
                        {budget.description}
                      </Text>
                    )}

                    <View style={styles.budgetStats}>
                      <View style={styles.statItem}>
                        <Text variant="labelSmall" style={styles.statLabel}>
                          Income
                        </Text>
                        <Text variant="titleMedium" style={styles.incomeText}>
                          ${budget.total_income.toLocaleString()}
                        </Text>
                      </View>

                      <View style={styles.statDivider} />

                      <View style={styles.statItem}>
                        <Text variant="labelSmall" style={styles.statLabel}>
                          Expenses
                        </Text>
                        <Text variant="titleMedium" style={styles.expenseText}>
                          ${budget.total_expenses.toLocaleString()}
                        </Text>
                      </View>

                      <View style={styles.statDivider} />

                      <View style={styles.statItem}>
                        <Text variant="labelSmall" style={styles.statLabel}>
                          Net
                        </Text>
                        <Text
                          variant="titleMedium"
                          style={[
                            styles.netText,
                            {
                              color:
                                budget.net_position >= 0 ? '#059669' : '#DC2626',
                            },
                          ]}
                        >
                          ${budget.net_position.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              ))}
            </View>
          ))}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleCreateBudget}
        label="New Budget"
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
    color: '#6B7280',
    marginTop: spacing.xs,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  searchbar: {
    backgroundColor: '#FFFFFF',
    elevation: 0,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100, // Space for FAB
  },
  yearSection: {
    marginBottom: spacing.xl,
  },
  yearTitle: {
    fontWeight: '700',
    marginBottom: spacing.md,
    color: '#374151',
  },
  budgetCard: {
    marginBottom: spacing.md,
    borderRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: spacing.sm,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetName: {
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.sm,
  },
  statusChip: {
    height: 28,
  },
  budgetDescription: {
    color: '#6B7280',
    marginBottom: spacing.md,
  },
  budgetStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: '#6B7280',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  incomeText: {
    color: '#059669',
    fontWeight: '600',
  },
  expenseText: {
    color: '#DC2626',
    fontWeight: '600',
  },
  netText: {
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  emptyButton: {
    borderRadius: 12,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    borderRadius: 16,
  },
})

export default BudgetListScreen
