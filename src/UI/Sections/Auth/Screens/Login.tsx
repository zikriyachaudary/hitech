import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  AppColors,
  AppImages,
  normalized,
  AppFonts,
  AppHorizontalMargin,
} from "../../../../Utils/AppConstants";
import { AppStyles } from "../../../../Utils/AppStyles";
import { Routes } from "../../../../Utils/Routes";
import { AppStrings, SocialTypeStrings } from "../../../../Utils/AppStrings";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsAlertShow,
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

const Login = ({ navigation }: any) => {
  const { gmailLoginRequest, appleAuthReq } = SocialAuthManager();
  const [email, setEmail] = useState<string>("");
  const { isNetConnected } = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
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
    const userData = {
      fullName: "Zikriya Chaudary",
      email: "zikriya@yopmail.com",
      profile:
        "https://firebasestorage.googleapis.com/v0/b/zippy-6ae4c.appspot.com/o/admin.jpg?alt=media&token=3b1094c3-7e07-400d-90bd-dbc80dcfc916",
      secretId: "12345678",
    };
    await setUserDataInAsync(userData);
    dispatch(setUserData(userData));
    return;

    let isFormValid = true;
    if (!email) {
      setEmailError("Please enter an Email");
      isFormValid = false;
    }
    if (!CommonDataManager.getSharedInstance().isEmailValid(email)) {
      setEmailError(AppStrings.Validation.invalidEmailError);
      isFormValid = false;
    }
    if (!password) {
      setPasswordError("Please enter Password");
      isFormValid = false;
    }

    if (!isFormValid) {
      return;
    }
    if (!isNetConnected) {
      dispatch(
        setIsAlertShow({
          value: true,
          message: AppStrings.Network.internetError,
        })
      );
      return;
    }
    const paramsObj = { email: email.toLocaleLowerCase(), password: password };
    dispatch(setIsLoader(true));
    await loginRequest(paramsObj, async (response) => {
      if (response?.status) {
        if (response?.data) {
          let userUpdatedData = {
            ...response?.data,
            secretId: password,
          };
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
          setUserDataInAsync(userUpdatedData);
          dispatch(setUserData(userUpdatedData));
        } else {
          dispatch(
            setIsAlertShow({
              value: true,
              message: "Invalid Credentials",
            })
          );
        }
        dispatch(setIsLoader(false));
      } else {
        dispatch(setIsLoader(false));
        dispatch(
          setIsAlertShow({
            value: true,
            message: response?.message,
          })
        );
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
                navigation?.navigate(Routes.Auth.socialAuthScreen, {
                  socialParams: { ...paramsObj, socailAuthType: type },
                });
              }
            });
          } else {
            navigation?.navigate(Routes.Auth.socialAuthScreen, {
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
            <Text style={styles.topText}>{"Login"}</Text>
            <Text style={styles.topTextDesc}>
              {"Login to Continue your journey."}
            </Text>
            <Text style={styles.phoneText}>{"Email Address"}</Text>
            <CustomInput
              ref={emailRef}
              onSubmitEditing={() => focusNextField(passwordRef)}
              placeHold={"Enter Email Address"}
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
            <Text style={styles.phoneText}>{"Password"}</Text>
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
            <Text
              style={styles.forgetText}
              onPress={() => navigation.navigate(Routes.Auth.forgerPassword)}
            >
              {"Forgot Password?"}
            </Text>
            <FilledButton label={"Login"} onPress={LogIn} />
            <View style={styles.midCont}>
              <View style={styles.line}></View>
              <Text style={styles.signinText}>{"Sign In With"}</Text>
              <View style={styles.line}></View>
            </View>

            <View
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
                title={"Sign in with Google"}
                image={AppImages.Auth.google}
                atPress={() => {
                  socialAuthReq(SocialTypeStrings.google);
                }}
              />
              {appleAuth.isSupported && Platform.OS === "ios" ? (
                <SocialBtnComp
                  title={"Sign in with Apple"}
                  image={AppImages.Auth.apple}
                  atPress={() => {
                    socialAuthReq(SocialTypeStrings.apple);
                  }}
                />
              ) : null}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <View style={styles.lastCont}>
          <Text style={styles.firstText}>
            Don't have an account?{" "}
            <Text
              onPress={() => navigation.navigate(Routes.Auth.signup)}
              style={styles.signupText}
            >
              Sign Up
            </Text>
          </Text>
        </View>
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
    alignSelf: "flex-end",
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
});

export default Login;
