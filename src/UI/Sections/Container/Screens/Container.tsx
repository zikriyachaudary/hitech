import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppColors, AppImages } from "../../../../Utils/AppConstants";
import BottomBar from "../../../Components/BottomBar/BottomBar";
import { useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import { setContainerStack } from "../State";

const Container = ({ navigation }: any) => {
  const selector = useSelector((state: AppRootStore) => state.SliceReducer);

  const BottomBarList = [
    {
      icon: AppImages.bottomBar.home,
      title: selector?.isRtl ? "ہوم" : "Home",
    },
    {
      icon: AppImages.bottomBar.orders,
      title: selector?.isRtl ? "آرڈرز" : "Orders",
    },
    {
      icon: AppImages.bottomBar.notification,
      title: selector?.isRtl ? "نوٹیفیکیشن" : "Notifications",
    },
    {
      icon: AppImages.bottomBar.profile,
      title: selector?.isRtl ? "پروفائل" : "Profile",
    },
  ];

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
