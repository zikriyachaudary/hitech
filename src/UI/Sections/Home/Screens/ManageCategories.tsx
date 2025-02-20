import {
  FlatList,
  Image,
  LayoutAnimation,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  AppImages,
  Categories,
  normalized,
  ScreenProps,
  ScreenSize,
} from "../../../../Utils/AppConstants";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import { Routes } from "../../../../Utils/Routes";
import { fetchCatListReq } from "../../../../Network/Services/GeneralServices";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsLoader,
  setShowToast,
} from "../../../../Redux/Reducers/AppReducers";
import { AppStrings } from "../../../../Utils/AppStrings";
import { useIsFocused } from "@react-navigation/native";
import { AppRootStore } from "../../../../Redux/store/AppStore";

const ManageCategories = (props: ScreenProps) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const [categoryList, setCategoryList] = useState<any>([]);
  const [subCategory, setSubCategory] = useState<any>(null);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const isRtl = selector?.isRtl;

  useEffect(() => {
    fetchCat();
  }, [isFocused]);

  const fetchCat = async () => {
    try {
      if (categoryList?.length == 0) dispatch(setIsLoader(true));
      fetchCatListReq((resp: any) => {
        if (resp?.status) {
          setCategoryList(resp?.data);
        } else {
          dispatch(
            setShowToast({
              type: AppStrings.ToastType.error,
              message: resp?.message,
            })
          );
        }
        dispatch(setIsLoader(false));
      });
    } catch (error) {
      console.log("error --->>>  ", error);
    }
  };

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <CustomHeader
        onPress={() => props?.navigation?.goBack()}
        title={isRtl ? "کیٹگری" : "Categories"}
        titleStyle={styles.heading}
        icon={[AppImages.Home.PlusBlack]}
        rightIconCont={{
          width: normalized(33),
          height: normalized(33),
          borderColor: AppColors.themeColor.dark,
          borderRadius: normalized(40),
          borderWidth: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: AppColors.themeColor.dark,
        }}
        rightIconStyle={{
          width: normalized(20),
          height: normalized(20),
          tintColor: AppColors.white.white,
        }}
        onRightIconPress={() => {
          props?.navigation?.navigate(Routes.Admin.AddCategory);
        }}
      />
      {categoryList?.length > 0 ? (
        <FlatList
          data={categoryList}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.contentCont}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.itemCont}
              activeOpacity={0.7}
              onPress={() => {
                props?.navigation?.navigate(Routes.Admin.AddCategory, {
                  item: item,
                });
              }}
            >
              <Text style={styles.itemTxt}>{item?.category}</Text>
              <View style={styles.divider} />
              <Text style={styles.itemTxt}>{item?.rtlCategory}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View
          style={{
            ...styles.emptyListCont,
            flexDirection: "row",
            justifyContent: isRtl ? "flex-start" : "flex-end",
          }}
        >
          <Text
            style={{
              ...styles.emptyTxt,
              fontSize: isRtl ? normalized(18) : normalized(14),
            }}
          >
            {isRtl
              ? "ابھی تک کوئی کیٹگری شامل نہیں کی گئی۔ نئی کیٹگری لسٹ شامل کرنے کے لیے بائیں کونے میں بٹن پر ٹیپ کریں۔"
              : "No Category added yet. Tap the button in the top right corner to add a new Category List."}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ManageCategories;

const styles = StyleSheet.create({
  heading: {
    fontSize: normalized(18),
    fontFamily: AppFonts.PoppinsSemiBold,
    alignSelf: "center",
    color: AppColors.black.black,
  },
  emptyListCont: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: AppHorizontalMargin,
  },
  emptyTxt: {
    textAlign: "center",
    fontFamily: AppFonts.PoppinsMedium,
    color: AppColors.black.black,
  },
  itemCont: {
    borderWidth: 2,
    borderColor: AppColors.themeColor.dark,
    borderRadius: normalized(8),
    // height: normalized(40),
    width: ScreenSize.width - normalized(15),
    justifyContent: "center",
    paddingHorizontal: normalized(10),
    paddingVertical: normalized(5),
  },
  itemTxt: {
    color: AppColors.black.black,
    fontSize: normalized(16),
    fontFamily: AppFonts.PoppinsMedium,
  },
  contentCont: {
    flex: 1,
    marginTop: normalized(20),
    alignItems: "center",
    gap: normalized(15),
  },
  divider: {
    width: normalized(100),
    height: 0.8,
    backgroundColor: AppColors.grey.greyLevel3,
    alignSelf: "center",
    marginVertical: normalized(5),
  },
});
