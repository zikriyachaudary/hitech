import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AppStyles } from "../../../../Utils/AppStyles";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  AppImages,
  hv,
  normalized,
} from "../../../../Utils/AppConstants";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import FilledButton from "../../../Components/CustomButton/FilledButton";
import auth from "@react-native-firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsAlertShow,
  setIsLoader,
  setShowToast,
} from "../../../../Redux/Reducers/AppReducers";
import { AppStrings } from "../../../../Utils/AppStrings";
import CommonDataManager from "../../../../Utils/CommonManager";
import { formatPhoneNumber, validateInput } from "../../../../Utils/Helper";
import {
  isEmailAlreadyRegistered,
  sendEmailOtp,
} from "../../../../Network/Services/AuthServices";
import { Routes } from "../../../../Utils/Routes";
import { AppRootStore } from "../../../../Redux/store/AppStore";

const ForgetPassword = (props: any) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const [email, setEmail] = useState<string>("");
  const dispatch = useDispatch();
  const [emailError, setEmailError] = useState<string>("");
  const isRtl = selector?.isRtl;

  const onForgotPass = async () => {
    let isFormValid = true;
    const result = validateInput(email);
    if (!email) {
      setEmailError("Please enter an Email / Phone Number");
      isFormValid = false;
    } else if (!result.isValid) {
      if (result.type === "email") {
        setEmailError("Invalid email format.");
        isFormValid = false;
      } else if (result.type === "phone") {
        setEmailError("Phone number must be exactly 11 digits long.");
        isFormValid = false;
      } else {
        setEmailError("Invalid Email / Phone Number");
        isFormValid = false;
      }
    }
    if (!isFormValid) {
      return;
    }
    try {
      dispatch(setIsLoader(true));

      // if (result?.type == 'phone') {
      //   const number = formatPhoneNumber(email);
      //   await isEmailAlreadyRegistered(
      //     number,
      //     'phoneNumber',
      //     async (res: any) => {
      //       if (res?.status) {
      //         const phoneVerification = await auth().signInWithPhoneNumber(
      //           number,
      //         );

      //         if (phoneVerification) {
      //           props?.navigation?.navigate(Routes.Auth.otpVerificationScreen, {
      //             isResetPasswordScreen: true,
      //             email: email,
      //             isEmail: false,
      //             phoneVerification,
      //           });
      //           dispatch(setIsLoader(false));
      //         } else {
      //           dispatch(
      //             setShowToast({
      //               type: AppStrings.ToastType.error,
      //               message: AppStrings.Network.someThingError,
      //             }),
      //           );
      //           dispatch(setIsLoader(false));
      //         }
      //       } else {
      //         setEmailError('Phone Number does not Registered before.');
      //         dispatch(setIsLoader(false));
      //       }
      //     },
      //   );
      // } else {
      await isEmailAlreadyRegistered(
        email?.toLocaleLowerCase(),
        "email",
        async (res: any) => {
          if (res?.status) {
            const isOtpSend = await sendEmailOtp({
              recipientEmail: email,
            });

            if (isOtpSend?.status) {
              props?.navigation?.navigate(Routes.Auth.otpVerificationScreen, {
                isResetPasswordScreen: true,
                email: email,
                isEmail: true,
              });
              dispatch(setIsLoader(false));
            } else {
              dispatch(
                setShowToast({
                  type: AppStrings.ToastType.error,
                  message: AppStrings.Network.tryAgainLater,
                })
              );
              dispatch(setIsLoader(false));
            }
          } else {
            setEmailError("Email deost not Registered before");
            dispatch(setIsLoader(false));
          }
        }
      );
      // }
    } catch (error: any) {
      dispatch(
        setIsAlertShow({
          value: true,
          message: error.message,
        })
      );
    } finally {
      // dispatch(setIsLoader(false));
    }
  };

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <CustomHeader
        onPress={() => props?.navigation?.goBack()}
        Text={isRtl ? "پاس ورڈ ری سیٹ کریں" : "Reset Password"}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 35 : 30}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, paddingHorizontal: AppHorizontalMargin }}
        >
          <Text style={styles.descText}>
            {isRtl
              ? "ہم آپ کو ایک وقتی پاس ورڈ آپ کے ای میل یا فون نمبر پر بھیجیں گے۔"
              : "We’ll send you a one time password on your email or phone number."}{" "}
          </Text>

          <Text style={styles.inputText}>
            {/* {isRtl ? "ای میل / فون نمبر" : "Email / Phone Number"} */}
            {isRtl ? "ای میل " : "Email "}
          </Text>
          <CustomInput
            placeHold={""}
            showLastIcon={true}
            rightIcon={AppImages.Auth.message}
            secureEntry={false}
            setValue={(txt: any) => {
              setEmail(txt);
              setEmailError("");
            }}
            value={email}
            errorMsg={emailError}
          />

          <FilledButton
            mainContainer={{ marginVertical: hv(30) }}
            label={isRtl ? "پاس ورڈ ری سیٹ کریں" : "Reset Password"}
            onPress={onForgotPass}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  descText: {
    color: AppColors.black.Level6,
    fontSize: normalized(14),
    fontFamily: AppFonts.PoppinsRegular,
    marginTop: normalized(10),
    paddingHorizontal: normalized(20),
    fontWeight: "400",
  },
  inputText: {
    marginTop: normalized(60),
    fontSize: normalized(14),
    color: AppColors.black.Level7,
    marginBottom: normalized(5),
    fontFamily: AppFonts.PoppinsSemiBold,
    fontWeight: "600",
  },
});

export default ForgetPassword;
