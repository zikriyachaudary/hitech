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
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import { normalized, ScreenProps } from "../../../../Utils/AppConstants";
import AddressItem from "../Components/AddressItem";
import { Routes } from "../../../../Utils/Routes";

const DeliveryAddressScreen = (props: ScreenProps) => {
  const [addressList, setAddressList] = useState([
    {
      general: "House 00 Stree 00 Mohallah Lahore Pakistan",
      street: "00",
      house: "00",
      Area: "Some Area here",
      City: "Lahore",
      isDefault: true,
    },
    {
      general: "House 01 Stree 01 Mohallah Mian Chunnu Pakistan",
      street: "01",
      house: "01",
      Area: "Some Area here",
      City: "Lahore",
      isDefault: false,
    },
    {
      general: "House 01 Stree 01 Mohallah Mian Chunnu Pakistan",
      street: "01",
      house: "01",
      Area: "Some Area here",
      City: "Lahore",
      isDefault: false,
    },
  ]);
  const changeDefaultAddress = (index: number) => {
    const updatedList = addressList.map((item: any, i: any) => ({
      ...item,
      isDefault: i === index,
    }));
    setAddressList(updatedList);
  };

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <CustomHeader
        onPress={() => props?.navigation?.goBack()}
        title={"Delivery Address"}
      />
      <FlatList
        data={addressList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: normalized(40) }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <AddressItem
              item={item}
              changeDefaultAddress={() => {
                changeDefaultAddress(index);
              }}
              onEdit={(item: any) => {
                props?.navigation?.navigate(Routes.Home.UpdateDelivery, {
                  item: item,
                });
              }}
            />
          );
        }}
      />
    </View>
  );
};

export default DeliveryAddressScreen;
