import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import {
  AppColors,
  AppFonts,
  AppImages,
  normalized,
  ScreenProps,
} from "../../../../Utils/AppConstants";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import {
  setIsLoader,
  setShowToast,
} from "../../../../Redux/Reducers/AppReducers";
import { AppStrings } from "../../../../Utils/AppStrings";
import FilledButton from "../../../Components/CustomButton/FilledButton";
import { updateUserPasswordReq } from "../../../../Network/Services/AuthServices";

const NewPasswordScreen = (props: ScreenProps) => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const confirmPasswordRef = useRef();
  const [passwordError, setPasswordError] = useState("");
  const { isEmail, isPhoneNumber, email, phoneNumber } =
    props?.route?.params || {};
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const dispatch = useDispatch();
  const isRtl = selector?.isRtl;

  const focusNextField = (inputRef: any) => {
    if (inputRef?.current) {
      inputRef?.current?.focus();
    }
  };

  const updatePassword = () => {
    let isFormValid = true;
    if (!password) {
      setPasswordError("Please Enter Password");
      isFormValid = false;
    }
    if (password?.length < 8) {
      setPasswordError("Password must be atleast 8 characters long");
      isFormValid = false;
    }
    if (!confirmPassword) {
      setPasswordError("Please Enter Password");
      isFormValid = false;
    }
    if (confirmPassword?.length < 8) {
      setPasswordError("Password must be atleast 8 characters long");
      isFormValid = false;
    }
    if (password != confirmPassword) {
      setPasswordError("Passwords does not match");
      isFormValid = false;
    }
    if (!isFormValid) {
      return;
    }
    dispatch(setIsLoader(true));
    const obj = {
      secretId: password,
      ...(isEmail && { email }),
      ...(isPhoneNumber && { phoneNumber }),
    };
    dispatch(setIsLoader(true));
    updateUserPasswordReq(obj, (resp: any) => {
      if (resp?.status) {
        dispatch(
          setShowToast({
            type: AppStrings.ToastType.success,
            message: isRtl
              ? "پاس ورڈ اپ ڈیٹ ہو گیا ہے"
              : "Password Updated Successfully",
          })
        );
        props?.navigation?.pop(3);
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
      <CustomHeader
        Text={isRtl ? "نیا پاس ورڈ سیٹ کریں" : "Set New Password"}
        onPress={() => props?.navigation?.goBack()}
      />
      <View style={styles.topContainerChild}>
        <View style={styles.inputCont}>
          <Text style={styles.inputText}>{isRtl ? "پاس ورڈ" : "Password"}</Text>
          <CustomInput
            onSubmitEditing={() => focusNextField(confirmPasswordRef)}
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
      <View style={styles.topContainerChild}>
        <View style={styles.inputCont}>
          <Text style={styles.inputText}>
            {isRtl ? "پاس ورڈ کی تصدیق کریں" : "Confirm Password"}
          </Text>
          <CustomInput
            ref={confirmPasswordRef}
            placeHold={isRtl ? "پاس ورڈ کی تصدیق کریں" : "Confirm Password"}
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

      <FilledButton
        label={isRtl ? "پاس ورڈ اپ ڈیٹ کریں" : "Update Password"}
        onPress={() => updatePassword()}
      />
    </View>
  );
};

export default NewPasswordScreen;

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
