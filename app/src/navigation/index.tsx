// Navigation Structure

import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAuthStore } from '../stores/authStore'
import { useOrgStore } from '../stores/orgStore'

// Auth Screens
import WelcomeScreen from '../screens/auth/WelcomeScreen'
import LoginScreen from '../screens/auth/LoginScreen'
import SignUpScreen from '../screens/auth/SignUpScreen'
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen'
import CreateOrganizationScreen from '../screens/auth/CreateOrganizationScreen'

// Main Screens
import DashboardScreen from '../screens/dashboard/DashboardScreen'

// Navigation Types
export type AuthStackParamList = {
  Welcome: undefined
  Login: undefined
  SignUp: undefined
  ForgotPassword: undefined
  CreateOrganization: undefined
}

export type MainStackParamList = {
  Dashboard: undefined
}

const AuthStack = createNativeStackNavigator<AuthStackParamList>()
const MainStack = createNativeStackNavigator<MainStackParamList>()

// Auth Navigator (for non-authenticated users)
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStack.Screen name="CreateOrganization" component={CreateOrganizationScreen} />
    </AuthStack.Navigator>
  )
}

// Main Navigator (for authenticated users)
const MainNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1E40AF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <MainStack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
    </MainStack.Navigator>
  )
}

// Root Navigator (switches between Auth and Main)
export const RootNavigator = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const currentOrg = useOrgStore((state) => state.currentOrg)

  // If authenticated but no org, show create organization screen
  if (isAuthenticated && !currentOrg) {
    return (
      <NavigationContainer>
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="CreateOrganization" component={CreateOrganizationScreen} />
        </AuthStack.Navigator>
      </NavigationContainer>
    )
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  )
}

export default RootNavigator
