import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import {
  AppColors,
  AppFonts,
  normalized,
} from "../../../../Utils/AppConstants";
import AppImageViewer from "../../../Components/AppImageView";

const ProfileHeader = (props: any) => {
  return (
    <View style={styles.mainCont}>
      <AppImageViewer
        source={{ uri: props?.profileImage }}
        style={{
          height: normalized(40),
          width: normalized(40),
          borderRadius: normalized(20),
          // borderWidth: 1,
          // borderColor: AppColors.themeColor.dark,
        }}
      />
      <Text style={styles.titleTxt}>{props?.title}</Text>
      {props?.rightIcon ? (
        <TouchableOpacity activeOpacity={0.7} onPress={props?.onRightIconPress}>
          <Image
            source={props?.rightIcon}
            style={{
              width: normalized(25),
              height: normalized(25),
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>
      ) : (
        <View
          style={{
            width: normalized(25),
          }}
        />
      )}
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  mainCont: {
    height: normalized(60),
    width: "92%",
    // borderBottomLeftRadius: normalized(10),
    // borderBottomRightRadius: normalized(10),
    borderRadius: normalized(10),
    shadowColor: AppColors.black.black,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: AppColors.white.white,
    paddingHorizontal: normalized(10),
    marginHorizontal: normalized(15),
    zIndex: 99,
  },
  titleTxt: {
    fontSize: normalized(16),
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsMedium,
  },
});
