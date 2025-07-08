import {
  Image,
  PermissionsAndroid,
  Platform,
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
  AppImages,
  normalized,
  ScreenProps,
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
    <View style={AppStyles.MainStyle}>
      <View style={styles.mainCont}>
        <View ref={receiptRef} style={[styles.recieptOuterCont]}>
          <View style={styles.recieptCont}>
            <View style={styles.tickCont}>
              <View style={styles.tickInnerCont}>
                <Image source={AppImages.Home.tick} style={styles.tickImage} />
              </View>
            </View>

            <Text style={styles.header}>Payment Success</Text>
            <Text style={styles.amountTxt}>
              {`PKR ${Number(data?.orderPrice).toLocaleString("en-PK", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
            </Text>

            <View style={styles.divider} />

            <View style={styles.rowCont}>
              <Text style={styles.keyTxt}>Reference Number</Text>
              <Text style={styles.valueTxt}>
                {Math.floor(100000000000 + Math.random() * 900000000000)}
              </Text>
            </View>
            <View style={styles.rowCont}>
              <Text style={styles.keyTxt}>Order ID</Text>
              <Text style={styles.valueTxt}>{data?.orderId}</Text>
            </View>
            <View style={styles.rowCont}>
              <Text style={styles.keyTxt}>Payment Time</Text>
              <Text style={styles.valueTxt}>
                {moment(data?.paymentTime).format("DD MMM YYYY, hh:mm A")}
              </Text>
            </View>
            <View style={styles.rowCont}>
              <Text style={styles.keyTxt}>Payment Method</Text>
              <Text style={styles.valueTxt}>{`${data?.paymentMethod}`}</Text>
            </View>
            <View style={styles.rowCont}>
              <Text style={styles.keyTxt}>Account Title</Text>
              <Text
                style={styles.valueTxt}
              >{`${selector?.userData?.fullName}`}</Text>
            </View>
            <View style={styles.rowCont}>
              <Text style={styles.keyTxt}>Account Number</Text>
              <Text style={styles.valueTxt}>
                {`${"*".repeat(
                  data?.phoneNumber?.length - 4
                )}${data?.phoneNumber?.slice(-4)}`}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.rowCont}>
              <Text style={styles.keyTxt}>Total Amount</Text>
              <Text style={styles.valueTxt}>
                {`PKR ${Number(data?.orderPrice).toLocaleString("en-PK", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
              </Text>
            </View>
            <View style={styles.stampCont}>
              <Image
                source={AppImages.payments.stamp}
                style={styles.stampImg}
              />
            </View>
          </View>
        </View>
        <View style={styles.btnCont}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles?.btn}
            onPress={() => {
              saveToGallery();
            }}
          >
            <Text>Save to Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.btn}
            onPress={() => {
              props?.navigation?.pop(4);
            }}
          >
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RecieptScreen;

const styles = StyleSheet.create({
  mainCont: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: normalized(30),
  },
  recieptOuterCont: {
    marginHorizontal: normalized(30),

    paddingTop: normalized(40),
    backgroundColor: AppColors.white.white,
    width: "100%",
  },
  recieptCont: {
    paddingBottom: normalized(30),
    borderRadius: normalized(15),
    shadowColor: AppColors.black.black,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    backgroundColor: AppColors.white.white,
    width: "100%",
  },
  tickImage: {
    width: normalized(20),
    height: normalized(20),
    resizeMode: "contain",
    tintColor: AppColors.white.white,
  },
  tickInnerCont: {
    borderRadius: normalized(150),
    backgroundColor: AppColors.green.dark,
    width: normalized(40),
    height: normalized(40),
    alignItems: "center",
    justifyContent: "center",
  },
  tickCont: {
    width: normalized(60),
    height: normalized(60),
    borderRadius: normalized(50),
    backgroundColor: AppColors.green.light,
    alignItems: "center",
    justifyContent: "center",
    marginTop: normalized(-30),
    alignSelf: "center",
  },
  header: {
    fontSize: normalized(14),
    fontFamily: AppFonts.PoppinsRegular,
    color: AppColors.black.black,
    marginTop: normalized(15),
    alignSelf: "center",
  },
  amountTxt: {
    fontSize: normalized(18),
    fontFamily: AppFonts.PoppinsSemiBold,
    color: AppColors.black.black,
    alignSelf: "center",
  },
  divider: {
    backgroundColor: AppColors.grey.greyLevel1,
    width: "80%",
    height: normalized(1),
    alignSelf: "center",
    marginVertical: normalized(20),
  },
  rowCont: {
    width: "85%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
    marginTop: normalized(4),
  },
  keyTxt: {
    fontSize: normalized(12),
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsRegular,
  },
  valueTxt: {
    fontSize: normalized(13),
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsSemiBold,
  },
  btnCont: {
    flexDirection: "row",
    width: "80%",
    alignItems: "center",
    gap: normalized(20),
    justifyContent: "space-around",
    marginTop: normalized(30),
  },
  btn: {
    height: normalized(45),
    borderWidth: 2,
    borderColor: AppColors.green.dark,
    borderRadius: normalized(8),
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: AppColors.white.white,
  },
  stampImg: {
    width: normalized(200),
    height: normalized(200),
    resizeMode: "contain",
    marginTop: normalized(60),
    opacity: 0.3,
  },
  stampCont: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
