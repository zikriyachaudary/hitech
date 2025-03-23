import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
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
      <View
        style={{
          flex: 1,
          borderWidth: 1,
          borderRadius: normalized(80),
          height: normalized(40),
          marginRight: normalized(10),
          borderColor: AppColors.grey.greyLevel1,
          paddingHorizontal: normalized(10),
        }}
      >
        <TextInput
          placeholder="Search"
          placeholderTextColor={AppColors.grey.greyLevel6}
          style={{
            flex: 1,
          }}
          value={props?.search}
          onChangeText={(e) => props?.atSearch(e)}
        />
      </View>
      {props?.rightIcon ? (
        <TouchableOpacity activeOpacity={0.7} onPress={props?.onRightIconPress}>
          <Image
            source={props?.rightIcon}
            style={{
              width: normalized(25),
              height: normalized(25),
              resizeMode: "contain",
              marginHorizontal: normalized(8),
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: AppColors.white.white,
    marginHorizontal: normalized(10),
    zIndex: 99,
  },
  titleTxt: {
    fontSize: normalized(16),
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsMedium,
  },
});
