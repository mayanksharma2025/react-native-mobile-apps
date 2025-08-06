import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Button, Text } from 'react-native'

const Tab = createBottomTabNavigator()

const HomeScreen = ({ navigation }: any) => (
  <Button
    title="Go to Jane's profile"
    onPress={() => navigation.navigate('Profile', { name: 'Jane' })}
  />
)

const ProfileScreen = ({ route }: any) => (
  <Text>This is {route.params?.name}'s profile</Text>
)

const App = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: 'Welcome' }}
    />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
)

export default App
