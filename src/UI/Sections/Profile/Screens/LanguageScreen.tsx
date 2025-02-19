import {
  Animated,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import {
  AppColors,
  AppFonts,
  AppImages,
  normalized,
  ScreenProps,
} from "../../../../Utils/AppConstants";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import { setIsRtl } from "../../../../Redux/Reducers/AppReducers";

const LanguageScreen = (props: ScreenProps) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;
  const dispatch = useDispatch();

  const scaleEnglish = useRef(new Animated.Value(isRtl ? 1 : 1.1)).current;
  const scaleUrdu = useRef(new Animated.Value(isRtl ? 1.1 : 1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleEnglish, {
        toValue: isRtl ? 1 : 1.2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleUrdu, {
        toValue: isRtl ? 1.2 : 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isRtl]);

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <CustomHeader
        title={isRtl ? "زبان کا انتخاب" : "Choose Language"}
        onPress={() => props?.navigation?.goBack()}
      />
      <View style={styles.mainCont}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => dispatch(setIsRtl(false))}
        >
          <Animated.View
            style={{
              ...styles.btnCont,
              transform: [{ scale: scaleEnglish }],
              borderWidth: !isRtl ? 2 : 1,
              borderColor: !isRtl
                ? AppColors.themeColor.dark
                : AppColors.grey.greyLevel9,
            }}
          >
            <Image source={AppImages.Profile.usa} style={styles.usaImg} />
            <Text style={styles.languageTxt}>English</Text>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => dispatch(setIsRtl(true))}
        >
          <Animated.View
            style={{
              ...styles.btnCont,
              transform: [{ scale: scaleUrdu }],
              borderWidth: isRtl ? 2 : 1,
              borderColor: isRtl
                ? AppColors.themeColor.dark
                : AppColors.grey.greyLevel9,
            }}
          >
            <Image source={AppImages.Profile.pk} style={styles.usaImg} />
            <Text style={styles.languageTxt}>اردو</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LanguageScreen;

const styles = StyleSheet.create({
  usaImg: {
    width: normalized(80),
    height: normalized(80),
  },
  languageTxt: {
    color: AppColors.black.black,
    fontSize: normalized(18),
    fontFamily: AppFonts.PoppinsSemiBold,
  },
  btnCont: {
    padding: normalized(10),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: normalized(10),
    width: normalized(140),
  },
  mainCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    flex: 1,
  },
});
