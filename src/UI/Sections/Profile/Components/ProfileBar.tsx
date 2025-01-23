import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  AppColors,
  AppFonts,
  AppImages,
  hv,
  normalized,
} from "../../../../Utils/AppConstants";

const ProfileBar = ({ List, setValue }: any) => {
  return (
    <View style={{ marginVertical: hv(10), marginHorizontal: normalized(20) }}>
      {List.map((item: any, index: number) => (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setValue(item?.id)}
          key={index}
          style={{
            backgroundColor: AppColors.grey.greyLevel3,
            height: normalized(45),
            paddingHorizontal: normalized(20),
            borderRadius: normalized(5),
            marginTop: normalized(10),
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={item.leftIcon}
            style={{
              height: normalized(18),
              width: normalized(18),
              resizeMode: "contain",
            }}
          />
          <Text style={styles.barTxt}>{item.text}</Text>

          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
            }}
          >
            <Image
              source={AppImages.Profile.ForwardArrow}
              style={{
                height: normalized(16),
                width: normalized(26),
                resizeMode: "contain",
              }}
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  barTxt: {
    fontFamily: AppFonts.PoppinsMedium,
    fontSize: normalized(14),
    color: "#343A40",
    marginLeft: normalized(25),
    fontWeight: "500",
  },
});
export default ProfileBar;
