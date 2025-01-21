import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
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
import { getCountry } from "react-native-localize";
import DeviceCountry from "react-native-device-country";
import { TextInput } from "react-native-gesture-handler";
import CountryPicker from "react-native-country-picker-modal";
import { SocialTypeStrings } from "../../../../Utils/AppStrings";
import { useDispatch } from "react-redux";
import {
  setIsAlertShow,
  setIsLoader,
  setUserData,
} from "../../../../Redux/Reducers/AppReducers";
import { createNewSocialUser } from "../../../../Network/Services/AuthServices";
import { setUserDataInAsync } from "../../../../Utils/AsyncStorage";
import CommonDataManager from "../../../../Utils/CommonManager";
import AppImagePicker from "../../../Components/CustomModal/AppImagePicker";
import { uploadMedia } from "../../../../Network/Services/GeneralServices";

const SocicalAuthScreen = (props: any) => {
  const socialParams = props?.route?.params?.socialParams;
  const [countryValues, setCountryValues] = useState<any>();

  const [firstName, setFirstName] = useState<string>(
    socialParams?.firstName || ""
  );
  const [lastName, setLastName] = useState<string>(
    socialParams?.lastName ? ` ${socialParams.lastName}` : ""
  );
  const [email, setEmail] = useState<string>(
    socialParams?.email ? ` ${socialParams.email}` : ""
  );
  const [isChecked, setIsChecked] = useState(false);

  const [selectedImage, setSelectedImage] = useState<any>("");
  const [showImagePicker, setShowImagePicker] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [showCountryPicker, setShowCountryPicker] = useState<boolean>(false);
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const dobRef = useRef();
  const emailRef = useRef();
  const dispatch = useDispatch();

  ///error------->
  const [selectedImageError, setSelectedImageError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [checkError, setCheckError] = useState<any>("");

  const focusNextField = (inputRef: any) => {
    if (inputRef?.current) {
      inputRef?.current?.focus();
    }
  };

  const atCreateAccount = async () => {
    let isFormValid = true;
    if (!selectedImage) {
      setSelectedImageError("Please select Profile Picture");
      isFormValid = false;
    }
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

    if (!isChecked) {
      setCheckError("Please accept Privacy & Terms of use first.");
      isFormValid = false;
    }

    if (!isFormValid) {
      return;
    }
    dispatch(setIsLoader(true));
    try {
      await uploadMedia(selectedImage, async (url) => {
        const paramsObj: any = {
          fullName: firstName + " " + lastName,
          phoneNumber: phoneNumber
            ? `${countryValues.code}-${phoneNumber}`
            : "",
          email: email?.toLocaleLowerCase() || "",
          profile_Image: url,
          socialAuthType:
            socialParams?.socailAuthType || SocialTypeStrings.apple,
          socialId: socialParams?.token || socialParams?.password,
        };
        await createNewSocialUser(paramsObj, (response: any) => {
          if (response?.status) {
            setUserDataInAsync(response?.data);
            dispatch(setUserData(response?.data));
            dispatch(setIsLoader(false));
          } else {
            let errorMessage = response?.message
              ? response?.message
              : "Something went wrong";
            dispatch(
              setIsAlertShow({
                value: true,
                message: errorMessage,
              })
            );
            dispatch(setIsLoader(false));
          }
        });
      });
    } catch (e) {
      console.log("error...", e);
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
          style={{ flex: 1, paddingHorizontal: AppHorizontalMargin }}
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
                setValue={(val: string) => {
                  setFirstName(val);
                  setFirstNameError("");
                }}
                value={firstName}
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
                setValue={(val: string) => {
                  setLastName(val);
                  setLastNameError("");
                }}
                keyboardType="default"
                errorMsg={lastNameError}
                value={lastName}
              />
            </View>
          </View>

          <View style={styles.topContainerChild}>
            <View style={styles.inputCont}>
              <Text style={styles.inputText}>{"Email"}</Text>
              <CustomInput
                ref={emailRef}
                placeHold={"Email Address"}
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
                  // Linking.openURL('https://zipp-y.com/privacy-policy/');
                }}
              >
                {" "}
                Terms of Use{" "}
              </Text>
              &
              <Text
                style={styles.privacyTxt}
                onPress={() => {
                  // Linking.openURL('https://zipp-y.com/terms-conditions/');
                }}
              >
                {" "}
                Privacy Policy
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <FilledButton
        label={"Create Account"}
        onPress={() => atCreateAccount()}
      />
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
    flexDirection: "row",
    gap: normalized(10),
    marginRight: normalized(30),
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
    height: normalized(3),
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
    marginTop: normalized(20),
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
    borderColor: AppColors.grey.greyLevel9,
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
  errorMsg: {
    marginTop: 3,
    color: "red",
    fontSize: normalized(12),
    marginLeft: normalized(2),
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
});

export default SocicalAuthScreen;
