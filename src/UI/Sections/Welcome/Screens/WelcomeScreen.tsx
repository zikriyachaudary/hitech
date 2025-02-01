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
    <LinearGradient colors={["#0900FF", "#DE8225"]} style={AppStyles.MainStyle}>
      <AppStatusBar backgroundColor="transparent" barStyle="light-content" />
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
          <View style={styles.btnCont}>
            <TouchableOpacity
              onPress={() => {
                props?.navigation?.navigate(Routes.Auth.login);
              }}
              activeOpacity={0.7}
              style={styles.btn}
            >
              <Text style={styles.btnTxt}>Continue As User</Text>
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
              <Text style={styles.btnTxt}>Continue As Admin</Text>
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
    width: normalized(150),
    height: normalized(150),
    resizeMode: "contain",
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
  },
  btn: {
    width: normalized(300),
    height: normalized(55),
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: normalized(10),
    marginTop: normalized(20),
  },
  btnTxt: {
    fontSize: normalized(22),
    color: "#8C4D00",
    // color: AppColors.white.white,
    fontFamily: AppFonts.PoppinsSemiBold,
  },
});
