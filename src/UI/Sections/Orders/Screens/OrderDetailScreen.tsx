import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  normalized,
  ScreenProps,
  ScreenSize,
} from "../../../../Utils/AppConstants";
import { AppStyles } from "../../../../Utils/AppStyles";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import { useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import AppImageViewer from "../../../Components/AppImageView";
import LinearGradient from "react-native-linear-gradient";
import { Routes } from "../../../../Utils/Routes";
import FilledButton from "../../../Components/CustomButton/FilledButton";
import UnFilledButton from "../../../Components/CustomButton/UnFilledButton";
import { ORDER_STATUS } from "../../../../Utils/AppStrings";

const OrderDetailScreen = (props: ScreenProps) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;
  const item = props?.route?.params?.item;
  console.log("item?.products ----  ", item);
//   ---->>>  RTL Needed
  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <CustomHeader
        title={isRtl ? "آرڈر کی تفصیلات" : "Order Details"}
        onPress={() => props?.navigation?.goBack()}
        rightIconCont={{
          width: normalized(33),
          height: normalized(33),
          borderColor: AppColors.red.dark,
          borderRadius: normalized(40),
          borderWidth: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: AppColors.white.white,
        }}
        rightIconStyle={{
          width: normalized(20),
          height: normalized(20),
          tintColor: AppColors.red.dark,
        }}
      />
      <ScrollView>

        <Text style = {styles.orderId}>{`Order ID: LKSJDF-ASDF`}</Text>
        <View style={styles.userMainCont}>
          <Text style={styles.headTxt}>
            {isRtl ? "کسٹمر کی تفصیلات" : "Customer Details"}
          </Text>

          <View style={styles.userCont}>
            <AppImageViewer
              source={{ uri: item?.userDetail?.profileImage }}
              style={styles.profileImg}
            />
            <View>
              <Text style={styles.userTxt} numberOfLines={1}>
                {item?.userDetail?.fullName}
              </Text>
              <View style={styles.divider} />
              <Text style={styles.userTxt} numberOfLines={1}>
                {item?.userDetail?.phoneNumber}
              </Text>
              <View style={styles.divider} />
              <Text style={styles.userTxt} numberOfLines={1}>
                {item?.userDetail?.email}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.userMainCont}>
          <Text style={styles.headTxt}>
            {isRtl ? "آرڈر کی تفصیلات" : "Order Details"}
          </Text>
          {item?.products?.map((product, index) => (
            <>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  props?.navigation?.navigate(Routes.Home.productDetail, {
                    item: product,
                    isFromAdmin: true,
                  })
                }
                key={index}
                style={[
                  styles.userCont,
                  { flexDirection: isRtl ? "row-reverse" : "row" },
                ]}
              >
                <AppImageViewer
                  source={{ uri: product?.images[0]?.url }}
                  style={styles.productImg}
                />
                <View>
                  <Text style={styles.userTxt} numberOfLines={1}>
                    {isRtl ? product?.rtlName : product?.name}
                  </Text>
                  <View style={styles.divider} />
                  <Text
                    style={[
                      styles.userTxt,
                      {
                        textAlign: isRtl ? "right" : "left",
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {isRtl ? product?.rtlDescription : product?.description}
                  </Text>
                  <View style={styles.divider} />
                  <Text style={styles.userTxt} numberOfLines={1}>
                    {isRtl
                      ? `قیمت : ${product?.price}`
                      : `Price : ${product?.price}`}
                  </Text>
                </View>
                <View style={styles.verDiv} />
                <Text style={styles.countTxt} numberOfLines={1}>
                  X{product?.count}
                </Text>
              </TouchableOpacity>
              {item?.products?.length - 1 == index && (
                <View style={styles.prodductDiv} />
              )}
            </>
          ))}
           <View
            style={{
              width: ScreenSize.width - normalized(80),
              alignSelf: "center",
              backgroundColor: AppColors.black.black,
              height: normalized(0.8),
              marginVertical: normalized(10),
            }}
          />
        </View>

        <View style = {styles.statusBtnCont} >
       <TouchableOpacity
       activeOpacity={0.8}
       style = {[styles.btn, {
        backgroundColor: item?.orderStatus == ORDER_STATUS.Order_Placed ? AppColors.themeColor.dark : AppColors.white.white,
       }]}
            onPress={()=>{}}
>
        <Text style = {[styles.btnTxt,{
          color: item?.orderStatus == ORDER_STATUS.Order_Placed ? AppColors.white.white : AppColors.themeColor.dark
        }]}>Pending</Text>
       </TouchableOpacity>
       <TouchableOpacity
       activeOpacity={0.8}
       style = {[styles.btn, {
        backgroundColor: item?.orderStatus == ORDER_STATUS.Dispatched ? AppColors.themeColor.dark : AppColors.white.white,
       }]}
            onPress={()=>{}}
>
        <Text style = {[styles.btnTxt,{
          color: item?.orderStatus == ORDER_STATUS.Dispatched ? AppColors.white.white : AppColors.themeColor.dark
        }]}>Dispatched</Text>
       </TouchableOpacity>

         <TouchableOpacity
       activeOpacity={0.8}
       style = {[styles.btn, {
        backgroundColor: item?.orderStatus == ORDER_STATUS.Dispatched ? AppColors.themeColor.dark : AppColors.white.white,
       }]}
            onPress={()=>{}}
>
        <Text style = {[styles.btnTxt,{
          color: item?.orderStatus == ORDER_STATUS.Returned ? AppColors.white.white : AppColors.themeColor.dark
        }]}>Refund</Text>
       </TouchableOpacity>
       </View>
      </ScrollView>
    </View>
  );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({
  profileImg: {
    width: normalized(100),
    height: normalized(100),
    borderRadius: normalized(10),
  },
  userCont: {
    flexDirection: "row",
    alignItems: "center",
    gap: normalized(10),
    padding: normalized(10),
  },
  divider: {
    backgroundColor: AppColors.grey.greyLevel8,
    height: normalized(0.5),
    borderRadius: normalized(2),
    width: normalized(200),
    marginVertical: normalized(6),
  },
  userTxt: {
    fontSize: normalized(13),
    fontFamily: AppFonts.PoppinsMedium,
    color: AppColors.black.black,
    maxWidth: normalized(200),
  },
  userMainCont: {
    borderRadius: normalized(10),
    borderColor: AppColors.grey.greyLevel2,
    borderWidth: 0.5,
    marginHorizontal: normalized(10),
    marginVertical: normalized(15),
  },
  headTxt: {
    fontSize: normalized(15),
    fontFamily: AppFonts.PoppinsSemiBold,
    color: AppColors.black.black,
    alignSelf: "center",
    marginTop: normalized(10),
    textDecorationLine: "underline",
  },
  productImg: {
    width: normalized(80),
    height: normalized(80),
    borderRadius: normalized(10),
  },
  verDiv: {
    height: normalized(30),
    width: normalized(1),
    backgroundColor: AppColors.grey.greyLevel4,
    borderRadius: normalized(10),
  },
  countTxt: {
    fontSize: normalized(16),
    fontFamily: AppFonts.PoppinsSemiBold,
    color: AppColors.black.black,
  },
  prodductDiv: {
    height: normalized(0.5),
    backgroundColor: AppColors.black.black,
    marginHorizontal: AppHorizontalMargin,
    marginVertical: normalized(5),
  },
  statusBtnCont: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: normalized(10),
    marginBottom: normalized(20)
  },
  btn: {
    paddingHorizontal: normalized(10),
    paddingVertical: normalized(8),
    borderRadius: normalized(8),
    borderColor: AppColors.themeColor.dark,
    borderWidth: 1
  },
  btnTxt: {
    fontSize: normalized(14),
    fontFamily: AppFonts.PoppinsSemiBold
  },
  orderId: {
    fontSize: normalized(14),
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsSemiBold,
    alignSelf: 'center',
    textDecorationLine: 'underline',
    marginTop: normalized(10)
  }
});
