import React from "react";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { Routes } from "../Utils/Routes";
import Container from "../UI/Sections/Container/Screens/Container";
import ProductDetailScreen from "../UI/Sections/Home/Screens/ProductDetailScreen";
import CartScreen from "../UI/Sections/Cart/Screens/CartScreen";
import DeliveryAddressScreen from "../UI/Sections/Profile/Screens/DeliveryAddressScreen";

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
      <MainStack.Screen
        name={Routes.Home.productDetail}
        component={ProductDetailScreen}
      />
      <MainStack.Screen name={Routes.Home.cartScreen} component={CartScreen} />
      <MainStack.Screen
        name={Routes.Home.DeliveryAddress}
        component={DeliveryAddressScreen}
      />
    </MainStack.Navigator>
  );
};

export default MainNavigation;
