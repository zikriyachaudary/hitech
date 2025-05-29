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
      activeOpacity={1}
      style={{
        padding: normalized(6),
        borderWidth: 1,
        borderColor: AppColors.grey.greyLevel1,
        borderRadius: normalized(8),
        flex: 0.5,
        marginTop: normalized(10),
      }}
      onPress={() => props?.onItemPress(item)}
    >
      <View
        style={{
          flex: 1,
          aspectRatio: 1,
          borderRadius: normalized(6),
          overflow: "hidden",
        }}
      >
        <AppImageViewer
          source={{ uri: item?.images[0]?.url }}
          style={{
            width: "100%",
            height: "100%",
          }}
          resizeMode="cover"
        />
      </View>

      <Text
        numberOfLines={1}
        style={{ ...styles.nameTxt, textAlign: isRtl ? "right" : "left" }}
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
          {isRtl
            ? `${item?.price || item?.sizeNPrice[0]?.price} روپے`
            : `Rs. ${item?.price || item?.sizeNPrice[0]?.price}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  nameTxt: {
    fontSize: normalized(14),
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsMedium,
    marginTop: normalized(5),
  },

  descTxt: {
    fontSize: normalized(11),
    color: AppColors.grey.greyLevel5,
    fontFamily: AppFonts.PoppinsRegular,
    width: "100%",
    height: normalized(35),
  },
  priceCont: {
    // height: normalized(25),
    // lineHeight: normalized(10),
    backgroundColor: AppColors.white.white,
    borderWidth: 1,
    borderColor: AppColors.themeColor.dark,
    alignItems: "center",
    justifyContent: "center",
    width: normalized(110),
    marginTop: normalized(5),
    borderRadius: normalized(5),
    alignSelf: "center",
  },
  priceTxt: {
    color: AppColors.themeColor.dark,
    fontSize: normalized(14),
    fontFamily: AppFonts.PoppinsSemiBold,
  },
});
//
