import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  AppImages,
  normalized,
} from "../../../Utils/AppConstants";

const SimpleHeader = (props: any) => {
  const icons = props?.icon;
  return (
    <View style={[styles.container, { ...props?.containerStyle }]}>
      <Text style={[styles.forgetText, props?.titleStyle]}>
        {props?.Text ?? props?.title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: normalized(10),
    height: normalized(50),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: AppHorizontalMargin,
    borderWidth: 0.5,
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderRadius: normalized(50),
    shadowColor: AppColors.black.black,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    elevation: 1,
    shadowOpacity: 0.25,
    backgroundColor: AppColors.white.white,
  },
  imageCont: {
    width: normalized(47),
    height: normalized(47),
    backgroundColor: AppColors.white.white,
    borderRadius: normalized(47 / 2),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: AppColors.themeColor.dark,
  },
  arrowImage: {
    width: normalized(45),
    height: normalized(45),
    resizeMode: "contain",
  },
  forgetText: {
    fontFamily: AppFonts.PoppinsSemiBold,
    fontSize: normalized(17),
    color: AppColors.black.black,
    marginLeft: normalized(10),
    fontWeight: "600",
  },
  icon1: {
    width: normalized(24),
    height: normalized(24),
    tintColor: AppColors.themeColor.dark,
  },
});

export default SimpleHeader;
