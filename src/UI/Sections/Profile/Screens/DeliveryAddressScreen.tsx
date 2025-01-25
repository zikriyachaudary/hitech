import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import { ScreenProps } from "../../../../Utils/AppConstants";
import AddressItem from "../Components/AddressItem";

const DeliveryAddressScreen = (props: ScreenProps) => {
  const address = [
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
  ];

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <CustomHeader
        onPress={() => props?.navigation?.goBack()}
        title={"Delivery Address"}
      />
      <FlatList
        data={address}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return <AddressItem item={item} />;
        }}
      />
    </View>
  );
};

export default DeliveryAddressScreen;
