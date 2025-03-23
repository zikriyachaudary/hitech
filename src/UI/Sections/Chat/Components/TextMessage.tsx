import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { AppColors } from "../../../../Utils/AppConstants";

const TextMessage = (props: any) => {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.container,
        props?.isSender && styles.sender,
        {
          alignItems: props?.isMyMessage ? "flex-end" : "flex-start",
          backgroundColor: props?.isMyMessage
            ? AppColors.white.white
            : AppColors.themeColor.light,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: props?.isMyMessage
              ? AppColors.black.black
              : AppColors.white.white,
          },
          props?.isSender && styles.senderText,
        ]}
      >
        {props?.content}
      </Text>
    </View>
  );
};

export default TextMessage;

const styles = StyleSheet.create({
  container: {
    maxWidth: Dimensions.get("window").width * 0.8,
    padding: 10,
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 16,
  },
  text: {
    fontSize: 15,
  },
  senderText: {
    color: "white",
  },
  sender: {
    backgroundColor: "#0084ff",
  },
});
