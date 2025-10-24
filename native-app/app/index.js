import { useEffect, useContext } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { AppContext } from '../_context/AppContext'
import { router } from 'expo-router'

export default function Index() {
  const { user, isLoading } = useContext(AppContext)

  useEffect(() => {
    if (!isLoading) {
      // wait until context is initialized
      if (user) {
        router.replace('/(tabs)/home') // redirect to home tab
      } else {
        router.replace('/(auth)/login') // redirect to login
      }
    }
  }, [user, isLoading])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#2a9d8f" />
    </View>
  )
}
