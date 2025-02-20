import React, { useState, useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  ActivityIndicator,
  BackHandler,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import {
  AppColors,
  AppImages,
  hv,
  normalized,
  ScreenSize,
} from "../../../Utils/AppConstants";
import { useSelector } from "react-redux";
import { AppRootStore } from "../../../Redux/store/AppStore";

const ImageViewModal = (props: any) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const [reload, setReload] = useState(false);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        props?.onClose();
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    Dimensions.addEventListener("change", ({ window: { width, height } }) => {
      setReload(true);
      setTimeout(() => {
        setReload(false);
      }, 500);
    });
  }, []);

  // Convert image list to the required format
  const imagesList = props.imagesList.map((image: any) => ({
    url: image?.url ?? image,
    // height: ScreenSize.height,
    width: ScreenSize.width,
  }));

  return (
    <Modal
      animationType={"fade"}
      visible={true}
      transparent={true}
      supportedOrientations={["landscape", "portrait"]}
    >
      <StatusBar
        backgroundColor={AppColors.black.black}
        barStyle={"light-content"}
        animated={true}
      />
      <SafeAreaView />
      <View style={styles.container}>
        {reload ? (
          <View />
        ) : (
          <ImageViewer
            style={{
              width: ScreenSize.width,
              // height: ScreenSize.height,
            }}
            renderHeader={() => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    props?.onClose();
                  }}
                  style={{
                    backgroundColor: AppColors.themeColor.dark,
                    height: normalized(40),
                    width: normalized(40),
                    borderRadius: normalized(40 / 2),
                    position: "absolute",
                    marginTop: normalized(5),
                    left: normalized(15),
                    zIndex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={AppImages.Home.close}
                    style={{ height: normalized(20), width: normalized(20) }}
                    tintColor={AppColors.white.white}
                  />
                </TouchableOpacity>
              );
            }}
            imageUrls={imagesList}
            saveToLocalByLongPress={false}
            index={props?.initialIndex}
            loadingRender={() => {
              return (
                <View style={styles.indicatorCont}>
                  <ActivityIndicator
                    size={"large"}
                    color={AppColors.themeColor.dark}
                  />
                </View>
              );
            }}
          />
        )}
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  mainView: {
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
    backgroundColor: AppColors.black.Level9,
  },
  backButton: {
    marginLeft: 20,
    height: 20,
    width: 20,
    marginBottom: 10,
    resizeMode: "contain",
    tintColor: "white",
    alignItems: "center",
  },
  indicatorCont: {
    height: ScreenSize.height,
    width: ScreenSize.width,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    height: ScreenSize.height,
    width: ScreenSize.width,
  },
});
export default ImageViewModal;
