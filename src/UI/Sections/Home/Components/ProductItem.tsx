import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  AppColors,
  AppFonts,
  normalized,
} from "../../../../Utils/AppConstants";
import AppImageViewer from "../../../Components/AppImageView";

const ProductItem = (props: any) => {
  const { item } = props;

  return (
    <TouchableOpacity
      style={styles.mainCont}
      activeOpacity={0.7}
      onPress={() => props?.onItemPress(item)}
    >
      <AppImageViewer
        source={{ uri: item?.images[0]?.url }}
        style={styles.img}
      />
      <View style={styles.rightCont}>
        <Text style={styles.nameTxt}>{item?.name}</Text>
        <Text numberOfLines={2} style={styles.descTxt}>
          {item?.description}
        </Text>
        <View style={styles.priceCont}>
          <Text style={styles.priceTxt}>{`Rs. ${item?.price}`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  mainCont: {
    width: "100%",
    backgroundColor: AppColors.white.white,
    // backgroundColor: "red",
    height: normalized(100),
    marginTop: normalized(20),
    borderRadius: normalized(10),
    flexDirection: "row",
    alignItems: "center",
    shadowColor: AppColors.black.black,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.3,
    elevation: 3,
    paddingHorizontal: normalized(10),
  },
  img: {
    width: normalized(80),
    height: normalized(80),
    borderRadius: normalized(10),
    resizeMode: "contain",
  },
  nameTxt: {
    fontSize: normalized(16),
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsMedium,
  },
  rightCont: {
    marginLeft: normalized(10),
  },
  descTxt: {
    fontSize: normalized(11),
    color: AppColors.grey.greyLevel5,
    fontFamily: AppFonts.PoppinsRegular,
    width: normalized(220),
    textAlign: "justify",
  },
  priceCont: {
    height: normalized(25),
    backgroundColor: AppColors.orange.sharp,
    alignItems: "center",
    justifyContent: "center",
    width: normalized(110),
    marginTop: normalized(5),
    borderRadius: normalized(5),
  },
  priceTxt: {
    color: AppColors.white.white,
    fontSize: normalized(14),
    fontFamily: AppFonts.PoppinsSemiBold,
  },
});
