import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  AppColors,
  AppFonts,
  AppImages,
  normalized,
} from "../../../../Utils/AppConstants";
import { useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";

const ProductHeader = (props: any) => {
  return (
    <View style={[styles.mainCont, { flexDirection: "row" }]}>
      {props.leftIcon && (
        <TouchableOpacity
          style={styles.imageCont}
          activeOpacity={0.7}
          onPress={() => props?.onBackPress()}
        >
          <Image
            style={styles.arrowImage}
            source={props?.leftIcon}
            tintColor={AppColors.themeColor.dark}
          />
        </TouchableOpacity>
      )}
      {props.title && <Text style={styles.titleTxt}>{props.title}</Text>}
      {props.rightIcon && (
        <TouchableOpacity onPress={props?.onRightIconPress} activeOpacity={0.7}>
          {props?.cartDetail?.length > 0 && (
            <View style={styles.countCont}>
              <Text style={styles.count}>{props?.cartDetail?.length}</Text>
            </View>
          )}
          <Image
            style={styles.cartImg}
            source={props?.rightIcon}
            tintColor={AppColors.themeColor.dark}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProductHeader;

const styles = StyleSheet.create({
  mainCont: {
    height: normalized(50),
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: normalized(20),
  },
  arrowImage: {
    width: normalized(40),
    height: normalized(40),
    resizeMode: "contain",
  },
  imageCont: {
    width: normalized(45),
    height: normalized(45),
    backgroundColor: AppColors.white.white,
    justifyContent: "center",
    alignItems: "center",
  },
  cartImg: {
    width: normalized(30),
    height: normalized(30),
    resizeMode: "contain",
  },
  titleTxt: {
    fontSize: normalized(15),
    fontFamily: AppFonts.PoppinsMedium,
    color: AppColors.black.black,
  },
  countCont: {
    width: normalized(15),
    height: normalized(15),
    borderRadius: normalized(15 / 2),
    backgroundColor: AppColors.themeColor.dark,
    position: "absolute",
    right: normalized(-10),
    top: normalized(-10),
    alignItems: "center",
    justifyContent: "center",
  },
  count: {
    color: AppColors.white.white,
    fontSize: normalized(11),
    fontFamily: AppFonts.PoppinsSemiBold,
  },
});
