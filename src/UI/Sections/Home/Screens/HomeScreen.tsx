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

  const dummyList = [
    {
      name: "Bike Tyres",
      price: 8000,
      images: [
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
      ],
      productId: "45XG3441",
      description:
        "Conquer rugged trails and steep hills with this durable and lightweight mountain bike. Built with advanced suspension and high-traction tires, it's perfect for off-road adventures and challenging terrains.",
    },
    {
      name: "Bike Tyres",
      price: 8000,
      images: [
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
      ],
      productId: "45XG3440",
      description:
        "Conquer rugged trails and steep hills with this durable and lightweight mountain bike. Built with advanced suspension and high-traction tires, it's perfect for off-road adventures and challenging terrains.",
    },
    {
      name: "Bike Tyres",
      price: 8000,
      images: [
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
      ],
      productId: "45XG3442",
      description:
        "Conquer rugged trails and steep hills with this durable and lightweight mountain bike. Built with advanced suspension and high-traction tires, it's perfect for off-road adventures and challenging terrains.",
    },
    {
      name: "Bike Tyres",
      price: 8000,
      images: [
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
      ],
      productId: "45XG3443",
      description:
        "Conquer rugged trails and steep hills with this durable and lightweight mountain bike. Built with advanced suspension and high-traction tires, it's perfect for off-road adventures and challenging terrains.",
    },
    {
      name: "Bike Tyres",
      price: 8000,
      images: [
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
      ],
      productId: "45XG3444",
      description:
        "Conquer rugged trails and steep hills with this durable and lightweight mountain bike. Built with advanced suspension and high-traction tires, it's perfect for off-road adventures and challenging terrains.",
    },
    {
      name: "Bike Tyres",
      price: 8000,
      images: [
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
      ],
      productId: "45XG3445",
      description:
        "Conquer rugged trails and steep hills with this durable and lightweight mountain bike. Built with advanced suspension and high-traction tires, it's perfect for off-road adventures and challenging terrains.",
    },
    {
      name: "Bike Tyres",
      price: 8000,
      images: [
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
      ],
      productId: "45XG3446",
      description:
        "Conquer rugged trails and steep hills with this durable and lightweight mountain bike. Built with advanced suspension and high-traction tires, it's perfect for off-road adventures and challenging terrains.",
    },
    {
      name: "Bike Tyres",
      price: 8000,
      images: [
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
      ],
      productId: "45XG3447",
      description:
        "Conquer rugged trails and steep hills with this durable and lightweight mountain bike. Built with advanced suspension and high-traction tires, it's perfect for off-road adventures and challenging terrains.",
    },
    {
      name: "Bike Tyres",
      price: 8000,
      images: [
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
        "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/aPdZjzFB883E3B-14F9-4179-8E09-04AF917E667E.jpg?alt=media&token=3db7e6ad-4041-49e2-ac6c-e6fc418be435",
      ],
      productId: "45XG3448",
      description:
        "Conquer rugged trails and steep hills with this durable and lightweight mountain bike. Built with advanced suspension and high-traction tires, it's perfect for off-road adventures and challenging terrains.",
    },
  ];
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
