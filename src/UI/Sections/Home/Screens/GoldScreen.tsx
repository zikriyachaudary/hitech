import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import { useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";

const GoldScreen = (props: any) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;

  return (
    <View style={AppStyles.MainStyle}>
      <Text>GoldScreen</Text>
    </View>
  );
};

export default GoldScreen;

const styles = StyleSheet.create({});
