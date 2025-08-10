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
import UpdateDeliveryScreen from "../UI/Sections/Profile/Screens/UpdateDeliveryScreen";
import AddProducScreen from "../UI/Sections/Home/Screens/AddProducScreen";
import ManageProductScreen from "../UI/Sections/Home/Screens/ManageProductScreen";
import ManageCategories from "../UI/Sections/Home/Screens/ManageCategories";
import AddAdminScreen from "../UI/Sections/Home/Screens/AddAdminScreen";
import OTPScreen from "../UI/Sections/Home/Screens/OTPScreen";
import AddCategoryScreen from "../UI/Sections/Home/Screens/AddCategoryScreen";
import EditProfileScreen from "../UI/Sections/Profile/Screens/EditProfileScreen";
import LanguageScreen from "../UI/Sections/Profile/Screens/LanguageScreen";
import GoldNSilverScreen from "../UI/Sections/Home/Screens/GoldNSilverScreen";
import UserOrderDetailScreen from "../UI/Sections/Home/Screens/UserOrderDetailScreen";
import OrderDetailScreen from "../UI/Sections/Orders/Screens/OrderDetailScreen";
import ChangePasswordScreen from "../UI/Sections/Profile/Screens/ChangePasswordScreen";
import PaymentMethodScreen from "../UI/Sections/Cart/Screens/PaymentMethodScreen";
import RecieptScreen from "../UI/Sections/Reciept/Screens/RecieptScreen";
import CardDetailsFormPage from "../UI/Sections/Cart/Screens/CardDetailFormPage";
import DeliveryScreen from "../UI/Sections/Cart/Screens/DeliveryScreen";

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
      <MainStack.Screen
        name={Routes.Home.UpdateDelivery}
        component={UpdateDeliveryScreen}
      />
      <MainStack.Screen
        name={Routes.Admin.AddProducts}
        component={AddProducScreen}
      />
      <MainStack.Screen
        name={Routes.Admin.ManagePrducts}
        component={ManageProductScreen}
      />
      <MainStack.Screen
        name={Routes.Admin.ManageCategories}
        component={ManageCategories}
      />
      <MainStack.Screen
        name={Routes.Admin.AddAdmins}
        component={AddAdminScreen}
      />
      <MainStack.Screen name={Routes.OtpScreen} component={OTPScreen} />
      <MainStack.Screen
        name={Routes.Admin.AddCategory}
        component={AddCategoryScreen}
      />
      <MainStack.Screen
        name={Routes.Home.EditProfile}
        component={EditProfileScreen}
      />
      <MainStack.Screen
        name={Routes.Home.Language}
        component={LanguageScreen}
      />
      <MainStack.Screen
        name={Routes.Admin.GoldNSilverScreen}
        component={GoldNSilverScreen}
      />
      <MainStack.Screen
        name={Routes.Admin.UserOrderDetail}
        component={UserOrderDetailScreen}
      />
      <MainStack.Screen
        name={Routes.Home.OrderDetailScreen}
        component={OrderDetailScreen}
      />
      <MainStack.Screen
        name={Routes.Home.ChangePassword}
        component={ChangePasswordScreen}
      />
      <MainStack.Screen
        name={Routes.Home.PaymentMethodScreen}
        component={PaymentMethodScreen}
      />
      <MainStack.Screen
        name={Routes.Home.RecieptScreen}
        component={RecieptScreen}
      />
      <MainStack.Screen
        name={Routes.Home.CardDetailFormPage}
        component={CardDetailsFormPage}
      />
      <MainStack.Screen
        name={Routes.Home.DeliveryScreen}
        component={DeliveryScreen}
      />
    </MainStack.Navigator>
  );
};

export default MainNavigation;
