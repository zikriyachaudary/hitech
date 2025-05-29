import {
  FlatList,
  LayoutAnimation,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import {
  AppColors,
  AppImages,
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
import CustomInput from "../../../Components/CustomInput/CustomInput";

const ManageProductScreen = (props: ScreenProps) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;

  const [productsList, setProductsList] = useState([]);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [searchTxt, setSearchTxt] = useState("");
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

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

  function searchProducts(searchTerm: String) {
    searchTerm = searchTerm.toLowerCase();
    return productsList.filter(function (item: any) {
      return (
        item?.name.toLowerCase().includes(searchTerm) ||
        item?.category?.category.toLowerCase().includes(searchTerm) ||
        item?.subCat?.name.toLowerCase().includes(searchTerm) ||
        item?.rtlCategory?.category.toLowerCase().includes(searchTerm) ||
        item?.rtlSubCat?.name.toLowerCase().includes(searchTerm) ||
        item?.rtlName.toLowerCase().includes(searchTerm)
      );
    });
  }

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <CustomHeader
        title={isRtl ? "تمام مصنوعات" : "All Products"}
        onPress={() => props?.navigation?.goBack()}
        icon={[AppImages.Home.search]}
        rightIconCont={{
          width: normalized(33),
          height: normalized(33),
          borderRadius: normalized(40),
          alignItems: "center",
          justifyContent: "center",
        }}
        rightIconStyle={{
          width: normalized(30),
          height: normalized(30),
          tintColor: AppColors.themeColor.dark,
        }}
        onRightIconPress={() => {
          setIsShowSearch(!isShowSearch);
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setSearchTxt("");
        }}
      />
      {isShowSearch && (
        <CustomInput
          leftIcon={AppImages.Home.search}
          placeHold={isRtl ? "پروڈکت ڈھونڈیں" : "Search Product"}
          container={styles.inputContainer}
          textInputStyle={styles.inputStyle}
          leftIconStyle={styles.leftIcon}
          value={searchTxt}
          setValue={(txt: any) => {
            setSearchTxt(txt);
            if (txt?.length > 0) {
              let filteredList = searchProducts(txt);
              setFilteredProducts(filteredList);
            }
          }}
        />
      )}
      <FlatList
        data={searchTxt?.length > 0 ? filteredProducts : productsList}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          paddingHorizontal: normalized(15),
        }}
        columnWrapperStyle={{ gap: normalized(10) }}
        numColumns={2}
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

const styles = StyleSheet.create({
  inputContainer: {
    width: "90%",
    flexDirection: "row",
    alignSelf: "center",
    borderRadius: normalized(7),
    height: normalized(43),
    alignItems: "center",
    paddingLeft: normalized(5),
    marginVertical: normalized(10),
  },
  inputStyle: {
    paddingLeft: normalized(10),
    fontSize: normalized(13),
    color: AppColors.black.black,
    fontWeight: "400",
  },
  leftIcon: {
    width: normalized(14),
    height: normalized(14),
  },
});
