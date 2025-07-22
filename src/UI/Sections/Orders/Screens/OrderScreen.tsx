import {
  Animated,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import AppImageViewer from "../../../Components/AppImageView";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  normalized,
  ScreenProps,
  ScreenSize,
} from "../../../../Utils/AppConstants";
import {
  getAllOrdersList,
  getUserOrdersList,
} from "../../../../Network/Services/GeneralServices";
import { useDispatch, useSelector } from "react-redux";
import {
  setDispatchedOrders,
  setIsLoader,
  setPendingOrders,
} from "../../../../Redux/Reducers/AppReducers";
import { Routes } from "../../../../Utils/Routes";
import { ORDER_STATUS } from "../../../../Utils/AppStrings";
import SimpleHeader from "../../../Components/CustomHeader/SimpleHeader";
import { useIsFocused } from "@react-navigation/native";

const OrderScreen = (props: ScreenProps) => {
  const selector = useSelector((state: any) => state.SliceReducer);
  const userData = selector?.userData;
  const isRtl = selector?.isRtl;
  const [pendingOrdersList, setPendingOrdersList] = useState(
    selector?.pendingOrdersList
  );
  const [dispatchedOrdersList, setDispatchedOrdersList] = useState(
    selector?.dispatchedOrdersList
  );
  const [ordersList, setOrdersList] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const dispatch = useDispatch();
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = ScreenSize;
  const scrollX = useRef(new Animated.Value(0)).current;
  const buttons = isRtl ? ["نامکمل", "بھیجے گئے"] : ["Pending", "Dispatched"];
  const onCLick = (i: any) =>
    scrollViewRef?.current?.scrollTo({ x: i * width });
  const isFocused = useIsFocused();

  useEffect(() => {
    if (selector?.userData?.isAdmin) {
      fetchAllOrders();
    } else {
      fetchOrders();
    }
  }, [isFocused]);

  const fetchOrders = async () => {
    !selector?.ordersList[0] && dispatch(setIsLoader(true));
    await getUserOrdersList(userData?.userId, (resp: any) => {
      if (resp?.status) {
        setOrdersList(resp?.data);
        setIsFetched(true);
      } else {
        setIsFetched(true);
      }
    });
    dispatch(setIsLoader(false));
  };

  const fetchAllOrders = async () => {
    !selector?.pendingOrdersList[0] && dispatch(setIsLoader(true));
    await getAllOrdersList((resp: any) => {
      if (resp?.status) {
        const pendingOrders = resp?.data?.filter(
          (order: any) => order.orderStatus !== ORDER_STATUS.Dispatched
        );
        const dispatchedOrders = resp?.data?.filter(
          (order: any) => order.orderStatus == ORDER_STATUS.Dispatched
        );

        setPendingOrdersList(pendingOrders);
        setDispatchedOrdersList(dispatchedOrders);
        dispatch(setPendingOrders(pendingOrders));
        dispatch(setDispatchedOrders(dispatchedOrders));
        setIsFetched(true);
        dispatch(setIsLoader(false));
      } else {
        dispatch(setIsLoader(false));
      }
    });
  };
  function ButtonContainer({ buttons, onClick, scrollX }: any) {
    const [btnContainerWidth, setWidth] = useState(0);
    const btnWidth = btnContainerWidth / buttons.length;
    const translateX = scrollX.interpolate({
      inputRange: [0, width],
      outputRange: [0, btnWidth],
    });
    const translateXOpposit = scrollX.interpolate({
      inputRange: [0, width],
      outputRange: [0, -btnWidth],
    });
    return (
      <View
        style={styles.btnContainer}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      >
        {buttons.map((btn: any, i: any) => (
          <TouchableOpacity
            key={btn}
            style={styles.btn}
            onPress={() => onClick(i)}
          >
            <Text style={{ color: AppColors.black.black }}>{btn}</Text>
          </TouchableOpacity>
        ))}
        <Animated.View
          style={[
            styles.animatedBtnContainer,
            { width: btnWidth, transform: [{ translateX }] },
          ]}
        >
          {buttons.map((btn: any) => (
            <Animated.View
              key={btn}
              style={[
                styles.animatedBtn,
                {
                  width: btnWidth,
                  transform: [{ translateX: translateXOpposit }],
                },
              ]}
            >
              <Text style={styles.btnTextActive}>{btn}</Text>
            </Animated.View>
          ))}
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />

      {!userData?.isAdmin && (
        <SimpleHeader Text={isRtl ? "تمام آرڈرز" : "Order History"} />
      )}

      {userData?.isAdmin ? (
        <View style={styles.container}>
          <View style={{ padding: 5, paddingTop: 0 }}>
            <ButtonContainer
              buttons={buttons}
              onClick={onCLick}
              scrollX={scrollX}
            />
          </View>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
          >
            {buttons.map((x) => {
              return (
                <View style={[styles.card]} key={x}>
                  {(selector?.userData?.isAdmin &&
                    (x === "Pending" ||
                      (x == "نامکمل" && pendingOrdersList?.length > 0) ||
                      (x === "Dispatched" &&
                        dispatchedOrdersList?.length > 0))) ||
                  (!selector?.userData?.isAdmin && ordersList?.length > 0) ? (
                    <FlatList
                      data={
                        x === "Pending" || x == "نامکمل"
                          ? pendingOrdersList
                          : dispatchedOrdersList
                      }
                      keyExtractor={(item, index) => `${index}`}
                      contentContainerStyle={{
                        paddingBottom: normalized(45),
                      }}
                      showsVerticalScrollIndicator={false}
                      renderItem={({ item, index }: any) => {
                        return (
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                              if (userData?.isAdmin) {
                                props?.navigation?.navigate(
                                  Routes.Home.OrderDetailScreen,
                                  {
                                    item,
                                  }
                                );
                              }
                            }}
                            style={styles.cont}
                          >
                            {!selector?.userData?.isAdmin && (
                              <View style={styles.statusCont}>
                                <Text style={styles.statusTxt}>
                                  {item?.orderStatus ==
                                  ORDER_STATUS.Order_Placed
                                    ? "Order Placed"
                                    : "Dispatched"}
                                </Text>
                              </View>
                            )}
                            <View style={styles.txtCont}>
                              <Text style={styles.title}>{"Order ID"}</Text>
                              <View style={styles.divider} />
                              <Text style={styles.title}>{item?.orderId}</Text>
                            </View>
                            {item?.products?.map((product: any, index: any) => (
                              <React.Fragment key={index}>
                                <View
                                  style={[
                                    styles.productCont,
                                    {
                                      flexDirection: isRtl
                                        ? "row-reverse"
                                        : "row",
                                    },
                                  ]}
                                >
                                  <AppImageViewer
                                    style={styles.productImg}
                                    source={{ uri: product?.images?.[0]?.url }}
                                  />
                                  <View
                                    style={{
                                      ...styles.divider,
                                      height: normalized(20),
                                      marginHorizontal: normalized(10),
                                    }}
                                  />
                                  <Text
                                    style={styles.productName}
                                    numberOfLines={2}
                                  >
                                    {isRtl ? product?.rtlName : product?.name}
                                  </Text>
                                </View>
                                {item?.products?.length - 1 !== index && (
                                  <View style={styles.horiDivider} />
                                )}
                              </React.Fragment>
                            ))}
                            <View
                              style={[
                                styles.priceCont,
                                {
                                  alignSelf: isRtl ? "flex-start" : "flex-end",
                                },
                              ]}
                            >
                              <Text style={styles.priceTxt}>
                                {isRtl
                                  ? `${Math.floor(item?.orderPrice || 0)} روپے`
                                  : `Rs. ${Math.floor(item?.orderPrice || 0)}`}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      }}
                    />
                  ) : (
                    <View style={styles.emptyCont}>
                      {isFetched && (
                        <Text
                          style={[
                            styles.emptyTxt,
                            { textAlign: isRtl ? "right" : "left" },
                          ]}
                        >
                          {userData?.isGuestUser
                            ? isRtl
                              ? "مہمان موڈ میں آرڈر ہسٹری دستیاب نہیں ہے۔"
                              : "Order History not available in Guest Mode."
                            : userData?.isAdmin
                            ? x == "Pending"
                              ? isRtl
                                ? "فی الحال کوئی زیر التواء آرڈرز موجود نہیں ہیں۔ براہ کرم بعد میں دوبارہ چیک کریں یا موجودہ آرڈرز کو بھیجے گئے سیکشن سے منظم کریں۔"
                                : "No pending orders found at the moment. Please check back later or manage existing orders from the Dispatched section."
                              : isRtl
                              ? "فی الحال کوئی بھیجے گئے آرڈرز دستیاب نہیں ہیں۔ آرڈرز پراسیس ہونے کے بعد یہاں ظاہر ہوں گے۔"
                              : "No dispatched orders available currently. Once orders are processed, they'll appear here."
                            : isRtl
                            ? "آپ نے ابھی تک کوئی آرڈر نہیں دیا۔ جب آپ خریداری کریں گے تو آپ کی آرڈر کی تفصیلات یہاں ظاہر ہوں گی۔ ابھی تلاش شروع کریں اور اپنی گاڑی کے لیے بہترین پارٹس تلاش کریں!"
                            : "You have not placed an order yet. Once you make a purchase, your order details will appear here. Start exploring now and find the perfect parts for your vehicle!"}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
      ) : (
        <FlatList
          data={ordersList}
          keyExtractor={(item, index) => `${index}`}
          contentContainerStyle={{
            paddingBottom: normalized(45),
            ...(ordersList?.length === 0 && { flex: 1 }),
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }: any) => {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (userData?.isAdmin) {
                    props?.navigation?.navigate(Routes.Home.OrderDetailScreen, {
                      item,
                    });
                  }
                }}
                style={styles.cont}
              >
                {!selector?.userData?.isAdmin && (
                  <View
                    style={[
                      styles.statusCont,
                      {
                        backgroundColor:
                          item?.orderStatus == ORDER_STATUS.Order_Placed
                            ? AppColors.orange.light
                            : AppColors.green.light,
                        borderColor:
                          item?.orderStatus == ORDER_STATUS.Order_Placed
                            ? AppColors.orange.dark
                            : AppColors.green.dark,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusTxt,
                        {
                          color:
                            item?.orderStatus == ORDER_STATUS.Order_Placed
                              ? AppColors.orange.dark
                              : AppColors.green.dark,
                        },
                      ]}
                    >
                      {item?.orderStatus == ORDER_STATUS.Order_Placed
                        ? "Order Placed"
                        : "Dispatched"}
                    </Text>
                  </View>
                )}
                <View style={styles.txtCont}>
                  <Text style={styles.title}>{"Order ID"}</Text>
                  <View style={styles.divider} />
                  <Text style={styles.title}>{item?.orderId}</Text>
                </View>
                {item?.products?.map((product: any, index: any) => (
                  <React.Fragment key={index}>
                    <View
                      style={[
                        styles.productCont,
                        {
                          flexDirection: isRtl ? "row-reverse" : "row",
                        },
                      ]}
                    >
                      <AppImageViewer
                        style={styles.productImg}
                        source={{ uri: product?.images?.[0]?.url }}
                      />
                      <View
                        style={{
                          ...styles.divider,
                          height: normalized(20),
                          marginHorizontal: normalized(10),
                        }}
                      />
                      <Text style={styles.productName} numberOfLines={2}>
                        {isRtl ? product?.rtlName : product?.name}
                      </Text>
                    </View>
                    {item?.products?.length - 1 !== index && (
                      <View style={styles.horiDivider} />
                    )}
                  </React.Fragment>
                ))}
                <View
                  style={[
                    styles.priceCont,
                    {
                      alignSelf: isRtl ? "flex-start" : "flex-end",
                    },
                  ]}
                >
                  <Text style={styles.priceTxt}>
                    {isRtl
                      ? `${Math.floor(item?.orderPrice || 0)} روپے`
                      : `Rs. ${Math.floor(item?.orderPrice || 0)}`}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={() => (
            <View style={styles.emptyCont}>
              {isFetched && (
                <Text
                  style={[
                    styles.emptyTxt,
                    { textAlign: isRtl ? "right" : "left" },
                  ]}
                >
                  {userData?.isGuestUser
                    ? isRtl
                      ? "مہمان موڈ میں آرڈر ہسٹری دستیاب نہیں ہے۔"
                      : "Order History not available in Guest Mode."
                    : userData?.isAdmin
                    ? x == "Pending"
                      ? isRtl
                        ? "فی الحال کوئی زیر التواء آرڈرز موجود نہیں ہیں۔ براہ کرم بعد میں دوبارہ چیک کریں یا موجودہ آرڈرز کو بھیجے گئے سیکشن سے منظم کریں۔"
                        : "No pending orders found at the moment. Please check back later or manage existing orders from the Dispatched section."
                      : isRtl
                      ? "فی الحال کوئی بھیجے گئے آرڈرز دستیاب نہیں ہیں۔ آرڈرز پراسیس ہونے کے بعد یہاں ظاہر ہوں گے۔"
                      : "No dispatched orders available currently. Once orders are processed, they'll appear here."
                    : isRtl
                    ? "آپ نے ابھی تک کوئی آرڈر نہیں دیا۔ جب آپ خریداری کریں گے تو آپ کی آرڈر کی تفصیلات یہاں ظاہر ہوں گی۔ ابھی تلاش شروع کریں اور اپنی گاڑی کے لیے بہترین پارٹس تلاش کریں!"
                    : "You have not placed an order yet. Once you make a purchase, your order details will appear here. Start exploring now and find the perfect parts for your vehicle!"}
                </Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  cont: {
    paddingHorizontal: normalized(15),
    borderRadius: normalized(10),
    marginTop: normalized(20),
    gap: normalized(10),
    // shadowColor: AppColors.black.black,
    // shadowOpacity: 0.3,
    // elevation: 3,
    backgroundColor: AppColors.white.white,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    marginHorizontal: AppHorizontalMargin,
    paddingBottom: normalized(10),
    borderWidth: 1,
    borderColor: AppColors.grey.greyLevel0,
  },

  emptyCont: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: AppHorizontalMargin,
  },
  emptyTxt: {
    fontSize: normalized(16),
    fontWeight: "500",
    fontFamily: AppFonts.PoppinsMedium,
    color: AppColors.black.black,
    textAlign: "justify",
  },
  txtCont: {
    flexDirection: "row",
    gap: normalized(5),
    alignItems: "center",
    // alignSelf: "center",
    marginTop: normalized(5),
  },
  title: {
    fontSize: normalized(14),
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsMedium,
  },
  divider: {
    width: normalized(0.5),
    height: normalized(13),
    backgroundColor: AppColors.black.black,
    marginHorizontal: normalized(5),
    borderRadius: normalized(10),
  },
  productImg: {
    width: normalized(30),
    height: normalized(30),
    borderRadius: normalized(5),
  },
  productCont: {
    alignItems: "center",
  },
  productName: {
    color: AppColors.black.black,
    fontSize: normalized(14),
    fontFamily: AppFonts.PoppinsRegular,
    maxWidth: normalized(250),
  },
  horiDivider: {
    height: normalized(1),
    width: ScreenSize.width - normalized(160),
    backgroundColor: AppColors.grey.greyLevel3,
    alignSelf: "center",
    marginVertical: normalized(1),
  },
  priceCont: {
    height: normalized(28),
    paddingHorizontal: normalized(14),
    borderRadius: normalized(5),
    backgroundColor: AppColors.white.white,
    borderWidth: 1,
    borderColor: AppColors.themeColor.dark,
    alignItems: "center",
    justifyContent: "center",
    marginTop: normalized(-5),
  },
  priceTxt: {
    color: AppColors.themeColor.dark,
    fontFamily: AppFonts.PoppinsSemiBold,
    fontSize: normalized(13),
  },
  statusCont: {
    paddingHorizontal: normalized(6),
    // paddingVertical: normalized(1),
    borderBottomLeftRadius: normalized(8),
    borderTopRightRadius: normalized(8),
    position: "absolute",
    borderColor: AppColors.themeColor.dark,
    borderWidth: 1,
    right: 0,
    backgroundColor: AppColors.themeColor.dark,
  },
  statusTxt: {
    fontSize: normalized(12),
    color: AppColors.white.white,
    fontFamily: AppFonts.PoppinsSemiBold,
  },
  container: {
    flex: 1,
    paddingVertical: 5,
  },
  btnContainer: {
    height: normalized(40),
    borderRadius: normalized(8),
    overflow: "hidden",
    flexDirection: "row",
    backgroundColor: "#00000011",
    width: ScreenSize.width - normalized(40),
    alignSelf: "center",
    marginTop: normalized(10),
  },
  btn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animatedBtnContainer: {
    height: normalized(40),
    flexDirection: "row",
    position: "absolute",
    overflow: "hidden",
    backgroundColor: AppColors.themeColor.dark,
  },
  animatedBtn: {
    height: normalized(40),
    justifyContent: "center",
    alignItems: "center",
  },
  btnTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    width: ScreenSize.width,
    height: "100%",
  },
});
