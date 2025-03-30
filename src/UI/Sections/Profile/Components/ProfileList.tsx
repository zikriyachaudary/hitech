import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  AppImages,
  normalized,
} from "../../../../Utils/AppConstants";
import { useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";

const ProfileList = (props: any) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;

  return (
    <View>
      {props?.List.map((el: any, i: any) => (
        <>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.mainCont,
              { flexDirection: isRtl ? "row-reverse" : "row" },
            ]}
            onPress={() => {
              props?.setValue(el?.id);
            }}
          >
            <Image source={el?.leftIcon} style={styles.leftIcon} />
            <Text
              style={[
                styles.barTxt,
                {
                  marginLeft: isRtl ? 0 : normalized(25),
                  marginRight: isRtl ? normalized(25) : 0,
                  textAlign: isRtl ? "right" : "left",
                },
              ]}
            >
              {isRtl ? el?.rtlTxt : el.text}
            </Text>
            <Image
              source={AppImages.Profile.ForwardArrow}
              resizeMode="contain"
              style={[
                styles.rightIcon,
                { transform: [{ rotate: isRtl ? "180deg" : "0deg" }] },
              ]}
            />
          </TouchableOpacity>
          {props?.List?.length - 1 != i && <View style={styles.divider} />}
        </>
      ))}
    </View>
  );
};

export default ProfileList;

const styles = StyleSheet.create({
  mainCont: {
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: AppHorizontalMargin,
    marginTop: normalized(12),
  },
  leftIcon: {
    height: normalized(20),
    width: normalized(20),
    resizeMode: "contain",
  },
  barTxt: {
    fontFamily: AppFonts.PoppinsMedium,
    fontSize: normalized(14),
    color: "#343A40",
    fontWeight: "500",
    flex: 1,
  },
  divider: {
    height: normalized(1),
    backgroundColor: AppColors.grey.greyLevel1,
    marginTop: normalized(13),
    marginHorizontal: 20,
  },
  rightIcon: {
    width: normalized(10),
    height: normalized(25),
    resizeMode: "contain",
  },
});
