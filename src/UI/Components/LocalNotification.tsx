import React, { useEffect } from "react";
import { View, Text, TouchableWithoutFeedback, Image } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AppColors, AppImages, normalized } from "../../Utils/AppConstants";
import { useSelector } from "react-redux";
import { AppRootStore } from "../../Redux/store/AppStore";

const LocalNotification = (props: any) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const translationY = useSharedValue(-130);
  useEffect(() => {
    showNoti();
    setTimeout(() => {
      showNoti();
      props.closeView();
    }, 5000);
  }, []);
  const showNoti = () => {
    translationY.value = withTiming(translationY.value == 0 ? -130 : 0, {
      duration: 500,
    });
  };
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: 60,
      marginHorizontal: 15,
      borderRadius: 8,
      marginTop: selector?.isNotchBar ? 10 : 5,
      paddingHorizontal: 10,
      backgroundColor: AppColors.white.white,
      borderWidth: 1,
      borderColor: "#C2C2C2",
      justifyContent: "center",
      transform: [
        {
          translateY: translationY.value,
        },
      ],
      flexDirection: "row",
      paddingVertical: 5,
    };
  });
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        props.openView();
      }}
    >
      <Animated.View style={animatedStyle}>
        <Image
          style={{
            height: normalized(40),
            width: normalized(70),
            borderRadius: normalized(6),
            backgroundColor: AppColors.white.white,
          }}
          source={AppImages.logo}
          resizeMode="contain"
        />
        <View
          style={{
            flex: 1,
            marginLeft: 10,
            justifyContent: "center",
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontSize: normalized(12),
              color: AppColors.black.black,
              fontWeight: "500",
            }}
          >
            {selector?.pushObj._title}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 12,
              color: "#8B8E91",
            }}
          >
            {selector?.pushObj?._body}
          </Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
export default LocalNotification;
