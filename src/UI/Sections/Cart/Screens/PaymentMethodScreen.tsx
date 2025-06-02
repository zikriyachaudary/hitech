import {
  Image,
  I18nManager,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import {
  AppColors,
  AppFonts,
  AppImages,
  normalized,
  ScreenProps,
} from "../../../../Utils/AppConstants";
import { AppStyles } from "../../../../Utils/AppStyles";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import FilledButton from "../../../Components/CustomButton/FilledButton";
import {
  setIsLoader,
  setShowToast,
  setTab,
  updateCartDetail,
} from "../../../../Redux/Reducers/AppReducers";
import { placeOrderReq } from "../../../../Network/Services/ProductServices";
import { AppStrings, NOTIFICATIONS_TYPES } from "../../../../Utils/AppStrings";
import CommonDataManager from "../../../../Utils/CommonManager";
import { fetchAdminDetailReq } from "../../../../Network/Services/GeneralServices";
import NotificationManager from "../../../../Hooks/NotificationsManager";

const PaymentMethodScreen = (props: ScreenProps) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const { updateNotificationFunc } = NotificationManager();
  const isRtl = selector?.isRtl;
  const userData = selector?.userData;
  const dispatch = useDispatch();
  const data = props?.route?.params?.data;
  const [selectedWallet, setSelectedWallet] = useState("");
  const [cnic, setCnic] = useState("");
  const [accNumber, setAccNumber] = useState("");
  const [cnicError, setCnicError] = useState("");
  const [accNumberError, setAccNumberError] = useState("");
  const [walletError, setWalletError] = useState(false);
  const cnicRef = useRef(null);
  const [prevCnic, setPrevCnic] = useState("");

  const focusNextField = (inputRef: any) => {
    if (inputRef?.current) {
      inputRef?.current?.focus();
    }
  };

  const handleCnicChange = (value: string, prevValue: string, setCnic: any) => {
    let raw = value.replace(/\D/g, "").slice(0, 13);
    if (prevValue.length > value.length) {
      if (prevValue[prevValue.length - 1] === "-") {
        raw = raw.slice(0, raw.length - 1);
      }
    }

    let formatted = "";
    for (let i = 0; i < raw.length; i++) {
      formatted += raw[i];
      if (i === 4 || i === 11) {
        formatted += "-";
      }
    }

    setCnic(formatted);
  };

  const onPayNow = async () => {
    let isFormValid = true;

    const rawPhone = accNumber.replace(/\D/g, "");
    const rawCnic = cnic.replace(/\D/g, "");

    if (!selectedWallet) {
      setWalletError(true);
      isFormValid = false;
    }

    if (!accNumber) {
      setAccNumberError(
        isRtl ? "فون نمبر درج کریں" : "Please enter phone number"
      );
      isFormValid = false;
    } else if (rawPhone.length !== 11) {
      setAccNumberError(
        isRtl
          ? "فون نمبر 11 ہندسوں پر مشتمل ہونا چاہیے"
          : "Phone number must be 11 digits long"
      );
      isFormValid = false;
    }

    if (!cnic) {
      setCnicError(
        isRtl ? "شناختی کارڈ نمبر درج کریں" : "Please enter CNIC number"
      );
      isFormValid = false;
    } else if (rawCnic.length !== 13) {
      setCnicError(
        isRtl
          ? "شناختی کارڈ نمبر 13 ہندسوں پر مشتمل ہونا چاہیے"
          : "CNIC must be 13 digits long"
      );
      isFormValid = false;
    }

    if (!isFormValid) return;

    dispatch(setIsLoader(true));

    ////////
    await fetchAdminDetailReq(async (adminObj: any) => {
      if (!adminObj) {
        dispatch(setIsLoader(false));
        return;
      }
      const notificatinObj = {
        title: `Payment Recieved`,
        body: `Payment Recieved against Order ID ${data?.orderId}`,
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
          email: userData?.email,
          name: userData?.firstName + " " + userData?.lastName,
          profile: userData?.profileImage || userData?.profile,
          userId: userData?.userId,
        },
      };
      await placeOrderReq(data, async (resp: any) => {
        if (resp?.status) {
          await updateNotificationFunc(notificatinObj);
          dispatch(
            setShowToast({
              type: AppStrings.ToastType.success,
              message: resp?.message,
            })
          );
          dispatch(setTab(0));
          props?.navigation?.pop(3);
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
    });
  };

  return (
    <View
      style={[
        AppStyles.MainStyle,
        { flexDirection: isRtl ? "row-reverse" : "row" },
      ]}
    >
      <SafeAreaView />
      <View style={{ flex: 1 }}>
        <CustomHeader
          onPress={() => props?.navigation?.goBack()}
          Text={isRtl ? "ادائیگی کے طریقے" : "Payment Methods"}
        />
        <View style={{ flex: 1, marginHorizontal: normalized(20) }}>
          <Text
            style={[styles.walletHead, { textAlign: isRtl ? "right" : "left" }]}
          >
            {isRtl ? "والیٹ منتخب کریں" : "Select Wallet"}
          </Text>

          <View
            style={[
              styles.paymentMethods,
              { flexDirection: isRtl ? "row-reverse" : "row" },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setSelectedWallet("JazzCash"), setWalletError(false);
              }}
              style={[
                styles.methodItemCont,
                {
                  borderColor: walletError
                    ? AppColors.red.dark
                    : selectedWallet === "JazzCash"
                    ? AppColors.green.dark
                    : AppColors.grey.greyLevel2,
                  backgroundColor: walletError
                    ? AppColors.red.pink
                    : AppColors.white.white,
                },
              ]}
            >
              {selectedWallet === "JazzCash" && (
                <View style={styles.tickImgCont}>
                  <Image source={AppImages.Home.tick} style={styles.tickImg} />
                </View>
              )}
              <Image
                source={AppImages.payments.jazzcash}
                style={styles.bankImg}
              />
              <Text>{isRtl ? "جاز کیش" : "JazzCash"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setSelectedWallet("EasyPaisa"), setWalletError(false);
              }}
              style={[
                styles.methodItemCont,
                {
                  borderColor: walletError
                    ? AppColors.red.dark
                    : selectedWallet === "EasyPaisa"
                    ? AppColors.green.dark
                    : AppColors.grey.greyLevel2,
                  backgroundColor: walletError
                    ? AppColors.red.pink
                    : AppColors.white.white,
                },
              ]}
            >
              {selectedWallet === "EasyPaisa" && (
                <View style={styles.tickImgCont}>
                  <Image source={AppImages.Home.tick} style={styles.tickImg} />
                </View>
              )}
              <Image
                source={AppImages.payments.easypaisa}
                style={styles.bankImg}
              />
              <Text>{isRtl ? "ایزی پیسہ" : "EasyPaisa"}</Text>
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.simpleHeader,
              { textAlign: isRtl ? "right" : "left" },
            ]}
          >
            {isRtl ? "اکاؤنٹ نمبر:" : "Account Number:"}
          </Text>
          <CustomInput
            onSubmitEditing={() => focusNextField(cnicRef)}
            placeHold={isRtl ? "03xxxxxxxxxx" : "03xxxxxxxxxx"}
            placeHolderColor={AppColors.grey.greyLevel4}
            value={accNumber}
            keyboardType={"number-pad"}
            setValue={(val: string) => {
              const numericVal = val.replace(/\D/g, "");
              if (numericVal.length > 11) return;

              setAccNumber(numericVal);
              setAccNumberError("");
            }}
            errorMsg={accNumberError}
          />

          <View style={{ height: normalized(10) }} />

          <Text
            style={[
              styles.simpleHeader,
              { textAlign: isRtl ? "right" : "left" },
            ]}
          >
            {isRtl ? "شناختی کارڈ نمبر:" : "CNIC Number:"}
          </Text>
          <CustomInput
            inputRef={cnicRef}
            placeHold={isRtl ? "12345-6789012-3" : "12345-6789012-3"}
            placeHolderColor={AppColors.grey.greyLevel4}
            value={cnic}
            keyboardType={"number-pad"}
            setValue={(val: string) => {
              handleCnicChange(val, cnic, (formatted: string) => {
                setPrevCnic(cnic);
                setCnic(formatted);
                setCnicError("");
              });
            }}
            errorMsg={cnicError}
          />

          <FilledButton
            label={isRtl ? "ادائیگی کریں" : "Pay Now"}
            onPress={() => {
              onPayNow();
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default PaymentMethodScreen;

const styles = StyleSheet.create({
  bankImg: {
    width: normalized(80),
    height: normalized(80),
    resizeMode: "contain",
    margin: normalized(8),
  },
  methodItemCont: {
    borderRadius: normalized(10),
    borderWidth: 1,
    backgroundColor: AppColors.white.white,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: normalized(20),
    paddingVertical: normalized(10),
  },
  paymentMethods: {
    alignItems: "center",
    justifyContent: "center",
    gap: normalized(15),
    marginVertical: normalized(15),
  },
  tickImg: {
    resizeMode: "contain",
    tintColor: AppColors.white.white,
    width: normalized(13),
    height: normalized(13),
  },
  tickImgCont: {
    width: normalized(18),
    height: normalized(18),
    borderRadius: normalized(25),
    backgroundColor: AppColors.green.dark,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: normalized(5),
    right: normalized(5),
    zIndex: 99,
  },
  walletHead: {
    color: AppColors.black.black,
    fontSize: normalized(15),
    fontFamily: AppFonts.PoppinsSemiBold,
    marginTop: normalized(10),
  },
  simpleHeader: {
    fontSize: normalized(13),
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsSemiBold,
    marginBottom: normalized(2),
  },
});
