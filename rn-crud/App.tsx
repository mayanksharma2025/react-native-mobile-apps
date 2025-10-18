import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import RootNavigator from './src/components/RootNavigator'

import { SnackbarProvider } from './src/components/SnackbarProvider'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60000, retry: 1 },
  },
})

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        {/* ✅ Wrap here */}
        <SnackbarProvider>
          <RootNavigator />
        </SnackbarProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  )
}
