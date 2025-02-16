import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  AppImages,
  normalized,
} from "../../../Utils/AppConstants";

const CustomHeader = (props: any) => {
  const icons = props?.icon;
  return (
    <View style={[styles.container, { ...props?.containerStyle }]}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {props?.onPress && (
          <TouchableOpacity onPress={props?.onPress} activeOpacity={0.7}>
            <Image
              style={styles.arrowImage}
              source={AppImages.Auth.backArrow}
              tintColor={AppColors.themeColor.dark}
            />
          </TouchableOpacity>
        )}

        <Text style={[styles.forgetText, props?.titleStyle]}>
          {props?.Text ?? props?.title}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: normalized(15),
          paddingRight: normalized(5),
        }}
      >
        {props?.icon
          ? icons.map((item: any, index: any) => (
              <TouchableOpacity
                key={item.index}
                onPress={() => {
                  props?.onRightIconPress();
                }}
                activeOpacity={0.7}
                style={props?.rightIconCont}
              >
                <Image
                  source={props?.icon[index]}
                  style={{ ...styles.icon1, ...props?.rightIconStyle }}
                />
              </TouchableOpacity>
            ))
          : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    height: normalized(50),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: AppHorizontalMargin,
    borderWidth: 1,
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderRadius: normalized(50),
    shadowColor: AppColors.black.black,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    elevation: 3,
    shadowOpacity: 0.3,
    backgroundColor: AppColors.white.white,
  },
  imageCont: {
    width: normalized(47),
    height: normalized(47),
    backgroundColor: AppColors.white.white,
    borderRadius: normalized(47 / 2),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: AppColors.themeColor.dark,
  },
  arrowImage: {
    width: normalized(45),
    height: normalized(45),
    resizeMode: "contain",
  },
  forgetText: {
    fontFamily: AppFonts.PoppinsSemiBold,
    fontSize: normalized(17),
    color: AppColors.black.black,
    marginLeft: normalized(10),
    fontWeight: "600",
  },
  icon1: {
    width: normalized(24),
    height: normalized(24),
    tintColor: AppColors.themeColor.dark,
  },
});

export default CustomHeader;
