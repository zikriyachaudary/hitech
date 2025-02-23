import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  AppColors,
  AppFonts,
  normalized,
} from "../../../../Utils/AppConstants";
import GoldScreen from "./GoldScreen";
import SilverScreen from "./SilverScreen";

const Tab = createMaterialTopTabNavigator();

const GoldNSilverTopTapNav = (props: any) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: {
          backgroundColor: AppColors.themeColor.dark,
          height: normalized(3.5),
          borderRadius: 10,
          position: "absolute",
          bottom: -2,
        },
        tabBarStyle: {
          elevation: 0,
          borderBottomColor: AppColors.grey.greyLevel2,
          borderBottomWidth: 1,
          marginTop: normalized(5),
          marginHorizontal: normalized(20),
        },
        tabBarLabelStyle: {
          textTransform: "none",
          fontSize: normalized(13),
          fontFamily: AppFonts.PoppinsMedium,
        },
        tabBarItemStyle: {
          marginHorizontal: normalized(-7),
        },
        tabBarActiveTintColor: AppColors.themeColor.dark,
        tabBarInactiveTintColor: AppColors.black.black,
        tabBarPressColor: "transparent",
      }}
    >
      <Tab.Screen
        name="Silver Users"
        children={() => (
          <SilverScreen
            silverUsers={props?.silverUsers}
            onUpdateDriverStatus={props?.onUpdateDriverStatus}
          />
        )}
      />

      <Tab.Screen
        name="Gold Users"
        children={() => <GoldScreen goldUsers={props?.goldUsers} />}
      />
    </Tab.Navigator>
  );
};

export default GoldNSilverTopTapNav;

const styles = StyleSheet.create({});
