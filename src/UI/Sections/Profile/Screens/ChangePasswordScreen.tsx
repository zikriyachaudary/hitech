import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import {
  AppColors,
  AppFonts,
  AppImages,
  hv,
  normalized,
  ScreenProps,
} from "../../../../Utils/AppConstants";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import FilledButton from "../../../Components/CustomButton/FilledButton";
import {
  setIsLoader,
  setShowToast,
} from "../../../../Redux/Reducers/AppReducers";
import { changePasswordReq } from "../../../../Network/Services/AuthServices";
import { AppStrings } from "../../../../Utils/AppStrings";

const ChangePasswordScreen = (props: ScreenProps) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const dispatch = useDispatch();
  const isRtl = selector?.isRtl;

  const [currentPassword, setCurrentPassowrd] = useState("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const confirmPasswordRef = useRef();
  const passwordRef = useRef();

  const focusNextField = (inputRef: any) => {
    if (inputRef?.current) {
      inputRef?.current?.focus();
    }
  };

  const changePassword = () => {
    let isFormValid = true;

    if (!currentPassword) {
      setCurrentPasswordError(
        isRtl
          ? "براہ کرم موجودہ پاس ورڈ درج کریں"
          : "Please Enter Current Password"
      );
      isFormValid = false;
    }

    if (currentPassword == selector?.userData?.secretId) {
      if (!password) {
        setPasswordError(
          isRtl ? "براہ کرم نیا پاس ورڈ درج کریں" : "Please Enter New Password"
        );
        isFormValid = false;
      }

      if (password?.length < 8) {
        setPasswordError(
          isRtl
            ? "پاس ورڈ کم از کم 8 حروف پر مشتمل ہونا چاہیے"
            : "Password must be at least 8 characters long"
        );
        isFormValid = false;
      }

      if (!confirmPassword) {
        setPasswordError(
          isRtl ? "براہ کرم پاس ورڈ کی تصدیق کریں" : "Please Enter Password"
        );
        isFormValid = false;
      }

      if (confirmPassword?.length < 8) {
        setPasswordError(
          isRtl
            ? "پاس ورڈ کم از کم 8 حروف پر مشتمل ہونا چاہیے"
            : "Password must be at least 8 characters long"
        );
        isFormValid = false;
      }

      if (password != confirmPassword) {
        setPasswordError(
          isRtl ? "پاس ورڈ مماثل نہیں ہے" : "Passwords do not match"
        );
        setConfirmPasswordError(
          isRtl ? "پاس ورڈ مماثل نہیں ہے" : "Passwords do not match"
        );
        isFormValid = false;
      }
    } else {
      setCurrentPasswordError(
        isRtl ? "غلط موجودہ پاس ورڈ" : "Wrong Current Password"
      );
      isFormValid = false;
    }

    if (!isFormValid) {
      return;
    }

    const obj = {
      userId: selector?.userData?.userId,
      secretId: password,
    };

    dispatch(setIsLoader(true));
    changePasswordReq(obj, (resp: any) => {
      if (resp?.status) {
        dispatch(
          setShowToast({
            type: AppStrings.ToastType.success,
            message: isRtl
              ? "پاس ورڈ اپ ڈیٹ ہو گیا ہے"
              : "Password Updated Successfully",
          })
        );
        props?.navigation?.goBack();
        dispatch(setIsLoader(false));
      } else {
        dispatch(
          setShowToast({
            type: AppStrings.ToastType.warning,
            message: AppStrings.Network.someThingError,
          })
        );
        dispatch(setIsLoader(false));
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
        <CustomHeader
          Text={isRtl ? "پاس ورڈ تبدیل کریں" : "Change Password"}
          onPress={() => props?.navigation?.goBack()}
        />

        <View style={styles.topContainerChild}>
          <View style={styles.inputCont}>
            <Text style={styles.inputText}>
              {isRtl ? "موجودہ پاس ورڈ" : "Current Password"}
            </Text>
            <CustomInput
              onSubmitEditing={() => focusNextField(passwordRef)}
              placeHold={isRtl ? "موجودہ پاس ورڈ" : "Current Password"}
              showLastIcon={true}
              rightIcon={AppImages.Auth.hideEye}
              secureEntry={true}
              value={currentPassword}
              setValue={(val: string) => {
                setCurrentPassowrd(val);
                setCurrentPasswordError("");
              }}
              errorMsg={currentPasswordError}
            />
          </View>
        </View>

        <View style={styles.topContainerChild}>
          <View style={styles.inputCont}>
            <Text style={styles.inputText}>
              {isRtl ? "پاس ورڈ" : "New Password"}
            </Text>
            <CustomInput
              onSubmitEditing={() => focusNextField(confirmPasswordRef)}
              placeHold={isRtl ? "پاس ورڈ" : "New Password"}
              showLastIcon={true}
              rightIcon={AppImages.Auth.hideEye}
              secureEntry={true}
              value={password}
              setValue={(val: string) => {
                setPassword(val);
                setPasswordError("");
                setConfirmPasswordError("");
              }}
              errorMsg={passwordError}
            />
          </View>
        </View>

        <View style={styles.topContainerChild}>
          <View style={styles.inputCont}>
            <Text style={styles.inputText}>
              {isRtl ? "پاس ورڈ کی تصدیق کریں" : "Confirm Password"}
            </Text>
            <CustomInput
              placeHold={isRtl ? "پاس ورڈ کی تصدیق کریں" : "Confirm Password"}
              showLastIcon={true}
              rightIcon={AppImages.Auth.hideEye}
              secureEntry={true}
              value={confirmPassword}
              setValue={(val: string) => {
                setConfirmPassword(val);
                setConfirmPasswordError("");
                setPasswordError("");
              }}
              errorMsg={confirmPasswordError}
            />
          </View>
        </View>

        <FilledButton
          label={isRtl ? "پاس ورڈ تبدیل کریں" : "Change Password"}
          onPress={() => changePassword()}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
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
    marginHorizontal: normalized(20),
  },
  inputCont: {
    marginTop: normalized(20),
    flex: 1,
  },
});
