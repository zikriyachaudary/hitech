import React, { forwardRef } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  AppColors,
  AppFonts,
  normalized,
} from "../../../../Utils/AppConstants";
import PendingOrdersScreen from "./PendingOrdersScreen";
import DispatchedOrdersScreen from "./DispatchedOrdersScreen";

const Tab = createMaterialTopTabNavigator();

const OrdersTopTabNav = (props: any) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: {
          backgroundColor: AppColors.red.dark,
          height: normalized(3.5),
          borderRadius: 10,
          position: "absolute",
          bottom: -3,
        },
        tabBarStyle: {
          elevation: 0,
          borderBottomColor: AppColors.grey.greyLevel2,
          borderBottomWidth: 1,
        },
        tabBarLabelStyle: {
          textTransform: "none",
          fontSize: normalized(14),
          fontFamily: AppFonts.PoppinsMedium,
        },
        tabBarActiveTintColor: AppColors.red.dark,
        tabBarInactiveTintColor: AppColors.black.black,
        tabBarPressColor: "transparent",
      }}
    >
      <Tab.Screen
        name="Pending Orders"
        children={() => (
          <PendingOrdersScreen
            pendingOrders={props?.pendingOrders}
            handleRefresh={props?.handleRefresh}
            refreshing={props?.refreshing}
          />
        )}
      />
      <Tab.Screen
        name="Dispatched Orders"
        children={() => (
          <DispatchedOrdersScreen
            dispatchOrders={props?.dispatchOrders}
            handleRefresh={props?.handleRefresh}
            refreshing={props?.refreshing}
          />
        )}
      />
    </Tab.Navigator>
  );
};

export default OrdersTopTabNav;
