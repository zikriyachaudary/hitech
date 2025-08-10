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
  setAddressList,
  setIsLoader,
  setShowToast,
  setTab,
  updateCartDetail,
} from "../../../../Redux/Reducers/AppReducers";
import { placeOrderReq } from "../../../../Network/Services/ProductServices";
import {
  AppStrings,
  NOTIFICATIONS_TYPES,
  ORDER_STATUS,
} from "../../../../Utils/AppStrings";
import CommonDataManager from "../../../../Utils/CommonManager";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import { fetchAddressReq } from "../../../../Network/Services/AddressServices";
import { useIsFocused } from "@react-navigation/native";
import PaymentMethodModal from "../Components/PaymentMethodModal";
import firestore from "@react-native-firebase/firestore";
import moment from "moment";
import { fetchAdminDetailReq } from "../../../../Network/Services/GeneralServices";
import NotificationManager from "../../../../Hooks/NotificationsManager";

const CartScreen = (props: ScreenProps) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const userData = selector?.userData;

  const isRtl = selector?.isRtl;
  const isFocused = useIsFocused();
  const { updateNotificationFunc } = NotificationManager();
  const { updateProductList, removeProductFromCart, getProductsTotalPrice } =
    CartManager();
  const dispatch = useDispatch();
  const [locationError, setLocationError] = useState("");
  const [isShowPaymentModal, setIsShowPaymentModal] = useState(false);

  const [deliveryAdd, setDeliveryAdd] = useState<any>(
    props?.route?.params?.address ? props?.route?.params?.address : null
  );
  const getUserAddress = () => {
    // dispatch(setIsLoader(true));
    fetchAddressReq(userData?.userId, (resp) => {
      if (resp?.status) {
        const defaultAddress =
          resp.data.find((item: any) => item.isDefault) || null;
        !deliveryAdd && setDeliveryAdd(defaultAddress);
        !deliveryAdd && dispatch(setAddressList(defaultAddress));
        dispatch(setIsLoader(false));
      } else {
        dispatch(setIsLoader(false));
      }
    });
  };

  useEffect(() => {
    getUserAddress();
    if (props?.route?.params?.address != undefined) {
      setDeliveryAdd(props?.route?.params?.address);
    }
  }, [isFocused]);

  let productList = useSelector((state: any) => state.SliceReducer.cartDetail);

  const onContinue = async () => {
    const obj = {
      orderPrice: getProductsTotalPrice(true),
      products: selector?.cartDetail,
      userDetail: selector?.userData,
      orderId: CommonDataManager.getSharedInstance().makeid(1),
      createdAt: firestore.FieldValue.serverTimestamp(),
      orderStatus: ORDER_STATUS.Order_Placed,
    };
    props?.navigation?.navigate(Routes.Home.DeliveryScreen, {
      orderDetails: obj,
    });
  };

  const placeOrder = async () => {
    const obj = {
      orderPrice: getProductsTotalPrice(false),
      products: selector?.cartDetail,
      userDetail: selector?.userData,
      orderId: CommonDataManager.getSharedInstance().makeid(1),
      createdAt: moment(Date.now()).format("DD MMM YYYY"),
      orderStatus: ORDER_STATUS.Order_Placed,
    };

    dispatch(setIsLoader(true));
    await placeOrderReq(obj, async (resp: any) => {
      if (resp?.status) {
        await fetchAdminDetailReq(async (adminObj: any) => {
          if (!adminObj) {
            dispatch(setIsLoader(false));
            return;
          }
          const notificatinObj = {
            title: "New Order Placed",
            body: `Order Placed with Order ID ${obj?.orderId}`,
            createdAt: new Date(),
            notificationId: CommonDataManager.getSharedInstance().makeid(3),
            type: NOTIFICATIONS_TYPES.payment_Received,
            reciver: {
              email: adminObj?.email,
              name: adminObj?.fullName,
              profile: adminObj?.profileImage,
              userId: adminObj?.adminId,
            },
            sender: {
              email: userData?.email ?? "",
              name:
                userData?.fullName ??
                userData?.firstName + " " + userData?.lastName,
              profile: userData?.profileImage || userData?.profile,
              userId: userData?.userId,
            },
          };
          await updateNotificationFunc(notificatinObj);
          dispatch(
            setShowToast({
              type: AppStrings.ToastType.success,
              message: resp?.message,
            })
          );
          props?.navigation?.pop(2);
          dispatch(updateCartDetail([]));
          dispatch(setIsLoader(false));
        });
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
              return index == 1 ? null : index === 2 ? (
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
                                  removeProductFromCart(item?.id);
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
            {userData?.isGuestUser ? (
              <View style={styles.bottomCont}>
                <Text
                  style={[
                    styles.nameTxt,
                    { textAlign: isRtl ? "right" : "left" },
                  ]}
                >
                  {isRtl
                    ? "مہمان موڈ میں آپ آرڈر نہیں دے سکتے"
                    : "You cannot place order in Guest Mode"}
                </Text>

                <View style={{ height: normalized(15) }} />
              </View>
            ) : (
              <>
                {!userData?.isShopUser && (
                  <View
                    style={[
                      styles.bottomCont,
                      { flexDirection: isRtl ? "row-reverse" : "row" },
                    ]}
                  >
                    <Text style={styles.leftTxt}>
                      {isRtl ? "روپے" : "Price"}
                    </Text>
                    <Text style={styles.rightTxt}>
                      {`Rs. ${getProductsTotalPrice(false)}`}
                    </Text>
                  </View>
                )}
                {!userData?.isShopUser && (
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
                )}

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
                    {`Rs. ${getProductsTotalPrice(
                      userData?.isShopUser ? false : true
                    )}`}
                  </Text>
                </View>
                <FilledButton
                  label={
                    userData?.isShopUser
                      ? isRtl
                        ? "آرڈر دیں"
                        : "Place Order"
                      : isRtl
                      ? "آگے بڑھیں"
                      : "Proceed"
                  }
                  onPress={() => {
                    if (!userData?.isShopUser && !deliveryAdd) {
                      setLocationError(
                        isRtl
                          ? "براہ کرم ڈلیوری ایڈریس منتخب کریں"
                          : "Please select delivery address"
                      );
                      return;
                    }
                    if (userData?.isShopUser) {
                      placeOrder();
                    } else {
                      onContinue();
                    }
                  }}
                />
              </>
            )}
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
