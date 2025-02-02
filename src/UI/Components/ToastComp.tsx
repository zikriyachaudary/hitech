import React, { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import {
  AppColors,
  lottieAnimation,
  normalized,
} from "../../Utils/AppConstants";
import CommonDataManager from "../../Utils/CommonManager";
import { setShowToast } from "../../Redux/Reducers/AppReducers";
import { AppStrings } from "../../Utils/AppStrings";
import LottieView from "lottie-react-native";

const ToastComp = () => {
  const timeOfAction = 700;
  const dispatch = useDispatch();
  const selector = useSelector((AppState: any) => AppState.SliceReducer);
  useEffect(() => {
    changeView();
    const t = setTimeout(() => {
      changeView(true);
    }, timeOfAction + 2500);
    return () => clearTimeout(t);
  }, []);
  const opacityOffset = useSharedValue(0);
  const changeView = (close = false) => {
    if (close) {
      opacityOffset.value = withTiming(0, {
        duration: timeOfAction,
      });
      setTimeout(() => {
        dispatch(setShowToast({ type: "", message: "" }));
      }, timeOfAction);
    } else {
      opacityOffset.value = withTiming(1, {
        duration: timeOfAction,
      });
    }
  };
  const viewStyles = useAnimatedStyle(() => {
    return {
      opacity: opacityOffset.value,
    };
  });

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
        width: "90%",
        position: "absolute",
        bottom: 20,
        marginHorizontal: normalized(20),
      }}
    >
      <Animated.View
        style={[
          {
            borderWidth: 1,
            borderColor:
              selector?.showToast?.type == AppStrings.ToastType.success
                ? AppColors.green.dark
                : selector?.showToast?.type == AppStrings.ToastType.warning
                ? AppColors.orange.dark
                : AppColors.red.dark,
            backgroundColor:
              selector?.showToast?.type == AppStrings.ToastType.success
                ? AppColors.green.light
                : selector?.showToast?.type == AppStrings.ToastType.warning
                ? AppColors.orange.light
                : AppColors.red.pink,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: normalized(10),
            paddingVertical: normalized(8),
            borderRadius: 8,
            zIndex: 15,
            flexDirection: "row",
            ...(selector?.showToast?.type == AppStrings.ToastType.warning && {
              height: normalized(50),
            }),
          },
          viewStyles,
        ]}
      >
        <LottieView
          source={
            selector?.showToast?.type == AppStrings.ToastType.success
              ? lottieAnimation.tickAnimation
              : selector?.showToast?.type == AppStrings.ToastType.warning
              ? lottieAnimation.waringAnimation
              : lottieAnimation.closeAnimation
          }
          loop={false}
          autoPlay
          style={{
            width:
              selector?.showToast?.type == AppStrings.ToastType.warning
                ? normalized(50)
                : normalized(32),
            height:
              selector?.showToast?.type == AppStrings.ToastType.warning
                ? normalized(50)
                : normalized(32),
            marginRight: normalized(5),
          }}
        />
        <Text
          style={{
            color:
              selector?.showToast?.type == AppStrings.ToastType.success
                ? AppColors.green.dark
                : selector?.showToast?.type == AppStrings.ToastType.warning
                ? AppColors.orange.dark
                : AppColors.red.dark,
            fontSize: normalized(14),
            fontWeight: "400",
          }}
        >
          {CommonDataManager.getSharedInstance().capitalizeFirstLetter(
            selector?.showToast?.message
          )}
        </Text>
      </Animated.View>
    </View>
  );
};
export default ToastComp;
