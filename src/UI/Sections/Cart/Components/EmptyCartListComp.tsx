import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  AppColors,
  AppFonts,
  hv,
  normalized,
} from "../../../../Utils/AppConstants";
import AppImageViewer from "../../../Components/AppImageView";
import { useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";

const EmptyCartListComp = (props: any) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.singleCont}
      onPress={() => {
        props?.atPress();
      }}
    >
      <View style={styles.upperCont}>
        <Text
          style={[styles.upperContTxt, { textAlign: isRtl ? "right" : "left" }]}
        >
          {isRtl ? "مفت شپنگ" : "Free Shipping"}
        </Text>
      </View>
      <AppImageViewer
        resizeMode={"contain"}
        source={{ uri: props?.item?.productImages[0]?.url }}
        style={styles.image}
      />

      <Text numberOfLines={1} style={styles.productTitle}>
        {props?.item?.productName}
      </Text>
      <Text style={styles.price}>
        {`$${Number(props?.item?.productPrice || props?.item?.price).toFixed(
          2
        )}`}{" "}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  singleCont: {
    height: hv(150),
    width: normalized(120),
    backgroundColor: AppColors.white.darkGrey,
    margin: normalized(4),
    // justifyContent: 'center',
    padding: 10,
    borderRadius: normalized(10),
  },
  price: {
    fontSize: normalized(12),
    fontWeight: "700",
    fontFamily: AppFonts.PoppinsMedium,
    color: AppColors.black.black,
    textAlign: "center",
  },
  upperCont: {
    backgroundColor: AppColors.white.white,
    width: normalized(80),
    borderRadius: normalized(25 / 2),
    height: normalized(20),
    justifyContent: "center",
    alignItems: "center",
  },
  upperContTxt: {
    fontSize: normalized(10),
    fontWeight: "400",
    fontFamily: AppFonts.PoppinsMedium,
    color: AppColors.red.dark,
  },
  image: {
    height: hv(60),
    width: normalized(70),
    alignSelf: "center",
    marginVertical: 5,
  },
  productTitle: {
    fontSize: normalized(12),
    fontWeight: "400",
    fontFamily: AppFonts.PoppinsMedium,
    color: AppColors.black.black,
    textAlign: "center",
    marginVertical: hv(3),
  },
});

export default EmptyCartListComp;
