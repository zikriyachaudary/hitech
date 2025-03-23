import React, { useEffect, useRef } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated as RNAnimated,
  Vibration,
} from "react-native";
import moment from "moment";
import ThreadManager from "../../../../ChatModule/ThreadManger";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import AppImageViewer from "../../../Components/AppImageView";
import {
  AppColors,
  AppHorizontalMargin,
  AppImages,
  hv,
  normalized,
} from "../../../../Utils/AppConstants";

const ChatHeader = (props: any) => {
  const animationValue = useRef(new RNAnimated.Value(1)).current;
  const ringRotation = useSharedValue(0);

  const animateButton = () => {
    RNAnimated.sequence([
      RNAnimated.timing(animationValue, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      RNAnimated.timing(animationValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    Vibration.vibrate(100);
    animateButton();

    ringRotation.value = withRepeat(
      withTiming(15, { duration: 100 }),
      -1,
      true
    );

    const timeout = setTimeout(() => {
      ringRotation.value = 0;
    }, 3500);

    return () => {
      clearTimeout(timeout);
      ringRotation.value = 0;
    };
  }, []);

  const phoneAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${ringRotation.value}deg` }],
    };
  });

  const getOfflineTime = () => {
    let findedDate = moment(
      moment(
        props?.otherUserStatus?.OfflineAt,
        ThreadManager.instance.dateFormater.fullDate
      )
    );
    let timeDate = findedDate.format(ThreadManager.instance.dateFormater.time);
    return moment(timeDate, "HH:mm:ss").format("ddd hh:mm A");
  };

  return (
    <>
      <View style={[styles.maincontainer, props?.mainStyle]}>
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={props?.atBackPress}
              style={styles.imageCont}
              activeOpacity={0.7}
            >
              <Image
                style={styles.arrowImage}
                source={AppImages.Auth.backArrow}
              />
            </TouchableOpacity>

            {props?.profile?.length > 0 && (
              <AppImageViewer
                source={{ uri: props?.profile }}
                style={{ ...styles.img, ...props.imgStyle }}
              />
            )}
            <View>
              <Text style={styles.title}>{props?.title}</Text>
              {props?.otherUserStatus?.value ? (
                <Text style={styles.des}>
                  {props?.otherUserStatus?.value == "Online"
                    ? "online"
                    : `Last seen at ${getOfflineTime()}`}
                </Text>
              ) : null}
            </View>
          </View>
          <View style={styles.rightCont}>
            {props?.atRightBtn && (
              <Animated.View style={[phoneAnimatedStyle]}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    paddingHorizontal: normalized(8),
                  }}
                  onPress={() => {
                    props?.atRightBtn();
                  }}
                >
                  <Image
                    source={AppImages.Profile.ProfileIcon}
                    style={{ height: normalized(25), width: normalized(25) }}
                  />
                </TouchableOpacity>
              </Animated.View>
            )}
            {props?.atRightBtn2 && (
              <Animated.View
                style={[
                  {
                    transform: [{ scale: animationValue }],
                  },
                  phoneAnimatedStyle,
                ]}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    paddingHorizontal: normalized(8),
                  }}
                  onPress={() => {
                    props?.atRightBtn();
                  }}
                >
                  <Image
                    source={AppImages.bottomBar.notification}
                    style={{ height: normalized(25), width: normalized(25) }}
                  />
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </>
      </View>
      {props.showBorder ? <View style={styles.line} /> : null}
    </>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    backgroundColor: AppColors.white.white,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: AppHorizontalMargin,
    alignItems: "center",
    paddingVertical: hv(10),
  },
  title: {
    color: "#1E1E1F",
    fontSize: normalized(18),
    marginStart: normalized(10),
  },
  des: {
    color: AppColors.grey.greyLevel10,
    fontSize: normalized(14),
    fontWeight: "400",
  },
  line: {
    height: 0.8,
    backgroundColor: "#E8E6EA",
    marginTop: hv(5),
  },
  rightTxt: {
    fontSize: normalized(14),
    color: AppColors.black.black,
  },
  img: {
    height: normalized(40),
    width: normalized(40),
    borderRadius: normalized(40 / 2),
  },
  imageCont: {
    width: normalized(35),
    height: normalized(35),
    borderRadius: normalized(35 / 2),
    justifyContent: "center",
    alignItems: "center",
  },
  arrowImage: {
    width: normalized(9),
    height: normalized(16),
    tintColor: AppColors.themeColor.dark,
    alignItems: "flex-start",
  },
  rightCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: normalized(10),
  },
});

export default ChatHeader;
