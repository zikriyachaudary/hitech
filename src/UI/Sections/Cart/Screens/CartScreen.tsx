import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  AppImages,
  hv,
  normalized,
  ScreenProps,
} from "../../../../Utils/AppConstants";
import CartManager from "../../../../Hooks/CartManager";
import { useDispatch, useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import ProductCounterComp from "../../Home/Components/ProductCounterComp";
import FilledButton from "../../../Components/CustomButton/FilledButton";
import EmptyCartListComp from "../Components/EmptyCartListComp";
import { Routes } from "../../../../Utils/Routes";
import {
  setIsLoader,
  setShowToast,
  setTab,
  updateCartDetail,
} from "../../../../Redux/Reducers/AppReducers";
import { placeOrderReq } from "../../../../Network/Services/ProductServices";
import { AppStrings } from "../../../../Utils/AppStrings";
import CommonDataManager from "../../../../Utils/CommonManager";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import { fetchAddressReq } from "../../../../Network/Services/AddressServices";

const CartScreen = (props: ScreenProps) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const userData = selector?.userData;
  const isRtl = selector?.isRtl;
  const { updateProductList, removeProductFromCart, getProductsTotalPrice } =
    CartManager();
  const dispatch = useDispatch();
  const [locationError, setLocationError] = useState("");

  const [DeliveryAdd, setDeliveryAdd] = useState<any>(null);

  const getUserAddress = () => {
    dispatch(setIsLoader(true));
    fetchAddressReq(userData?.userId, (resp) => {
      if (resp?.status) {
        const defaultAddress =
          resp.data.find((item: any) => item.isDefault) || null;
        setDeliveryAdd(defaultAddress);
        dispatch(setIsLoader(false));
      } else {
        dispatch(setIsLoader(false));
      }
    });
  };

  useEffect(() => {
    getUserAddress();
  }, []);

  // const address = {
  //   general: "House 00 Stree 00 Mohallah Lahore Pakistan",
  //   street: "00",
  //   house: "00",
  //   Area: "Some Area here",
  //   City: "Pakistan",
  //   isDefault: true,
  // };
  let productList = useSelector((state: any) => state.SliceReducer.cartDetail);

  const placeOrder = async () => {
    const obj = {
      deliveryDetails: {
        generalAddress: "House 00 Stree 00 Mohallah Lahore Pakistan",
        street: "00",
        house: "00",
        Area: "Some Area here",
        City: "Pakistan",
      },
      orderPrice: getProductsTotalPrice(true),
      products: selector?.cartDetail,
      userDetail: selector?.userData,
      orderId: CommonDataManager.getSharedInstance().makeid(1),
    };
    dispatch(setIsLoader(true));
    await placeOrderReq(obj, (resp: any) => {
      if (resp?.status) {
        dispatch(
          setShowToast({
            type: AppStrings.ToastType.success,
            message: resp?.message,
          })
        );
        props?.navigation?.pop(2);
        dispatch(updateCartDetail([]));
        dispatch(setIsLoader(false));
      } else {
        dispatch(
          setShowToast({
            type: AppStrings.ToastType.error,
            message: resp?.message,
          })
        );
        dispatch(setIsLoader(false));
      }
    });
  };

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <CustomHeader
        onPress={() => props?.navigation?.goBack()}
        Text={isRtl ? "کارٹ" : "Cart"}
      />
      {selector?.cartDetail?.length > 0 ? (
        <>
          <FlatList
            style={{ flex: 1, paddingHorizontal: AppHorizontalMargin }}
            data={[1, 2, 3]}
            keyExtractor={(item, index) => `${index}`}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return index == 1 ? (
                <>
                  <View
                    style={{
                      ...styles.deliveryCont,
                      backgroundColor: !locationError
                        ? AppColors.grey.light
                        : AppColors.red.pink,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <Text
                        style={{
                          ...styles.title,
                          marginRight: isRtl ? normalized(10) : 0,
                          textAlign: isRtl ? "right" : "left",
                        }}
                      >
                        {isRtl ? "ڈلیوری کا پتہ" : "Delivery Address"}
                      </Text>
                      <Text numberOfLines={2} style={styles.addressTxt}>
                        {DeliveryAdd?.address || "Select Delivery Address"}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.editIcon}
                      activeOpacity={0.7}
                      onPress={() => {
                        props?.navigation?.navigate(
                          Routes.Home.DeliveryAddress,
                          { address: DeliveryAdd }
                        );
                      }}
                    >
                      <Image source={AppImages.Products.editIcon} />
                    </TouchableOpacity>
                  </View>
                  {locationError && (
                    <Text
                      style={{
                        fontSize: normalized(14),
                        color: AppColors.red.dark,
                      }}
                    >
                      {locationError}
                    </Text>
                  )}
                </>
              ) : index === 2 ? (
                <>
                  <FlatList
                    data={selector?.cartDetail}
                    keyExtractor={(item, index) => `${index}`}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                      return (
                        <>
                          <View style={styles.singleItemCont}>
                            <View style={styles.productImageCont}>
                              <TouchableOpacity
                                style={styles.removeProCont}
                                onPress={() => {
                                  removeProductFromCart(item?.productId);
                                }}
                              >
                                <Image source={AppImages.Products.delete} />
                              </TouchableOpacity>
                              <FastImage
                                source={{
                                  uri:
                                    item?.productImage || item?.images[0]?.url,
                                }}
                                style={styles.proImage}
                              />
                            </View>
                            <View
                              style={{
                                justifyContent: "space-evenly",
                                alignItems: "flex-start",
                              }}
                            >
                              <Text style={styles.nameTxt} numberOfLines={1}>
                                {isRtl ? item?.rtlName : item?.name}
                              </Text>
                              <View style={styles.priceCont}>
                                <Text style={styles.priceTxt}>
                                  {isRtl
                                    ? `${item?.price} روپے`
                                    : `Rs. ${Number(
                                        item?.price * item?.count
                                      ).toFixed(2)}`}
                                </Text>
                                <ProductCounterComp
                                  count={item?.count}
                                  atIncreaseCount={() => {
                                    updateProductList({
                                      ...item,
                                      count: item?.count + 1,
                                    });
                                  }}
                                  atDecreaseCount={() => {
                                    updateProductList({
                                      ...item,
                                      count: item?.count - 1,
                                    });
                                  }}
                                />
                              </View>
                            </View>
                          </View>
                          <View style={styles.bottomLine} />
                        </>
                      );
                    }}
                    ListHeaderComponent={() => {
                      return (
                        <Text
                          style={{
                            ...styles.headerTxt,
                            textAlign: isRtl ? "right" : "left",
                          }}
                        >
                          {isRtl ? "آرڈر کی تفصیلات" : "Order Details"}
                        </Text>
                      );
                    }}
                  />
                </>
              ) : null;
            }}
          />
          <View style={styles.bottomSheet}>
            {/* {selectedCard ? (
              <View
                style={{
                  ...styles.cardCont,
                }}
              >
                <View
                  style={{
                    maxWidth: "85%",
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      ...styles.addressTxt,
                      fontSize: normalized(18),
                      fontWeight: "600",
                    }}
                  >
                    {selectedCard["holderName"]}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      ...styles.addressTxt,
                      fontSize: normalized(16),
                    }}
                  >
                    {maskCardNumber(selectedCard["cardNumber"])}
                  </Text>
                </View>
                <Text
                  style={styles.addPaymentBtn}
                  onPress={() => {
                    props?.navigation?.navigate(
                      Routes.AddToCart.AddCardScreen,
                      {
                        atBack: (selectedCard: any) => {
                          setSelectedCard(selectedCard);
                        },
                      }
                    );
                  }}
                >
                  Change
                </Text>
              </View>
            ) : (
              <Text
                style={{
                  ...styles.addPaymentBtn,
                  textDecorationLine: cardError ? "underline" : "none",
                  marginVertical: hv(5),
                }}
                onPress={() => {
                  props?.navigation?.navigate(Routes.AddToCart.AddCardScreen, {
                    location: location,
                    atBack: (selectedCard: any) => {
                      setSelectedCard(selectedCard);
                    },
                  });
                }}
              >
                Add Payment Method
              </Text>
            )} */}

            <View
              style={[
                styles.bottomCont,
                { flexDirection: isRtl ? "row-reverse" : "row" },
              ]}
            >
              <Text style={styles.leftTxt}>{isRtl ? "روپے" : "Price"}</Text>
              <Text style={styles.rightTxt}>
                {`Rs. ${getProductsTotalPrice(false)}`}
              </Text>
            </View>
            <View
              style={[
                styles.bottomCont,
                { flexDirection: isRtl ? "row-reverse" : "row" },
              ]}
            >
              <Text
                style={{
                  ...styles.leftTxt,
                  textAlign: isRtl ? "right" : "left",
                }}
              >
                {isRtl ? "ڈلیوری چارجز" : "Delivery Charges"}
              </Text>
              <Text style={styles.rightTxt}>Rs. 200</Text>
            </View>

            <View
              style={[
                styles.bottomCont,
                { flexDirection: isRtl ? "row-reverse" : "row" },
              ]}
            >
              <Text style={styles.leftTxt}>
                {isRtl ? "ٹوٹل" : "Total (incl. DC)"}
              </Text>
              <Text style={styles.rightTxt}>
                {`Rs. ${getProductsTotalPrice(true)}`}
              </Text>
            </View>
            <FilledButton
              label={isRtl ? "آگے بڑھیں" : "Proceed"}
              onPress={() => {
                if (!DeliveryAdd) {
                  setLocationError(
                    isRtl
                      ? "براہ کرم ڈلیوری ایڈریس منتخب کریں"
                      : "Please select delivery address"
                  );
                  return;
                }
                placeOrder();
              }}
            />
          </View>
        </>
      ) : (
        <FlatList
          style={styles.emptyCont}
          data={productList?.length == 0 ? [1] : [1, 2]}
          keyExtractor={(item, index) => `${index}`}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }: any) => {
            return index == 0 ? (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Image source={AppImages.Products.emptyCart} />

                <Text
                  style={[
                    styles.title,
                    { textAlign: isRtl ? "right" : "left" },
                  ]}
                >
                  {isRtl ? "آپ کی ٹوکری خالی ہے!" : "Your cart is empty!"}
                </Text>
                <Text
                  style={[styles.des, { textAlign: isRtl ? "right" : "left" }]}
                >
                  {isRtl
                    ? "ہمارے مصنوعات دریافت کریں"
                    : "Discover our products"}
                </Text>
                <FilledButton
                  label={isRtl ? "مصنوعات دریافت کریں" : "Explore Products"}
                  onPress={() => {
                    dispatch(setTab(0));
                    props?.navigation?.pop(1);
                  }}
                  mainContainer={{ width: normalized(270) }}
                />
              </View>
            ) : index == 1 ? (
              <View style={{ flex: 1, marginTop: hv(30) }}>
                <View style={styles.recomdCont}>
                  <Text
                    style={[
                      styles.recomdTxt,
                      { textAlign: isRtl ? "right" : "left" },
                    ]}
                  >
                    {isRtl ? "سفارشات" : "Recommendations"}
                  </Text>
                  <Text
                    style={[
                      styles.seeAll,
                      { textAlign: isRtl ? "right" : "left" },
                    ]}
                    onPress={() => {
                      dispatch(setTab(0));
                    }}
                  >
                    {isRtl ? "سب دیکھیں" : "See All"}
                  </Text>
                </View>
                <FlatList
                  horizontal
                  data={productList}
                  keyExtractor={(item, index) => `${index}`}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item, index }) => {
                    return (
                      <EmptyCartListComp
                        item={item}
                        atPress={() => {
                          props?.navigation?.navigate(
                            Routes.Home.productDetail,
                            {
                              productDetail: item,
                            }
                          );
                        }}
                      />
                    );
                  }}
                />
              </View>
            ) : null;
          }}
        />
      )}
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  deliveryCont: {
    backgroundColor: AppColors.grey.light,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: normalized(10),
    borderRadius: normalized(8),
    marginTop: 10,
    maxHeight: 150,
  },
  title: {
    fontSize: normalized(16),
    fontWeight: "600",
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsRegular,
    marginTop: normalized(10),
  },
  des: {
    fontSize: normalized(14),
    fontWeight: "400",
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsMedium,
  },
  addressTxt: {
    fontSize: normalized(12),
    fontWeight: "400",
    color: AppColors.black.black,
    marginVertical: 4,
  },
  editIcon: {
    height: normalized(40),
    width: normalized(40),
    borderRadius: normalized(40 / 2),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColors.themeColor.dark,
  },
  emptyCont: {
    flex: 1,
    paddingHorizontal: AppHorizontalMargin,
  },
  singleItemCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: hv(10),
  },
  productImageCont: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: normalized(110),
    width: normalized(115),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: normalized(3),
    borderColor: AppColors.white.white,
    borderRadius: normalized(10),
    backgroundColor: AppColors.grey.light,
  },
  removeProCont: {
    position: "absolute",
    height: normalized(30),
    width: normalized(30),
    borderRadius: normalized(30 / 2),
    backgroundColor: AppColors.white.white,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    bottom: 0,
    left: 0,
  },
  proImage: {
    height: normalized(100),
    width: normalized(100),
    borderRadius: normalized(8),
  },
  nameTxt: {
    fontSize: normalized(14),
    color: AppColors.black.black,
    fontWeight: "600",
    minWidth: normalized(200),
    marginLeft: normalized(10),
  },
  priceCont: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: normalized(10),
    maxWidth: normalized(210),
    flexWrap: "wrap",
  },
  priceTxt: {
    fontSize: normalized(15),
    color: AppColors.black.black,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: AppColors.themeColor.dark,
    borderRadius: normalized(5),
    paddingHorizontal: normalized(15),
    paddingVertical: normalized(3),
  },
  headerTxt: {
    color: AppColors.black.black,
    fontSize: normalized(14),
    paddingRight: 10,
    fontWeight: "700",
    marginVertical: hv(10),
  },
  bottomLine: {
    height: 1,
    width: "100%",
    backgroundColor: AppColors.grey.greyLevel1,
    marginVertical: hv(10),
  },
  addPaymentBtn: {
    textDecorationLine: "underline",
    color: AppColors.red.dark,
    fontSize: normalized(15),
    fontWeight: "500",
    marginVertical: 5,
  },
  bottomCont: {
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  leftTxt: {
    fontSize: normalized(13),
    fontWeight: "400",
    color: AppColors.black.black,
  },
  rightTxt: {
    fontSize: normalized(13),
    fontWeight: "600",
    color: AppColors.black.black,
  },
  cardCont: {
    backgroundColor: AppColors.white.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxHeight: hv(80),
    padding: normalized(10),
    borderRadius: normalized(8),
  },
  bottomSheet: {
    paddingHorizontal: AppHorizontalMargin,
    borderWidth: 1,
    borderColor: AppColors.themeColor.dark,
    paddingTop: normalized(10),
    borderTopLeftRadius: normalized(20),
    borderTopRightRadius: normalized(20),
  },
  recomdCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  recomdTxt: {
    fontSize: normalized(16),
    fontWeight: "700",
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsRegular,
  },
  seeAll: {
    fontSize: normalized(14),
    fontWeight: "500",
    color: AppColors.red.dark,
    fontFamily: AppFonts.PoppinsRegular,
  },
});
