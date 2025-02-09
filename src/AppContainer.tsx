import { StyleSheet, View } from "react-native";
import React from "react";
import AuthStack from "./Navigation/AuthStack";
import { AppStyles } from "./Utils/AppStyles";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStore } from "./Redux/store/AppStore";
import MainNavigation from "./Navigation/MainNavigation";
import AppLoader from "./UI/Components/AppLoader";
import ToastComp from "./UI/Components/ToastComp";
import { setIsAlertShow } from "./Redux/Reducers/AppReducers";
import AlertModal from "./UI/Components/CustomModal/AlertModal";

const AppContainer = () => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const dispatch = useDispatch();

  return (
    <View style={AppStyles.MainStyle}>
      {selector?.isLoaderStart && <AppLoader />}
      {selector?.showToast?.message !== "" ? <ToastComp /> : null}
      {selector?.isAlertShow?.value && (
        <AlertModal
          visible={selector?.isAlertShow?.value}
          onPress={() => {
            dispatch(setIsAlertShow({ value: false, message: "" }));
          }}
          message={selector?.isAlertShow?.message}
        />
      )}
      {selector?.userData ? <MainNavigation /> : <AuthStack />}
    </View>
  );
};

export default AppContainer;

const styles = StyleSheet.create({});
