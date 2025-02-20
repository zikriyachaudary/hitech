import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  AppColors,
  AppFonts,
  normalized,
} from "../../../../Utils/AppConstants";
import AppImageViewer from "../../../Components/AppImageView";
import { useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";

const ProductItem = (props: any) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;

  const { item } = props;

  return (
    <TouchableOpacity
      style={{
        ...styles.mainCont,
        flexDirection: isRtl ? "row-reverse" : "row",
      }}
      activeOpacity={0.7}
      onPress={() => props?.onItemPress(item)}
    >
      <AppImageViewer
        source={{ uri: item?.images[0]?.url }}
        style={styles.img}
      />
      <View
        style={{
          marginLeft: isRtl ? 0 : normalized(10),
          marginRight: isRtl ? normalized(10) : 0,
        }}
      >
        <Text
          style={{ ...styles.nameTxt, textAlign: isRtl ? "right" : "justify" }}
        >
          {isRtl ? item?.rtlName : item?.name}
        </Text>
        <Text
          numberOfLines={2}
          style={{ ...styles.descTxt, textAlign: isRtl ? "right" : "justify" }}
        >
          {isRtl ? item?.rtlDescription : item?.description}
        </Text>
        <View style={styles.priceCont}>
          <Text style={styles.priceTxt}>
            {isRtl ? `${item?.price} روپے` : `Rs. ${item?.price}`}
          </Text>
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
    alignItems: "center",
    shadowColor: AppColors.black.black,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.3,
    elevation: 3,
    paddingHorizontal: normalized(10),
    borderWidth: 0.5,
    borderColor: AppColors.themeColor.dark,
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

  descTxt: {
    fontSize: normalized(11),
    color: AppColors.grey.greyLevel5,
    fontFamily: AppFonts.PoppinsRegular,
    width: normalized(220),
  },
  priceCont: {
    height: normalized(25),
    backgroundColor: AppColors.white.white,
    borderWidth: 1,
    borderColor: AppColors.themeColor.dark,
    alignItems: "center",
    justifyContent: "center",
    width: normalized(110),
    marginTop: normalized(5),
    borderRadius: normalized(5),
  },
  priceTxt: {
    color: AppColors.themeColor.dark,
    fontSize: normalized(14),
    fontFamily: AppFonts.PoppinsSemiBold,
  },
});
