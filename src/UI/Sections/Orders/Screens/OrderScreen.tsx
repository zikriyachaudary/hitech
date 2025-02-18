import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import AppImageViewer from "../../../Components/AppImageView";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  normalized,
  ScreenSize,
} from "../../../../Utils/AppConstants";
import { getUserOrdersList } from "../../../../Network/Services/GeneralServices";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoader } from "../../../../Redux/Reducers/AppReducers";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import SimpleHeader from "../../../Components/CustomHeader/SimpleHeader";

const OrderScreen = () => {
  const selector = useSelector((state: any) => state.SliceReducer);
  const userData = selector?.userData;
  const [ordersList, setOrdersList] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (ordersList?.length == 0) dispatch(setIsLoader(true));
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

  console.log("ordersList ---->>>  ", ordersList?.length);

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <SimpleHeader Text={"Order History"} />
      {ordersList?.length > 0 ? (
        <FlatList
          data={ordersList}
          keyExtractor={(index, item) => `${index}`}
          style={{
            // marginHorizontal: normalized(20),
            marginBottom: normalized(25),
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }: any) => {
            return (
              <View style={styles.cont}>
                <View style={styles.txtCont}>
                  <Text style={styles.title}>{`Order ID`}</Text>
                  <View style={styles.divider} />
                  <Text style={styles.title}>{item?.orderId}</Text>
                </View>
                {item?.products?.map((product: any, index: any) => (
                  <>
                    <View key={index} style={styles.productCont}>
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
                        {product?.name}
                      </Text>
                    </View>
                    {item?.products?.length - 1 != index && (
                      <View style={styles.horiDivider} />
                    )}
                  </>
                ))}
                <View style={styles.priceCont}>
                  <Text style={styles.priceTxt}>
                    {`Rs. ${Math.floor(item?.orderPrice || 0)}`}
                  </Text>
                </View>
              </View>
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
    // alignItems: "center",
    // height: normalized(100),
    paddingHorizontal: normalized(15),
    borderRadius: normalized(10),
    marginTop: normalized(20),
    gap: normalized(10),
    shadowColor: AppColors.black.black,
    shadowOpacity: 0.3,
    elevation: 3,
    backgroundColor: AppColors.white.white,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    marginHorizontal: AppHorizontalMargin,
    paddingBottom: normalized(10),
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
    width: normalized(2),
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
    flexDirection: "row",
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
    // width: normalized(100),
    height: normalized(28),
    paddingHorizontal: normalized(14),
    borderRadius: normalized(25),
    backgroundColor: AppColors.white.white,
    alignSelf: "flex-end",
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
