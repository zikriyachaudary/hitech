import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  AppImages,
  hv,
  normalized,
} from "../../../../Utils/AppConstants";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import { formatPhoneNumber } from "../../../../Utils/Helper";
import {
  setIsLoader,
  setShowToast,
  setUserData,
} from "../../../../Redux/Reducers/AppReducers";
import { AppStrings, USER_TYPE } from "../../../../Utils/AppStrings";
import {
  isEmailAlreadyRegistered,
  shopUserSignupRequest,
  userSignupRequest,
} from "../../../../Network/Services/AuthServices";
import auth from "@react-native-firebase/auth";
import { setUserDataInAsync } from "../../../../Utils/AsyncStorage";
import FilledButton from "../../../Components/CustomButton/FilledButton";

const ShopUserSignupScreen = () => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;
  const dispatch = useDispatch();

  // ------------------>>>>>

  const [countryValues, setCountryValues] = useState<any>({
    code: "+92",
    flag: "pk",
    name: "Pakistan",
  });
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneError, setPhoneError] = useState<any>("");
  const [passwordError, setPasswordError] = useState("");

  const lastNameRef = useRef();
  const passwordRef = useRef();
  const phoneNumberRef = useRef();

  const focusNextField = (inputRef: any) => {
    if (inputRef?.current) {
      inputRef?.current?.focus();
    }
  };

  // -------------------->>>>

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
    if (!phoneNumber) {
      setPhoneError("Please Enter Phone Number");
      isFormValid = false;
    }
    if (phoneNumber.length < 10) {
      setPhoneError("Phone Number Should be 10 digits Long.");
      isFormValid = false;
    }
    if (!password) {
      setPasswordError("Please Enter Password");
      isFormValid = false;
    }
    if (password?.length < 8) {
      setPasswordError("Password must be atleast 8 characters long");
      isFormValid = false;
    }
    if (!isFormValid) {
      return;
    }
    const number = formatPhoneNumber(phoneNumber);
    dispatch(setIsLoader(true));
    const obj = {
      fullName: firstName + " " + lastName,
      phoneNumber: number,
      password: password,
      profileImage:
        "https://firebasestorage.googleapis.com/v0/b/hitech-b1558.firebasestorage.app/o/Guest-user-removebg-preview.png?alt=media&token=050f86a0-d92a-4fe3-871e-36a4910e40e8",
      userType: USER_TYPE.Silver,
      isShopUser: true,
    };

    await isEmailAlreadyRegistered(number, "phoneNumber", async (res: any) => {
      if (res?.status) {
        setPhoneError(
          isRtl
            ? "فون نمبر پہلے سے استعمال میں ہے"
            : "Phone Number Already in Use"
        );
        dispatch(setIsLoader(false));
      } else {
        await shopUserSignupRequest(obj, (response) => {
          if (response?.status) {
            setUserDataInAsync(response?.data);
            dispatch(setUserData(response?.data));
          } else {
            dispatch(
              setShowToast({
                type: AppStrings.ToastType.error,
                message: response?.message || "Something went wrong",
              })
            );
          }
          dispatch(setIsLoader(false));
        });
      }
    });
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
          <Text
            style={[styles.topText, { textAlign: isRtl ? "right" : "left" }]}
          >
            {isRtl ? "اکاؤنٹ بنائیں" : "Create an account"}
          </Text>

          <View style={styles.topContainer}>
            <View style={styles.inputCont}>
              <Text
                style={[
                  styles.inputText,
                  { textAlign: isRtl ? "right" : "left" },
                ]}
              >
                {isRtl ? "پہلا نام" : "First Name"}
              </Text>
              <CustomInput
                onSubmitEditing={() => focusNextField(lastNameRef)}
                placeHold={isRtl ? "پہلا نام" : "First Name"}
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
              <Text
                style={[
                  styles.inputText,
                  { textAlign: isRtl ? "right" : "left" },
                ]}
              >
                {isRtl ? "آخری نام" : "Last Name"}
              </Text>
              <CustomInput
                ref={lastNameRef}
                onSubmitEditing={() => focusNextField(phoneNumberRef)}
                placeHold={isRtl ? "آخری نام" : "Last Name"}
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

          <Text
            style={{
              ...styles.inputText,
              marginTop: normalized(20),
              textAlign: isRtl ? "right" : "left",
            }}
          >
            {isRtl ? "فون نمبر" : "Phone Number"}
          </Text>

          <View
            style={{
              ...styles.phoneContChild,
              flexDirection: isRtl ? "row-reverse" : "row",
              borderColor: phoneError
                ? AppColors.red.dark
                : AppColors.grey.greyLevel2,
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

            <View style={{ flex: 1, padding: 0 }}>
              <TextInput
                onSubmitEditing={() => focusNextField(passwordRef)}
                placeholder={isRtl ? "3XXXXXXXX" : "3XXXXXXXX"}
                ref={phoneNumberRef}
                placeholderTextColor={AppColors.grey.greyLevel9}
                keyboardType="number-pad"
                maxLength={10}
                style={{
                  includeFontPadding: false,
                  color: AppColors.black.black,
                  fontFamily: AppFonts.PoppinsRegular,
                  textAlign: isRtl ? "right" : "left",
                }}
                onChangeText={(txt: string) => {
                  const clean = txt.replace(/[^0-9]/g, "");
                  setPhoneNumber(clean);
                  setPhoneError("");
                }}
                value={phoneNumber}
              />
            </View>
          </View>
          {phoneError && <Text style={styles.errorMsg}>{phoneError}</Text>}

          <View style={styles.topContainerChild}>
            <View style={styles.inputCont}>
              <Text
                style={[
                  styles.inputText,
                  { textAlign: isRtl ? "right" : "left" },
                ]}
              >
                {isRtl ? "پاس ورڈ" : "Password"}
              </Text>
              <CustomInput
                ref={passwordRef}
                placeHold={isRtl ? "پاس ورڈ" : "Password"}
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

          <FilledButton
            label={isRtl ? "اکاؤنٹ بنائیں" : "Create Account"}
            onPress={() => onSignUpPress()}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ShopUserSignupScreen;

const styles = StyleSheet.create({
  topText: {
    fontSize: normalized(22),
    color: AppColors.black.Level7,
    marginTop: normalized(10),
    fontFamily: AppFonts.PoppinsRegular,
    fontWeight: "600",
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
  inputCont: {
    marginTop: normalized(20),
    flex: 1,
  },
  flag: {
    width: normalized(30),
    height: normalized(30),
    resizeMode: "contain",
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
  topContainerChild: {
    flexDirection: "row",
    gap: normalized(10),
    alignItems: "center",
  },
  errorMsg: {
    marginTop: 3,
    color: "red",
    fontSize: normalized(12),
    marginLeft: normalized(2),
  },
});
