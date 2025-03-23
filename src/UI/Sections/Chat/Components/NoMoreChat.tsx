import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppColors, normalized } from "../../../../Utils/AppConstants";

const NoMoreChat = (props: any) => {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.message}>{props?.message}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: AppColors.grey.greyLevel10,
    height: normalized(30),
    alignItems: "center",
  },
  message: {
    color: AppColors.grey.greyLevel10,
    justifyContent: "center",
  },
});
export default NoMoreChat;
