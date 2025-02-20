import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import LinearGradient from "react-native-linear-gradient";
import AppStatusBar from "../../../Components/SocialButton/AppStatusBar";
import {
  AppColors,
  AppFonts,
  AppImages,
  normalized,
  ScreenProps,
  ScreenSize,
} from "../../../../Utils/AppConstants";
import { Routes } from "../../../../Utils/Routes";

const WelcomeScreen = (props: ScreenProps) => {
  return (
    <LinearGradient
      colors={["#85031f", "#000"]}
      style={AppStyles.MainStyle}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* <AppStatusBar backgroundColor="transparent" barStyle="light-content" /> */}
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.imgCont}>
            <Image source={AppImages.logo} style={styles.logo} />
          </View>
          <View
            style={{
              height: normalized(130),
              width: ScreenSize.width,
              position: "absolute",
              bottom: 0,
              borderTopLeftRadius: normalized(20),
              borderTopRightRadius: normalized(20),
              backgroundColor: "rgba(255,255,255,0.20)",
            }}
          />
          <View style={styles.btnCont}>
            <TouchableOpacity
              onPress={() => {
                props?.navigation?.navigate(Routes.Auth.login);
              }}
              activeOpacity={0.7}
              style={styles.btn}
            >
              <Text style={styles.btnTxt}>User</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                props?.navigation?.navigate(Routes.Auth.login, {
                  isAdmin: true,
                });
              }}
              activeOpacity={0.7}
              style={styles.btn}
            >
              <Text style={styles.btnTxt}>Admin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  logo: {
    width: normalized(200),
    height: normalized(200),
    resizeMode: "contain",
    borderRadius: normalized(10),
  },
  imgCont: {
    width: normalized(250),
    height: normalized(250),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: normalized(20),
    marginTop: normalized(20),
    backgroundColor: "rgba(255,255,255,0.20)",
  },
  btnCont: {
    width: ScreenSize.width - normalized(40),
    alignItems: "center",
    marginBottom: normalized(30),
    flexDirection: "row",
    justifyContent: "center",
    gap: normalized(20),
  },
  btn: {
    width: normalized(150),
    height: normalized(40),
    // backgroundColor: "rgba(255,255,255,0.3)",
    // backgroundColor: AppColors.white.white,
    backgroundColor: AppColors.themeColor.dark,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: normalized(100),
    marginTop: normalized(20),
    // borderWidth: 2,
    borderColor: AppColors.themeColor.dark,
  },
  btnTxt: {
    fontSize: normalized(18),
    // color: "#8C4D00",
    // color: "#0900FF",
    // color: AppColors.themeColor.dark,
    color: AppColors.white.white,
    fontFamily: AppFonts.PoppinsSemiBold,
  },
});
