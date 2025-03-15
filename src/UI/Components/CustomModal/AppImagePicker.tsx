import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
  Dimensions,
  Linking,
} from "react-native";
import {
  request,
  PERMISSIONS,
  check,
  openSettings,
} from "react-native-permissions";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import {
  AppColors,
  ScreenSize,
  hv,
  imagePickerConstants,
  isSmallDevice,
  normalized,
} from "../../../Utils/AppConstants";
import ImagePicker from "react-native-image-crop-picker";

interface Props {
  onClose: () => void;
  onImageSelect: (uriList: any) => void;
  limit: number;
  mediaType: string;
}

const AppImagePicker = (props: Props) => {
  const width = Dimensions.get("screen").width - 40;

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
          onPress: () =>
            openSettings().catch(() => console.warn("cannot open settings")),
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

  const handleSelectPhotoFromCamera = async () => {
    if (Platform.OS === "android") {
      await handlePermissionCheck(PERMISSIONS.ANDROID.CAMERA, () => {
        if (props?.mediaType == "Profile") {
          ImagePicker.openCamera({
            width: 400,
            height: 400,
            cropping: true,
          }).then((image) => {
            props?.onImageSelect(image.path);
          });
        } else {
          launchCamera(
            {
              mediaType: "photo",
              cameraType: "back",
              quality: 1,
            },
            (response: any) => {
              if (response.didCancel) {
                console.log("User cancelled image picker");
              } else if (response.errorCode) {
                console.log("ImagePicker Error: ", response.errorMessage);
              } else {
                const selectedImage = response.assets[0].uri;
                if (selectedImage) {
                  props?.onImageSelect(selectedImage);
                }
              }
            }
          );
        }
      });
    } else {
      await handlePermissionCheck(PERMISSIONS.IOS.CAMERA, () => {
        if (props?.mediaType == "Profile") {
          ImagePicker.openCamera({
            width: 400,
            height: 400,
            cropping: true,
          }).then((image) => {
            props?.onImageSelect(image.path);
          });
        } else {
          launchCamera(
            {
              mediaType: "photo",
              cameraType: "back",
              quality: 1,
            },
            (response: any) => {
              if (response.didCancel) {
                console.log("User cancelled image picker");
              } else if (response.errorCode) {
                console.log("ImagePicker Error: ", response.errorMessage);
              } else {
                const selectedImage = response.assets[0].uri;
                if (selectedImage) {
                  props?.onImageSelect(selectedImage);
                }
              }
            }
          );
        }
      });
    }
  };

  const handleSelectPhotoFromGallery = async () => {
    if (Platform.OS === "android") {
      if (props?.mediaType == "Profile") {
        ImagePicker.openPicker({
          width: 400,
          height: 400,
          cropping: true,
        }).then((image) => {
          props?.onImageSelect(image?.path);
        });
      } else {
        launchImageLibrary(
          {
            mediaType: "photo",
            selectionLimit: props?.limit || 1,
            quality: 1,
          },
          (response: any) => {
            if (response.didCancel) {
              console.log("User cancelled image picker");
            } else if (response.errorCode) {
              console.log("ImagePicker Error: ", response.errorMessage);
            } else {
              const selectedImages = response.assets.map(
                (asset: any) => asset.uri
              );
              if (selectedImages.length > 0) {
                props?.onImageSelect(selectedImages);
              }
            }
          }
        );
      }
    } else {
      await handlePermissionCheck(PERMISSIONS.IOS.PHOTO_LIBRARY, () => {
        if (props?.mediaType == "Profile") {
          ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping: true,
          }).then((image) => {
            props?.onImageSelect(image?.path);
          });
        } else {
          launchImageLibrary(
            {
              mediaType: "photo",
              selectionLimit: props?.limit || 1,
              quality: 1,
            },
            (response: any) => {
              if (response.didCancel) {
                console.log("User cancelled image picker");
              } else if (response.errorCode) {
                console.log("ImagePicker Error: ", response.errorMessage);
              } else {
                const selectedImages = response.assets.map(
                  (asset: any) => asset.uri
                );
                if (selectedImages.length > 0) {
                  props?.onImageSelect(selectedImages);
                }
              }
            }
          );
        }
      });
    }
  };

  return (
    <Modal transparent animationType="slide" onRequestClose={props.onClose}>
      <View style={styles.outerContainer}>
        <StatusBar
          barStyle={"light-content"}
          backgroundColor={AppColors.black.black}
        />
        <TouchableWithoutFeedback onPress={props?.onClose}>
          <View style={styles.transparentBg} />
        </TouchableWithoutFeedback>
        <View style={styles.mainContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.headingText}>Upload Image</Text>
          </View>
          <View style={styles.pickersContainer}>
            {imagePickerConstants.map((item: any, index: any) => (
              <TouchableOpacity
                onPress={() => {
                  if (index) {
                    handleSelectPhotoFromCamera();
                  } else {
                    handleSelectPhotoFromGallery();
                  }
                }}
                key={index}
                activeOpacity={1}
                style={styles.singlePicker}
              >
                <Image
                  source={item.image}
                  style={styles.pickerImg}
                  resizeMode="contain"
                />
                <Text style={styles.pickerText}>{item.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AppImagePicker;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  transparentBg: {
    backgroundColor: "rgba(0,0,0,0.4)",
    ...StyleSheet.absoluteFillObject,
  },
  mainContainer: {
    height: isSmallDevice ? "35%" : "30%",
    backgroundColor: AppColors.white.white,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: hv(5),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: normalized(40),
  },
  headingText: {
    fontSize: normalized(16),
    color: AppColors.black.black,
  },
  crossView: {
    height: normalized(40),
    width: normalized(40),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    margin: normalized(5),
    position: "absolute",
    right: 0,
  },
  crossImg: {
    height: normalized(14),
    width: normalized(14),
  },
  pickersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    height: ScreenSize.height < 680 ? hv(200) : hv(170),
    marginTop: isSmallDevice ? hv(50) : hv(30),
    alignSelf: "center",
  },
  singlePicker: {
    borderRadius: 15,
    width: "45%",
    height: "65%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: normalized(20),
    borderWidth: 3,
    borderColor: AppColors.grey.greyLevel8,
    borderStyle: "dashed",
  },
  pickerImg: {
    width: normalized(30),
    height: normalized(30),
  },
  pickerText: {
    color: AppColors.black.black,
    fontSize: normalized(12),
    marginTop: hv(10),
    textAlign: "center",
  },
});
