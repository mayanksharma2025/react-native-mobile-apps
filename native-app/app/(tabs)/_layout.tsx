// app/_layout.tsx
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#3498db' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { backgroundColor: '#fff' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="destination"
        options={{
          title: 'Destinations',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="+not-found"
        options={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // <-- hides the tab completely
          tabBarButton: () => null, // ensures no button appears
        }}
      />
    </Tabs>
  )
}
