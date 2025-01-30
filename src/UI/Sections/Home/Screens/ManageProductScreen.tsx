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

const ManageProductScreen = (props: ScreenProps) => {
  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
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
      <Text>ManageProductScreen</Text>
    </View>
  );
};

export default ManageProductScreen;

const styles = StyleSheet.create({});
