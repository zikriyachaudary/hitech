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

const FilledButton = (props: any) => {
  return (
    <TouchableOpacity
      onPress={props?.onPress}
      activeOpacity={0.7}
      disabled={props?.isDisable}
    >
      <View
        style={{
          ...styles.Container,
          ...props.mainContainer,
          backgroundColor: props?.isDisable
            ? AppColors.grey.greyLevel2
            : AppColors.themeColor.dark,
        }}
      >
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
    borderRadius: normalized(30),
    alignItems: "center",
    justifyContent: "center",
    height: hv(50),
    marginVertical: normalized(25),
    marginHorizontal: normalized(20),
  },
  buttonText: {
    color: AppColors.white.white,
    fontSize: normalized(14),
    fontFamily: AppFonts.PoppinsMedium,
  },
});

export default FilledButton;
