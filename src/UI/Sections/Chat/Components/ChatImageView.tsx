import React, { useState, useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { AppColors } from "../../../../Utils/AppConstants";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";

const ImageViewModal = (props: any) => {
  const [reload, setReload] = useState(false);

  useEffect(() => {
    Dimensions.addEventListener("change", ({ window: { width, height } }) => {
      setReload(true);
      setTimeout(() => {
        setReload(false);
      }, 500);
    });
  }, []);
  return (
    <View
      style={{
        ...StyleSheet.absoluteFill,
        backgroundColor: AppColors.white.white,
      }}
    >
      <SafeAreaView />
      <CustomHeader
        onPress={() => {
          props?.onClose();
        }}
        title={"Photos"}
      />
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
                    color={AppColors.themeColor.dark}
                  />
                </View>
              );
            }}
          />
        )}
      </View>
    </View>
  );
};

const ImageViewModalStyle = StyleSheet.create({
  mainView: {
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
    backgroundColor: "rgba(0,0,0,0.5)",
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
