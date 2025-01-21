import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AuthStack from "./Navigation/AuthStack";
import { AppStyles } from "./Utils/AppStyles";
import { useSelector } from "react-redux";
import { AppRootStore } from "./Redux/store/AppStore";
import MainNavigation from "./Navigation/MainNavigation";

const AppContainer = () => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );

  return (
    <View style={AppStyles.MainStyle}>
      {selector?.userData ? <MainNavigation /> : <AuthStack />}
    </View>
  );
};

export default AppContainer;

const styles = StyleSheet.create({});
