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
    height: normalized(44),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: AppHorizontalMargin,
    borderWidth: 1,
    borderRadius: normalized(50),
    backgroundColor: AppColors.white.white,
    borderColor: AppColors.grey.greyLevel1,
  },
  forgetText: {
    fontFamily: AppFonts.PoppinsSemiBold,
    fontSize: normalized(15),
    color: AppColors.black.black,
    marginLeft: normalized(10),
    fontWeight: "600",
  },
});

export default SimpleHeader;
