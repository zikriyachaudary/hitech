import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AppStyles } from "../../../../Utils/AppStyles";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  AppImages,
  hv,
  normalized,
} from "../../../../Utils/AppConstants";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import FilledButton from "../../../Components/CustomButton/FilledButton";
import auth from "@react-native-firebase/auth";
import { useDispatch } from "react-redux";
import {
  setIsAlertShow,
  setIsLoader,
} from "../../../../Redux/Reducers/AppReducers";
import { AppStrings } from "../../../../Utils/AppStrings";
import CommonDataManager from "../../../../Utils/CommonManager";

const ForgetPassword = (props: any) => {
  const [email, setEmail] = useState<string>("");
  const dispatch = useDispatch();
  const [emailError, setEmailError] = useState<string>("");

  const onForgotPass = async () => {
    let isFormValid = true;
    if (!email) {
      setEmailError("Please enter an Email");
      isFormValid = false;
    }
    if (!CommonDataManager.getSharedInstance().isEmailValid(email)) {
      setEmailError(AppStrings.Validation.invalidEmailError);
      isFormValid = false;
    }
    if (!isFormValid) {
      return;
    }
    try {
      dispatch(setIsLoader(true));
      setEmail("");
      await auth().sendPasswordResetEmail(email.toLocaleLowerCase());
      dispatch(
        setIsAlertShow({
          value: true,
          message: "A reset Email has been send to your email",
        })
      );
      props?.navigation.goBack();
    } catch (error: any) {
      dispatch(
        setIsAlertShow({
          value: true,
          message: error.message,
        })
      );
    } finally {
      dispatch(setIsLoader(false));
    }
  };

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <CustomHeader
        onPress={() => props?.navigation?.goBack()}
        Text={"Forgot Passowrd"}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 35 : 30}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, paddingHorizontal: AppHorizontalMargin }}
        >
          {email ? (
            <Text style={styles.descText}>
              {`We’ll send you a one time password on your email `}
              <Text style={{ fontFamily: AppFonts.PoppinsSemiBold }}>
                {email}
              </Text>
            </Text>
          ) : (
            <View style={{ marginVertical: hv(25) }} />
          )}
          <Text style={styles.inputText}>{"Email"}</Text>
          <CustomInput
            placeHold={"email@example.com"}
            showLastIcon={true}
            rightIcon={AppImages.Auth.message}
            secureEntry={false}
            setValue={(txt: any) => {
              setEmail(txt);
              setEmailError("");
            }}
            value={email}
            errorMsg={emailError}
          />

          <FilledButton
            mainContainer={{ marginVertical: hv(30) }}
            label={"Reset Passwword"}
            onPress={onForgotPass}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  descText: {
    color: AppColors.black.Level6,
    fontSize: normalized(14),
    fontFamily: AppFonts.PoppinsRegular,
    marginTop: normalized(10),
    paddingHorizontal: normalized(20),
    fontWeight: "400",
  },
  inputText: {
    marginTop: normalized(60),
    fontSize: normalized(14),
    color: AppColors.black.Level7,
    marginBottom: normalized(5),
    fontFamily: AppFonts.PoppinsSemiBold,
    fontWeight: "600",
  },
});

export default ForgetPassword;
