import {
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import ProductHeader from "../Components/ProductHeader";
import {
  AppColors,
  AppFonts,
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
import { AppRootStore } from "../../../../Redux/store/AppStore";
import { USER_TYPE } from "../../../../Utils/AppStrings";

const ProductDetailScreen = (props: ScreenProps) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;
  const isGolderUser = selector?.userData?.userType == USER_TYPE.Gold;
  const item = props?.route?.params?.item;

  const [count, setCount] = useState(1);
  const cartDetail = useSelector((state: any) => state.SliceReducer.cartDetail);
  const { updateProductList } = CartManager();
  const [price, setPrice] = useState(
    isGolderUser
      ? item?.goldenPrice || item?.sizeNPrice[0]?.goldenPrice
      : item?.price || item?.sizeNPrice[0]?.price
  );

  const [selectedSize, setSelectedSize] = useState(
    item?.sizeNPrice[0]?.size || ""
  );

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <ProductHeader
        leftIcon={AppImages.Auth.backArrow}
        onBackPress={() => props?.navigation?.goBack()}
        title={isRtl ? "پروڈکٹ کی تفصیلات" : "Product Details"}
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
          <Text
            style={{ ...styles.itemName, textAlign: isRtl ? "right" : "left" }}
          >
            {isRtl ? item?.rtlName : item?.name}
          </Text>
          {/* <View style={styles.ratingCont}>
            <Text style={styles.ratingTxt}>{"5.0"}</Text>
            <Image source={AppImages.Home.star} style={styles.star} />
          </View> */}
        </View>
        <Text style={styles.priceTxt}>
          {isRtl ? `${price} روپے` : `Rs. ${price}`}
        </Text>
        {item?.sizeNPrice?.length > 0 && (
          <Text style={styles.desc}>Available Sizes:</Text>
        )}

        {item?.sizeNPrice?.length > 0 && (
          <View style={styles.sizeWrapper}>
            {item?.sizeNPrice.map((item: any, index: any) => {
              const scaleAnim = useRef(new Animated.Value(1)).current;

              useEffect(() => {
                Animated.timing(scaleAnim, {
                  toValue: item?.size == selectedSize ? 1.1 : 1,
                  duration: 200,
                  useNativeDriver: true,
                }).start();
              }, [selectedSize]);
              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    ...styles.sizeCont,
                    borderWidth: item?.size == selectedSize ? 1 : 0,
                    borderColor: AppColors.themeColor.dark,
                    transform: [{ scale: scaleAnim }],
                  }}
                  onPress={() => {
                    setSelectedSize(item?.size);
                    setPrice(isGolderUser ? item?.goldenPrice : item?.price);
                  }}
                >
                  <Text style={styles.sizeTxt}>{item?.size}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <Text style={styles.desc}>{isRtl ? "تفصیل:" : "Description:"}</Text>
        <Text
          style={{ ...styles.descTxt, textAlign: isRtl ? "right" : "left" }}
        >
          {isRtl ? item?.rtlDescription : item?.description}
        </Text>
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
          label={isRtl ? "کارٹ میں شامل کریں" : "Add To Cart"}
          onPress={async () => {
            let tempItem = { ...item };
            delete tempItem.sizeNPrice;
            const updateItem = {
              ...tempItem,
              count,
              price,
              size: selectedSize,
            };
            console.log("item --0----   ", updateItem);
            updateProductList(updateItem);
          }}
          mainContainer={{
            width: normalized(150),
            height: normalized(40),
          }}
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
    fontFamily: AppFonts.PoppinsSemiBold,
    marginTop: normalized(10),
    width: ScreenSize.width - normalized(30),
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
    fontFamily: AppFonts.PoppinsSemiBold,
    marginTop: normalized(10),
  },
  descTxt: {
    fontFamily: AppFonts.PoppinsRegular,
    fontSize: normalized(12),
    color: AppColors.black.Level5,
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
  sizeCont: {
    height: normalized(30),
    width: normalized(80),
    backgroundColor: AppColors.grey.greyLevel0,
    borderRadius: normalized(5),
    marginRight: normalized(10),
    alignItems: "center",
    justifyContent: "center",
  },
  sizeTxt: {
    fontSize: normalized(13),
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsSemiBold,
  },
  sizeWrapper: {
    flexDirection: "row",
    gap: normalized(5),
    flexWrap: "wrap",
    marginTop: normalized(8),
  },
});
