import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

import TasksScreen from "../screens/tasks/TasksScreen";
// import NotificationsScreen from "../screens/notifications/NotificationsScreen";
// import ProjectsScreen from "../screens/projects/ProjectsScreen";

export type PrivateTabParamList = {
  Tasks: undefined;
  Notifications: undefined;
  Projects: undefined;
};

const Tab = createBottomTabNavigator<PrivateTabParamList>();

const PrivateNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: string = "home";

          if (route.name === "Tasks") iconName = "list";
          if (route.name === "Notifications") iconName = "notifications";
          if (route.name === "Projects") iconName = "folder";

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Tasks" component={TasksScreen} />
      {/* <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Projects" component={ProjectsScreen} /> */}
    </Tab.Navigator>
  );
};

export default PrivateNavigator;
