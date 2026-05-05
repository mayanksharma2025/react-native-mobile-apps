// src/app/AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SignInScreen } from "@/features/auth/screens/SignInScreen";
import { SignUpScreen } from "@/features/auth/screens/SignUpScreen";
import { ProfileScreen } from "@/features/auth/screens/ProfileScreen";
import { useAuth } from "@/src/core/contexts/AuthContext";
import { PostsListScreen } from "./features/auth/screens/PostsListScreen";
import { EditPostScreen } from "./features/auth/screens/EditPostScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* -------- Bottom Tabs (After Login) -------- */
const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Posts" component={PostsListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

/* -------- Root Navigator -------- */
export const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
              name="EditPost"
              component={EditPostScreen}
              options={{ headerShown: true, title: "New / Edit Post" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
