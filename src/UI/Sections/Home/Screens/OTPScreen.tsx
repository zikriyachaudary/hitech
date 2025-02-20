import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  hv,
  normalized,
  ScreenProps,
} from "../../../../Utils/AppConstants";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import {
  setIsLoader,
  setShowToast,
  setUserData,
} from "../../../../Redux/Reducers/AppReducers";
import { ADMN_TYPE, AppStrings } from "../../../../Utils/AppStrings";
import CommonDataManager from "../../../../Utils/CommonManager";
import { AppStyles } from "../../../../Utils/AppStyles";
import AppStatusBar from "../../../Components/SocialButton/AppStatusBar";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import CodeInput from "../Components/OTPInput";
import FilledButton from "../../../Components/CustomButton/FilledButton";
import {
  addAdminInToSuperAdminReq,
  fetchAdminListReq,
  findAdminByEmail,
  updateAdminInToSuperAdminReq,
} from "../../../../Network/Services/AdminGeneralServices";
import { setUserDataInAsync } from "../../../../Utils/AsyncStorage";
import { Routes } from "../../../../Utils/Routes";

const OTPScreen = (props: ScreenProps) => {
  const selector = useSelector((state: AppRootStore) => state.SliceReducer);
  const isRtl = selector?.isRtl;

  const params = props?.route?.params;
  const isFromAuth = params?.fromAuth;
  const adminObj = params?.adminObj;

  const dispatch = useDispatch();

  const [otp, setOtp] = useState<any>(adminObj?.pinCode ?? "");
  const [firstName, setFirstName] = useState<any>(adminObj?.firstName ?? "");
  const [lastName, setLastName] = useState<any>(adminObj?.lastName ?? "");
  const [email, setEmail] = useState<any>(adminObj?.email ?? "");

  ////error---------
  const [firstNameError, setFirstNameError] = useState<any>();
  const [lastNameError, setLastNameError] = useState<any>();
  const [OTPerror, setOTPerror] = useState("");
  const [emailError, setEmailError] = useState("");

  ///////////////////

  ///ref------
  const lastNameRef = useRef();
  const focusNextField = (inputRef: any) => {
    if (inputRef?.current) {
      inputRef?.current?.focus();
    }
  };
  ////////////
  const onAddAdminFunc = async () => {
    let isFormValid = true;
    if (!firstName) {
      setFirstNameError(
        isRtl ? "براہ کرم پہلا نام درج کریں" : "Please Enter First Name"
      );
      isFormValid = false;
    }
    if (!lastName) {
      setLastNameError(
        isRtl ? "براہ کرم آخری نام درج کریں" : "Please Enter Last Name"
      );
      isFormValid = false;
    }
    if (otp?.length < 6) {
      setOTPerror(isRtl ? "براہ کرم OTP درج کریں" : "Please Enter OTP");
      isFormValid = false;
    }

    if (!isFormValid) {
      return;
    }
    if (!selector?.isNetConnected) {
      dispatch(
        setShowToast({
          type: AppStrings.ToastType.error,
          message: AppStrings.Network.internetError,
        })
      );
      return;
    }
    dispatch(setIsLoader(true));
    let payload: any = {
      firstName: firstName,
      lastName: lastName,
      pinCode: otp,
      email: email?.toLowerCase(),
      userId: selector?.userData?.userId,
      adminType: ADMN_TYPE.Admin,
      profile: selector?.userData?.profileImage || "",
      adminId: adminObj?.adminId
        ? adminObj?.adminId
        : CommonDataManager.getSharedInstance().makeid(8).toString(),
    };
    let isEmailMatch = false;
    const list: any = await fetchAdminListReq(selector?.userData?.adminId);
    console.log("list ---->>>   ", list);

    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if (element?.email === email && element?.adminId !== payload?.adminId) {
        isEmailMatch = true;
        dispatch(setIsLoader(false));
        dispatch(
          setShowToast({
            type: AppStrings.ToastType.error,
            message: "An admin has already been created with this email.",
          })
        );
        return;
      }
    }
    let res = null;
    if (adminObj?.adminId) {
      res = await updateAdminInToSuperAdminReq(payload);
    } else {
      res = await addAdminInToSuperAdminReq(payload);
    }
    dispatch(setIsLoader(false));
    props?.navigation?.goBack();
  };

  const simpleAdminLogin = async () => {
    if (!email) {
      setEmailError(isRtl ? "ای میل درکار ہے*" : "Email Required*");
    }

    if (!otp) {
      setOTPerror(isRtl ? "براہ کرم پن درج کریں" : "Please Enter PIN");
      return;
    }

    if (otp?.length < 6) {
      setOTPerror(
        isRtl ? "براہ کرم مکمل پن کوڈ درج کریں" : "Please Complete PIN Code"
      );
      return;
    }

    dispatch(setIsLoader(true));
    const params = { email: email, otp: otp };
    let findAdmin = await findAdminByEmail(params);
    if (findAdmin?.adminId) {
      let userObj = { ...findAdmin, isAdmin: true };
      props?.navigation?.goBack();
      await setUserDataInAsync(userObj);
      dispatch(setUserData(userObj));
    } else {
      setOtp("");
      dispatch(
        setShowToast({
          type: AppStrings.ToastType.error,
          message: "Invalid Credentials",
        })
      );
    }
    dispatch(setIsLoader(false));
  };

  return (
    <View style={{ ...AppStyles.MainStyle }}>
      <SafeAreaView />
      <AppStatusBar
        backgroundColor={AppColors.grey.greyLevel4}
        barStyle="light-content"
        statusBarHeight={50}
      />
      <CustomHeader
        onPress={() => {
          props?.navigation?.goBack();
        }}
        title={
          isFromAuth
            ? isRtl
              ? "لاگ ان سب ایڈمن"
              : "Login Sub-Admin"
            : adminObj?.adminId
            ? isRtl
              ? "ایڈمن کو اپ ڈیٹ کریں"
              : "Update Admin"
            : isRtl
            ? "ایڈمن شامل کریں"
            : "Add Admin"
        }
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {!isFromAuth ? (
          <View
            style={{
              marginHorizontal: AppHorizontalMargin,
            }}
          >
            <View
              style={{
                ...styles.topContainer,
                flexDirection: isRtl ? "row-reverse" : "row",
              }}
            >
              <View style={styles.inputCont}>
                <Text style={styles.inputText}>
                  {isRtl ? "پہلا نام" : "First Name"}
                </Text>
                <CustomInput
                  onSubmitEditing={() => focusNextField(lastNameRef)}
                  placeHold={isRtl ? "پہلا نام" : "First Name"}
                  value={firstName}
                  errorMsg={firstNameError}
                  setValue={(val: string) => {
                    setFirstName(val);
                    setFirstNameError("");
                  }}
                  keyboardType={"default"}
                />
              </View>

              <View style={styles.inputCont}>
                <Text style={styles.inputText}>
                  {isRtl ? "آخری نام" : "Last Name"}
                </Text>
                <CustomInput
                  ref={lastNameRef}
                  placeHold={isRtl ? "آخری نام" : "Last Name"}
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
            <Text style={{ ...styles.inputText, marginTop: normalized(15) }}>
              {isRtl ? "ای میل" : "Email"}
            </Text>
            <CustomInput
              ref={lastNameRef}
              placeHold={isRtl ? "ای میل ایڈریس" : "Email Address"}
              value={email}
              setValue={(val: string) => {
                setEmail(val);
                setEmailError("");
              }}
              keyboardType="default"
              errorMsg={lastNameError}
            />
          </View>
        ) : (
          <View style={{ marginHorizontal: AppHorizontalMargin }}>
            <Text
              style={{
                fontSize: normalized(14),
                fontFamily: AppFonts.PoppinsRegular,
                color: AppColors.grey.greyLevel9,
                marginTop: normalized(15),
                textAlign: isRtl ? "right" : "left",
              }}
            >
              {isRtl
                ? "براہ کرم پن کوڈ استعمال کرکے اپنے اکاؤنٹ میں لاگ ان کریں!"
                : "Please login your account using PinCode!"}
            </Text>
            <Text
              style={{
                ...styles.inputText,
                marginTop: normalized(15),
                textAlign: isRtl ? "right" : "left",
              }}
            >
              {isRtl ? "ای میل" : "Email"}
            </Text>
            <CustomInput
              ref={lastNameRef}
              placeHold={
                isRtl ? "ای میل ایڈریس درج کریں" : "Enter Email Address"
              }
              value={email}
              setValue={(val: string) => {
                setEmail(val);
                setEmailError("");
              }}
              keyboardType="default"
              errorMsg={emailError}
            />
          </View>
        )}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <Text
            style={[styles.pinTxt, { textAlign: isRtl ? "right" : "left" }]}
          >
            {isRtl ? "خفیہ پن کوڈ" : "Secret PIN Code"}
          </Text>

          <CodeInput
            codeLength={6}
            cellSize={normalized(80)}
            cellSpacing={normalized(8)}
            cellStyle={{
              ...styles.codeInput,
              borderColor: OTPerror
                ? AppColors.red.dark
                : "rgba(226, 227, 228, 1)",
              backgroundColor: OTPerror
                ? AppColors.red.pink
                : "rgba(255, 255, 255, 1)",
            }}
            onFulfill={() => {}}
            value={otp}
            onChangeText={(otp: any) => {
              setOTPerror("");
              setOtp(otp);
              if (otp?.length == 6) {
              }
            }}
            keyboardType={"number-pad"}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <FilledButton
        label={
          isFromAuth
            ? isRtl
              ? "ایڈمن لاگ ان کریں"
              : "Login Admin"
            : adminObj?.adminId
            ? isRtl
              ? "اپ ڈیٹ کریں"
              : "Update"
            : isRtl
            ? "محفوظ کریں"
            : "Save"
        }
        onPress={() => {
          if (isFromAuth) {
            simpleAdminLogin();
          } else {
            onAddAdminFunc();
          }
        }}
        mainCustomStyle={{ marginBottom: hv(15) }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  headerMainStyle: {
    backgroundColor: AppColors.red.dark,
    alignItems: "flex-start",
  },
  countStyle: {
    alignSelf: "center",
    marginTop: hv(40),
    fontSize: 20,
    fontFamily: AppFonts.PoppinsMedium,
    color: AppColors.black.black,
  },
  topSafeArea: {
    flex: 0,
    backgroundColor: AppColors.red.dark,
  },
  logoStyle: {
    height: normalized(79),
    width: normalized(107),
  },
  eclipseStyle: {
    height: normalized(152),
    width: normalized(152),
    justifyContent: "center",
    alignItems: "center",
  },
  subContainer: {
    flex: 1,
    backgroundColor: AppColors.white.white,
  },
  titleStyle: {
    color: AppColors.black.Level6,
    fontFamily: AppFonts.PoppinsMedium,
    fontSize: 24,
    textAlign: "center",
    paddingHorizontal: normalized(30),
  },
  titleContainer: {
    marginTop: normalized(33),
  },
  inputContainer: {
    marginHorizontal: normalized(18),
    marginTop: hv(25),
    marginBottom: normalized(30),
  },
  didReciverCode: {},
  alreadyHvAcc: {
    fontSize: 14,
    fontFamily: AppFonts.PoppinsRegular,
    color: AppColors.grey.greyLevel9,
    marginTop: normalized(14),
    textAlign: "center",
  },
  checkBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkBoxStyle: {
    alignSelf: "flex-start",
    marginTop: normalized(2),
  },
  rememberNForgetContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hv(14),
    alignItems: "center",
  },
  bottomSection: {
    left: 0,
    right: 0,
    marginTop: "40%",
    paddingBottom: normalized(20),
  },
  codeInput: {
    height: Platform.OS == "ios" ? 55 : 53,
    width: normalized(50),
    borderRadius: normalized(5),
    // marginTop: normalized(30),
    borderWidth: 1,
  },
  backArrowImgStyle: {
    marginTop: 10,
  },
  titleDesContainer: {
    marginTop: hv(-4),
  },
  desStyle: {
    letterSpacing: 0.2,
    color: AppColors.grey.greyLevel1,
    marginTop: Platform.OS == "ios" ? hv(6) : hv(0),
  },
  labelStyle: {},
  inputText: {
    fontSize: normalized(14),
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsSemiBold,
    fontWeight: "400",
    marginVertical: 5,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  topContainerChild: {
    flexDirection: "row",
    gap: normalized(10),
    alignItems: "center",
  },
  inputCont: {
    marginTop: normalized(10),
    marginHorizontal: 4,
    flex: 1,
  },
  pinTxt: {
    fontSize: normalized(14),
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsMedium,
    marginTop: normalized(20),
    marginHorizontal: AppHorizontalMargin,
  },
});

export default OTPScreen;
