import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const SLIDER_WIDTH = Dimensions.get("window").width;
import Carousel, { Pagination } from "react-native-snap-carousel";
import {
  AppColors,
  AppHorizontalMargin,
  ScreenSize,
  normalized,
} from "../../../../Utils/AppConstants";
import AppImageViewer from "../../../Components/AppImageView";

const ProductSliderComp = (props: any) => {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const imageCrouselRef = useRef<any>();

  return (
    <>
      <View style={styles.innerCont} />

      {props?.productImagesList?.length > 0 ? (
        <View>
          <Carousel
            ref={imageCrouselRef}
            data={props?.productImagesList}
            renderItem={(item: any, i: number) => {
              let image = item.item;
              return (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    console.log("something happended -----");
                  }}
                >
                  <AppImageViewer
                    source={{ uri: image?.url }}
                    style={styles.productPic}
                    resizeMode={"cover"}
                    // resizeMode={"contain"}
                  />
                </TouchableOpacity>
              );
            }}
            sliderWidth={SLIDER_WIDTH}
            firstItem={activeImgIndex}
            itemWidth={SLIDER_WIDTH}
            onSnapToItem={(index: number) => setActiveImgIndex(index)}
          />
          <Pagination
            dotsLength={props?.productImagesList.length}
            activeDotIndex={activeImgIndex}
            containerStyle={{
              paddingTop: normalized(10),
            }}
            dotColor={AppColors.themeColor.dark}
            dotStyle={styles.dotStyle}
            activeDotScale={0.8}
            inactiveDotColor={AppColors.grey.greyLevel3}
            inactiveDotOpacity={1}
            inactiveDotScale={0.5}
            carouselRef={imageCrouselRef}
            tappableDots={!!imageCrouselRef}
          />
        </View>
      ) : (
        <View style={styles.noImgAttCont}>
          <Text
            style={{
              fontSize: normalized(14),
              color: AppColors.grey.greyLevel8,
            }}
          >
            Not Product Image Attached
          </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  productPic: {
    resizeMode: "contain",
    height: ScreenSize.width - normalized(20),
    width: ScreenSize.width - normalized(20),
    alignSelf: "center",
    borderRadius: normalized(10),
    marginTop: normalized(5),
    overflow: "hidden",
  },
  childProductPic: {
    resizeMode: "contain",
    height: normalized(65),
    width: normalized(75),
    borderRadius: normalized(10),
    alignSelf: "center",
  },
  innerCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "90%",
    height: 100,
    position: "absolute",
    marginHorizontal: AppHorizontalMargin,
    zIndex: 1000,
  },
  dotStyle: {
    width: normalized(10),
    height: normalized(10),
    borderRadius: normalized(10 / 2),
    marginHorizontal: normalized(-5),
    marginBottom: normalized(-8),
  },
  noImgAttCont: {
    borderColor: AppColors.grey.greyLevel1,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    resizeMode: "contain",
    height: normalized(250),
    width: ScreenSize.width,
    marginVertical: normalized(30),
    borderRadius: normalized(20),
    alignSelf: "center",
  },
  backBtnCont: {
    backgroundColor: AppColors.themeColor.dark,
    height: normalized(47),
    width: normalized(47),
    borderRadius: normalized(47 / 2),
    justifyContent: "center",
    alignItems: "center",
  },
  loaderCont: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
  },
  countTxt: {
    fontSize: normalized(14),
    fontWeight: "400",
    color: AppColors.red.dark,
  },
  countBg: {
    borderRadius: normalized(25 / 2),
    height: normalized(20),
    width: normalized(20),
    backgroundColor: AppColors.white.white,
    position: "absolute",
    top: -3,
    right: -3,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default ProductSliderComp;
