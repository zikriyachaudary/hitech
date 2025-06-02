import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  AppColors,
  AppFonts,
  normalized,
} from "../../../../Utils/AppConstants";
import { useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";

const ProductHeader = (props: any) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;

  return (
    <View
      style={[
        styles.mainCont,
        { flexDirection: isRtl ? "row-reverse" : "row" },
      ]}
    >
      {props.leftIcon && (
        <TouchableOpacity
          style={styles.imageCont}
          activeOpacity={0.7}
          onPress={() => props?.onBackPress()}
        >
          <Image
            style={[
              styles.arrowImage,
              isRtl && { transform: [{ rotate: "180deg" }] },
            ]}
            source={props?.leftIcon}
            tintColor={AppColors.themeColor.dark}
          />
        </TouchableOpacity>
      )}
      {props.title && <Text style={styles.titleTxt}>{props.title}</Text>}
      {props.rightIcon && (
        <TouchableOpacity onPress={props?.onRightIconPress} activeOpacity={0.8}>
          {props?.cartDetail?.length > 0 && (
            <View style={styles.countCont}>
              <Text style={styles.count}>{props?.cartDetail?.length}</Text>
            </View>
          )}
          <Image
            style={styles.cartImg}
            source={props?.rightIcon}
            tintColor={
              props?.isFromAdmin
                ? AppColors.white.white
                : AppColors.themeColor.dark
            }
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
    marginHorizontal: normalized(10),
    borderWidth: 1,
    borderColor: AppColors.grey.greyLevel2,
    borderRadius: normalized(100),
  },
  arrowImage: {
    width: normalized(30),
    height: normalized(30),
    resizeMode: "contain",
  },
  imageCont: {
    width: normalized(45),
    height: normalized(45),
    justifyContent: "center",
    alignItems: "center",
  },
  cartImg: {
    width: normalized(23),
    height: normalized(23),
    resizeMode: "contain",
    marginRight: normalized(15),
  },
  titleTxt: {
    fontSize: normalized(15),
    fontFamily: AppFonts.PoppinsMedium,
    color: AppColors.black.black,
  },
  countCont: {
    width: normalized(13),
    height: normalized(13),
    borderRadius: normalized(15 / 2),
    backgroundColor: AppColors.themeColor.dark,
    position: "absolute",
    right: normalized(5),
    bottom: normalized(-5),
    alignItems: "center",
    justifyContent: "center",
  },
  count: {
    color: AppColors.white.white,
    fontSize: normalized(10),
    fontFamily: AppFonts.PoppinsSemiBold,
  },
});
