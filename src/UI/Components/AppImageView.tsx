import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import FastImage from "react-native-fast-image";
import { AppColors } from "../../Utils/AppConstants";
const AppImageViewer = (props: any) => {
  const [loading, setLoading] = useState(false);
  const [src, setSource] = useState(props.source);
  useEffect(() => {
    setSource(props.source);
  }, [props?.source]);

  return (
    <View
      style={{
        ...props.style,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        // borderWidth: 1,
        // borderColor: AppColors.themeColor.dark,
      }}
    >
      <FastImage
        resizeMode={props?.resizeMode ? props?.resizeMode : "cover"}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          if (props?.placeHolder) {
            setSource(props.placeHolder);
          }
        }}
        source={src}
        style={{
          ...props.style,
          borderWidth: 0,
        }}
      />

      {loading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator
            size={props?.indicatorSize ? props?.indicatorSize : "small"}
            color={AppColors.themeColor.dark}
          />
        </View>
      )}
    </View>
  );
};
export default AppImageViewer;
