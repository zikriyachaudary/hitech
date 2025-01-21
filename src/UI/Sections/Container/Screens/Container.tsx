import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppColors, BottomBarList } from "../../../../Utils/AppConstants";
import BottomBar from "../../../Components/BottomBar/BottomBar";
import { useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import { setContainerStack } from "../State";

const Container = ({ navigation }: any) => {
  const selector = useSelector((state: AppRootStore) => state.SliceReducer);
  return (
    <View style={styles.Container}>
      {setContainerStack(selector?.currentTab)}
      <BottomBar
        bottomBarList={[...BottomBarList]}
        navigation={navigation}
        tab={selector?.currentTab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: AppColors.white.white,
    justifyContent: "flex-end",
  },
});

export default Container;
