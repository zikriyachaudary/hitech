import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppColors, normalized } from "../../../../Utils/AppConstants";
import {
  capitalizeFirstLetter,
  generateRandomColor,
} from "../../../../Utils/Helper";

const ProfilePlaceHolderComp = (props: any) => {
  return (
    <View
      style={[
        styles.mainContainer,
        {
          backgroundColor: generateRandomColor(props?.index ? props?.index : 0),
        },
        props?.mainStyles,
      ]}
    >
      <Text style={[styles.nameTxt, props?.nameStyles]}>
        {props?.name ? capitalizeFirstLetter(props?.name) : ""}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    height: normalized(60),
    width: normalized(60),
    borderRadius: normalized(60 / 2),
    justifyContent: "center",
  },
  nameTxt: {
    color: AppColors.white.white,
    textAlign: "center",
    alignSelf: "center",
    fontSize: normalized(16),
    fontWeight: "500",
  },
});
export default ProfilePlaceHolderComp;
