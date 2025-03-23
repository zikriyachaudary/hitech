import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Routes } from "../Utils/Routes";
import HomeScreen from "../UI/Sections/Home/Screens/HomeScreen";
import OrderScreen from "../UI/Sections/Orders/Screens/OrderScreen";
import NotificationScreen from "../UI/Sections/Notifications/Screens/NotificationScreen";
import ProfileScreen from "../UI/Sections/Profile/Screens/ProfileScreen";
import ChatScreen from "../UI/Sections/Chat/Screens/ChatScreen";
import ChatListing from "../UI/Sections/Chat/Screens/ChatListing";
const Stack = createNativeStackNavigator();

export const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.Home.HomeScreen}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={Routes.Home.HomeScreen} component={HomeScreen} />
    </Stack.Navigator>
  );
};

export const OrderStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.Home.OrderScreen}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={Routes.Home.OrderScreen} component={OrderScreen} />
    </Stack.Navigator>
  );
};

export const NotificationStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.Home.NotificationScreen}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={Routes.Home.NotificationScreen}
        component={NotificationScreen}
      />
    </Stack.Navigator>
  );
};

export const ProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.Home.ProfileScreen}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={Routes.Home.ProfileScreen}
        component={ProfileScreen}
      />
    </Stack.Navigator>
  );
};

export const ChatStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={"ChatListing"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={"ChatListing"} component={ChatListing} />
    </Stack.Navigator>
  );
};

export default {
  HomeStack,
  OrderStack,
  NotificationStack,
  ProfileStack,
};
