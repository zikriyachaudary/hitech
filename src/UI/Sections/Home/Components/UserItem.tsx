import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import AppImageViewer from "../../../Components/AppImageView";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  AppImages,
  normalized,
} from "../../../../Utils/AppConstants";

const UserItem = (props: any) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;
  const item = props?.item;

  const [totalPrice, setTotalPrice] = useState("0");

  const calculateTotalPrice = (user: any) => {
    if (!user?.orders || !Array.isArray(user.orders)) {
      return 0;
    }

    const price = user.orders.reduce((total: any, order: any) => {
      return total + parseFloat(order.orderPrice);
    }, 0);
    setTotalPrice(price);
  };

  useEffect(() => {
    calculateTotalPrice(item);
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => props?.onPress(item)}
      style={{
        ...styles.itemCont,
        flexDirection: isRtl ? "row-reverse" : "row",
      }}
    >
      <AppImageViewer
        source={{ uri: item?.profileImage }}
        style={styles.profileImg}
      />
      <View>
        <Text style={styles.nameTxt}>{item?.fullName}</Text>
        <Text
          style={styles.nameTxt}
        >{`Total Purchase Amount : ${totalPrice}`}</Text>
        <Text
          style={styles.nameTxt}
        >{`Total Orders : ${item?.orders?.length}`}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserItem;

const styles = StyleSheet.create({
  itemCont: {
    marginTop: normalized(10),
    marginHorizontal: AppHorizontalMargin,
    gap: normalized(10),
    alignItems: "center",
    paddingVertical: normalized(10),
  },
  profileImg: {
    width: normalized(60),
    height: normalized(60),
    borderRadius: normalized(10),
  },
  nameTxt: {
    fontSize: normalized(14),
    fontFamily: AppFonts.PoppinsMedium,
    color: AppColors.black.black,
  },
});
