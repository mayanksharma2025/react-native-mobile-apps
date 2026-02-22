// src/app/AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SignInScreen } from "@/app/features/auth/screens/SignInScreen";
import { SignUpScreen } from "@/app/features/auth/screens/SignUpScreen";
import { ProfileScreen } from "@/app/features/auth/screens/ProfileScreen";
import { PostsListScreen } from "./features/auth/screens/PostsListScreen";
import { EditPostScreen } from "./features/auth/screens/EditPostScreen";
import { useAuth } from "@/src/core/contexts/AuthContext";

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return null; // optionally a splash/loading screen

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Posts" component={PostsListScreen} />
            <Stack.Screen
              name="EditPost"
              component={EditPostScreen}
              options={{ title: "New / Edit Post" }}
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
