import {
  View,
  TextInput,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextInputProps,
  Text,
  PixelRatio,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolateColor,
  withTiming,
  Easing,
  ReduceMotion,
} from "react-native-reanimated";
import { useRef } from "react";

type SmoothBorderTextInputProps = {
  containerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  label: string;
  labelColor: string;
  valueColor: string;
  isFocusBorderColor: string;
  isBlurBorderColor: string;
  isBlurValueBorderColor: string;
  startIcon?: React.ReactElement;
  isError?: boolean;
  errorMessage?: string;
  reduceMotion?: "never" | "always" | "system";
};

const DEFAULT_INPUT_HEIGHT = 50;

export default function SmoothBorderTextInput(
  props: TextInputProps & SmoothBorderTextInputProps
) {
  const inputRef = useRef<TextInput>(null);
  const fontScale = PixelRatio.getFontScale();
  const animatedValue = useSharedValue(0);

  const motion =
    props.reduceMotion === "never"
      ? ReduceMotion.Never
      : props.reduceMotion === "always"
      ? ReduceMotion.Always
      : ReduceMotion.System;

  const handleFocus = () => {
    animatedValue.value = withTiming(1, {
      duration: 350,
      easing: Easing.in(Easing.linear),
      reduceMotion: motion,
    });
  };

  const handleBlur = () => {
    animatedValue.value = withTiming(0, {
      duration: 250,
      easing: Easing.out(Easing.linear),
      reduceMotion: motion,
    });
  };

  const BorderStyle = useAnimatedStyle(() => {
    let fromColor, toColor;

    if (props.isError) {
      fromColor = "#F65936";
      toColor = "#F65936";
    } else {
      fromColor = props.value
        ? props.isBlurValueBorderColor
        : props.isBlurBorderColor;
      toColor = props.isFocusBorderColor;
    }

    return {
      borderColor: interpolateColor(
        animatedValue.value,
        [0, 1],
        [fromColor, toColor]
      ),
      zIndex: 1,
    };
  });

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={[styles.label, { color: props.labelColor }]}>
        {props.label}
      </Text>
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: props.backgroundColor ?? "transparent",
            height: DEFAULT_INPUT_HEIGHT * fontScale,
          },
          BorderStyle,
        ]}
      >
        {!!props.startIcon && (
          <View style={styles.iconContainer}>{props.startIcon}</View>
        )}
        <TextInput
          ref={inputRef}
          clearButtonMode="while-editing"
          placeholderTextColor={props.labelColor}
          style={[styles.input, { color: props.valueColor }, props.style]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </Animated.View>
      {props.isError && (
        <Text style={[styles.errorText, { color: "#F65936" }]}>
          {props.errorMessage}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    borderWidth: 1,
    borderRadius: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    borderRadius: 12,
    padding: 12,
    height: "100%",
    outline: "none",
  },
  label: {
    fontSize: 14,
    marginLeft: 8,
    zIndex: 100,
  },
  errorText: {
    fontSize: 12,
  },
  iconContainer: {
    zIndex: 2,
  },
});
