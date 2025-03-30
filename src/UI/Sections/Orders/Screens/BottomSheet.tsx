import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
} from "react-native-reanimated";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useEffect } from "react";
import { AppColors, ScreenSize } from "../../../../Utils/AppConstants";

const SCREEN_HEIGHT = ScreenSize.height;
const SNAP_POINTS = [
  SCREEN_HEIGHT,
  SCREEN_HEIGHT * 0.3,
  SCREEN_HEIGHT * 0.6,
  SCREEN_HEIGHT * 0.9,
];

const BottomSheet = () => {
  const translateY = useSharedValue(SNAP_POINTS[0]); // Start from bottom (hidden)

  useEffect(() => {
    // Animate bottom sheet from hidden position to middle (default)
    translateY.value = withSpring(SNAP_POINTS[1], {
      damping: 20,
      stiffness: 200,
    });
  }, []);

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateY.value = Math.max(
        SNAP_POINTS[1], // Prevent moving below initial position
        Math.min(ctx.startY + event.translationY, SNAP_POINTS[2])
      );
    },
    onEnd: () => {
      const closest = SNAP_POINTS.reduce((prev, curr) =>
        Math.abs(curr - translateY.value) < Math.abs(prev - translateY.value)
          ? curr
          : prev
      );

      translateY.value = withSpring(closest, { damping: 20, stiffness: 200 });
    },
  });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={[styles.sheet, style]}>
        <View style={styles.handle} />
        <Text style={styles.text}>Swipe me up or down!</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 1, // Adjusted height
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    marginBottom: 10,
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.black.black,
  },
});

export default BottomSheet;
