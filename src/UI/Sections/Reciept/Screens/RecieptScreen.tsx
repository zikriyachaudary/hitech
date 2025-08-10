import {
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  AppImages,
  normalized,
  ScreenProps,
  ScreenSize,
} from "../../../../Utils/AppConstants";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import {
  setIsAlertShow,
  setShowToast,
} from "../../../../Redux/Reducers/AppReducers";
import { captureRef } from "react-native-view-shot";
import RNFS from "react-native-fs";
import { AppStrings } from "../../../../Utils/AppStrings";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";
import FilledButton from "../../../Components/CustomButton/FilledButton";
import { capitalizeFirstLetter } from "../../../../Utils/Helper";
import CommonDataManager from "../../../../Utils/CommonManager";

const RecieptScreen = (props: ScreenProps) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const dispatch = useDispatch();
  const data = props?.route?.params?.item;
  const receiptRef = useRef<any>();

  const requestPermission = async () => {
    if (Platform.OS === "android") {
      const permission =
        Platform.Version >= 33
          ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

      const result = await check(permission);
      if (result === RESULTS.GRANTED) return true;

      const requestResult = await request(permission);
      return requestResult === RESULTS.GRANTED;
    }

    if (Platform.OS === "ios") {
      const result = await check(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);
      if (result === RESULTS.GRANTED) {
        return true;
      }

      const requestResult = await request(
        PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY
      );
      return requestResult === RESULTS.GRANTED;
    }

    return false;
  };

  const saveToGallery = async () => {
    const hasPermission = await requestPermission();

    if (!hasPermission) {
      dispatch(
        setIsAlertShow({
          value: true,
          message: "Storage permission is required to save receipt.",
        })
      );

      return;
    }

    try {
      const uri = await captureRef<any>(receiptRef, {
        format: "png",
        quality: 1,
      });

      const destPath = `${
        RNFS.PicturesDirectoryPath
      }/receipt_${Date.now()}.png`;

      await RNFS.copyFile(uri, destPath);
      dispatch(
        setShowToast({
          type: AppStrings.ToastType.success,
          message: "Receipt saved to gallery.",
        })
      );
    } catch (err) {
      console.error("Error saving receipt:", err);
      dispatch(
        setShowToast({
          type: AppStrings.ToastType.error,
          message: "Could not save the receipt.",
        })
      );
    }
  };

  return (
    // <View style={AppStyles.MainStyle}>
    //   <View style={styles.mainCont}>
    //     <View ref={receiptRef} style={[styles.recieptOuterCont]}>
    //       <View style={styles.recieptCont}>
    //         <View style={styles.tickCont}>
    //           <View style={styles.tickInnerCont}>
    //             <Image source={AppImages.Home.tick} style={styles.tickImage} />
    //           </View>
    //         </View>

    //         <Text style={styles.header}>Payment Success</Text>
    //         <Text style={styles.amountTxt}>
    //           {`PKR ${Number(data?.orderPrice).toLocaleString("en-PK", {
    //             minimumFractionDigits: 2,
    //             maximumFractionDigits: 2,
    //           })}`}
    //         </Text>

    //         <View style={styles.divider} />

    //         <View style={styles.productCont}>
    //           <AppImageViewer
    //             source={{ uri: data?.products[0].images[0]?.url }}
    //             style={styles.productImg}
    //           />
    //           <Text style={styles.productName}>{data?.products[0].name}</Text>
    //           <Text
    //             style={styles.productName}
    //           >{`X ${data?.products[0].count}`}</Text>
    //         </View>

    //         <View style={styles.divider} />

    //         <View style={styles.rowCont}>
    //           <Text style={styles.keyTxt}>Reference Number</Text>
    //           <Text style={styles.valueTxt}>
    //             {Math.floor(100000000000 + Math.random() * 900000000000)}
    //           </Text>
    //         </View>
    //         <View style={styles.rowCont}>
    //           <Text style={styles.keyTxt}>Order ID</Text>
    //           <Text style={styles.valueTxt}>{data?.orderId}</Text>
    //         </View>
    //         <View style={styles.rowCont}>
    //           <Text style={styles.keyTxt}>Payment Time</Text>
    //           <Text style={styles.valueTxt}>
    //             {moment(data?.paymentTime).format("DD MMM YYYY, hh:mm A")}
    //           </Text>
    //         </View>
    //         <View style={styles.rowCont}>
    //           <Text style={styles.keyTxt}>Payment Method</Text>
    //           <Text style={styles.valueTxt}>{`${data?.paymentMethod}`}</Text>
    //         </View>
    //         <View style={styles.rowCont}>
    //           <Text style={styles.keyTxt}>Account Title</Text>
    //           <Text
    //             style={styles.valueTxt}
    //           >{`${selector?.userData?.fullName}`}</Text>
    //         </View>
    //         <View style={styles.rowCont}>
    //           <Text style={styles.keyTxt}>Account Number</Text>
    //           <Text style={styles.valueTxt}>
    //             {`${"*".repeat(
    //               data?.phoneNumber?.length - 4
    //             )}${data?.phoneNumber?.slice(-4)}`}
    //           </Text>
    //         </View>
    //         <View style={styles.divider} />
    //         <View style={styles.rowCont}>
    //           <Text style={styles.keyTxt}>Total Amount</Text>
    //           <Text style={styles.valueTxt}>
    //             {`PKR ${Number(data?.orderPrice).toLocaleString("en-PK", {
    //               minimumFractionDigits: 2,
    //               maximumFractionDigits: 2,
    //             })}`}
    //           </Text>
    //         </View>
    //         <View style={styles.stampCont}>
    //           <Image
    //             source={AppImages.payments.stamp}
    //             style={styles.stampImg}
    //           />
    //         </View>
    //       </View>
    //     </View>
    //     <View style={styles.btnCont}>
    //       <TouchableOpacity
    //         activeOpacity={0.8}
    //         style={styles?.btn}
    //         onPress={() => {
    //           saveToGallery();
    //         }}
    //       >
    //         <Text>Save to Gallery</Text>
    //       </TouchableOpacity>
    //       <TouchableOpacity
    //         activeOpacity={0.8}
    //         style={styles.btn}
    //         onPress={() => {
    //           props?.navigation?.pop(4);
    //         }}
    //       >
    //         <Text>Close</Text>
    //       </TouchableOpacity>
    //     </View>
    //   </View>
    // </View>

    <View style={{ flex: 1, backgroundColor: "#f3f5f9" }}>
      <SafeAreaView />
      <View style={styles.headerCont}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            props?.navigation?.goBack();
          }}
        >
          <Image source={AppImages.Home.backArrow} style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.invoiceTxt}>Invoice</Text>
        <Text style={styles.dateTxt}>
          {moment(new Date()).format("DD. MMM. YYYY")}
        </Text>
      </View>

      <View style={styles.infoCont}>
        <Text style={styles.infoTxt}>INFO</Text>
        <View style={styles.invoiceNoCont}>
          <Text style={styles.invoiceNo}>Invoice # 34435645</Text>
          {/* <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
            <Image source={AppImages.payments.copy} style={styles.copyImg} />
          </TouchableOpacity> */}
        </View>
        <Text style={styles.invoiceNo}>High Tech SMC-PVT LTD.</Text>
        <Text style={styles.invoiceNo}>
          Macleor Road, new Lakshami Chowk Lahore.
        </Text>
        <Text style={styles.lightTxt}>info@hitech.com</Text>
        <Text style={styles.lightTxt}>{"(+92) 324456675"}</Text>
      </View>

      <View style={styles.infoCont}>
        <Text style={styles.infoTxt}>CUSTOMER</Text>
        <Text style={styles.invoiceNo}>
          {CommonDataManager.getSharedInstance().capitalizeFirstLetter(
            data?.userDetail?.fullName
          )}
        </Text>
        <Text style={styles.invoiceNo}>{data?.userDetail?.phoneNumber}</Text>
      </View>

      <View style={styles.infoCont}>
        <View style={styles.header}>
          <Text style={styles.headerTxt}>PRODUCTS</Text>
        </View>
        <View style={styles.horiDivider} />
        <FlatList
          data={data?.products}
          renderItem={({ item, index }) => {
            return (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <Text style={styles.simpleTxt}>{index + 1}</Text>
                  <View style={styles.itemDivider} />
                  <View style={{ flex: 1 }}>
                    <View style={[styles.row, { flex: 1 }]}>
                      <Text style={styles.simpleTxt}>{item?.name}</Text>
                      <Text
                        style={styles.simpleTxt}
                      >{`${item?.price} /-`}</Text>
                    </View>
                    <Text style={styles.simpleTxt}>
                      {item?.category?.category}
                    </Text>

                    <View style={[styles.row, { flex: 1 }]}>
                      <Text
                        style={styles.simpleTxt}
                      >{`Quantity : ${item?.price} x ${item?.count}`}</Text>
                      <Text style={styles.simpleTxt}>
                        {`Subtotal : Rs. ${item?.price * item?.count}`}
                      </Text>
                    </View>
                  </View>
                </View>
                {data?.products?.length != index + 1 && (
                  <View style={[styles.horiDivider, { width: "50%" }]} />
                )}
              </View>
            );
          }}
        />

        <View
          style={[styles.horiDivider, { marginVertical: normalized(20) }]}
        />

        <View style={styles.totalCont}>
          <Text style={styles.simpleTxt}>Subtotal</Text>
          <Text style={styles.simpleTxt}>
            {`Rs. ${data?.products?.reduce((acc: any, item: any) => {
              return acc + item.price * item.count;
            }, 0)}`}
          </Text>
        </View>
        <View style={styles.totalCont}>
          <Text style={styles.simpleTxt}>Discount</Text>
          <Text style={styles.simpleTxt}>{`0 %`}</Text>
        </View>

        <View style={styles.totalCont}>
          <Text style={styles.simpleTxt}>Grand Total</Text>
          <Text style={styles.simpleTxt}>
            {`Rs. ${data?.products?.reduce((acc: any, item: any) => {
              return acc + item.price * item.count;
            }, 0)}`}
          </Text>
        </View>
      </View>

      <View style={styles.bottomCont}>
        <Text style={styles.priceTxt}>{`Rs. ${data?.products?.reduce(
          (acc: any, item: any) => {
            return acc + item.price * item.count;
          },
          0
        )}`}</Text>
        <TouchableOpacity onPress={() => {}} style={styles.btnCont}>
          <Text style={styles.btnTxt}>Print</Text>
          <Image source={AppImages.Home.printer} style={styles.printerImg} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecieptScreen;

