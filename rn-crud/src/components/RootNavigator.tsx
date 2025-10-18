import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import { RootStackParamList } from '../navigation/types'
import UsersList from '../screens/UsersList'
import UserForm from '../screens/UserForm'
import PostsList from '../screens/PostsList'
import PostForm from '../screens/PostForm'
import CommentsList from '../screens/CommentsList'
import CommentForm from '../screens/CommentForm'

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator()

function UsersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UsersList"
        component={UsersList}
        options={{ title: 'Users' }}
      />
      <Stack.Screen
        name="UserForm"
        component={UserForm}
        options={{ title: 'Add / Edit User' }}
      />
    </Stack.Navigator>
  )
}

function PostsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PostsList"
        component={PostsList}
        options={{ title: 'Posts' }}
      />
      <Stack.Screen
        name="PostForm"
        component={PostForm}
        options={{ title: 'Add / Edit Post' }}
      />
    </Stack.Navigator>
  )
}

function CommentsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CommentsList"
        component={CommentsList}
        options={{ title: 'Comments' }}
      />
      <Stack.Screen
        name="CommentForm"
        component={CommentForm}
        options={{ title: 'Add / Edit Comment' }}
      />
    </Stack.Navigator>
  )
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="UsersList"
          component={UsersStack}
          options={{ title: 'Users' }}
        />
        <Tab.Screen
          name="PostsList"
          component={PostsStack}
          options={{ title: 'Posts' }}
        />
        <Tab.Screen
          name="CommentsList"
          component={CommentsStack}
          options={{ title: 'Comments' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
