import {
  Alert,
  Dimensions,
  Linking,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from "react-native-permissions";
import DocumentPicker, { types } from "react-native-document-picker";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStore } from "../Redux/store/AppStore";
import { setIsLoader, setShowToast } from "../Redux/Reducers/AppReducers";
import { AppStrings } from "../Utils/AppStrings";
import ThreadManager from "../ChatModule/ThreadManger";

const GeneralManager = () => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const dispatch = useDispatch();
  const width = Dimensions.get("screen").width - 40;

  const requestAudioPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);

        const recordAudioGranted =
          granted["android.permission.RECORD_AUDIO"] ===
          PermissionsAndroid.RESULTS.GRANTED;
        const writeStorageGranted =
          granted["android.permission.WRITE_EXTERNAL_STORAGE"] ===
          PermissionsAndroid.RESULTS.GRANTED;
        const readStorageGranted =
          granted["android.permission.READ_EXTERNAL_STORAGE"] ===
          PermissionsAndroid.RESULTS.GRANTED;

        if (recordAudioGranted && writeStorageGranted && readStorageGranted) {
          return true;
        } else {
          Alert.alert(
            "Permission Denied",
            "You need to grant all permissions to use this feature."
          );
          return false;
        }
      } catch (err) {
        console.error("Failed to request permissions:", err);
        return false;
      }
    } else if (Platform.OS === "ios") {
      const microphonePermission = await check(PERMISSIONS.IOS.MICROPHONE);
      if (microphonePermission === RESULTS.GRANTED) {
        return true;
      }
      const microphoneRequest = await request(PERMISSIONS.IOS.MICROPHONE);
      if (microphoneRequest === RESULTS.GRANTED) {
        return true;
      } else {
        Alert.alert(
          "Permission Denied",
          "Please enable microphone permissions in your iOS settings to use this feature."
        );
        return false;
      }
    }
  };

  const handlePermissionCheck = async (
    permission: any,
    onSuccess: () => void
  ) => {
    const status = await check(permission);
    if (status === "granted") {
      onSuccess();
    } else if (status === "blocked") {
      Alert.alert("", "Press to Go in device settings to enable permissions.", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "SETTINGS",
          onPress: () => openSettings(),
        },
      ]);
    } else {
      const result = await request(permission);
      if (result === "granted") {
        onSuccess();
      } else {
        Alert.alert(
          "Permission Required",
          "Permission is required to access the camera or gallery.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Go to Settings",
              onPress: () => Linking.openSettings(),
            },
          ],
          { cancelable: false }
        );
      }
    }
  };

  const handleCameraPermissions = async (onComplete: any) => {
    const options = {
      quality: 0.5,
      maxWidth: 800,
      maxHeight: 800,
      cameraType: "back",
    };

    const handleResponse = (response: any) => {
      if (response.didCancel) {
        onComplete({ status: false, data: "User cancelled media selection" });
      } else if (response.errorCode) {
        onComplete({ status: false, data: response.errorMessage });
      } else if (response.assets && response.assets.length > 0) {
        const selectedMedia = response.assets[0].uri;
        onComplete({ status: true, data: selectedMedia });
      } else {
        onComplete({ status: false, data: "No media selected" });
      }
    };

    const launchCameraWithType = async (mediaType: "photo" | "video") => {
      const mediaOptions = { ...options, mediaType };
      launchCamera(mediaOptions, handleResponse);
    };

    if (Platform.OS === "android") {
      Alert.alert(
        "Select Media Type",
        "Choose the type of media to capture:",
        [
          {
            text: "Photo",
            onPress: async () => {
              await handlePermissionCheck(
                PERMISSIONS.ANDROID.CAMERA,
                async () => {
                  await launchCameraWithType("photo");
                }
              );
            },
          },
          {
            text: "Video",
            onPress: async () => {
              await handlePermissionCheck(
                PERMISSIONS.ANDROID.CAMERA,
                async () => {
                  await launchCameraWithType("video");
                }
              );
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      await handlePermissionCheck(PERMISSIONS.IOS.CAMERA, async () => {
        launchCamera({ ...options, mediaType: "mixed" }, handleResponse);
      });
    }
  };

  const handleGalleryPermissions = async (onComplete: any) => {
    if (Platform.OS === "android") {
      const permission =
        Platform.Version >= 33
          ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

      // await handlePermissionCheck(permission, () => {
      launchImageLibrary(
        {
          mediaType: "mixed",
          selectionLimit: 1,
          quality: 0.5,
          maxWidth: width,
          maxHeight: 400,
        },
        (response: any) => {
          if (response.didCancel) {
            onComplete({
              status: false,
              data: "User cancelled Media selection",
            });
          } else if (response.errorCode) {
            onComplete({ status: false, data: response.errorMessage });
          } else {
            const selectedImages = response.assets.map(
              (asset: any) => asset.uri
            );
            if (selectedImages.length > 0) {
              onComplete({ status: true, data: selectedImages[0] });
            } else {
              onComplete({
                status: false,
                data: "User cancelled Media selection",
              });
            }
          }
        }
      ).catch((e) => {
        onComplete({ status: false, data: "User Cancelled Media Selection" });
      });
      // });
    } else {
      await handlePermissionCheck(PERMISSIONS.IOS.PHOTO_LIBRARY, () => {
        launchImageLibrary(
          {
            mediaType: "mixed",
            selectionLimit: 1,
            quality: 0.5,
            maxWidth: width,
            maxHeight: 400,
          },
          (response: any) => {
            if (response.didCancel) {
              onComplete({
                status: false,
                data: "User cancelled Media selection",
              });
            } else if (response.errorCode) {
              onComplete({ status: false, data: response.errorMessage });
            } else {
              const selectedImages = response.assets.map(
                (asset: any) => asset.uri
              );
              if (selectedImages.length > 0) {
                onComplete({ status: true, data: selectedImages[0] });
              } else {
                onComplete({
                  status: false,
                  data: "User cancelled Media selection",
                });
              }
            }
          }
        ).catch((e) => {
          onComplete({ status: false, data: "User Cancelled Media Selection" });
        });
      });
    }
  };

  const handleDocPermissions = async (onComplete: any) => {
    try {
      if (Platform.OS === "android") {
        if (Platform.Version < 29) {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          ]);
          if (
            granted["android.permission.READ_EXTERNAL_STORAGE"] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            granted["android.permission.WRITE_EXTERNAL_STORAGE"] ===
              PermissionsAndroid.RESULTS.GRANTED
          ) {
            documentSelection((res: any) => {
              if (res?.status && res?.data) {
                onComplete({ status: true, data: res?.data });
              } else {
                onComplete({ status: false, data: res?.data });
              }
            });
          }
        } else if (Platform.Version < 30) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            documentSelection((res: any) => {
              if (res?.status && res?.data) {
                onComplete({ status: true, data: res?.data });
              } else {
                onComplete({ status: false, data: res?.data });
              }
            });
          }
        } else {
          documentSelection((res: any) => {
            if (res?.status && res?.data) {
              onComplete({ status: true, data: res?.data });
            } else {
              onComplete({ status: false, data: res?.data });
            }
          });
        }
      } else {
        documentSelection((res: any) => {
          if (res?.status && res?.data) {
            onComplete({ status: true, data: res?.data });
          } else {
            onComplete({ status: false, data: res?.data });
          }
        });
      }
    } catch (e) {
      onComplete({ status: false, data: e });
    }
  };

  const documentSelection = async (onComplete: any) => {
    DocumentPicker.pick({
      presentationStyle: "formSheet",
      type: types.pdf,
      allowMultiSelection: false,
    })
      .then(async (pdf) => {
        const result = pdf[0];
        if (result?.uri) {
          onComplete({ status: true, data: result?.uri });
        } else {
          onComplete({ status: false, data: "User Cancelled Media Selection" });
        }
      })
      .catch((e) => {
        onComplete({ status: false, data: "User Cancelled Media Selection" });
      });
  };

  const checkChatIsConnected = async (otherUserData: any, onComplete: any) => {
    if (!selector?.isNetConnected) {
      dispatch(
        setShowToast({
          type: AppStrings.ToastType.error,
          message: AppStrings.Network.internetError,
        })
      );
      return;
    }
    let threadObj = null;
    ThreadManager.instance.checkIsConnectionExist(
      selector?.userData?.userId,
      otherUserData?.userId,
      (threadData: any) => {
        threadObj = threadData;
      }
    );
    if (threadObj) {
      onComplete({ status: true, data: threadObj });
    } else {
      let senderObj: any = {
        id: selector?.userData?.userId?.toString(),
        _id: selector?.userData?.userId?.toString(),
        image: selector?.userData?.profileImage,
        username: selector?.userData?.fullName,
      };
      let reciverObj: any = {
        id: otherUserData?.userId,
        _id: otherUserData?.userId,
        image: otherUserData?.profileImage,
        username: otherUserData?.fullName,
      };

      dispatch(setIsLoader(true));
      let msg = "";
      let docId = ThreadManager.instance.makeId(7);
      await ThreadManager.instance.onSendCall(
        senderObj,
        reciverObj,
        docId,
        msg,
        async (data: any) => {
          dispatch(setIsLoader(false));
          if (data != "error") {
            dispatch(setIsLoader(true));
            dispatch(setIsLoader(false));
            onComplete({ status: true, data: data });
          } else {
            alert(JSON.stringify(data));
          }
        }
      );
    }
  };

  return {
    requestAudioPermissions,
    handleGalleryPermissions,
    handleCameraPermissions,
    handleDocPermissions,
    checkChatIsConnected,
  };
};

export default GeneralManager;
