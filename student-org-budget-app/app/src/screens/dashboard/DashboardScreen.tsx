// Dashboard Screen - Main hub with budget overview

import React, { useEffect } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Button, Text, Card, Chip, IconButton } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useAuthStore } from '../../stores/authStore'
import { useOrgStore } from '../../stores/orgStore'
import { useBudgetStore } from '../../stores/budgetStore'
import { spacing } from '../../theme'

export const DashboardScreen = () => {
  const navigation = useNavigation()
  const user = useAuthStore((state) => state.user)
  const currentOrg = useOrgStore((state) => state.currentOrg)
  const signOut = useAuthStore((state) => state.signOut)
  const budgets = useBudgetStore((state) => state.budgets)
  const loadBudgets = useBudgetStore((state) => state.loadBudgets)

  useEffect(() => {
    if (currentOrg) {
      loadBudgets(currentOrg.id)
    }
  }, [currentOrg?.id])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const handleViewBudgets = () => {
    navigation.navigate('BudgetList' as never)
  }

  const handleCreateBudget = () => {
    navigation.navigate('CreateBudget' as never)
  }

  const handleBudgetPress = (budgetId: string) => {
    navigation.navigate('BudgetDetails' as never, { budgetId } as never)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#059669'
      case 'active':
        return '#3B82F6'
      case 'archived':
        return '#6B7280'
      default:
        return '#F59E0B'
    }
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

  // Get recent budgets (top 3)
  const recentBudgets = budgets.slice(0, 3)

  // Calculate total across all active budgets
  const activeBudgets = budgets.filter((b) => b.status === 'active' || b.status === 'approved')
  const totalIncome = activeBudgets.reduce((sum, b) => sum + b.total_income, 0)
  const totalExpenses = activeBudgets.reduce((sum, b) => sum + b.total_expenses, 0)
  const totalNet = totalIncome - totalExpenses

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
          <Card style={styles.orgCard}>
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

        {/* Budget Summary */}
        {activeBudgets.length > 0 && (
          <Card style={styles.summaryCard}>
            <Card.Content>
              <View style={styles.summaryHeader}>
                <Text variant="titleMedium" style={styles.summaryTitle}>
                  Active Budgets Summary
                </Text>
                <Text variant="bodySmall" style={styles.summarySubtitle}>
                  {activeBudgets.length} active budget{activeBudgets.length !== 1 ? 's' : ''}
                </Text>
              </View>

              <View style={styles.summaryStats}>
                <View style={styles.statItem}>
                  <Text variant="labelSmall" style={styles.statLabel}>
                    TOTAL INCOME
                  </Text>
                  <Text variant="headlineSmall" style={styles.incomeText}>
                    ${totalIncome.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <Text variant="labelSmall" style={styles.statLabel}>
                    TOTAL EXPENSES
                  </Text>
                  <Text variant="headlineSmall" style={styles.expenseText}>
                    ${totalExpenses.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <Text variant="labelSmall" style={styles.statLabel}>
                    NET
                  </Text>
                  <Text
                    variant="headlineSmall"
                    style={[
                      styles.netText,
                      { color: totalNet >= 0 ? '#059669' : '#DC2626' },
                    ]}
                  >
                    ${totalNet.toLocaleString()}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Quick Actions
          </Text>

          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={handleCreateBudget}
              icon="plus"
              style={styles.actionButton}
            >
              New Budget
            </Button>
            <Button
              mode="outlined"
              onPress={handleViewBudgets}
              icon="file-document-multiple"
              style={styles.actionButton}
            >
              View All
            </Button>
          </View>
        </View>

        {/* Recent Budgets */}
        {recentBudgets.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Recent Budgets
              </Text>
              <Button mode="text" onPress={handleViewBudgets} compact>
                See All
              </Button>
            </View>

            {recentBudgets.map((budget) => (
              <Card
                key={budget.id}
                style={styles.budgetCard}
                onPress={() => handleBudgetPress(budget.id)}
              >
                <Card.Content>
                  <View style={styles.budgetCardHeader}>
                    <View style={styles.budgetCardTitle}>
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
                        {budget.status}
                      </Chip>
                    </View>
                  </View>

                  <View style={styles.budgetCardStats}>
                    <View style={styles.budgetStat}>
                      <Text variant="labelSmall" style={styles.budgetStatLabel}>
                        Income
                      </Text>
                      <Text variant="titleSmall" style={styles.incomeText}>
                        ${budget.total_income.toLocaleString()}
                      </Text>
                    </View>

                    <View style={styles.budgetStat}>
                      <Text variant="labelSmall" style={styles.budgetStatLabel}>
                        Expenses
                      </Text>
                      <Text variant="titleSmall" style={styles.expenseText}>
                        ${budget.total_expenses.toLocaleString()}
                      </Text>
                    </View>

                    <View style={styles.budgetStat}>
                      <Text variant="labelSmall" style={styles.budgetStatLabel}>
                        Net
                      </Text>
                      <Text
                        variant="titleSmall"
                        style={[
                          styles.netText,
                          { color: budget.net_position >= 0 ? '#059669' : '#DC2626' },
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
        )}

        {/* Empty State */}
        {budgets.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
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
            </Card.Content>
          </Card>
        )}

        {/* Coming Soon Features */}
        <Card style={styles.comingSoonCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.comingSoon}>
              🚧 Coming Soon!
            </Text>
            <Text variant="bodyMedium" style={styles.comingSoonText}>
              We're building amazing features for you:
            </Text>
            <View style={styles.featureList}>
              <Text variant="bodyMedium">• Event Management</Text>
              <Text variant="bodyMedium">• Expense Tracking with Receipts</Text>
              <Text variant="bodyMedium">• Professional PDF Reports</Text>
              <Text variant="bodyMedium">• Team Collaboration</Text>
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
    marginBottom: spacing.sm,
  },
  title: {
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: '#6B7280',
  },
  orgCard: {
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
  summaryCard: {
    borderRadius: 12,
    elevation: 3,
    backgroundColor: '#FFFFFF',
  },
  summaryHeader: {
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  summarySubtitle: {
    color: '#6B7280',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: '#6B7280',
    marginBottom: spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: spacing.sm,
  },
  incomeText: {
    color: '#059669',
    fontWeight: '700',
  },
  expenseText: {
    color: '#DC2626',
    fontWeight: '700',
  },
  netText: {
    fontWeight: '700',
  },
  quickActions: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
  },
  section: {
    marginTop: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  budgetCard: {
    marginBottom: spacing.md,
    borderRadius: 12,
    elevation: 2,
  },
  budgetCardHeader: {
    marginBottom: spacing.md,
  },
  budgetCardTitle: {
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
  budgetCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  budgetStat: {
    flex: 1,
    alignItems: 'center',
  },
  budgetStatLabel: {
    color: '#6B7280',
    marginBottom: spacing.xs,
  },
  emptyCard: {
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  emptyContent: {
    alignItems: 'center',
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
  comingSoonCard: {
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#93C5FD',
    marginTop: spacing.md,
  },
  comingSoon: {
    textAlign: 'center',
    marginBottom: spacing.md,
    color: '#1E40AF',
  },
  comingSoonText: {
    color: '#1E3A8A',
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
