import React from "react";
import { View, ActivityIndicator } from "react-native";
import { AppColors, normalized } from "../../Utils/AppConstants";
import LoaderKit from "react-native-loader-kit";
import AppStatusBar from "./SocialButton/AppStatusBar";

const AppLoader = (props: any) => {
  return (
    <View
      style={{
        backgroundColor: "rgba(0,0,0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        elevation: 3,
        zIndex: 100,
      }}
    >
      <AppStatusBar backgroundColor="rgba(0,0,0,0.5)" />
      <View
        style={{
          backgroundColor: "white",
          width: 80,
          height: 80,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
        }}
      >
        <LoaderKit
          style={{ width: normalized(50), height: normalized(50) }}
          name={"BallSpinFadeLoader"}
          color={AppColors.themeColor.dark}
        />
      </View>
    </View>
  );
};

export default AppLoader;
