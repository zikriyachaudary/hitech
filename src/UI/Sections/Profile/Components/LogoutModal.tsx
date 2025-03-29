import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppStatusBar from "../../../Components/SocialButton/AppStatusBar";
import {
  AppColors,
  AppFonts,
  AppImages,
  hv,
  Modal_Type,
  normalized,
} from "../../../../Utils/AppConstants";

const LogoutModal = (props: any) => {
  const handleLogout = () => {
    props?.onLogout();
  };

  return (
    <Modal animationType={"slide"} visible={true} transparent={true}>
      <AppStatusBar
        backgroundColor={"rgba(0,0,0,0.3)"}
        barStyle={"light-content"}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <View style={styles.container}>
          <View style={styles.alertBox}>
            {props?.type !== Modal_Type.deleteAccount && (
              <Image
                source={AppImages.Products.warning}
                style={{
                  tintColor:
                    props?.type === Modal_Type.deleteAccount
                      ? AppColors.red.dark
                      : undefined,
                }}
              />
            )}

            <Text style={styles.title}>
              {props?.type === Modal_Type.deleteAccount
                ? "Confirm Account Deletion"
                : "Come Back Soon!"}
            </Text>
            <Text style={styles.label}>
              {props?.type === Modal_Type.deleteAccount
                ? `Are you sure you want to permanently delete your account? This action is irreversible, and all your data will be permanently lost.`
                : "Are you sure you want to logout?"}
            </Text>

            <View style={styles.bottomCont}>
              <TouchableOpacity
                onPress={() => {
                  handleLogout();
                }}
                activeOpacity={0.7}
                style={styles.yesBtnCont}
              >
                <Text style={styles.yesBtnTxt}>{"Yes"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  props?.onClose();
                }}
                activeOpacity={0.7}
                style={styles.cancelBtn}
              >
                <Text
                  style={{
                    fontSize: normalized(14),
                    fontWeight: "400",
                    color: AppColors.white.white,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  alertBox: {
    marginHorizontal: normalized(20),
    backgroundColor: AppColors.white.white,
    borderRadius: normalized(15),
    alignItems: "center",
    justifyContent: "center",
    padding: normalized(15),
  },
  label: {
    fontSize: normalized(14),
    color: AppColors.black.black,
    textAlign: "center",
  },
  title: {
    fontSize: normalized(16),
    color: AppColors.black.black,
    fontWeight: "500",
    fontFamily: AppFonts.PoppinsMedium,
    marginVertical: hv(12),
    textAlign: "center",
  },
  bottomCont: {
    flexDirection: "row",
    marginTop: 10,
    width: normalized(250),
    justifyContent: "space-between",
  },
  yesBtnCont: {
    height: hv(32),
    width: normalized(110),
    borderWidth: 1,
    borderColor: AppColors.themeColor.dark,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  yesBtnTxt: {
    fontSize: normalized(14),
    fontWeight: "400",
    color: AppColors.themeColor.dark,
  },
  cancelBtn: {
    height: hv(32),
    width: normalized(110),
    backgroundColor: AppColors.themeColor.dark,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});

export default LogoutModal;
