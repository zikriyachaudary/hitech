import {
  Image,
  LayoutAnimation,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  AppImages,
  Categories,
  normalized,
  ScreenProps,
  ScreenSize,
} from "../../../../Utils/AppConstants";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";

const ManageCategories = (props: ScreenProps) => {
  const [category, setCategory] = useState<any>(null);
  const [subCategory, setSubCategory] = useState<any>(null);

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: normalized(10),
          marginVertical: normalized(10),
          marginBottom: normalized(20),
        }}
      >
        <CustomHeader
          onPress={() => props?.navigation?.goBack()}
          title={"Categories"}
          titleStyle={styles.heading}
        />
        {/* <Text style={styles.heading}>Categories</Text> */}
        <View style={styles.itemCont}>
          {Categories.map((item) => {
            return (
              <TouchableOpacity
                style={{
                  ...styles.item,
                  backgroundColor:
                    category?.id == item?.id
                      ? AppColors.themeColor.dark
                      : AppColors.white.white,
                }}
                activeOpacity={0.7}
                onPress={() => {
                  if (item?.id == category?.id) {
                    LayoutAnimation.configureNext({
                      ...LayoutAnimation.Presets.linear,
                      duration: 200,
                    });
                    setCategory(null);
                  } else {
                    LayoutAnimation.configureNext({
                      ...LayoutAnimation.Presets.linear,
                      duration: 200,
                    });
                    setCategory(item);
                  }
                  setSubCategory(null);
                }}
              >
                <Text
                  style={{
                    ...styles.itemTxt,
                    color:
                      category?.id == item?.id
                        ? AppColors.white.white
                        : AppColors.black.black,
                  }}
                >
                  {item?.category}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    ...styles.imgCont,
                    backgroundColor:
                      category?.id == item?.id
                        ? AppColors.white.white
                        : AppColors.themeColor.dark,
                  }}
                  onPress={() => {}}
                >
                  <Image
                    style={{
                      ...styles.img,
                      tintColor:
                        category?.id == item?.id
                          ? AppColors.themeColor.dark
                          : AppColors.white.white,
                    }}
                    source={AppImages.Products.editIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    ...styles.imgCont,
                    backgroundColor:
                      category?.id == item?.id
                        ? AppColors.white.white
                        : AppColors.themeColor.dark,
                  }}
                  onPress={() => {}}
                >
                  <Image
                    style={{
                      ...styles.img,
                      tintColor:
                        category?.id == item?.id
                          ? AppColors.themeColor.dark
                          : AppColors.white.white,
                    }}
                    source={AppImages.Home.close}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>
        {category?.id && (
          <Text
            style={{
              ...styles.heading,
              marginVertical: normalized(10),
            }}
          >
            Sub-Categoires
          </Text>
        )}

        <View style={styles.itemCont}>
          {category?.id &&
            category?.subcategories.map((item: any) => {
              return (
                <TouchableOpacity
                  style={{
                    ...styles.item,
                    backgroundColor:
                      subCategory?.id == item?.id
                        ? AppColors.themeColor.dark
                        : AppColors.white.white,
                  }}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (item?.id == subCategory?.id) {
                      LayoutAnimation.configureNext({
                        ...LayoutAnimation.Presets.linear,
                        duration: 200,
                      });
                      setSubCategory(null);
                    } else {
                      LayoutAnimation.configureNext({
                        ...LayoutAnimation.Presets.linear,
                        duration: 200,
                      });
                      setSubCategory(item);
                    }
                  }}
                >
                  <Text
                    style={{
                      ...styles.itemTxt,
                      color:
                        subCategory?.id == item?.id
                          ? AppColors.white.white
                          : AppColors.black.black,
                    }}
                  >
                    {item?.name}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                      ...styles.imgCont,
                      backgroundColor:
                        subCategory?.id == item?.id
                          ? AppColors.white.white
                          : AppColors.themeColor.dark,
                    }}
                    onPress={() => {}}
                  >
                    <Image
                      style={{
                        ...styles.img,
                        tintColor:
                          subCategory?.id == item?.id
                            ? AppColors.themeColor.dark
                            : AppColors.white.white,
                      }}
                      source={AppImages.Products.editIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                      ...styles.imgCont,
                      backgroundColor:
                        subCategory?.id == item?.id
                          ? AppColors.white.white
                          : AppColors.themeColor.dark,
                    }}
                    onPress={() => {}}
                  >
                    <Image
                      style={{
                        ...styles.img,
                        tintColor:
                          subCategory?.id == item?.id
                            ? AppColors.themeColor.dark
                            : AppColors.white.white,
                      }}
                      source={AppImages.Home.close}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
};

export default ManageCategories;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    borderWidth: 1.5,
    borderColor: AppColors.themeColor.dark,
    paddingHorizontal: normalized(5),
    paddingVertical: normalized(5),
    margin: normalized(5),
    borderRadius: normalized(10),
    gap: normalized(10),
    alignItems: "center",
  },
  itemCont: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  itemTxt: {
    fontSize: normalized(14),
    fontFamily: AppFonts.PoppinsMedium,
  },
  heading: {
    fontSize: normalized(18),
    fontFamily: AppFonts.PoppinsSemiBold,
    alignSelf: "center",
  },
  img: {
    width: normalized(15),
    height: normalized(15),
    resizeMode: "contain",
  },
  imgCont: {
    width: normalized(27),
    height: normalized(27),
    borderWidth: 1,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    borderColor: AppColors.themeColor.dark,
  },
});
