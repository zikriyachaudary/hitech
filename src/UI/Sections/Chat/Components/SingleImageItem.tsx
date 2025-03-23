import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import AppImageViewer from "../../../Components/AppImageView";
const SingleImageItem = ({ item, onPress }: any) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          ...style.mainView,
        }}
      >
        <AppImageViewer
          style={{
            ...style.innerView,
          }}
          source={{ uri: item.url }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
const style = StyleSheet.create({
  mainView: {
    height: 200,
    width: 200,
    backgroundColor: "black",
    borderRadius: 10,
    alignSelf: "center",
    overflow: "hidden",
  },
  innerView: {
    height: 200,
    width: 200,
    resizeMode: "cover",
  },
  loaderView: {
    position: "absolute",
    zIndex: 1,
    elevation: 3,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default SingleImageItem;
