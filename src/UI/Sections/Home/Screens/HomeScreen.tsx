import {
  FlatList,
  Image,
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
  normalized,
  ScreenProps,
} from "../../../../Utils/AppConstants";
import ProfileHeader from "../Components/ProfileHeader";
import CategoryModal from "../Components/CategoryModal";
import ProductItem from "../Components/ProductItem";
import { Routes } from "../../../../Utils/Routes";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import { useIsFocused } from "@react-navigation/native";
import { fetchAllProducts } from "../../../../Network/Services/ProductServices";
import {
  setIsLoader,
  setShowToast,
} from "../../../../Redux/Reducers/AppReducers";
import { AppStrings } from "../../../../Utils/AppStrings";
import CategorySelectionModal from "../../../Components/CustomModal/CategorySelectionModal";

const HomeScreen = (props: ScreenProps) => {
  const [isShowCategoryModal, setIsShowCategoryModal] = useState<any>(false);
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;
  const [productsList, setProductsList] = useState([]);
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>([]);
  const [categoryModal, setCategoryModal] = useState(false);
  const [filterProductList, setFilterProductList] = useState([]);

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
          ListFooterComponent={<View style={{ height: normalized(30) }} />}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  ...styles.cont,
                  flexDirection: isRtl ? "row-reverse" : "row",
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
                <Text
                  style={{ ...styles.txt, textAlign: isRtl ? "right" : "left" }}
                >
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
            title={"Zikriya Chaudary"}
            rightIcon={AppImages.Home.filter}
            onRightIconPress={() => {
              setCategoryModal(true);
            }}
          />
          <FlatList
            data={
              selectedCategory?.category?.length > 0
                ? filterProductList
                : productsList
            }
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
                    props?.navigation.navigate(Routes.Home.productDetail, {
                      item,
                    });
                  }}
                />
              );
            }}
          />
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
    height: normalized(100),
    borderRadius: normalized(10),
    marginTop: normalized(10),
    alignItems: "center",
    padding: normalized(10),
    borderColor: AppColors.themeColor.dark,
    borderWidth: 2,
  },
  txt: {
    fontSize: normalized(16),
    color: AppColors.themeColor.dark,
    fontFamily: AppFonts.PoppinsSemiBold,
    marginLeft: normalized(10),
    width: normalized(270),
  },
});
export default HomeScreen;
