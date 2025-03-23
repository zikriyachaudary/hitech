import {
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Portal } from "react-native-portalize";
import TextMessage from "./TextMessage";
import ImageMessage from "./ImageMessage";
import { BlurView } from "@react-native-community/blur";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import {
  AppColors,
  normalized,
  ScreenSize,
} from "../../../../Utils/AppConstants";

const PortalView = ({
  selectedMessage,
  messageCordinates,
  setSelectedMessage,
  isSender,
  atReactPress,
  actionType,
}: any) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isMyMessage = selectedMessage?.senderID == selector?.userData?.userId;
  const [blurAmount, setBlurAmount] = useState(0);
  const [messageLayout, setMessageLayout] = useState({ top: 0, height: 0 });
  const scale = useSharedValue(0);
  const yCoordinate = useSharedValue(messageCordinates?.y || 0);
  const layoutHeight = useSharedValue(selectedMessage?.layoutHeight || 0);
  const isBelowCenter = useSharedValue(false);
  const { height } = useWindowDimensions();

  useEffect(() => {
    if (selectedMessage) {
      scale.value = withSpring(1);
      yCoordinate.value = messageCordinates?.y || 0;
      layoutHeight.value = selectedMessage?.layoutHeight || 0;
      isBelowCenter.value = (messageCordinates?.y || 0) > height / 2;

      // const interval = setInterval(() => {
      //   setBlurAmount((prev) => {
      //     if (prev < 60) {
      //       return prev + 10;
      //     }
      //     clearInterval(interval);
      //     return prev;
      //   });
      // }, 30);
    } else {
      scale.value = 0;
      // setBlurAmount(0);
    }
  }, [selectedMessage, messageCordinates]);

  const animatedStyle = useAnimatedStyle(() => {
    let y = yCoordinate.value;
    let shouldAnimate = false;

    if (isBelowCenter.value) {
      y = height / 2 - layoutHeight.value / 2;
      shouldAnimate = true;
    } else {
      const isLessDistanceFromTop = y < 100;
      const isLessDistanceFromBottom = height - y < layoutHeight.value;

      if (isLessDistanceFromBottom) {
        y = y - layoutHeight.value * 2;
        shouldAnimate = true;
      }

      if (isLessDistanceFromTop) {
        y = y + layoutHeight.value;
        shouldAnimate = true;
      }
    }

    y = isNaN(y) ? 0 : y;

    return {
      transform: [
        {
          translateX: withTiming(selectedMessage ? 0 : isSender ? 0 : 30, {
            duration: 200,
          }),
        },
      ],
      top: shouldAnimate ? withTiming(y, { duration: 200 }) : y,
      right: isSender ? 0 : undefined,
    };
  });

  const reactionStyle = useAnimatedStyle(() => {
    let y = yCoordinate.value;
    let shouldAnimate = false;

    if (isBelowCenter.value) {
      y = height / 2 - layoutHeight.value / 2 - 10;
      shouldAnimate = true;
    } else {
      const isLessDistanceFromTop = y < 100;
      const isLessDistanceFromBottom = height - y < layoutHeight.value;

      if (isLessDistanceFromBottom) {
        y = y - layoutHeight.value * 2;
        shouldAnimate = true;
      }

      if (isLessDistanceFromTop) {
        y = y + layoutHeight.value;
        shouldAnimate = true;
      }
    }

    y = isNaN(y) ? 0 : y;

    return {
      transform: [
        {
          translateY: shouldAnimate
            ? withTiming(y - 70, { duration: 200 })
            : y - 70,
        },
      ],
    };
  });

  const animatedPopupStyle = useAnimatedStyle(() => {
    let popupY = 0;

    if (isBelowCenter.value) {
      popupY = height / 2 + layoutHeight.value / 2 + 5;
    } else {
      const availableSpaceBelow =
        height - messageLayout.top - messageLayout.height - 10;
      const popupHeight = 250;
      const isSpaceBelow = availableSpaceBelow > popupHeight;

      popupY = isSpaceBelow
        ? messageLayout.top + messageLayout.height + 10
        : messageLayout.top - popupHeight - 10;
    }

    return {
      transform: [
        {
          scale: scale.value,
        },
      ],
      opacity: scale.value,
      top: withTiming(popupY, { duration: 200 }),
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      fontSize: 35,
      color: "black",
      transform: [
        {
          scale: scale.value,
        },
        {
          translateY: interpolate(scale.value, [0, 1], [50, 0]),
        },
      ],
    };
  });

  const handleLayout = (event: any) => {
    const layout = event.nativeEvent.layout;
    setMessageLayout({
      top: layout.y,
      height: layout.height,
    });
  };

  const handleOptionPress = (item: any) => {
    actionType(item?.label);
  };

  if (!selectedMessage) return null;

  const getActionList = () => {
    let list: any = [];
    if (isMyMessage) {
      if (selectedMessage?.msgType == "text") {
        list = [
          { label: "Edit", icon: "🖊️" },
          { label: "Delete", icon: "🗑️" },
        ];
      } else {
        [{ label: "Delete", icon: "🗑️" }];
      }
    } else {
      list = [{ label: "Reply", icon: "↩️" }];
    }

    return list;
  };

  return (
    <Portal>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BlurView
          style={{
            height: ScreenSize.height,
            width: ScreenSize.width,
            position: "absolute",
            bottom: 0,
          }}
        ></BlurView>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setSelectedMessage(null)}
          style={styles.container}
        >
          {!isMyMessage && (
            <Animated.View style={[styles.reaction, reactionStyle]}>
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  atReactPress("❤️");
                }}
              >
                <Animated.Text style={textStyle}>❤️</Animated.Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  atReactPress("👍");
                }}
              >
                <Animated.Text style={textStyle}>👍</Animated.Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  atReactPress("😀");
                }}
              >
                <Animated.Text style={textStyle}>😀</Animated.Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  atReactPress("😂");
                }}
              >
                <Animated.Text style={textStyle}>😂</Animated.Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  atReactPress("😍");
                }}
              >
                <Animated.Text style={textStyle}>😍</Animated.Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  atReactPress("😡");
                }}
              >
                <Animated.Text style={textStyle}>😡</Animated.Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          <Animated.View
            style={[
              styles.popupMenu,
              {
                height:
                  getActionList()?.length < 2
                    ? normalized(50)
                    : getActionList()?.length < 3
                    ? normalized(85)
                    : normalized(110),
              },
              animatedPopupStyle,
            ]}
          >
            <FlatList
              data={getActionList()}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.label}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    handleOptionPress(item);
                  }}
                  style={styles.popupOption}
                >
                  <Text
                    style={{
                      ...styles.popupText,
                      color:
                        item?.label == "Delete"
                          ? AppColors.red.dark
                          : AppColors.black.black,
                    }}
                  >
                    {item.label}
                  </Text>
                  {/* <Text style={styles.popupIcon}>{item.icon}</Text> */}
                </TouchableOpacity>
              )}
            />
          </Animated.View>
          <Animated.View
            style={[styles.messageStyle, animatedStyle]}
            onLayout={handleLayout}
          >
            {selectedMessage?.msgType === "text" ? (
              <TextMessage {...selectedMessage} isMyMessage={isMyMessage} />
            ) : (
              <ImageMessage {...selectedMessage} />
            )}
          </Animated.View>
        </TouchableOpacity>
      </GestureHandlerRootView>
    </Portal>
  );
};

export default PortalView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageStyle: {
    position: "absolute",
  },
  reaction: {
    position: "absolute",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 50,
    flexDirection: "row",
    alignSelf: "center",
    gap: 8,
  },
  popupMenu: {
    width: 260,
    position: "absolute",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    padding: 10,
    zIndex: 1,
  },
  popupOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    gap: 30,
  },
  popupIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  popupText: {
    fontSize: 18,
    color: "black",
  },
});