const styles = StyleSheet.create({
  headerCont: {
    flexDirection: "row",
    alignItems: "center",
    gap: normalized(10),
    paddingHorizontal: AppHorizontalMargin,
    height: normalized(50),
    backgroundColor: AppColors.white.white,
    shadowColor: AppColors.black.black,
    shadowOffset: {
      width: 0,
      height: Platform.OS == "ios" ? 0 : 4,
    },
    shadowOpacity: 0.4,
    elevation: 4,
  },
  backArrow: {
    width: normalized(30),
    height: normalized(30),
    resizeMode: "contain",
    tintColor: AppColors.black.black,
  },
  invoiceTxt: {
    color: AppColors.black.black,
    fontSize: normalized(15),
    fontFamily: AppFonts.PoppinsSemiBold,
    flex: 1,
  },
  dateTxt: {
    fontSize: normalized(12),
    fontFamily: AppFonts.PoppinsRegular,
    color: AppColors.grey.greyLevel5,
  },
  infoCont: {
    backgroundColor: AppColors.white.white,
    borderRadius: normalized(10),
    padding: normalized(8),
    marginHorizontal: normalized(12),
    marginTop: normalized(20),
  },
  infoTxt: {
    color: AppColors.grey.greyLevel2,
    fontFamily: AppFonts.PoppinsMedium,
    fontSize: normalized(12),
  },
  invoiceNo: {
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsSemiBold,
    fontSize: normalized(13),
    marginLeft: normalized(12),
    // marginTop: normalized(3),
  },
  invoiceNoCont: {
    flexDirection: "row",
    alignItems: "center",
    gap: normalized(15),
  },
  copyImg: {
    width: normalized(17),
    height: normalized(17),
    resizeMode: "contain",
    tintColor: AppColors.green.dark,
  },
  lightTxt: {
    color: AppColors.grey.greyLevel2,
    fontSize: normalized(12),
    fontFamily: AppFonts.PoppinsRegular,
    marginLeft: normalized(10),
  },
  header: {
    alignItems: "center",
    marginTop: normalized(5),
    marginHorizontal: normalized(6),
  },
  headerTxt: {
    color: AppColors.grey.greyLevel2,
    fontFamily: AppFonts.PoppinsMedium,
    fontSize: normalized(11),
    alignSelf: "center",
  },
  horiDivider: {
    backgroundColor: AppColors.grey.greyLevel1,
    width: "100%",
    height: normalized(1),
    marginVertical: normalized(5),
    alignSelf: "center",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  bottomCont: {
    height: normalized(75),
    width: "100%",
    flexDirection: "row",
    backgroundColor: AppColors.white.white,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: normalized(20),
    position: "absolute",
    bottom: 0,
    borderWidth: 1,
    borderTopColor: AppColors.grey.greyLevel0,
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
  simpleTxt: {
    fontSize: normalized(12),
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsMedium,
  },
  itemDivider: {
    width: normalized(1.8),
    height: normalized(15),
    borderRadius: normalized(20),
    backgroundColor: AppColors.black.black,
    marginHorizontal: normalized(8),
  },
  totalCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: normalized(60),
    marginBottom: normalized(8),
  },
  priceTxt: {
    fontSize: normalized(15),
    fontFamily: AppFonts.PoppinsSemiBold,
    color: AppColors.black.black,
  },
  btnCont: {
    paddingHorizontal: normalized(20),
    paddingVertical: normalized(5),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: normalized(50),
    backgroundColor: AppColors.green.dark,
    flexDirection: "row",
    gap: normalized(5),
  },
  btnTxt: {
    fontSize: normalized(14),
    fontFamily: AppFonts.PoppinsBold,
    color: AppColors.white.white,
    marginTop: normalized(3),
  },
  printerImg: {
    width: normalized(22),
    height: normalized(22),
    resizeMode: "contain",
    tintColor: AppColors.white.white,
  },
});

// const styles = StyleSheet.create({
//   mainCont: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     marginHorizontal: normalized(30),
//   },
//   recieptOuterCont: {
//     marginHorizontal: normalized(30),

//     paddingTop: normalized(40),
//     backgroundColor: AppColors.white.white,
//     width: "100%",
//   },
//   recieptCont: {
//     paddingBottom: normalized(30),
//     borderRadius: normalized(15),
//     shadowColor: AppColors.black.black,
//     shadowOffset: {
//       width: 4,
//       height: 4,
//     },
//     shadowOpacity: 0.4,
//     shadowRadius: 10,
//     elevation: 10,
//     backgroundColor: AppColors.white.white,
//     width: "100%",
//   },
//   tickImage: {
//     width: normalized(20),
//     height: normalized(20),
//     resizeMode: "contain",
//     tintColor: AppColors.white.white,
//   },
//   tickInnerCont: {
//     borderRadius: normalized(150),
//     backgroundColor: AppColors.green.dark,
//     width: normalized(40),
//     height: normalized(40),
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   tickCont: {
//     width: normalized(60),
//     height: normalized(60),
//     borderRadius: normalized(50),
//     backgroundColor: AppColors.green.light,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: normalized(-30),
//     alignSelf: "center",
//   },
//   header: {
//     fontSize: normalized(14),
//     fontFamily: AppFonts.PoppinsRegular,
//     color: AppColors.black.black,
//     marginTop: normalized(15),
//     alignSelf: "center",
//   },
//   amountTxt: {
//     fontSize: normalized(18),
//     fontFamily: AppFonts.PoppinsSemiBold,
//     color: AppColors.black.black,
//     alignSelf: "center",
//   },
//   divider: {
//     backgroundColor: AppColors.grey.greyLevel1,
//     width: "80%",
//     height: normalized(1),
//     alignSelf: "center",
//     marginVertical: normalized(20),
//   },
//   rowCont: {
//     width: "85%",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     alignSelf: "center",
//     marginTop: normalized(4),
//   },
//   keyTxt: {
//     fontSize: normalized(12),
//     color: AppColors.black.black,
//     fontFamily: AppFonts.PoppinsRegular,
//   },
//   valueTxt: {
//     fontSize: normalized(13),
//     color: AppColors.black.black,
//     fontFamily: AppFonts.PoppinsSemiBold,
//   },
//   btnCont: {
//     flexDirection: "row",
//     width: "80%",
//     alignItems: "center",
//     gap: normalized(20),
//     justifyContent: "space-around",
//     marginTop: normalized(30),
//   },
//   btn: {
//     height: normalized(45),
//     borderWidth: 2,
//     borderColor: AppColors.green.dark,
//     borderRadius: normalized(8),
//     alignItems: "center",
//     justifyContent: "center",
//     flex: 1,
//     backgroundColor: AppColors.white.white,
//   },
//   stampImg: {
//     width: normalized(200),
//     height: normalized(200),
//     resizeMode: "contain",
//     marginTop: normalized(60),
//     opacity: 0.3,
//   },
//   stampCont: {
//     position: "absolute",
//     width: "100%",
//     height: "100%",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   productCont: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: normalized(10),
//     marginHorizontal: AppHorizontalMargin,
//   },
//   productImg: {
//     width: normalized(30),
//     height: normalized(30),
//     borderRadius: normalized(8),
//     resizeMode: "cover",
//     overflow: "hidden",
//   },
//   productName: {
//     fontSize: normalized(14),
//     color: AppColors.black.black,
//     fontFamily: AppFonts.PoppinsMedium,
//   },
// });
