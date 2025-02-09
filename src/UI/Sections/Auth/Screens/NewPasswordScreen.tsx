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
import { useDispatch } from "react-redux";

const NewPasswordScreen = (props: ScreenProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const confirmPasswordRef = useRef();
  const [passwordError, setPasswordError] = useState("");

  const dispatch = useDispatch();

  const focusNextField = (inputRef: any) => {
    if (inputRef?.current) {
      inputRef?.current?.focus();
    }
  };

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <CustomHeader
        Text={"Set New Password"}
        onPress={() => props?.navigation?.goBack()}
      />
      <View style={styles.topContainerChild}>
        <View style={styles.inputCont}>
          <Text style={styles.inputText}>{"Passowrd"}</Text>
          <CustomInput
            onSubmitEditing={() => focusNextField(confirmPasswordRef)}
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
            ref={confirmPasswordRef}
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
      </View>{" "}
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
  },
  inputCont: {
    marginTop: normalized(20),
    flex: 1,
  },
});
