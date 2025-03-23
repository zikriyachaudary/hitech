import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Animated,
  Text,
  Easing,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
} from "react-native";
import { AppStyles } from "../../../../Utils/AppStyles";

import AudioRecorderPlayer from "react-native-audio-recorder-player";
import LottieView from "lottie-react-native";
import {
  AppColors,
  AppImages,
  lottieAnimation,
  normalized,
  ScreenSize,
} from "../../../../Utils/AppConstants";

const ChatAnimatedBar = (props: any) => {
  const rotation = useRef(new Animated.Value(0)).current;
  const firstButtonY = useRef(new Animated.Value(0)).current;
  const secondButtonY = useRef(new Animated.Value(100)).current;
  const firstButtonOpacity = useRef(new Animated.Value(1)).current;
  const secondButtonOpacity = useRef(new Animated.Value(0)).current;
  const isSecondButtonVisible = useRef(false);
  const [message, setMessage] = useState<any>("");
  const [isRecordingView, setIsRecordingView] = useState(false);
  const [isInputShow, setIsInputShow] = useState(false);
  const [audioRecorderPlayer] = useState(new AudioRecorderPlayer());
  const [recordTime, setRecordTime] = useState("00:00");
  const [playTime, setPlayTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const onStartRecord = async () => {
    try {
      const result = await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener((e) => {
        setRecordTime(formatTime(Math.floor(e.currentPosition / 1000)));
        return;
      });
      setIsRecording(true);
      console.log("Recording started:", result);
    } catch (error) {
      Alert.alert("Error", "Failed to start recording. Please try again.");
      console.error(error);
    }
  };
  const formatTime = (seconds: any) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const onStopRecord = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      setRecordTime("00:00");
      console.log("Recording stopped. File saved at:", result);
    } catch (error) {
      Alert.alert("Error", "Failed to stop recording. Please try again.");
      console.error(error);
    }
  };

  const onStartPlay = async () => {
    try {
      const msg = await audioRecorderPlayer.startPlayer();
      console.log("Playing audio:", msg);
      audioRecorderPlayer.addPlayBackListener((e) => {
        setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
        setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
        return;
      });
      setIsPlaying(true);
    } catch (error) {
      Alert.alert("Error", "Failed to play audio. Please try again.");
      console.error(error);
    }
  };

  const onPausePlay = async () => {
    try {
      await audioRecorderPlayer.pausePlayer();
      setIsPlaying(false);
      console.log("Playback paused.");
    } catch (error) {
      Alert.alert("Error", "Failed to pause playback. Please try again.");
      console.error(error);
    }
  };

  const onStopPlay = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setIsPlaying(false);
      setPlayTime("00:00");
      console.log("Playback stopped.");
    } catch (error) {
      Alert.alert("Error", "Failed to stop playback. Please try again.");
      console.error(error);
    }
  };
  const RecordingButton = () => {
    if (!isRecording) {
      setIsRecordingView(true);
      onStartRecord();
    }
  };
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (props?.takingActionObj) {
      let type = props?.takingActionObj?.actionType;
      if (type == "Edit") {
        setMessage(props?.takingActionObj?.content);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }
  }, [props?.takingActionObj]);

  const handlePress = () => {
    if (message == "") {
      Keyboard.dismiss();
      const nextRotationValue = isSecondButtonVisible.current ? -0.25 : 0.37;
      const nextFirstButtonY = isSecondButtonVisible.current ? 0 : -65;
      const nextSecondButtonY = isSecondButtonVisible.current ? 65 : 0;

      Animated.parallel([
        Animated.timing(rotation, {
          toValue: nextRotationValue,
          duration: 1200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(firstButtonY, {
          toValue: nextFirstButtonY,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(firstButtonOpacity, {
          toValue: isSecondButtonVisible.current ? 1 : 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(secondButtonY, {
          toValue: nextSecondButtonY,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(secondButtonOpacity, {
          toValue: isSecondButtonVisible.current ? 0 : 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsInputShow(!isInputShow);
        isSecondButtonVisible.current = !isSecondButtonVisible.current;
      });
    } else {
      setMessage("");
      props?.onTextMessage(message);
    }
  };

  const rotate = rotation.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-360deg", "360deg"],
  });

  return (
    <View style={AppStyles.MainStyle}>
      {props?.takingActionObj?.actionType == "Reply" && (
        <View
          style={{
            backgroundColor: AppColors.themeColor.dark,
            alignItems: "center",
            borderRadius: normalized(30),
            flexDirection: "row",
            marginHorizontal: normalized(15),
            position: "absolute",
            bottom: normalized(2),
            padding: normalized(10),
            width: ScreenSize.width - normalized(30),
            height: normalized(120),
            marginBottom: normalized(10),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              marginBottom: normalized(30),
            }}
          >
            <View
              style={{
                height: normalized(55),
                width: normalized(3),
                backgroundColor: AppColors.themeColor.light,
              }}
            />
            <Text
              style={{
                color: AppColors.white.white,
                alignSelf: "center",
                width: ScreenSize.width - normalized(90),
                marginStart: normalized(5),
                fontSize: normalized(14),
              }}
              numberOfLines={3}
            >
              {props?.takingActionObj?.content}
            </Text>
            <TouchableOpacity
              style={{
                height: normalized(30),
                width: normalized(30),
                justifyContent: "center",
                alignItems: "center",
                borderRadius: normalized(30 / 2),
                borderWidth: 2,
                borderColor: AppColors.white.white,
              }}
              onPress={() => {}}
            >
              <Image
                source={AppImages.Home.close}
                style={{
                  tintColor: AppColors.white.white,
                  height: normalized(13),
                  width: normalized(13),
                  resizeMode: "contain",
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View
        style={{
          ...styles.box,
          height: normalized(
            message?.length > 60 &&
              props?.takingActionObj?.actionType !== "Reply"
              ? 100
              : 60
          ),
        }}
      >
        {isRecordingView ? (
          <View style={styles.recordViewOuter}>
            <TouchableOpacity
              style={styles.redBoxContainer}
              onPress={() => {
                onStopRecord();
              }}
            >
              <TouchableOpacity
                style={styles.recordRedDot}
                onPress={() => {
                  onStopRecord();
                }}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: normalized(18),
                color: AppColors.white.white,
                marginHorizontal: normalized(15),
              }}
            >{`${recordTime}`}</Text>
            <LottieView
              source={lottieAnimation.recordingAnimation}
              style={{ width: normalized(50), height: normalized(50) }}
              loop={true}
              autoPlay
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: normalized(130),
                right: normalized(-10),
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  // props?.atCloseAction();
                  setIsRecordingView(false);
                  onStopRecord();
                }}
                activeOpacity={1}
                style={{
                  height: normalized(40),
                  width: normalized(40),
                  borderRadius: normalized(40 / 2),
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: AppColors.themeColor.dark,
                }}
              >
                <Image
                  source={AppImages.Home.close}
                  style={{
                    tintColor: AppColors.white.white,
                    height: normalized(15),
                    width: normalized(15),
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsRecordingView(false);
                  onStopRecord();
                }}
                activeOpacity={1}
                style={{
                  borderRadius: normalized(20),
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: AppColors.themeColor.light,
                  paddingHorizontal: normalized(25),
                  paddingVertical: normalized(10),
                }}
              >
                <Text
                  style={{
                    fontSize: normalized(14),
                    color: AppColors.white.white,
                  }}
                >
                  Send
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <Animated.View
              style={[
                styles.btn,
                {
                  transform: [{ translateX: firstButtonY }],
                  opacity: firstButtonOpacity,
                  zIndex: isInputShow ? 0 : 1,
                },
              ]}
            >
              <TextInput
                ref={inputRef}
                multiline
                placeholder="Enter a message ...."
                placeholderTextColor={AppColors.white.white}
                style={{
                  ...styles.txtInput,
                  height: normalized(
                    message?.length > 60 &&
                      props?.takingActionObj?.actionType !== "Reply"
                      ? 70
                      : 30
                  ),
                }}
                value={message}
                onChangeText={(e) => setMessage(e)}
              />
            </Animated.View>
            <Animated.View
              style={[
                styles.btnCont,
                {
                  transform: [{ translateX: secondButtonY }],
                  opacity: secondButtonOpacity,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.cameraCont}
                activeOpacity={0.7}
                onPress={() => {
                  if (isInputShow) {
                    props?.atCameraPress();
                  }
                }}
              >
                <Image source={AppImages.Chat.Camera} style={styles.camera} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cameraCont}
                activeOpacity={0.7}
                onPress={() => {
                  if (isInputShow) {
                    props?.atGalleryPress();
                  }
                }}
              >
                <Image source={AppImages.Chat.Gallery} style={styles.camera} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cameraCont}
                activeOpacity={0.7}
                onPress={() => {
                  if (isInputShow) {
                    props?.atDocPress();
                  }
                }}
              >
                <Image source={AppImages.Chat.doc} style={styles.camera} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cameraCont}
                activeOpacity={0.7}
                onPress={() => {
                  RecordingButton();
                }}
              >
                <Image source={AppImages.Chat.mic} style={styles.camera} />
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
        {!props?.actionType && (
          <TouchableWithoutFeedback
            style={styles.plusCont}
            onPress={handlePress}
          >
            <Animated.Image
              source={
                message.length > 0
                  ? AppImages.Chat.sendIcon
                  : AppImages.Chat.plus
              }
              style={[
                styles.plus,
                !message
                  ? {
                      transform: [
                        { rotate },
                        { scaleX: message.length > 0 ? 1 : -1 },
                      ],
                    }
                  : {},
              ]}
            />
          </TouchableWithoutFeedback>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: AppColors.themeColor.dark,
    alignItems: "center",
    borderRadius: normalized(30),
    flexDirection: "row",
    marginHorizontal: normalized(15),
    position: "absolute",
    bottom: normalized(2),
    padding: normalized(10),
    width: ScreenSize.width - normalized(30),
  },
  plus: {
    width: normalized(20),
    height: normalized(20),
    tintColor: AppColors.white.white,
    resizeMode: "contain",
    marginLeft: normalized(30),
  },
  plusCont: {
    width: normalized(40),
    height: normalized(40),
    borderRadius: normalized(20),
    backgroundColor: AppColors.themeColor.light,
  },
  btn: {
    width: "85%",
    height: normalized(40),
    borderRadius: normalized(30),
    backgroundColor: AppColors.themeColor.light,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: normalized(10),
  },
  btnCont: {
    width: "80%",
    height: normalized(30),
    borderRadius: normalized(15),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: normalized(25),
  },
  txtInput: {
    width: "100%",
    paddingLeft: normalized(15),
    padding: normalized(5),
    backgroundColor: AppColors.themeColor.light,
    borderRadius: normalized(20),
    fontSize: normalized(14),
    color: AppColors.white.white,
    verticalAlign: "middle",
  },
  camera: {
    width: normalized(20),
    height: normalized(20),
    tintColor: AppColors.white.white,
  },
  cameraCont: {
    width: normalized(45),
    height: normalized(45),
    backgroundColor: AppColors.themeColor.light,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: normalized(25),
  },

  recordViewOuter: {
    width: "95%",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: normalized(20),
    justifyContent: "space-between",
  },
  recordRedDot: {
    height: normalized(13),
    width: normalized(13),
    backgroundColor: AppColors.red.dark,
    borderRadius: normalized(3),
  },
  recordTxt: {
    color: AppColors.white.white,
    fontSize: normalized(15),
    marginLeft: 10,
  },
  redBoxContainer: {
    borderWidth: normalized(1.5),
    borderColor: AppColors.white.white,
    height: normalized(35),
    width: normalized(35),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: normalized(25),
  },
});

export default ChatAnimatedBar;
