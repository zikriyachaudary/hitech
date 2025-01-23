import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import {
  AppColors,
  AppImages,
  dummyProfile,
  normalized,
  ScreenProps,
} from "../../../../Utils/AppConstants";
import ProfileHeader from "../Components/ProfileHeader";
import CategoryModal from "../Components/CategoryModal";
import ProductItem from "../Components/ProductItem";
import { Routes } from "../../../../Utils/Routes";

const HomeScreen = (props: ScreenProps) => {
  const [isShowCategoryModal, setIsShowCategoryModal] = useState<any>(false);

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
  return (
    <View style={[AppStyles.MainStyle]}>
      <SafeAreaView />

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
                props?.navigation.navigate(Routes.Home.productDetail, { item });
              }}
            />
          );
        }}
      />
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

const styles = StyleSheet.create({});
export default HomeScreen;
