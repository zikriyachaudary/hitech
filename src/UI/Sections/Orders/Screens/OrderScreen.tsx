import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import AppImageViewer from "../../../Components/AppImageView";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  normalized,
} from "../../../../Utils/AppConstants";

const OrderScreen = () => {
  const orders_list = [
    {
      name: "Bike Tyres",
      status: "Pending",
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
      status: "Pending",
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
      status: "Pending",
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
      status: "Pending",
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
      status: "Pending",
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
      status: "Pending",
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
      status: "Pending",
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
  ];
  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <FlatList
        data={orders_list}
        keyExtractor={(index, item) => `${index}`}
        style={{
          // marginHorizontal: normalized(20),
          marginBottom: normalized(25),
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }: any) => {
          return (
            <View style={styles.cont}>
              <AppImageViewer
                source={{ uri: item?.images[0] }}
                style={styles.image}
              />
              <View style={styles.txtCont}>
                <Text style={styles.title}>{item?.name}</Text>
                <Text style={styles.desc} numberOfLines={2}>
                  {item?.description}
                </Text>
                <View style={styles.bottomCont}>
                  <View style={styles.priceCont}>
                    <Text style={styles.price}>{`Rs. ${item?.price}`}</Text>
                  </View>
                  <View
                    style={{
                      ...styles.statusCont,
                      backgroundColor: AppColors.green.light,
                      borderColor: AppColors.green.dark,
                      borderWidth: 1,
                    }}
                  >
                    <View
                      style={{
                        ...styles.dot,
                        backgroundColor: AppColors.green.dark,
                      }}
                    />
                    <Text
                      style={{
                        ...styles.status,
                        color: AppColors.green.dark,
                      }}
                    >
                      Completed
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  image: {
    width: normalized(75),
    height: normalized(75),
    borderRadius: normalized(10),
  },
  cont: {
    flexDirection: "row",
    alignItems: "center",
    height: normalized(100),
    paddingHorizontal: normalized(10),
    borderRadius: normalized(10),
    marginTop: normalized(20),
    gap: normalized(10),
    shadowColor: AppColors.black.black,
    shadowOpacity: 0.3,
    elevation: 3,
    backgroundColor: AppColors.white.white,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    marginHorizontal: AppHorizontalMargin,
  },
  title: {
    fontSize: normalized(16),
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsSemiBold,
  },
  txtCont: {
    // marginBottom: normalized(10),
  },
  desc: {
    color: AppColors.grey.greyLevel5,
    fontSize: normalized(13),
    fontFamily: AppFonts.PoppinsRegular,
    width: normalized(220),
    textAlign: "justify",
  },
  price: {
    fontSize: normalized(14),
    fontFamily: AppFonts.PoppinsMedium,
    color: AppColors.black.black,
  },
  priceCont: {
    width: normalized(100),
    borderWidth: 1,
    borderColor: AppColors.themeColor.dark,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: normalized(5),
    marginTop: normalized(6),
    backgroundColor: AppColors.themeColor.medium,
  },
  statusCont: {
    width: normalized(100),
    height: normalized(22),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: normalized(5),
    borderRadius: normalized(4),
    marginTop: normalized(5),
  },
  dot: {
    width: normalized(5),
    height: normalized(5),
    borderRadius: normalized(5),
  },
  status: {
    fontSize: normalized(10),
    fontFamily: AppFonts.PoppinsSemiBold,
  },
  bottomCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
