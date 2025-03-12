import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  AppImages,
  normalized,
  ScreenProps,
  ScreenSize,
} from "../../../../Utils/AppConstants";
import { AppStyles } from "../../../../Utils/AppStyles";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import AppImageViewer from "../../../Components/AppImageView";
import FilledButton from "../../../Components/CustomButton/FilledButton";
import { AppStrings, USER_TYPE } from "../../../../Utils/AppStrings";
import { Routes } from "../../../../Utils/Routes";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import { updatedUserReq } from "../../../../Network/Services/AuthServices";
import {
  setIsLoader,
  setShowToast,
} from "../../../../Redux/Reducers/AppReducers";

const UserOrderDetailScreen = (props: ScreenProps) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;
  const dispatch = useDispatch();

  const item = props?.route?.params?.item;

  const [totalPrice, setTotalPrice] = useState("0");

  const calculateTotalPrice = (user: any) => {
    if (!user?.orders || !Array.isArray(user.orders)) {
      return 0;
    }

    const price = user.orders.reduce((total: any, order: any) => {
      return total + parseFloat(order.orderPrice);
    }, 0);
    setTotalPrice(price);
  };

  useEffect(() => {
    calculateTotalPrice(item);
  }, []);

  const onSwitchUser = async () => {
    dispatch(setIsLoader(true));
    await updatedUserReq(
      item?.id,
      { userType: USER_TYPE.Gold },
      (resp: any) => {
        if (resp?.status) {
          dispatch(
            setShowToast({
              type: AppStrings.ToastType.success,
              message: "Success",
            })
          );
          dispatch(setIsLoader(false));
          props?.navigation?.goBack();
        } else {
          dispatch(
            setShowToast({
              type: AppStrings.ToastType.error,
              message: "Network Error",
            })
          );
          dispatch(setIsLoader(false));
        }
      }
    );
  };

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <CustomHeader
        title={isRtl ? "صارف کے آرڈر کی تفصیل" : "User Order Detail"}
        onPress={() => props.navigation.goBack()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.userCont}>
          <View style={styles.imgCont}>
            <AppImageViewer
              source={{ uri: item?.profileImage }}
              style={styles.profileImg}
            />
            {item?.userType == USER_TYPE.Silver ? (
              <View style={styles.silverCont}>
                <Image
                  source={AppImages.Home.star}
                  style={{
                    width: normalized(18),
                    height: normalized(18),
                    resizeMode: "contain",
                    tintColor: AppColors.white.white,
                  }}
                />
              </View>
            ) : (
              <View style={styles.goldCont}>
                <Image
                  source={AppImages.Home.goldBadge}
                  style={{
                    width: normalized(35),
                    height: normalized(35),
                    resizeMode: "contain",
                  }}
                />
              </View>
            )}
          </View>
          <View style={{ height: normalized(10) }} />
          <View
            style={{
              ...styles.rowCont,
              flexDirection: isRtl ? "row-reverse" : "row",
            }}
          >
            <Image source={AppImages.User.user} style={styles.icon} />
            <View style={styles.divider} />
            <Text
              style={{
                ...styles.title,
                textAlign: isRtl ? "right" : "left",
              }}
            >
              {item?.fullName}
            </Text>
          </View>
          <View
            style={{
              ...styles.rowCont,
              flexDirection: isRtl ? "row-reverse" : "row",
            }}
          >
            <Image source={AppImages.User.email} style={styles.icon} />
            <View style={styles.divider} />
            <Text
              style={{ ...styles.title, textAlign: isRtl ? "right" : "left" }}
            >
              {item?.email}
            </Text>
          </View>
          <View
            style={{
              ...styles.rowCont,
              flexDirection: isRtl ? "row-reverse" : "row",
            }}
          >
            <Image source={AppImages.User.phone} style={styles.icon} />
            <View style={styles.divider} />
            <Text
              style={{ ...styles.title, textAlign: isRtl ? "right" : "left" }}
            >
              {item?.phoneNumber}
            </Text>
          </View>
          <View
            style={{
              ...styles.rowCont,
              flexDirection: isRtl ? "row-reverse" : "row",
            }}
          >
            <Image source={AppImages.User.orders} style={styles.icon} />
            <View style={styles.divider} />
            <Text
              style={{ ...styles.title, textAlign: isRtl ? "right" : "left" }}
            >
              {isRtl
                ? "آرڈرز " + `${item?.orders?.length}`
                : `${item?.orders?.length} Orders`}
            </Text>
          </View>
          <View
            style={{
              ...styles.rowCont,
              flexDirection: isRtl ? "row-reverse" : "row",
            }}
          >
            <Image source={AppImages.User.amount} style={styles.icon} />
            <View style={styles.divider} />
            <Text
              style={{ ...styles.title, textAlign: isRtl ? "right" : "left" }}
            >
              {`${totalPrice} PKR`}
            </Text>
          </View>
          {item?.userType == USER_TYPE.Silver ? (
            <FilledButton
              onPress={onSwitchUser}
              label={"Switch to Gold User"}
              mainContainer={{
                height: normalized(40),
                backgroundColor: AppColors.orange.sharp,
              }}
            />
          ) : (
            <View style={{ height: normalized(15) }} />
          )}
        </View>

        {/* Orders listing start here  */}

        <View style={styles.mainCont}>
          {item?.orders.map((item: any, index: any) => (
            <View style={styles.orderCont}>
              <View style={styles.txtCont}>
                <Text style={styles.orderTitle}>{`Order ID - `}</Text>
                <Text style={styles.title}>{item?.orderId}</Text>
              </View>
              {item?.products.map((item: any, index: any) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  // onPress={() =>
                  //   props?.navigation?.navigate(Routes.Home.productDetail, {
                  //     item: item,
                  //   })
                  // }
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: normalized(10),
                    marginVertical: normalized(7),
                  }}
                >
                  <AppImageViewer
                    style={styles.productImg}
                    source={{ uri: item?.images?.[0]?.url }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {item?.name}
                    </Text>
                    <Text style={styles.productName} numberOfLines={1}>
                      {`X${item?.count}`}
                    </Text>
                  </View>
                  <Text style={{ ...styles.productName }} numberOfLines={1}>
                    {`Rs. ${item?.price}`}
                  </Text>
                </TouchableOpacity>
              ))}
              <View style={styles.horiDivider} />
              <View style={styles.totalPriceCont}>
                <Text style={{ ...styles.productName }} numberOfLines={1}>
                  Total Price{" "}
                </Text>
                <Text style={{ ...styles.productName }} numberOfLines={1}>
                  {`${item?.orderPrice} PKR`}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default UserOrderDetailScreen;

const styles = StyleSheet.create({
  profileImg: {
    width: normalized(120),
    height: normalized(120),
    resizeMode: "contain",
    borderRadius: normalized(6),
  },
  imgCont: {
    marginTop: normalized(-70),
    backgroundColor: AppColors.white.white,
    borderRadius: normalized(10),
    overflow: "visible",
    alignSelf: "center",
    shadowColor: AppColors.black.black,
    shadowRadius: normalized(3),
    padding: normalized(5),
    elevation: 4,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  userCont: {
    marginTop: normalized(80),
    marginHorizontal: normalized(30),
    borderRadius: normalized(10),
    backgroundColor: AppColors.white.white,
    shadowColor: AppColors.black.black,
    shadowRadius: normalized(3),
    elevation: 4,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    paddingTop: normalized(15),
    paddingHorizontal: normalized(15),
  },
  title: {
    fontSize: normalized(14),
    fontFamily: AppFonts.PoppinsRegular,
    color: AppColors.black.black,
    width: normalized(220),
  },
  orderTitle: {
    fontSize: normalized(14),
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsMedium,
    includeFontPadding: false,
  },
  icon: {
    resizeMode: "contain",
    width: normalized(20),
    height: normalized(20),
    tintColor: AppColors.themeColor.dark,
  },
  rowCont: {
    alignItems: "center",
    marginTop: normalized(5),
    gap: normalized(20),
  },
  divider: {
    width: normalized(1.8),
    borderRadius: normalized(10),
    height: normalized(16),
    backgroundColor: AppColors.themeColor.dark,
  },

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
    // backgroundColor: AppColors.white.white,
    backgroundColor: "red",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    marginHorizontal: AppHorizontalMargin,
    paddingBottom: normalized(10),
  },
  txtCont: {
    flexDirection: "row",
    gap: normalized(5),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: normalized(300),
    marginTop: normalized(5),
  },

  orderDivider: {
    width: normalized(2),
    height: normalized(13),
    backgroundColor: AppColors.black.black,
    marginHorizontal: normalized(5),
    borderRadius: normalized(10),
  },
  productImg: {
    width: normalized(45),
    height: normalized(45),
    borderRadius: normalized(8),
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
  orderCont: {
    padding: normalized(10),
    marginTop: normalized(15),
    shadowColor: AppColors.black.black,
    shadowOpacity: 0.3,
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    backgroundColor: AppColors.white.white,
    borderRadius: normalized(15),
  },
  mainCont: {
    marginHorizontal: AppHorizontalMargin,
    marginBottom: normalized(20),
  },
  totalPriceCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: normalized(10),
  },
  silverCont: {
    width: normalized(25),
    height: normalized(25),
    borderWidth: 1,
    backgroundColor: AppColors.grey.greyLevel8,
    borderColor: AppColors.grey.greyLevel8,
    borderRadius: normalized(30),
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: normalized(-5),
    right: normalized(-5),
    zIndex: 100,
  },
  goldCont: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: normalized(-10),
    right: normalized(-10),
  },
});
