import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import {
  AppColors,
  AppImages,
  normalized,
} from "../../../../Utils/AppConstants";

const SingleDocItem = ({ item, onOpen }: any) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        onOpen();
      }}
    >
      <View
        style={{
          ...style.mainView,
        }}
      >
        <Image
          style={{
            ...style.innerView,
          }}
          source={AppImages.Chat.Document}
        />
        <Text
          style={{
            fontSize: normalized(14),
            color: AppColors.themeColor.dark,
            textAlign: "center",
            marginTop: 10,
          }}
          numberOfLines={4}
        >
          {item?.documentName}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};
const style = StyleSheet.create({
  mainView: {
    height: 200,
    width: 200,
    backgroundColor: AppColors.white.white,
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: AppColors.grey.greyLevel10,
    padding: 10,
  },
  innerView: {
    resizeMode: "cover",
    tintColor: "red",
    alignSelf: "center",
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
export default SingleDocItem;
