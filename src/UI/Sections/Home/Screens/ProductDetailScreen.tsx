import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import ProductHeader from "../Components/ProductHeader";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  AppImages,
  normalized,
  ScreenProps,
  ScreenSize,
} from "../../../../Utils/AppConstants";
import ProductSliderComp from "../Components/ProductSliderComp";
import FilledButton from "../../../Components/CustomButton/FilledButton";
import ProductCounterComp from "../Components/ProductCounterComp";
import { useSelector } from "react-redux";
import CartManager from "../../../../Hooks/CartManager";
import { Routes } from "../../../../Utils/Routes";

const ProductDetailScreen = (props: ScreenProps) => {
  const item = props?.route?.params?.item;
  const [count, setCount] = useState(1);
  const cartDetail = useSelector((state: any) => state.SliceReducer.cartDetail);
  const { updateProductList } = CartManager();
  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <ProductHeader
        leftIcon={AppImages.Auth.backArrow}
        onBackPress={() => props?.navigation?.goBack()}
        title={"Product Details"}
        rightIcon={AppImages.Home.cart}
        onRightIconPress={() => {
          props?.navigation?.navigate(Routes.Home.cartScreen);
        }}
        cartDetail={cartDetail}
      />

      <View>
        <ProductSliderComp
          productImagesList={item?.images}
          atBackPress={() => {
            props?.navigation?.goBack();
          }}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.headingCont}>
          <Text style={styles.itemName}>{item?.name}</Text>
          {/* <View style={styles.ratingCont}>
            <Text style={styles.ratingTxt}>{"5.0"}</Text>
            <Image source={AppImages.Home.star} style={styles.star} />
          </View> */}
        </View>
        <Text style={styles.priceTxt}>{`Rs. ${item?.price}`}</Text>
        <Text style={styles.desc}>Description:</Text>
        <Text style={styles.descTxt}>{item?.description}</Text>
      </ScrollView>

      <View style={styles.bottomCont}>
        <ProductCounterComp
          count={count}
          atIncreaseCount={() => {
            setCount(count + 1);
          }}
          atDecreaseCount={() => {
            setCount(count - 1);
          }}
        />
        <FilledButton
          label={"Add To Cart"}
          onPress={async () => {
            const updateItem = { ...item, count: count };
            updateProductList(updateItem);
          }}
          mainContainer={{ width: normalized(150) }}
        />
      </View>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  itemName: {
    color: AppColors.black.black,
    fontSize: normalized(17),
    fontFamily: AppFonts.PoppinsMedium,
    marginTop: normalized(10),
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: normalized(20),
  },
  headingCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  star: {
    width: normalized(17),
    height: normalized(17),
    resizeMode: "contain",
    tintColor: AppColors.white.white,
  },
  ratingTxt: {
    color: AppColors.white.white,
    fontFamily: AppFonts.PoppinsSemiBold,
    fontSize: normalized(13),
  },
  priceTxt: {
    fontSize: normalized(20),
    color: AppColors.red.dark,
    fontFamily: AppFonts.PoppinsSemiBold,
    marginTop: normalized(5),
  },
  ratingCont: {
    flexDirection: "row",
    gap: normalized(5),
    width: normalized(60),
    height: normalized(30),
    backgroundColor: AppColors.themeColor.dark,
    borderRadius: normalized(5),
    alignItems: "center",
    justifyContent: "center",
  },
  desc: {
    fontSize: normalized(14),
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsMedium,
    marginTop: normalized(10),
  },
  descTxt: {
    fontFamily: AppFonts.PoppinsRegular,
    fontSize: normalized(12),
    color: AppColors.black.Level5,
    textAlign: "justify",
    marginTop: normalized(5),
  },
  bottomCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: ScreenSize.width - normalized(20),
    marginLeft: normalized(20),
    position: "absolute",
    bottom: normalized(10),
  },
});
