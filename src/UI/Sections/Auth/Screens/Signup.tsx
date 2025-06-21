import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { AppStyles } from "../../../../Utils/AppStyles";
import {
  AppColors,
  AppImages,
  AppHorizontalMargin,
  AppFonts,
  hv,
  normalized,
} from "../../../../Utils/AppConstants";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import FilledButton from "../../../Components/CustomButton/FilledButton";
import { Routes } from "../../../../Utils/Routes";
import { AppStrings, SocialTypeStrings } from "../../../../Utils/AppStrings";
import { useDispatch } from "react-redux";
import {
  setIsLoader,
  setShowToast,
  setUserData,
} from "../../../../Redux/Reducers/AppReducers";
import {
  checkUserInCollection,
  getSocialAuthReq,
  isEmailAlreadyRegistered,
  sendEmailOtp,
  socialAuthCheckRequest,
} from "../../../../Network/Services/AuthServices";
import { setUserDataInAsync } from "../../../../Utils/AsyncStorage";
import CommonDataManager from "../../../../Utils/CommonManager";
import SocialAuthManager from "../../../../Hooks/SocialAuthManager";
import AppImagePicker from "../../../Components/CustomModal/AppImagePicker";
import { formatPhoneNumber } from "../../../../Utils/Helper";
import auth from "@react-native-firebase/auth";

