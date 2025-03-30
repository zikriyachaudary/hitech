import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AppColors,
  AppFonts,
  hv,
  normalized,
} from "../../../Utils/AppConstants";

const UnFilledButton = (props: any) => {
  return (
    <TouchableOpacity
      onPress={props?.onPress}
      activeOpacity={0.7}
      disabled={props?.isDisable}
    >
      <View style={{ ...styles.Container, ...props.mainContainer }}>
        {props?.isLoader ? (
          <ActivityIndicator color={AppColors.white.white} />
        ) : (
          <Text style={styles.buttonText}>{props.label}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  Container: {
    backgroundColor: AppColors.white.white,
    borderRadius: normalized(30),
    alignItems: "center",
    justifyContent: "center",
    height: hv(50),
    marginVertical: normalized(25),
    marginHorizontal: normalized(20),
    borderWidth: 1,
    borderColor: AppColors.themeColor.dark,
  },
  buttonText: {
    color: AppColors.themeColor.dark,
    fontSize: normalized(14),
    fontFamily: AppFonts.PoppinsMedium,
  },
});

export default UnFilledButton;
