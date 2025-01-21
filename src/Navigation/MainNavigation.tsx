import React from "react";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { Routes } from "../Utils/Routes";
import Container from "../UI/Sections/Container/Screens/Container";

const MainStack = createStackNavigator();

const MainNavigation = () => {
  return (
    <MainStack.Navigator
      initialRouteName={Routes.Main.container}
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: false,
      }}
    >
      <MainStack.Screen name={Routes.Main.container} component={Container} />
    </MainStack.Navigator>
  );
};

export default MainNavigation;
