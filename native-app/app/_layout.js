import React, { useContext } from 'react'
import { Stack } from 'expo-router'
import { AppProvider, AppContext } from '../_context/AppContext'

function MainLayout() {
  const { user } = useContext(AppContext)

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? <Stack.Screen name="(tabs)" /> : <Stack.Screen name="(auth)" />}
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  )
}
