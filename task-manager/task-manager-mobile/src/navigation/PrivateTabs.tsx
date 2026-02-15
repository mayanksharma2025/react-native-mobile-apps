import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TasksScreen from "../screens/tasks/TasksScreen";
import { Text } from "react-native";
import CreateTaskScreen from "../screens/tasks/CreateTaskScreen";

export type PrivateTabParamList = {
  Tasks: undefined;
  Profile: undefined;
  CreateTask: undefined;
};

const Tab = createBottomTabNavigator<PrivateTabParamList>();

const ProfileScreen: React.FC = () => {
  return (
    <Text style={{ flex: 1, textAlign: "center", marginTop: 50 }}>Profile</Text>
  );
};

const PrivateTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: "#999",
      }}
    >
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="CreateTask" component={CreateTaskScreen} />
    </Tab.Navigator>
  );
};

export default PrivateTabs;