const SignUpScreen = (props: any) => {
  const { gmailLoginRequest, appleAuthReq } = SocialAuthManager();
  const [countryValues, setCountryValues] = useState<any>({
    code: "+92",
    flag: "pk",
    name: "Pakistan",
  });
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const dobRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const licenseRef = useRef();
  const [selectedImage, setSelectedImage] = useState<any>("");
  const [showImagePicker, setShowImagePicker] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  ///error------->
  const [selectedImageError, setSelectedImageError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [checkError, setCheckError] = useState<any>("");
  const [phoneError, setPhoneError] = useState<any>("");

  ////////

  const dispatch = useDispatch();

  const focusNextField = (inputRef: any) => {
    if (inputRef?.current) {
      inputRef?.current?.focus();
    }
  };

  function onAuthStateChanged(user: any) {}
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const onSignUpPress = async () => {
    let isFormValid = true;

    if (!firstName) {
      setFirstNameError("Please Enter first Name");
      isFormValid = false;
    }
    if (!lastName) {
      setLastNameError("Please Enter last Name");
      isFormValid = false;
    }
    if (!email) {
      setEmailError("Please enter Email.");
      isFormValid = false;
    }
    if (!CommonDataManager.getSharedInstance().isEmailValid(email)) {
      setEmailError("Please Enter Valid Email");
      isFormValid = false;
    }
    if (!phoneNumber) {
      setPhoneError("Please Enter Phone Number");
    }
    if (phoneNumber.length < 10) {
      setPhoneError("Phone Number Should be 10 digits Long.");
    }
    if (!password) {
      setPasswordError("Please Enter Password");
      isFormValid = false;
    }
    if (password?.length < 8) {
      setPasswordError("Password must be atleast 8 characters long");
      isFormValid = false;
    }
    if (password != confirmPassword) {
      setPasswordError("Passwords does not match");
      isFormValid = false;
    }
    if (!isChecked) {
      setCheckError("Please accept Privacy & Terms of use first.");
      isFormValid = false;
    }
    if (!isFormValid) {
      return;
    }
    const number = formatPhoneNumber(phoneNumber);
    dispatch(setIsLoader(true));
    const obj = {
      fullName: firstName + " " + lastName,
      email: email?.toLocaleLowerCase(),
      phoneNumber: number,
      password: password,
      profilePath: selectedImage,
    };
    await isEmailAlreadyRegistered(
      email?.toLocaleLowerCase(),
      "email",
      async (res: any) => {
        if (res?.status) {
          setEmailError("Email Already in Use");
          dispatch(setIsLoader(false));
        } else {
          await isEmailAlreadyRegistered(
            number,
            "phoneNumber",
            async (res: any) => {
              if (res?.status) {
                setPhoneError("Phone Number Already in Use");
                dispatch(setIsLoader(false));
              } else {
                const confirmation = await auth().signInWithPhoneNumber(number);
                const isOtpSend = await sendEmailOtp({
                  recipientEmail: obj?.email,
                });

                if (confirmation && isOtpSend?.status) {
                  props?.navigation?.navigate(
                    Routes.Auth.otpVerificationScreen,
                    {
                      obj,
                      phoneVerification: confirmation,
                    }
                  );
                  dispatch(setIsLoader(false));
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
            }
          );
        }
      }
    );
  };
  // dispatch(setIsLoader(false));

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
            await checkUserInCollection(paramsObj, (res: any) => {
              if (res?.status && res?.data) {
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
      <SafeAreaView />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? hv(10) : hv(20)}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            paddingHorizontal: AppHorizontalMargin,
          }}
        >
          <Text style={styles.topText}>{"Create an account"}</Text>
          <Text style={styles.topTextDesc}>
            {"Please Complete your profile for better experience."}
          </Text>

          {selectedImage ? (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.cameraCont}
              onPress={() => {
                setShowImagePicker(true);
                setSelectedImageError("");
              }}
            >
              <Image
                style={styles.profileImg}
                source={{ uri: selectedImage }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.cameraCont}
              activeOpacity={1}
              onPress={() => {
                setShowImagePicker(true);
                setSelectedImageError("");
              }}
            >
              <Image
                source={AppImages.Auth.camera}
                resizeMode="contain"
                style={{
                  height: normalized(32),
                  width: normalized(38),
                  resizeMode: "contain",
                }}
              />
            </TouchableOpacity>
          )}
          <Text style={styles.optionalTxt}>{"(Optional)"}</Text>
          {selectedImageError && (
            <Text
              style={{
                ...styles.errorMsg,
                alignSelf: "center",
              }}
            >
              {selectedImageError}
            </Text>
          )}
          <View style={styles.topContainer}>
            <View style={styles.inputCont}>
              <Text style={styles.inputText}>{"First Name"}</Text>
              <CustomInput
                ref={firstNameRef}
                onSubmitEditing={() => focusNextField(lastNameRef)}
                placeHold={"First Name"}
                placeHolderColor={AppColors.grey.greyLevel4}
                value={firstName}
                setValue={(val: string) => {
                  setFirstName(val);
                  setFirstNameError("");
                }}
                keyboardType={"default"}
                errorMsg={firstNameError}
              />
            </View>
            <View style={styles.inputCont}>
              <Text style={styles.inputText}>{"Last Name"}</Text>
              <CustomInput
                ref={lastNameRef}
                onSubmitEditing={() => focusNextField(dobRef)}
                placeHold={"Last Name"}
                placeHolderColor={AppColors.grey.greyLevel4}
                value={lastName}
                setValue={(val: string) => {
                  setLastName(val);
                  setLastNameError("");
                }}
                keyboardType="default"
                errorMsg={lastNameError}
              />
            </View>
          </View>

          <View style={styles.topContainerChild}>
            <View style={styles.inputCont}>
              <Text style={styles.inputText}>{"Email"}</Text>
              <CustomInput
                ref={emailRef}
                onSubmitEditing={() => focusNextField(passwordRef)}
                placeHold={"Enter Email Address"}
                placeHolderColor={AppColors.grey.greyLevel4}
                value={email}
                keyboardType={"email-address"}
                setValue={(val: string) => {
                  setEmail(val);
                  setEmailError("");
                }}
                errorMsg={emailError}
              />
            </View>
          </View>

          <Text style={{ ...styles.inputText, marginTop: normalized(20) }}>
            {"Phone Number"}
          </Text>

          <View
            style={{
              ...styles.phoneContChild,
              borderColor: phoneError
                ? AppColors.red.dark
                : AppColors.grey.greyLevel9,
              backgroundColor: phoneError
                ? AppColors.red.pink
                : AppColors.white.white,
            }}
          >
            <View
              style={{
                ...styles.flagCont,
                backgroundColor: phoneError
                  ? AppColors.red.pink
                  : AppColors.white.white,
              }}
            >
              <Image source={AppImages.Auth.flag} style={styles.flag} />
            </View>

            <TextInput
              placeholder={countryValues?.code}
              placeholderTextColor={AppColors.black.black}
              editable={false}
              style={{
                textAlign: "center",
                fontFamily: AppFonts.PoppinsRegular,
                includeFontPadding: false,
                width: normalized(40),
              }}
            />

            <View
              style={{
                flex: 1,
                padding: 0,
              }}
            >
              <TextInput
                onSubmitEditing={() => focusNextField(emailRef)}
                placeholder={"3XXXXXXXX"}
                placeholderTextColor={AppColors.grey.greyLevel9}
                keyboardType="number-pad"
                maxLength={10}
                style={{
                  includeFontPadding: false,
                  color: AppColors.black.black,
                  fontFamily: AppFonts.PoppinsRegular,
                }}
                onChangeText={(txt: any) => {
                  const nonnumericValue = txt.replace(/[^0-9]/g, "");
                  setPhoneNumber(nonnumericValue);
                  setPhoneError("");
                }}
                value={phoneNumber}
              />
            </View>
          </View>
          {phoneError && <Text style={styles.errorMsg}>{phoneError}</Text>}

          <View style={styles.topContainerChild}>
            <View style={styles.inputCont}>
              <Text style={styles.inputText}>{"Passowrd"}</Text>
              <CustomInput
                ref={passwordRef}
                onSubmitEditing={() => focusNextField(licenseRef)}
                placeHold={"Password"}
                showLastIcon={true}
                rightIcon={AppImages.Auth.hideEye}
                secureEntry={true}
                value={password}
                setValue={(val: string) => {
                  setPassword(val);
                  setPasswordError("");
                }}
                errorMsg={passwordError}
              />
            </View>
          </View>

          <View style={styles.topContainerChild}>
            <View style={styles.inputCont}>
              <Text style={styles.inputText}>{"Confirm Passowrd"}</Text>
              <CustomInput
                ref={passwordRef}
                onSubmitEditing={() => focusNextField(licenseRef)}
                placeHold={"Confirm Password"}
                showLastIcon={true}
                rightIcon={AppImages.Auth.hideEye}
                secureEntry={true}
                value={confirmPassword}
                setValue={(val: string) => {
                  setConfirmPassword(val);
                  setPasswordError("");
                }}
                errorMsg={passwordError}
              />
            </View>
          </View>

          <View style={styles.termCont}>
            <TouchableWithoutFeedback
              onPress={() => {
                setIsChecked(!isChecked);
                setCheckError("");
              }}
            >
              <View
                style={{
                  ...styles.checkCont,
                  borderColor: AppColors.grey.greyLevel9,
                  backgroundColor: checkError
                    ? AppColors.red.pink
                    : AppColors.white.white,
                }}
              >
                {isChecked && (
                  <Image
                    source={AppImages.Home.tick}
                    resizeMode="contain"
                    style={{
                      height: normalized(12),
                      width: normalized(12),
                    }}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
            <Text style={styles.termsTxt}>
              I agree to
              <Text
                style={styles.privacyTxt}
                onPress={() => {
                  Linking.openURL(
                    "https://hitechsolutions.store/TermsAndCondition/"
                  );
                }}
              >
                {" "}
                Terms of Use{" "}
              </Text>
              &
              <Text
                style={styles.privacyTxt}
                onPress={() => {
                  Linking.openURL(
                    "https://hitechsolutions.store/PrivacyPolicy/"
                  );
                }}
              >
                {" "}
                Privacy Policy
              </Text>
            </Text>
          </View>

          <FilledButton
            label={"Create Account"}
            onPress={() => onSignUpPress()}
          />
          {/* <View style={styles.midCont}>
            <View style={styles.line} />
            <Text style={styles.signinText}>{"SignUp with"}</Text>
            <View style={styles.line} />
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
              title={"Sign up with Google"}
              image={AppImages.Auth.google}
              atPress={() => {
                socialAuthReq(SocialTypeStrings.google);
              }}
            />
            {appleAuth.isSupported && Platform.OS === "ios" ? (
              <SocialBtnComp
                title={"Sign up with Apple"}
                image={AppImages.Auth.apple}
                atPress={() => {
                  socialAuthReq(SocialTypeStrings.apple);
                }}
              />
            ) : null}
          </View> */}
          <View style={styles.lastCont}>
            <Text style={styles.firstText}>
              Already have an account?{" "}
              <Text
                onPress={() => props?.navigation?.navigate(Routes.Auth.login)}
                style={styles.loginText}
              >
                {"Login"}
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {showImagePicker ? (
        <AppImagePicker
          limit={1}
          onClose={() => {
            setShowImagePicker(false);
          }}
          onImageSelect={(userSelectedImage: any) => {
            setShowImagePicker(false);
            if (userSelectedImage) {
              let image = Array.isArray(userSelectedImage)
                ? userSelectedImage[0]
                : userSelectedImage;
              setSelectedImage(image);
            }
          }}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  topText: {
    fontSize: normalized(22),
    color: AppColors.black.Level7,
    marginTop: normalized(10),
    fontFamily: AppFonts.PoppinsRegular,
    fontWeight: "600",
  },
  topTextDesc: {
    fontSize: normalized(14),
    color: AppColors.black.Level6,
    fontFamily: AppFonts.PoppinsRegular,
    fontWeight: "400",
  },
  inputCont: {
    marginTop: normalized(20),
    flex: 1,
  },
  dobCont: {
    marginTop: normalized(20),
    flex: 1,
  },
  errorMsg: {
    marginTop: 3,
    color: "red",
    fontSize: normalized(12),
    marginLeft: normalized(2),
  },
  dobText: {
    paddingVertical: normalized(17),
    borderWidth: 1,
    borderColor: AppColors.grey.greyLevel3,
    borderRadius: normalized(7),
    paddingLeft: normalized(10),
    color: AppColors.black.black,
  },
  phoneCont: {
    marginTop: normalized(20),
  },
  phoneContChild: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: AppColors.grey.greyLevel3,
    borderRadius: normalized(7),
    height: normalized(45),
    alignItems: "center",
  },
  flagCont: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColors.white.white,
    flexDirection: "row",
    width: normalized(55),
    padding: 0,
    height: normalized(42),
    borderTopLeftRadius: normalized(6),
    borderBottomLeftRadius: normalized(6),
  },
  inputText: {
    fontSize: normalized(14),
    color: AppColors.black.Level7,
    marginBottom: normalized(5),
    fontFamily: AppFonts.PoppinsSemiBold,
    fontWeight: "500",
  },
  topContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
  },
  topContainerChild: {
    flexDirection: "row",
    gap: normalized(10),
    alignItems: "center",
  },
  buttonCont: {
    marginVertical: normalized(30),
    marginHorizontal: normalized(20),
  },
  midCont: {
    flexDirection: "row",
    marginBottom: normalized(10),
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
    color: AppColors.grey.greyLevel2,
    fontSize: normalized(13),
    marginHorizontal: normalized(20),
    fontFamily: AppFonts.PoppinsMedium,
  },
  googleCont: {
    marginHorizontal: normalized(60),
    marginVertical: normalized(10),
  },
  lastCont: {
    marginTop: normalized(70),
    bottom: normalized(20),
    alignSelf: "center",
    marginBottom: normalized(15),
  },
  firstText: {
    fontSize: normalized(14),
    color: AppColors.black.Level7,
    fontFamily: AppFonts.PoppinsRegular,
  },
  loginText: {
    color: AppColors.themeColor.dark,
    fontFamily: AppFonts.PoppinsBold,
  },
  dropdown: {
    height: "auto",
    borderRadius: normalized(7),
    paddingHorizontal: 8,
    width: normalized(60),
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    color: "black",
  },
  iconStyle: {
    width: normalized(25),
    height: normalized(25),
    tintColor: AppColors.black.black,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: "red",
  },

  arrowImage: {
    marginLeft: normalized(-5),
    // marginRight: normalized(3),
    width: normalized(10),
    height: normalized(8),
    padding: normalized(5),
    resizeMode: "contain",
  },
  cameraCont: {
    width: normalized(75),
    height: normalized(75),
    borderColor: AppColors.themeColor.dark,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: normalized(75 / 2),
    alignSelf: "center",
    marginVertical: normalized(15),
  },
  cameraImg: {
    width: normalized(38),
    height: normalized(32),
  },
  profileImg: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: normalized(86 / 2),
  },
  termCont: {
    flexDirection: "row",
    marginTop: normalized(20),
  },
  checkCont: {
    borderRadius: normalized(5),
    height: normalized(20),
    width: normalized(20),
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  termsTxt: {
    fontSize: normalized(14),
    color: AppColors.black.black,
    marginStart: normalized(10),
  },
  privacyTxt: {
    color: AppColors.themeColor.dark,
  },
  flag: {
    width: normalized(30),
    height: normalized(30),
    resizeMode: "contain",
  },
  optionalTxt: {
    fontSize: normalized(13),
    color: AppColors.grey.greyLevel4,
    alignSelf: "center",
  },
});

export default SignUpScreen;
