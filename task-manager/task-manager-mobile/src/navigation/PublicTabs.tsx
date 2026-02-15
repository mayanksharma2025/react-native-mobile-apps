// src/navigation/PublicTabs.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import TasksScreen from "../screens/tasks/TasksScreen";

export type PublicTabParamList = {
  Login: undefined;
  Register: undefined;
  Tasks: undefined;
};

const Tab = createBottomTabNavigator<PublicTabParamList>();

const PublicTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: "#999",
      }}
    >
      <Tab.Screen name="Login" component={LoginScreen} />
      <Tab.Screen name="Register" component={RegisterScreen} />
      {/* <Tab.Screen name="Tasks" component={TasksScreen} /> */}
    </Tab.Navigator>
  );
};

export default PublicTabs;
