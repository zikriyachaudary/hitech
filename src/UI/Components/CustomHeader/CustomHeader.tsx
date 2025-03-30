import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  AppImages,
  normalized,
} from "../../../Utils/AppConstants";
import { useSelector } from "react-redux";
import { AppRootStore } from "../../../Redux/store/AppStore";

const CustomHeader = (props: any) => {
  const icons = props?.icon;
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;
  return (
    <View
      style={[
        styles.container,
        {
          ...props?.containerStyle,
          flexDirection: isRtl ? "row-reverse" : "row",
        },
      ]}
    >
      <View
        style={{
          flexDirection: isRtl ? "row-reverse" : "row",
          alignItems: "center",
        }}
      >
        {props?.onPress && (
          <TouchableOpacity onPress={props?.onPress} activeOpacity={0.7}>
            <Image
              style={[
                styles.arrowImage,
                {
                  transform: [{ scaleX: isRtl ? -1 : 1 }],
                },
              ]}
              source={AppImages.Home.backArrow}
              tintColor={AppColors.themeColor.dark}
            />
          </TouchableOpacity>
        )}

        <Text
          style={[
            styles.forgetText,
            props?.titleStyle,
            { textAlign: isRtl ? "right" : "left" },
          ]}
          numberOfLines={1}
        >
          {props?.Text ?? props?.title}
        </Text>
      </View>
      <View
        style={{
          flexDirection: isRtl ? "row-reverse" : "row",
          gap: normalized(15),
          marginLeft: isRtl ? normalized(10) : 0,
          marginRight: isRtl ? 0 : normalized(10),
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
    justifyContent: "space-between",
    marginHorizontal: normalized(15),
    borderWidth: 1,
    // borderBottomColor: "transparent",
    // borderTopColor: "transparent",
    // borderLeftColor: "transparent",
    // borderRightColor: "transparent",
    borderRadius: normalized(50),
    borderColor: AppColors.grey.greyLevel1,
    // shadowColor: AppColors.black.black,
    // shadowOffset: {
    //   height: 2,
    //   width: 2,
    // },
    // elevation: 5,
    // shadowOpacity: 0.3,
    // shadowRadius: normalized(3),
    backgroundColor: AppColors.white.white,
    paddingHorizontal: normalized(5),
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
    width: normalized(25),
    height: normalized(25),
    resizeMode: "contain",
  },
  forgetText: {
    fontFamily: AppFonts.PoppinsSemiBold,
    fontSize: normalized(17),
    color: AppColors.themeColor.dark,
    // marginLeft: normalized(10),
    fontWeight: "600",
    width: normalized(230),
    marginTop: normalized(2),
  },
  icon1: {
    width: normalized(24),
    height: normalized(24),
    tintColor: AppColors.themeColor.dark,
  },
});

export default CustomHeader;
