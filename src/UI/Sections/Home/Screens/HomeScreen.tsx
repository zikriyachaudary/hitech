import {
  FlatList,
  Image,
  SafeAreaView,
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
  AppImages,
  dummyList,
  dummyProfile,
  normalized,
  ScreenProps,
} from "../../../../Utils/AppConstants";
import ProfileHeader from "../Components/ProfileHeader";
import CategoryModal from "../Components/CategoryModal";
import ProductItem from "../Components/ProductItem";
import { Routes } from "../../../../Utils/Routes";
import { useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";

const HomeScreen = (props: ScreenProps) => {
  const [isShowCategoryModal, setIsShowCategoryModal] = useState<any>(false);
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );

  const adminBarItems = [
    {
      icon: AppImages.Products.category,
      title: "Manage Categories & Sub-Categories",
      id: 1,
    },
    {
      icon: AppImages.Products.addProduct,
      title: "Add New Products",
      id: 2,
    },
    {
      icon: AppImages.Products.updateProduct,
      title: "Update & Delete Existing Products",
      id: 3,
    },
  ];
  return (
    <View style={[AppStyles.MainStyle]}>
      <SafeAreaView />

      {selector?.userData?.isAdmin ? (
        <FlatList
          data={adminBarItems}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            paddingHorizontal: normalized(15),
          }}
          ListFooterComponent={<View style={{ height: normalized(30) }} />}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.cont}
                onPress={() => {
                  if (item?.id == 1) {
                    props?.navigation?.navigate(Routes.Admin.ManageCategories);
                  } else if (item?.id == 2) {
                    props?.navigation?.navigate(Routes.Admin.AddProducts);
                  } else if (item?.id == 3) {
                    props?.navigation?.navigate(Routes.Admin.ManagePrducts);
                  }
                }}
              >
                <Image source={item?.icon} style={styles.adminIcon} />
                <Text style={styles.txt}>{item?.title}</Text>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <>
          <ProfileHeader
            profileImage={dummyProfile}
            title={"Zikriya Chaudary"}
            rightIcon={AppImages.Home.filter}
            onRightIconPress={() => {
              setIsShowCategoryModal(true);
            }}
          />
          <FlatList
            data={dummyList}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
              paddingHorizontal: normalized(15),
            }}
            ListFooterComponent={<View style={{ height: normalized(30) }} />}
            renderItem={({ item }) => {
              return (
                <ProductItem
                  item={item}
                  onItemPress={(item: any) => {
                    props?.navigation.navigate(Routes.Home.productDetail, {
                      item,
                    });
                  }}
                />
              );
            }}
          />
        </>
      )}
      {isShowCategoryModal && (
        <CategoryModal
          onClose={() => {
            setIsShowCategoryModal(false);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  adminIcon: {
    width: normalized(40),
    height: normalized(40),
    resizeMode: "contain",
    tintColor: AppColors.themeColor.dark,
  },
  cont: {
    height: normalized(100),
    borderRadius: normalized(10),
    marginTop: normalized(10),
    alignItems: "center",
    flexDirection: "row",
    padding: normalized(10),
    borderColor: AppColors.themeColor.dark,
    borderWidth: 2,
  },
  txt: {
    fontSize: normalized(16),
    color: AppColors.themeColor.dark,
    fontFamily: AppFonts.PoppinsSemiBold,
    marginLeft: normalized(10),
    textAlign: "justify",
    width: normalized(270),
  },
});
export default HomeScreen;
