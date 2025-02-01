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
} from "../../../../Redux/Reducers/AppReducers";
import { ADMN_TYPE, AppStrings } from "../../../../Utils/AppStrings";
import CommonDataManager from "../../../../Utils/CommonManager";
import { AppStyles } from "../../../../Utils/AppStyles";
import AppStatusBar from "../../../Components/SocialButton/AppStatusBar";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import CodeInput from "../Components/OTPInput";
import FilledButton from "../../../Components/CustomButton/FilledButton";

const OTPScreen = (props: ScreenProps) => {
  const params = props?.route?.params;
  const isFromAuth = params?.fromAuth;
  const adminObj = params?.adminObj;
  const dispatch = useDispatch();
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );

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

  // const onAddAdminFunc = async () => {
  //   let isFormValid = true;
  //   if (!firstName) {
  //     setFirstNameError("Please Enter first Name");
  //     isFormValid = false;
  //   }
  //   if (!lastName) {
  //     setLastNameError("Please Enter last Name");
  //     isFormValid = false;
  //   }
  //   if (otp?.length < 4) {
  //     setOTPerror("Please Enter OTP");
  //     isFormValid = false;
  //   }
  //   if (!isFormValid) {
  //     return;
  //   }
  //   if (!selector?.isNetConnected) {
  //     dispatch(
  //       setShowToast({
  //         type: AppStrings.ToastType.error,
  //         message: AppStrings.Network.internetError,
  //       })
  //     );
  //     return;
  //   }
  //   dispatch(setIsLoader(true));
  //   let payload: any = {
  //     firstName: firstName.toLocaleLowerCase(),
  //     lastName: lastName.toLocaleLowerCase(),
  //     pinCode: otp,
  //     userId: selector?.userData?.userId,
  //     adminType: ADMN_TYPE.Admin,
  //     profile: selector?.userData?.profile || "",
  //     adminId: adminObj?.adminId
  //       ? adminObj?.adminId
  //       : CommonDataManager.getSharedInstance().makeid(6).toString(),
  //   };
  //   let isOTPMatch = false;
  //   // const list: any = await fetchAdminListReq(selector?.userData?.userId);
  //   for (let index = 0; index < list.length; index++) {
  //     const element = list[index];
  //     if (element?.pinCode === otp && element?.adminId !== payload?.adminId) {
  //       isOTPMatch = true;
  //       dispatch(setIsLoader(false));
  //       dispatch(
  //         setShowToast({
  //           type: AppStrings.ToastType.error,
  //           message: "An admin has already been created with this PIN code.",
  //         })
  //       );
  //       return;
  //     }
  //   }
  //   let res = null;
  //   if (adminObj?.adminId) {
  //     res = await updateAdminInToSuperAdminReq(payload);
  //   } else {
  //     res = await addAdminInToSuperAdminReq(payload);
  //   }
  //   dispatch(setIsLoader(false));
  //   props?.navigation?.goBack();
  // };

  // const simpleAdminLogin = async () => {
  //   if (otp?.length < 4) {
  //     setOTPerror("Please Enter OTP");
  //     return;
  //   }
  //   dispatch(setIsLoader(true));
  //   let findAdmin = await findAdminByPinCode(otp.toString());

  //   if (findAdmin?.adminId) {
  //     let userObj = { ...findAdmin, isAdmin: true };
  //     setUserDataInAsync(userObj);
  //     dispatch(setUserData(userObj));
  //   } else {
  //     setOTPerror("please Enter valid OTP");
  //     setOtp("");
  //   }
  //   dispatch(setIsLoader(false));
  // };

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
            ? "Verify OTP"
            : adminObj?.adminId
            ? "Update Admin"
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
            <View style={styles.topContainer}>
              <View style={styles.inputCont}>
                <Text style={styles.inputText}>{"First Name"}</Text>
                <CustomInput
                  onSubmitEditing={() => focusNextField(lastNameRef)}
                  placeHold={"First name"}
                  placeHolderColor={AppColors.grey.greyLevel1}
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
                <Text style={styles.inputText}>{"Last Name"}</Text>
                <CustomInput
                  ref={lastNameRef}
                  placeHold={"Last name"}
                  placeHolderColor={AppColors.grey.greyLevel1}
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
              {"Email"}
            </Text>
            <CustomInput
              ref={lastNameRef}
              placeHold={"Email Address"}
              placeHolderColor={AppColors.grey.greyLevel1}
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
                fontSize: normalized(18),
                fontFamily: AppFonts.PoppinsMedium,
                color: AppColors.black.black,
              }}
            >
              Login Admin
            </Text>
            <Text
              style={{
                fontSize: normalized(14),
                fontFamily: AppFonts.PoppinsRegular,
                color: AppColors.grey.greyLevel4,
                marginTop: 5,
              }}
            >
              please login your account using PinCode!
            </Text>
          </View>
        )}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.pinTxt}>PIN Code</Text>

          <CodeInput
            codeLength={6}
            cellSize={normalized(50)}
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
          isFromAuth ? "Login Admin" : adminObj?.adminId ? "Update" : "Save"
        }
        onPress={() => {
          if (isFromAuth) {
            // simpleAdminLogin();
          } else {
            // onAddAdminFunc();
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
    marginTop: normalized(30),
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
