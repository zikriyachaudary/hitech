import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  normalized,
  ScreenProps,
} from "../../../../Utils/AppConstants";
import { AppStyles } from "../../../../Utils/AppStyles";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import FilledButton from "../../../Components/CustomButton/FilledButton";
import CodeInput from "../../Home/Components/OTPInput";
import { useDispatch } from "react-redux";
import {
  setIsLoader,
  setShowToast,
  setUserData,
} from "../../../../Redux/Reducers/AppReducers";
import {
  userSignupRequest,
  verifyEmailOtp,
} from "../../../../Network/Services/AuthServices";
import { uploadMedia } from "../../../../Network/Services/GeneralServices";
import { AppStrings } from "../../../../Utils/AppStrings";
import { setUserDataInAsync } from "../../../../Utils/AsyncStorage";
import { Routes } from "../../../../Utils/Routes";
import auth from "@react-native-firebase/auth";

const OtpVerificationScreen = (props: ScreenProps) => {
  const [emailOtp, setEmailOtp] = useState("");
  const [numberOtp, setNumberOtp] = useState("");
  const [emailOtpError, setEmailOtpError] = useState("");
  const [numberOtpError, setNumberOtpError] = useState("");
  const signupObj = props?.route?.params?.obj || null;
  const phoneVerification = props?.route?.params?.phoneVerification || null;
  const isResetPasswordScreen =
    props?.route?.params?.isResetPasswordScreen || false;
  const isEmail = props?.route?.params?.isEmail || false;

  function onAuthStateChanged(user: any) {}
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const onSubmit = async () => {
    try {
      if (emailOtp?.length < 6 && numberOtp?.length < 6) return;
      const resp = await phoneVerification.confirm(numberOtp);
      const emailOtpRes = await verifyEmailOtp({
        recipientEmail: signupObj?.email,
        OTP: emailOtp,
      });
      if (!resp?.user?.uid) {
        setNumberOtpError("Invalid Code");
      }
      if (!emailOtpRes?.status) {
        setEmailOtpError("Invalid Code");
      }
      if (resp?.user?.uid && emailOtpRes?.status) {
        try {
          await uploadMedia(signupObj?.profilePath, async (url) => {
            if (url) {
              const paramsObj: any = {
                fullName: signupObj?.fullName,
                email: signupObj?.email,
                phoneNumber: signupObj?.phoneNumber,
                password: signupObj?.password,
                profileImage: url,
              };

              await userSignupRequest(paramsObj, (response) => {
                if (response?.status) {
                  setUserDataInAsync(response?.data);
                  dispatch(setUserData(response?.data));
                  dispatch(setIsLoader(false));
                } else {
                  let errorMessage = response?.message
                    ? response?.message
                    : "Something went wrong";
                  dispatch(
                    setShowToast({
                      type: AppStrings.ToastType.error,
                      message: errorMessage,
                    })
                  );
                  dispatch(setIsLoader(false));
                }
              });
            } else {
              dispatch(setIsLoader(false));
              dispatch(
                setShowToast({
                  type: AppStrings.ToastType.error,
                  message: AppStrings.Network.someThingError,
                })
              );
            }
          });
        } catch (e) {
          dispatch(setIsLoader(false));
          console.log("error...", e);
        }
      }
    } catch (error) {
      console.log("Invalid code.");
    }
  };

  const onResetPassword = async () => {
    if (emailOtp?.length < 5) return;
    try {
      dispatch(setIsLoader(true));
      if (isEmail) {
        const emailOtpRes = await verifyEmailOtp({
          recipientEmail: props?.route?.params?.email,
          OTP: emailOtp,
        });

        if (emailOtpRes?.status) {
          props?.navigation?.navigate(Routes.Auth.newPasswordScreen, {
            email: props?.route?.params?.email,
            isEmail: true,
          });
        } else {
          setEmailOtpError("Invalid Code");
        }
      } else {
        const resp = await phoneVerification.confirm(emailOtp);
        if (!resp?.user?.uid) {
          setEmailOtpError("Invalid Code");
        } else {
          props?.navigation?.navigate(Routes.Auth.newPasswordScreen, {
            email: props?.route?.params?.email,
            isPhoneNumber: true,
          });
        }
      }
      dispatch(setIsLoader(false));
    } catch (error) {
      console.log("Error ---0-----  ", error);
      dispatch(
        setShowToast({
          type: AppStrings.ToastType.error,
          message: "Invalid OTP / Expired",
        })
      );
      dispatch(setIsLoader(false));
    }
  };

  const dispatch = useDispatch();

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <CustomHeader
        Text={"OTP Verification"}
        onPress={() => props?.navigation?.goBack()}
      />
      <ScrollView
        style={{
          flex: 1,
          marginHorizontal: normalized(15),
          marginTop: normalized(10),
        }}
      >
        {isResetPasswordScreen ? (
          <>
            <Text style={styles.header}>
              {isEmail ? "Email OTP" : "Phone Number OTP"}
            </Text>
            <CodeInput
              codeLength={6}
              cellSize={normalized(50)}
              cellSpacing={normalized(8)}
              cellStyle={{
                ...styles.codeInput,
                borderColor: emailOtpError
                  ? AppColors.red.dark
                  : "rgba(226, 227, 228, 1)",
                backgroundColor: emailOtpError
                  ? AppColors.red.pink
                  : "rgba(255, 255, 255, 1)",
              }}
              onFulfill={() => {}}
              value={emailOtp}
              onChangeText={(otp: any) => {
                setEmailOtpError("");
                setEmailOtp(otp);
                if (otp?.length == 6) {
                }
              }}
              keyboardType={"number-pad"}
            />
            <View style={styles.txtCont}>
              <Text>Didn't get a code?</Text>
              <Text onPress={() => {}} style={styles.resendTxt}>
                Resend Otp
              </Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.header}>Email OTP</Text>
            <CodeInput
              codeLength={6}
              cellSize={normalized(50)}
              cellSpacing={normalized(8)}
              cellStyle={{
                ...styles.codeInput,
                borderColor: emailOtpError
                  ? AppColors.red.dark
                  : "rgba(226, 227, 228, 1)",
                backgroundColor: emailOtpError
                  ? AppColors.red.pink
                  : "rgba(255, 255, 255, 1)",
              }}
              onFulfill={() => {}}
              value={emailOtp}
              onChangeText={(otp: any) => {
                setEmailOtpError("");
                setEmailOtp(otp);
                if (otp?.length == 6) {
                }
              }}
              keyboardType={"number-pad"}
            />
            <View style={styles.txtCont}>
              <Text>Didn't get a code?</Text>
              <Text onPress={() => {}} style={styles.resendTxt}>
                Resend Otp
              </Text>
            </View>
            <View style={{ height: normalized(15) }} />
            <Text style={styles.header}>Phone Number OTP</Text>
            <CodeInput
              codeLength={6}
              cellSize={normalized(50)}
              cellSpacing={normalized(8)}
              cellStyle={{
                ...styles.codeInput,
                borderColor: numberOtpError
                  ? AppColors.red.dark
                  : "rgba(226, 227, 228, 1)",
                backgroundColor: numberOtpError
                  ? AppColors.red.pink
                  : "rgba(255, 255, 255, 1)",
              }}
              onFulfill={() => {}}
              value={numberOtp}
              onChangeText={(otp: any) => {
                setNumberOtpError("");
                setNumberOtp(otp);
                if (otp?.length == 6) {
                }
              }}
              keyboardType={"number-pad"}
            />
            <View style={styles.txtCont}>
              <Text>Didn't get a code?</Text>
              <Text onPress={() => {}} style={styles.resendTxt}>
                Resend Otp
              </Text>
            </View>
          </>
        )}
        <FilledButton
          label={isResetPasswordScreen ? "Reset Password" : "Submit"}
          onPress={() => {
            isResetPasswordScreen ? onResetPassword() : onSubmit();
          }}
        />
      </ScrollView>
    </View>
  );
};

export default OtpVerificationScreen;

const styles = StyleSheet.create({
  header: {
    fontSize: normalized(18),
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsMedium,
    marginBottom: normalized(15),
  },
  txtCont: {
    flexDirection: "row",
    gap: normalized(5),
    marginTop: normalized(15),
    alignSelf: "flex-end",
  },
  resendTxt: {
    fontSize: normalized(13),
    textDecorationLine: "underline",
    color: AppColors.themeColor.dark,
    fontFamily: AppFonts.PoppinsSemiBold,
  },
  codeTxt: {
    fontSize: normalized(13),
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsMedium,
  },
  codeInput: {
    height: Platform.OS == "ios" ? 55 : 53,
    width: normalized(50),
    borderRadius: normalized(5),
    // marginTop: normalized(30),
    borderWidth: 1,
  },
});
