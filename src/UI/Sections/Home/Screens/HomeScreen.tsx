import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import {
  adminHomeBarItems,
  AppColors,
  AppFonts,
  AppImages,
  dummyList,
  dummyProfile,
  hv,
  normalized,
  ScreenProps,
} from "../../../../Utils/AppConstants";
import ProfileHeader from "../Components/ProfileHeader";
import ProductItem from "../Components/ProductItem";
import { Routes } from "../../../../Utils/Routes";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import { useIsFocused } from "@react-navigation/native";
import { fetchAllProducts } from "../../../../Network/Services/ProductServices";
import {
  setIsLoader,
  setProductList,
  setShowToast,
} from "../../../../Redux/Reducers/AppReducers";
import { AppStrings, USER_TYPE } from "../../../../Utils/AppStrings";
import CategorySelectionModal from "../../../Components/CustomModal/CategorySelectionModal";

const HomeScreen = (props: ScreenProps) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;
  const [productsList, setProductsList] = useState(selector?.productsList);
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>([]);
  const [categoryModal, setCategoryModal] = useState(false);
  const [filterProductList, setFilterProductList] = useState([]);
  const [search, setSearch] = useState("");

  const isFocused = useIsFocused();

  const fetchProductsReq = async () => {
    try {
      !selector?.productsList[0] &&
        selector?.userData?.userType == USER_TYPE.Silver &&
        dispatch(setIsLoader(true));
      await fetchAllProducts((resp: any) => {
        if (resp?.status) {
          setProductsList(resp?.data);
          dispatch(setProductList(resp?.data));
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

  const filterProduct = (category: any, subCategory: any) => {
    const updatedFilterList = productsList.filter((item: any) => {
      if (subCategory?.length > 0) {
        return subCategory.includes(item?.subCat?.name);
      } else if (category) {
        return item?.category?.category.includes(category);
      }
      return false;
    });
    setFilterProductList(updatedFilterList);
  };

  const searchProduct = (value: any) => {
    if (!value) {
      return;
    }

    const lowerValue = value.toLowerCase();

    if (productsList?.length == 0) return;

    const filtered = productsList.filter((product: any) => {
      if (isRtl) {
        return (
          product.rtlName?.toLowerCase().includes(lowerValue) ||
          product.rtlCategory?.category?.toLowerCase().includes(lowerValue) ||
          product.rtlSubCat?.name?.toLowerCase().includes(lowerValue)
        );
      } else {
        return (
          product.name?.toLowerCase().includes(lowerValue) ||
          product.category?.category?.toLowerCase().includes(lowerValue) ||
          product.subCat?.name?.toLowerCase().includes(lowerValue)
        );
      }
    });
    console.log("filter ----  ", filtered);

    setFilterProductList(filtered);
  };

  return (
    <View style={[AppStyles.MainStyle]}>
      <SafeAreaView />

      {selector?.userData?.isAdmin ? (
        <FlatList
          data={adminHomeBarItems}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            paddingHorizontal: normalized(15),
          }}
          numColumns={2}
          columnWrapperStyle={{
            gap: normalized(10),
            flex: 1,
            justifyContent: "center",
          }}
          ListFooterComponent={<View style={{ height: normalized(30) }} />}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  ...styles.cont,
                }}
                onPress={() => {
                  if (item?.id == 1) {
                    props?.navigation?.navigate(Routes.Admin.ManageCategories);
                  } else if (item?.id == 2) {
                    props?.navigation?.navigate(Routes.Admin.AddProducts);
                  } else if (item?.id == 3) {
                    props?.navigation?.navigate(Routes.Admin.ManagePrducts);
                  } else if (item?.id == 4) {
                    props?.navigation?.navigate(Routes.Admin.AddAdmins);
                  } else if (item?.id == 5) {
                    props?.navigation?.navigate(Routes.Admin.AddCategory);
                  } else if (item?.id == 6) {
                    props?.navigation?.navigate(Routes.Admin.GoldNSilverScreen);
                  }
                }}
              >
                <Image
                  source={item?.icon}
                  style={{
                    ...styles.adminIcon,
                    marginLeft: isRtl ? normalized(10) : 0,
                  }}
                />
                <Text style={{ ...styles.txt }} numberOfLines={3}>
                  {isRtl ? item?.rtlTitle : item?.title}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <>
          <ProfileHeader
            profileImage={dummyProfile}
            title={selector?.userData?.fullName}
            rightIcon={AppImages.Home.filter}
            onRightIconPress={() => {
              setCategoryModal(true);
            }}
            search={search}
            atSearch={(e: any) => {
              setSearch(e);
              searchProduct(e);
            }}
          />
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "undefined"}
            keyboardVerticalOffset={Platform.OS === "ios" ? hv(10) : 0}
          >
            <FlatList
              data={
                selectedCategory?.category?.length > 0 || search?.length > 0
                  ? filterProductList
                  : productsList
              }
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{
                paddingHorizontal: normalized(15),
              }}
              numColumns={2}
              columnWrapperStyle={{
                gap: normalized(10),
                flex: 1,
              }}
              ListFooterComponent={<View style={{ height: normalized(50) }} />}
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
          </KeyboardAvoidingView>
        </>
      )}
      {categoryModal && (
        <CategorySelectionModal
          selectedCategory={selectedCategory}
          selectedSubCategory={selectedSubCategory}
          atApply={async (categoy: any, subCategory: any) => {
            setCategoryModal(false);
            setSelectedCategory(categoy);
            setSelectedSubCategory(subCategory);
            filterProduct(categoy?.category, subCategory);
          }}
          atClear={() => {
            setSelectedCategory(null);
            setSelectedSubCategory([]);
            setFilterProductList([]);
            setCategoryModal(false);
          }}
          onClose={() => {
            setCategoryModal(false);
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
    borderRadius: normalized(10),
    marginTop: normalized(10),
    alignItems: "center",
    padding: normalized(10),
    borderColor: AppColors.themeColor.dark,
    borderWidth: 0.5,
    justifyContent: "center",
    flex: 1,
  },
  txt: {
    fontSize: normalized(14),
    color: AppColors.themeColor.dark,
    fontFamily: AppFonts.PoppinsMedium,
    textAlign: "center",
    marginTop: normalized(5),
  },
});
export default HomeScreen;
