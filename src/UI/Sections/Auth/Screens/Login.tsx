import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AppColors,
  AppImages,
  normalized,
  AppFonts,
  AppHorizontalMargin,
  ScreenProps,
} from "../../../../Utils/AppConstants";
import { AppStyles } from "../../../../Utils/AppStyles";
import { Routes } from "../../../../Utils/Routes";
import { AppStrings, SocialTypeStrings } from "../../../../Utils/AppStrings";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsLoader,
  setShowToast,
  setUserData,
} from "../../../../Redux/Reducers/AppReducers";
import {
  checkUserInCollection,
  getSocialAuthReq,
  loginRequest,
  socialAuthCheckRequest,
  updatedUserReq,
} from "../../../../Network/Services/AuthServices";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import { setUserDataInAsync } from "../../../../Utils/AsyncStorage";
import CommonDataManager from "../../../../Utils/CommonManager";
import appleAuth from "@invertase/react-native-apple-authentication";
import SocialBtnComp from "../../../Components/SocialButton/GoogleButton";
import SocialAuthManager from "../../../../Hooks/SocialAuthManager";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import FilledButton from "../../../Components/CustomButton/FilledButton";
import { formatPhoneNumber, validateInput } from "../../../../Utils/Helper";

const Login = (props: ScreenProps) => {
  const { gmailLoginRequest, appleAuthReq } = SocialAuthManager();
  const [email, setEmail] = useState<string>("");
  const { isNetConnected } = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;

  const isAdmin = props?.route?.params?.isAdmin;
  const [password, setPassword] = useState<string>("");
  const emailRef = useRef();
  const passwordRef = useRef();
  const dispatch = useDispatch();

  const focusNextField = (inputRef: any) => {
    if (inputRef?.current) {
      inputRef?.current?.focus();
    }
  };
  //error-------->
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  /////

  const showToast = (type: any, message: string) => {
    dispatch(
      setShowToast({
        type: type,
        message: message,
      })
    );
    return "";
  };

  const LogIn = async () => {
    let isFormValid = true;
    const result = validateInput(email);
    console.log("result --->>> ", result);

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
      }
    }
    if (!password) {
      setPasswordError("Please enter Password");
      isFormValid = false;
    }

    if (!isFormValid) {
      return;
    }
    if (!isNetConnected) {
      showToast(AppStrings.ToastType.error, AppStrings.Network.internetError);
      return;
    }
    const paramsObj = {
      email:
        result?.type == "phone"
          ? formatPhoneNumber(email)
          : email.toLocaleLowerCase(),
      password: password,
      isAdmin,
      key: result?.type == "email" ? "email" : "phoneNumber",
    };
    console.log("params obj --->>  ", paramsObj);

    dispatch(setIsLoader(true));
    await loginRequest(paramsObj, async (response) => {
      if (response?.status) {
        if (response?.data) {
          let userUpdatedData = {
            ...response?.data,
            secretId: password,
          };
          if (!isAdmin) {
            await updatedUserReq(
              response?.data?.userId,
              userUpdatedData,
              async (response: any) => {
                if (response?.status) {
                } else {
                  console.log("Error: ", response?.message);
                }
              }
            );
          }
          setUserDataInAsync({ ...userUpdatedData });
          dispatch(setUserData(userUpdatedData));
        } else {
          showToast(AppStrings.ToastType.error, "Invalid Credentials");
        }
        dispatch(setIsLoader(false));
      } else {
        dispatch(setIsLoader(false));
        showToast(AppStrings.ToastType.error, response?.message);
      }
    });
  };

  const socialAuthReq = async (type: string) => {
    dispatch(setIsLoader(true));

    let socialParams: any =
      type === SocialTypeStrings.google
        ? await gmailLoginRequest()
        : await appleAuthReq();

    if (socialParams?.token) {
      let paramsObj = {
        firstName: socialParams?.firstName || "",
        lastName: socialParams?.lastName || "",
        email: socialParams?.email.toLocaleLowerCase() || "",
        password: socialParams?.token,
        socailAuthType: type,
      };
      await getSocialAuthReq(paramsObj, async (authResponse: any) => {
        paramsObj = authResponse?.data;
        await socialAuthCheckRequest(paramsObj, async (response: any) => {
          if (
            response?.message === AppStrings.Network.emailAlreadyUse ||
            response?.message === AppStrings.Network.invalidEmail
          ) {
            await checkUserInCollection(paramsObj, async (res: any) => {
              if (res?.status && res?.data) {
                await updatedUserReq(
                  res?.data?.userId,
                  res?.data,
                  async (response: any) => {
                    if (response?.status) {
                    } else {
                      console.log("Error: ", response?.message);
                    }
                  }
                );

                setUserDataInAsync(res?.data);
                dispatch(setUserData(res?.data));
              } else {
                props?.navigation?.navigate(Routes.Auth.socialAuthScreen, {
                  socialParams: { ...paramsObj, socailAuthType: type },
                });
              }
            });
          } else {
            props?.navigation?.navigate(Routes.Auth.socialAuthScreen, {
              socialParams: { ...paramsObj, socailAuthType: type },
            });
          }
          dispatch(setIsLoader(false));
        }).catch((e) => {
          dispatch(setIsLoader(false));
        });
      });
    } else {
      dispatch(setIsLoader(false));
    }
  };

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          keyboardVerticalOffset={10}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.Container}
          >
            <Text
              style={{
                ...styles.topText,
                textAlign: selector?.isRtl ? "right" : "left",
              }}
            >
              {selector?.isRtl ? "لاگ ان" : "Login"}
            </Text>
            <Text
              style={{
                ...styles.topTextDesc,
                textAlign: selector?.isRtl ? "right" : "left",
              }}
            >
              {selector?.isRtl
                ? "اپنے سفر کو جاری رکھنے کے لئے لاگ ان کریں۔"
                : "Login to Continue your journey."}
            </Text>

            <Text
              style={{
                ...styles.phoneText,
                textAlign: selector?.isRtl ? "right" : "left",
              }}
            >
              {selector?.isRtl ? "ای میل " : "Email / Phone Number"}
            </Text>
            <CustomInput
              ref={emailRef}
              onSubmitEditing={() => focusNextField(passwordRef)}
              placeHold={
                selector?.isRtl
                  ? "ای میل یا فون نمبر درج کریں"
                  : "Enter Email Or Phone Number"
              }
              showLastIcon={true}
              rightIcon={AppImages.Auth.message}
              keyboardType={"email-address"}
              setValue={(txt: any) => {
                setEmail(txt);
                setEmailError("");
              }}
              value={email}
              errorMsg={emailError}
            />
            <Text
              style={{
                ...styles.phoneText,
                textAlign: selector?.isRtl ? "right" : "left",
              }}
            >
              {selector?.isRtl ? "خفیہ کوڈ" : "Password"}
            </Text>
            <CustomInput
              ref={passwordRef}
              placeHold={"**********"}
              showLastIcon={true}
              rightIcon={AppImages.Auth.hideEye}
              secureEntry={true}
              setValue={(val: string) => {
                setPassword(val);
                setPasswordError("");
              }}
              value={password}
              errorMsg={passwordError}
            />
            {!isAdmin && (
              <Text
                style={{
                  ...styles.forgetText,

                  alignSelf: selector?.isRtl ? "flex-start" : "flex-end",
                }}
                onPress={() =>
                  props?.navigation.navigate(Routes.Auth.forgerPassword)
                }
              >
                {selector?.isRtl ? "پاس ورڈ بھول گئے؟" : "Forgot Password?"}
              </Text>
            )}
            <FilledButton
              label={
                isAdmin
                  ? "Sign in with Super Admin"
                  : selector?.isRtl
                  ? "لاگ ان"
                  : "Login"
              }
              onPress={LogIn}
            />

            {isAdmin ? (
              <TouchableOpacity
                activeOpacity={1}
                style={styles.unfilledBtn}
                onPress={() => {
                  props?.navigation?.navigate(Routes.Auth.subAdmin, {
                    fromAuth: true,
                  });
                }}
              >
                <Text style={styles.unfilledBtnTxt}>Sign in with Admin</Text>
              </TouchableOpacity>
            ) : (
              <>
                {/* <View style={styles.midCont}>
                  <View style={styles.line}></View>
                  <Text
                    style={{
                      ...styles.signinText,
                      textAlign: selector?.isRtl ? "right" : "left",
                    }}
                  >
                    {selector?.isRtl ? " سائن ان کریں" : "Sign In With"}
                  </Text>
                  <View style={styles.line}></View>
                </View> */}

                {/* <View
                  style={{
                    flexDirection: "row",
                    justifyContent:
                      appleAuth.isSupported && Platform.OS === "ios"
                        ? "space-between"
                        : "center",
                    alignItems: "center",
                  }}
                >
                  <SocialBtnComp
                    title={
                      selector?.isRtl
                        ? "گوگل کے ساتھ سائن ان کریں"
                        : "Sign in with Google"
                    }
                    image={AppImages.Auth.google}
                    atPress={() => {
                      socialAuthReq(SocialTypeStrings.google);
                    }}
                    fontSize={selector?.isRtl ? normalized(10) : normalized(12)}
                    isRtl={selector?.isRtl}
                  />
                  {appleAuth.isSupported && Platform.OS === "ios" ? (
                    <SocialBtnComp
                      title={
                        selector?.isRtl
                          ? "ایپل کے ساتھ سائن ان کریں"
                          : "Sign in with Apple"
                      }
                      image={AppImages.Auth.apple}
                      atPress={() => {
                        socialAuthReq(SocialTypeStrings.apple);
                      }}
                      fontSize={
                        selector?.isRtl ? normalized(10) : normalized(12)
                      }
                    />
                  ) : null}
                </View> */}
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
        {!isAdmin && (
          <View style={styles.lastCont}>
            <Text style={styles.firstText}>
              {selector?.isRtl
                ? "کیا آپ کا اکاؤنٹ نہیں ہے؟ "
                : "Don't have an account? "}
              <Text
                onPress={() => props?.navigation.navigate(Routes.Auth.signup)}
                style={styles.signupText}
              >
                {selector?.isRtl ? "سائن اپ کریں" : "Sign Up"}
              </Text>
            </Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    paddingHorizontal: AppHorizontalMargin,
  },
  topText: {
    fontSize: normalized(28),
    color: AppColors.black.Level7,
    marginTop: normalized(50),
    fontFamily: AppFonts.PoppinsRegular,
    fontWeight: "700",
  },
  topTextDesc: {
    fontSize: normalized(17),
    color: AppColors.black.Level6,
    marginVertical: normalized(5),
    fontFamily: AppFonts.PoppinsRegular,
    fontWeight: "400",
  },
  phoneText: {
    marginTop: normalized(20),
    fontSize: normalized(14),
    color: AppColors.black.Level7,
    marginBottom: normalized(5),
    fontFamily: AppFonts.PoppinsSemiBold,
  },
  forgetText: {
    marginVertical: normalized(10),
    fontSize: normalized(13),
    color: AppColors.themeColor.dark,
    fontFamily: AppFonts.PoppinsMedium,
    textDecorationLine: "underline",
    fontWeight: "500",
  },
  midCont: {
    flexDirection: "row",
    marginVertical: normalized(20),
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: normalized(15),
  },
  line: {
    flex: 1,
    backgroundColor: AppColors.grey.greyLevel2,
    height: normalized(1),
  },
  signinText: {
    color: AppColors.grey.greyLevel9,
    fontSize: normalized(13),
    marginHorizontal: normalized(20),
    fontFamily: AppFonts.PoppinsMedium,
  },
  lastCont: {
    bottom: normalized(10),
    alignSelf: "center",
  },
  firstText: {
    fontSize: normalized(14),
    color: AppColors.black.Level7,
    fontFamily: AppFonts.PoppinsRegular,
  },
  signupText: {
    color: AppColors.themeColor.dark,
    fontFamily: AppFonts.PoppinsRegular,
    fontSize: normalized(14),
    fontWeight: "700",
  },
  unfilledBtn: {
    marginTop: 25,
    backgroundColor: AppColors.white.white,
    borderRadius: normalized(24),
    alignItems: "center",
    justifyContent: "center",
    height: normalized(49),
    marginHorizontal: normalized(20),
    width: "90%",
    borderWidth: 1,
    borderColor: AppColors.themeColor.dark,
  },
  unfilledBtnTxt: {
    color: AppColors.themeColor.dark,
    fontSize: normalized(14),
    fontFamily: AppFonts.PoppinsMedium,
  },
});

export default Login;
