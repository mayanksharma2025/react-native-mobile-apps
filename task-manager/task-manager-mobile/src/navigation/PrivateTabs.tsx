import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TasksScreen from "../screens/tasks/TasksScreen";
import CreateTaskScreen from "../screens/tasks/CreateTaskScreen";
import { Text, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import ProfileScreen from "../screens/ProfileScreen";
import AdminEditUserScreen from "../screens/AdminEditUserScreen";

export type PrivateTabParamList = {
  Tasks: undefined;
  Profile: undefined;
  CreateTask: undefined;
  Logout: undefined;
};

const Tab = createBottomTabNavigator<PrivateTabParamList>();

// const ProfileScreen: React.FC = () => {
//   return (
//     <Text style={{ flex: 1, textAlign: "center", marginTop: 50 }}>Profile</Text>
//   );
// };

const PrivateTabs: React.FC = () => {
  const { setUser } = useContext(AuthContext);

  const navigation = useNavigation<any>();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setUser(null);
    await AsyncStorage.clear();

    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: "Login" }],
    // });
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: "#999",
      }}
    >
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="CreateTask" component={CreateTaskScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />

      {/* <Tab.Screen
        name="AdminEditUser"
        component={AdminEditUserScreen}
        options={{
          tabBarButton: () => null, // hides button
          tabBarStyle: { display: "none" }, // optional (see note below)
        }}
      /> */}

      {/* Logout Tab */}
      <Tab.Screen
        name="Logout"
        component={() => null}
        listeners={{
          tabPress: async (e) => {
            e.preventDefault();
            await handleLogout();
          },
        }}
      />
      {/* <Tab.Screen
        name="Logout"
        component={() => null}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();

            Alert.alert("Logout", "Are you sure you want to logout?", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Logout",
                style: "destructive",
                onPress: handleLogout,
              },
            ]);
          },
        }}
      /> */}
    </Tab.Navigator>
  );
};

export default PrivateTabs;
