import { Tabs } from 'expo-router'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { useFonts } from 'expo-font'
import { useColorScheme } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

export default function RootLayout() {
  const colorScheme = useColorScheme()

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  if (!loaded) return null

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
          // headerShown: true, // show header on each tab
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Resume Form',
            // headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="pencil" color={color} size={size} />
            ),
          }}
        />

        <Tabs.Screen
          name="ShowCV"
          options={{
            title: 'Your CV',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="id-card" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="+not-found"
          options={{
            title: 'Not Found',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome
                name="exclamation-triangle"
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tabs>
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}
