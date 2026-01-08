// Theme Configuration - React Native Paper + Custom Theme

import { MD3LightTheme as DefaultTheme, configureFonts } from 'react-native-paper'
import type { MD3Theme } from 'react-native-paper'

// Custom color palette - University-friendly blues and grays
const colors = {
  // Primary - Professional blue
  primary: '#1E40AF', // Blue 800
  primaryContainer: '#DBEAFE', // Blue 100
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#1E3A8A',

  // Secondary - Accent teal
  secondary: '#0891B2', // Cyan 600
  secondaryContainer: '#CFFAFE', // Cyan 100
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#164E63',

  // Tertiary - Success green
  tertiary: '#059669', // Green 600
  tertiaryContainer: '#D1FAE5', // Green 100
  onTertiary: '#FFFFFF',
  onTertiaryContainer: '#065F46',

  // Error - Red
  error: '#DC2626', // Red 600
  errorContainer: '#FEE2E2', // Red 100
  onError: '#FFFFFF',
  onErrorContainer: '#991B1B',

  // Background & Surface
  background: '#F9FAFB', // Gray 50
  onBackground: '#111827', // Gray 900
  surface: '#FFFFFF',
  onSurface: '#111827',
  surfaceVariant: '#F3F4F6', // Gray 100
  onSurfaceVariant: '#6B7280', // Gray 500

  // Outline & Borders
  outline: '#D1D5DB', // Gray 300
  outlineVariant: '#E5E7EB', // Gray 200

  // Inverse (for dark elements on light backgrounds)
  inverseSurface: '#1F2937', // Gray 800
  inverseOnSurface: '#F9FAFB',
  inversePrimary: '#93C5FD', // Blue 300

  // Custom additions
  success: '#059669', // Green 600
  warning: '#F59E0B', // Amber 500
  info: '#3B82F6', // Blue 500

  // Budget-specific colors
  income: '#059669', // Green for income
  expense: '#DC2626', // Red for expenses
  neutral: '#6B7280', // Gray for neutral/balanced
}

// Font configuration
const fontConfig = {
  displayLarge: {
    fontFamily: 'System',
    fontSize: 57,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: 'System',
    fontSize: 45,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 44,
  },
  headlineLarge: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineSmall: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 32,
  },
  titleLarge: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  bodyLarge: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  labelLarge: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelSmall: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
}

// Custom theme extending Material Design 3
export const theme: MD3Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...colors,
  },
  fonts: configureFonts({ config: fontConfig }),
  roundness: 12, // Slightly rounded corners
}

// Spacing constants (multiples of 4)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const

// Common dimensions
export const dimensions = {
  inputHeight: 56,
  buttonHeight: 48,
  iconSize: 24,
  avatarSize: 40,
  headerHeight: 56,
  tabBarHeight: 60,
} as const

// Shadow styles
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
} as const

// Budget status colors
export const getBudgetStatusColor = (percentSpent: number): string => {
  if (percentSpent < 50) return colors.success // Green - on track
  if (percentSpent < 85) return colors.warning // Yellow - warning
  return colors.error // Red - over budget
}

// Net position color (positive = green, negative = red)
export const getNetPositionColor = (amount: number): string => {
  if (amount > 0) return colors.success
  if (amount < 0) return colors.error
  return colors.neutral
}

export default theme
