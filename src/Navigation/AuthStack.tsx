import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { Routes } from "../Utils/Routes";
import Login from "../UI/Sections/Auth/Screens/Login";
import Signup from "../UI/Sections/Auth/Screens/Signup";
import ForgotPassword from "../UI/Sections/Auth/Screens/ForgotPassword";
import SocialAuthScreen from "../UI/Sections/Auth/Screens/SocialAuthScreen";

const Stack = createStackNavigator();
const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.Auth.login}
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name={Routes.Auth.login} component={Login} />
      <Stack.Screen name={Routes.Auth.signup} component={Signup} />
      <Stack.Screen
        name={Routes.Auth.forgerPassword}
        component={ForgotPassword}
      />
      <Stack.Screen
        name={Routes.Auth.socialAuthScreen}
        component={SocialAuthScreen}
      />
    </Stack.Navigator>
  );
};
export default AuthStack;
