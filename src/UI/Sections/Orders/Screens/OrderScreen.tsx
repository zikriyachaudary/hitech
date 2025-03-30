import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
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
  setIsLoader,
  setOrderList,
} from "../../../../Redux/Reducers/AppReducers";
import SimpleHeader from "../../../Components/CustomHeader/SimpleHeader";
import { Routes } from "../../../../Utils/Routes";

const OrderScreen = (props: ScreenProps) => {
  const selector = useSelector((state: any) => state.SliceReducer);
  const userData = selector?.userData;
  const isRtl = selector?.isRtl;
  const [ordersList, setOrdersList] = useState(selector?.ordersList);
  const [isFetched, setIsFetched] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selector?.userData?.isAdmin) {
      fetchAllOrders();
    } else {
      fetchOrders();
    }
  }, []);

  const fetchOrders = async () => {
    !selector?.ordersList[0] && dispatch(setIsLoader(true));
    await getUserOrdersList(userData?.userId, (resp: any) => {
      if (resp?.status) {
        setOrdersList(resp?.data);
        setIsFetched(true);
        dispatch(setOrderList(resp?.data));
      } else {
        setIsFetched(true);
      }
    });
    dispatch(setIsLoader(false));
  };

  const fetchAllOrders = async () => {
    dispatch(setIsLoader(true));
    await getAllOrdersList((resp: any) => {
      if (resp?.status) {
        setOrdersList(resp?.data);
        dispatch(setIsLoader(false));
      } else {
        dispatch(setIsLoader(false));
      }
    });
  };

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <SimpleHeader Text={isRtl ? "تمام آرڈرز" : "Order History"} />
      {ordersList?.length > 0 ? (
        <FlatList
          data={ordersList}
          keyExtractor={(index, item) => `${index}`}
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
                    props?.navigation?.navigate(Routes.Home.OrderDetailScreen, {
                      item,
                    });
                  } else {
                  }
                }}
                style={styles.cont}
              >
                <View style={styles.txtCont}>
                  <Text style={styles.title}>{`Order ID`}</Text>
                  <View style={styles.divider} />
                  <Text style={styles.title}>{item?.orderId}</Text>
                </View>
                {item?.products?.map((product: any, index: any) => (
                  <>
                    <View
                      key={index}
                      style={[
                        styles.productCont,
                        { flexDirection: isRtl ? "row-reverse" : "row" },
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
                    {item?.products?.length - 1 != index && (
                      <View style={styles.horiDivider} />
                    )}
                  </>
                ))}
                <View
                  style={[
                    styles.priceCont,
                    { alignSelf: isRtl ? "flex-start" : "flex-end" },
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
            <Text style={styles.emptyTxt}>
              {userData?.isAdmin
                ? "We're Working on this Screen"
                : "You have not placed an order yet. Once you make a purchase, yourorder details will appear here. Start exploring now and find the perfect parts for your vehicle!"}
            </Text>
          )}
        </View>
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
    borderColor: AppColors.grey.greyLevel2,
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
    alignSelf: "center",
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
});
