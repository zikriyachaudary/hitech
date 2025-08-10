import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import {
  AppColors,
  AppFonts,
  hv,
  normalized,
} from "../../../Utils/AppConstants";

const GreenBtn = (props: any) => {
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
            : AppColors.white.white,
        }}
      >
        {props?.isLoader ? (
          <ActivityIndicator color={AppColors.green.dark} />
        ) : (
          <Text style={styles.buttonText}>{props.text}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default GreenBtn;

const styles = StyleSheet.create({
  Container: {
    borderRadius: normalized(10),
    alignItems: "center",
    justifyContent: "center",
    height: hv(50),
    marginVertical: normalized(25),
    marginHorizontal: normalized(20),
    borderWidth: 2,
    borderColor: AppColors.green.dark,
  },
  buttonText: {
    color: AppColors.green.dark,
    fontSize: normalized(15),
    fontFamily: AppFonts.PoppinsSemiBold,
  },
});
