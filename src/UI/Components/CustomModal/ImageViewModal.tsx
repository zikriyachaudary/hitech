import React, { useState, useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  ActivityIndicator,
  BackHandler,
  Modal,
  SafeAreaView,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { AppColors, hv, normalized } from "../../../Utils/AppConstants";
import CustomHeader from "../CustomHeader/CustomHeader";
import { useSelector } from "react-redux";

const ImageViewModal = (props: any) => {
  const selector = useSelector((state: any) => state.SliceReducer);
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

  return (
    <Modal
      animationType={"slide"}
      visible={true}
      transparent={true}
      supportedOrientations={["landscape", "portrait"]}
    >
      <View
        style={{
          ...StyleSheet.absoluteFill,
          backgroundColor: AppColors.white.white,
        }}
      >
        <View
          style={{
            marginTop: selector?.isNotchBar ? hv(20) : hv(10),
            backgroundColor: AppColors.white.white,
          }}
        />
        <SafeAreaView />

        <CustomHeader onPress={() => props?.onClose()} />

        <View style={ImageViewModalStyle.container}>
          {reload ? (
            <View />
          ) : (
            <ImageViewer
              imageUrls={props?.imagesList}
              index={props?.initialIndex}
              loadingRender={() => {
                return (
                  <View style={ImageViewModalStyle.indicatorCont}>
                    <ActivityIndicator
                      size={"large"}
                      color={AppColors.white.white}
                    />
                  </View>
                );
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};
const ImageViewModalStyle = StyleSheet.create({
  mainView: {
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
    backgroundColor: "rgba(0,0,0,0.55)",
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
});
export default ImageViewModal;
