import {
  Image,
  KeyboardAvoidingView,
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
import React, { useRef, useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  AppImages,
  hv,
  normalized,
  ScreenProps,
} from "../../../../Utils/AppConstants";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import FilledButton from "../../../Components/CustomButton/FilledButton";
import AppImagePicker from "../../../Components/CustomModal/AppImagePicker";
import { useDispatch, useSelector } from "react-redux";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import { uploadMedia } from "../../../../Network/Services/GeneralServices";
import {
  setIsLoader,
  setShowToast,
  setUserData,
} from "../../../../Redux/Reducers/AppReducers";
import { updatedUserReq } from "../../../../Network/Services/AuthServices";
import { setUserDataInAsync } from "../../../../Utils/AsyncStorage";
import { ADMN_TYPE, AppStrings } from "../../../../Utils/AppStrings";
import {
  updateAdminReq,
  updateSubAdminReq,
} from "../../../../Network/Services/AdminGeneralServices";

const EditProfileScreen = (props: ScreenProps) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const userData = selector?.userData || null;
  const isRtl = selector?.isRtl;

  const [email, setEmail] = useState<string>(userData?.email || "");
  const [firstName, setFirstName] = useState<string>(userData?.firstName || "");
  const [lastName, setLastName] = useState<string>(userData?.lastName || "");
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const dobRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [selectedImage, setSelectedImage] = useState<any>(
    userData?.profileImage || userData?.profile || ""
  );
  const [showImagePicker, setShowImagePicker] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>(
    userData?.phoneNumber || ""
  );

  ///error------->
  const [selectedImageError, setSelectedImageError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState<any>("");

  ////////

  const dispatch = useDispatch();

  const focusNextField = (inputRef: any) => {
    if (inputRef?.current) {
      inputRef?.current?.focus();
    }
  };

  const onUpdateProfile = async () => {
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
    if (!phoneNumber) {
      setPhoneError("Please Enter Phone Number");
      isFormValid = false;
    }
    if (!isFormValid) {
      return;
    }

    try {
      dispatch(setIsLoader(true));
      let url = selectedImage;
      if (!selectedImage.includes("https")) {
        url = await new Promise<string>((resolve, reject) => {
          uploadMedia(selectedImage, (imageUrl: string | null) => {
            if (imageUrl) {
              resolve(imageUrl);
            } else {
              console.error("Image upload failed");
              reject("Image upload failed");
            }
          });
        });
      }
      if (url) {
        if (userData?.adminType == ADMN_TYPE.superAdmin) {
          const paramsObj = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            profileImage: url,
            adminId: userData?.adminId,
          };
          await updateAdminReq(paramsObj, (resp: any) => {
            if (resp?.status) {
              let obj = { ...selector?.userData, ...paramsObj };
              setUserDataInAsync(obj);
              dispatch(setUserData(obj));
              dispatch(
                setShowToast({
                  type: AppStrings.ToastType.success,
                  message: resp?.message,
                })
              );
              props?.navigation?.goBack();
            } else {
              dispatch(
                setShowToast({
                  type: AppStrings.ToastType.error,
                  message: resp?.message,
                })
              );
            }
          });
        } else if (userData?.adminType == ADMN_TYPE.Admin) {
          const paramsObj = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            profileImage: url,
            adminId: userData?.adminId,
            userId: userData?.userId,
          };
          await updateSubAdminReq(paramsObj, (resp: any) => {
            if (resp?.status) {
              let obj = { ...selector?.userData, ...paramsObj };
              setUserDataInAsync(obj);
              dispatch(setUserData(obj));
              dispatch(
                setShowToast({
                  type: AppStrings.ToastType.success,
                  message: resp?.message,
                })
              );
              props?.navigation?.goBack();
            } else {
              dispatch(
                setShowToast({
                  type: AppStrings.ToastType.error,
                  message: resp?.message,
                })
              );
            }
          });
        } else {
          const paramsObj = {
            firstName: firstName,
            lastName: lastName,
            fullName: firstName + " " + lastName,
            email: email,
            phoneNumber: phoneNumber,
            profileImage: url,
          };
          updatedUserReq(selector?.userData?.userId, paramsObj, (response) => {
            if (response?.status) {
              let obj = { ...selector?.userData, ...paramsObj };
              setUserDataInAsync(obj);
              dispatch(setUserData(obj));
              dispatch(
                setShowToast({
                  type: AppStrings.ToastType.success,
                  message: response?.message,
                })
              );
              props?.navigation?.goBack();
              dispatch(setIsLoader(false));
              props?.navigation?.goBack();
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
        }
        dispatch(setIsLoader(false));
      }
    } catch (error) {
      console.log("Eror while update profile --->>>   ", error),
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
        <CustomHeader
          Text={isRtl ? "پروفائل میں ترمیم کریں" : "Edit Profile"}
          onPress={() => props?.navigation?.goBack()}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            paddingHorizontal: AppHorizontalMargin,
          }}
        >
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
                ref={firstNameRef}
                onSubmitEditing={() => focusNextField(lastNameRef)}
                placeHold={isRtl ? "پہلا نام درج کریں" : "First Name"}
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
              <Text style={styles.inputText}>
                {isRtl ? "آخری نام" : "Last Name"}
              </Text>
              <CustomInput
                ref={lastNameRef}
                onSubmitEditing={() => focusNextField(dobRef)}
                placeHold={isRtl ? "آخری نام درج کریں" : "Last Name"}
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
              <Text style={styles.inputText}>{isRtl ? "ای میل" : "Email"}</Text>
              <CustomInput
                ref={emailRef}
                onSubmitEditing={() => focusNextField(passwordRef)}
                placeHold={isRtl ? "ای میل درج کریں" : "Enter Email Address"}
                placeHolderColor={AppColors.grey.greyLevel4}
                value={email}
                keyboardType={"email-address"}
                setValue={(val: string) => {
                  setEmail(val);
                  setEmailError("");
                }}
                errorMsg={emailError}
                isDisable={true}
                isEditable={false}
              />
            </View>
          </View>

          <Text style={{ ...styles.inputText, marginTop: normalized(20) }}>
            {isRtl ? "فون نمبر" : "Phone Number"}
          </Text>

          <View
            style={{
              ...styles.phoneContChild,
              borderColor: phoneError
                ? AppColors.red.dark
                : AppColors.grey.greyLevel9,
              flexDirection: isRtl ? "row-reverse" : "row",
            }}
          >
            <View
              style={{
                ...styles.flagCont,
              }}
            >
              <Image source={AppImages.Auth.flag} style={styles.flag} />
            </View>

            <View
              style={{
                flex: 1,
                padding: 0,
              }}
            >
              <TextInput
                onSubmitEditing={() => focusNextField(emailRef)}
                placeholder={isRtl ? "3XXXXXXXX" : "3XXXXXXXX"}
                placeholderTextColor={AppColors.grey.greyLevel9}
                keyboardType="number-pad"
                maxLength={10}
                editable={userData?.isAdmin ? true : false}
                style={{
                  includeFontPadding: false,
                  color: userData?.isAdmin
                    ? AppColors.black.black
                    : AppColors.grey.greyLevel9,
                  fontFamily: AppFonts.PoppinsRegular,
                  textAlign: isRtl ? "right" : "left",
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

          <FilledButton
            label={isRtl ? "پروفائل اپ ڈیٹ کریں" : "Update Profile"}
            onPress={() => {
              onUpdateProfile();
            }}
          />
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

export default EditProfileScreen;

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
});
