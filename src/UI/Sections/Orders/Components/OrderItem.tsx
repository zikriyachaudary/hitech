import {
  Platform,
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
  ScreenSize,
} from "../../../../Utils/AppConstants";
import AppImageViewer from "../../../Components/AppImageView";
import { ORDER_STATUS } from "../../../../Utils/AppStrings";
import { useSelector } from "react-redux";

const OrderItem = ({ item, onPress }: any) => {
  const selector = useSelector((state: any) => state.SliceReducer);
  const isRtl = selector?.isRtl;
  const isAdmin = selector?.userData?.isAdmin;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        onPress(item);
      }}
      style={styles.cont}
    >
      {!isAdmin && (
        <View style={styles.statusCont}>
          <Text style={styles.statusTxt}>
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
        <Text
          style={[
            styles.priceTxt,
            {
              marginTop:
                isRtl && Platform.OS == "ios" ? normalized(-5) : normalized(5),
            },
          ]}
        >
          {isRtl
            ? `${Math.floor(item?.orderPrice || 0)} روپے`
            : `Rs. ${Math.floor(item?.orderPrice || 0)}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
  cont: {
    paddingHorizontal: normalized(15),
    borderRadius: normalized(10),
    // marginTop: normalized(10),
    gap: normalized(10),
    backgroundColor: AppColors.white.white,
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
    // height: normalized(28),
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
