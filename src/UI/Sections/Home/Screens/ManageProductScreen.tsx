import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import {
  dummyList,
  normalized,
  ScreenProps,
} from "../../../../Utils/AppConstants";
import ProductItem from "../Components/ProductItem";
import { Routes } from "../../../../Utils/Routes";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import { fetchAllProducts } from "../../../../Network/Services/ProductServices";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsLoader,
  setShowToast,
} from "../../../../Redux/Reducers/AppReducers";
import { AppStrings } from "../../../../Utils/AppStrings";
import { useIsFocused } from "@react-navigation/native";
import { AppRootStore } from "../../../../Redux/store/AppStore";

const ManageProductScreen = (props: ScreenProps) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;

  const [productsList, setProductsList] = useState([]);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const fetchProductsReq = async () => {
    try {
      productsList?.length == 0 && dispatch(setIsLoader(true));
      await fetchAllProducts((resp: any) => {
        if (resp?.status) {
          setProductsList(resp?.data);
        } else {
          dispatch(
            setShowToast({
              type: AppStrings.ToastType.error,
              message:
                "Error While Getting Products, Check your Internet Connection",
            })
          );
        }
        dispatch(setIsLoader(false));
      });
    } catch (error) {
      console.log("error whille fetching products --->>>  ", error);
    }
  };

  useEffect(() => {
    fetchProductsReq();
  }, [isFocused]);
  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <CustomHeader
        title={isRtl ? "تمام مصنوعات" : "All Products"}
        onPress={() => props?.navigation?.goBack()}
      />
      <FlatList
        data={productsList}
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
