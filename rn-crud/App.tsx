import React, { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import RootNavigator from './src/components/RootNavigator'

import { SnackbarProvider } from './src/components/SnackbarProvider'

import { makeServer } from './src/api/mockServer'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60000, retry: 1 },
  },
})

export default function App() {
  useEffect(() => {
    // MirageJS expects window.fetch; patch it to globalThis
    if (typeof globalThis.window === 'undefined') {
      ;(globalThis as any).window = globalThis
    }

    // Start Mirage server
    makeServer()
  }, [])

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
