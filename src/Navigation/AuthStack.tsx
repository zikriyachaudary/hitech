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
import OTPScreen from "../UI/Sections/Home/Screens/OTPScreen";
import WelcomeScreen from "../UI/Sections/Welcome/Screens/WelcomeScreen";
import OtpVerificationScreen from "../UI/Sections/Auth/Screens/OtpVerificationScreen";
import NewPasswordScreen from "../UI/Sections/Auth/Screens/NewPasswordScreen";
import ShopUserSignupScreen from "../UI/Sections/Auth/Screens/ShopUserSignupScreen";

const Stack = createStackNavigator();
const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.Auth.welcome}
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name={Routes.Auth.welcome} component={WelcomeScreen} />
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
      <Stack.Screen name={Routes.Auth.subAdmin} component={OTPScreen} />
      <Stack.Screen
        name={Routes.Auth.otpVerificationScreen}
        component={OtpVerificationScreen}
      />
      <Stack.Screen
        name={Routes.Auth.newPasswordScreen}
        component={NewPasswordScreen}
      />
      <Stack.Screen
        name={Routes.Auth.shopUserSignupScreen}
        component={ShopUserSignupScreen}
      />
    </Stack.Navigator>
  );
};
export default AuthStack;
