import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import {
  dummyList,
  normalized,
  ScreenProps,
} from "../../../../Utils/AppConstants";
import ProductItem from "../Components/ProductItem";
import { Routes } from "../../../../Utils/Routes";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";

const ManageProductScreen = (props: ScreenProps) => {
  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <CustomHeader
        title={"All Products"}
        onPress={() => props?.navigation?.goBack()}
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
                props?.navigation.navigate(Routes.Admin.AddProducts, {
                  item,
                });
              }}
            />
          );
        }}
      />
    </View>
  );
};

export default ManageProductScreen;

const styles = StyleSheet.create({});
