import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PublicTabs from "./PublicTabs";
import PrivateTabs from "./PrivateTabs";
import { AuthContext } from "../context/AuthContext";
import SplashScreen from "../screens/SplashScreen"; // optional loading screen
import { ITask } from "../types/task.types";
import AdminEditUserScreen from "../screens/AdminEditUserScreen";

export type RootStackParamList = {
  Auth: undefined;
  Public: undefined;
  Private: undefined;
  CreateTask: { task?: ITask }; // optional for editing  Login: undefined;
  Register: undefined;
  Login: undefined;
  Tasks: undefined;
  PrivateTabs: undefined;
  AdminEditUser: { userId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { user } = useContext(AuthContext);

  // if (loading) {
  //   return <SplashScreen />; // render nothing or splash while loading
  // }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Private" component={PrivateTabs} />
            <Stack.Screen
              name="AdminEditUser"
              component={AdminEditUserScreen}
            />
          </>
        ) : (
          <Stack.Screen name="Public" component={PublicTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
