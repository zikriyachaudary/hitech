import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  AppImages,
  normalized,
  ScreenProps,
} from "../../../../Utils/AppConstants";
import FilledButton from "../../../Components/CustomButton/FilledButton";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import CommonDataManager from "../../../../Utils/CommonManager";
import {
  addCategoryReq,
  deleteCatReq,
  updateCategoryReq,
} from "../../../../Network/Services/GeneralServices";
import { useDispatch } from "react-redux";
import {
  setIsAlertShow,
  setIsLoader,
  setShowToast,
} from "../../../../Redux/Reducers/AppReducers";
import { AppStrings } from "../../../../Utils/AppStrings";

const AddCategoryScreen = (props: ScreenProps) => {
  const item = props?.route?.params?.item;
  const [category, setCategory] = useState<string | null>(
    item?.category || null
  );
  const [subCategories, setSubCategories] = useState<
    { id: string; name: string }[]
  >(item?.subCat || []);
  const dispatch = useDispatch();

  const addSubCategory = () => {
    const randId = CommonDataManager.getSharedInstance().makeid(6);
    setSubCategories([...subCategories, { id: randId, name: "" }]);
    setRtlSubCategories([...rtlSubCategories, { id: randId, name: "" }]);
  };

  const updateSubCategory = (id: string, value: string) => {
    setSubCategories(
      subCategories.map((subCat) =>
        subCat.id === id ? { ...subCat, name: value } : subCat
      )
    );
  };
  const updateRtlSubCategory = (id: string, value: string) => {
    setRtlSubCategories(
      rtlSubCategories.map((subCat) =>
        subCat.id === id ? { ...subCat, name: value } : subCat
      )
    );
  };

  const removeSubCategory = (id: string) => {
    setSubCategories(subCategories.filter((subCat) => subCat.id !== id));
    setRtlSubCategories(rtlSubCategories.filter((subCat) => subCat.id !== id));
  };

  const handlePublish = () => {
    let isFormValid = true;
    if (category?.trimEnd() == "") isFormValid = false;
    if (subCategories.every((sub) => sub?.name?.trim() == ""))
      isFormValid = false;
    if (subCategories?.length == 0) isFormValid = false;
    if (RtlCategory?.trimEnd() == "") isFormValid = false;
    if (rtlSubCategories.every((sub) => sub?.name?.trim() == ""))
      isFormValid = false;
    if (rtlSubCategories?.length == 0) isFormValid = false;
    if (!isFormValid) {
      dispatch(
        setIsAlertShow({
          value: true,
          message: "Please enter at least one sub-category in English or Urdu.",
        })
      );
      return;
    }

    const data = {
      category: category,
      id: item?.id || CommonDataManager.getSharedInstance().makeid(6),
      subCat: subCategories.filter((sub) => sub.name.trim() !== ""),
      rtlCategory: RtlCategory,
      rtlSubCat: rtlSubCategories.filter((sub) => sub.name.trim() !== ""),
    };
    dispatch(setIsLoader(true));
    if (item?.category) {
      updateCategoryReq(data, (resp: any) => {
        if (resp?.status) {
          dispatch(
            setShowToast({
              type: AppStrings.ToastType.success,
              message: resp?.message,
            })
          );
          props?.navigation?.goBack();
        } else {
          dispatch(
            setShowToast({
              type: AppStrings.ToastType.success,
              message: resp?.message,
            })
          );
        }
        dispatch(setIsLoader(false));
      });
    } else {
      addCategoryReq(data, (resp: any) => {
        if (resp?.status) {
          dispatch(
            setShowToast({
              type: AppStrings.ToastType.success,
              message: resp?.message,
            })
          );
          props?.navigation?.goBack();
        } else {
          dispatch(
            setShowToast({
              type: AppStrings.ToastType.success,
              message: resp?.message,
            })
          );
        }
        dispatch(setIsLoader(false));
      });
    }
  };
  const deleteCat = async () => {
    dispatch(setIsLoader(true));
    await deleteCatReq(item?.id, (resp: any) => {
      if (resp?.status) {
        dispatch(
          setShowToast({
            type: AppStrings.ToastType.success,
            message: resp?.message,
          })
        );
        props?.navigation?.goBack();
        dispatch(setIsLoader(false));
      } else {
        dispatch(
          setShowToast({
            type: AppStrings.ToastType.error,
            message: AppStrings.Network.tryAgainLater,
          })
        );
        dispatch(setIsLoader(false));
      }
    });
  };

  ////////////////////////////////////////////////// ---> urdu stats

  const [RtlCategory, setRtlCategory] = useState<string | null>(
    item?.rtlCategory || null
  );
  const [rtlSubCategories, setRtlSubCategories] = useState<
    { id: string; name: string }[]
  >(item?.rtlSubCat || []);

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <CustomHeader
        Text={"Add Category"}
        onPress={() => props?.navigation?.goBack()}
        rightIconCont={{
          width: normalized(33),
          height: normalized(33),
          borderColor: AppColors.red.dark,
          borderRadius: normalized(40),
          borderWidth: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: AppColors.white.white,
        }}
        rightIconStyle={{
          width: normalized(20),
          height: normalized(20),
          tintColor: AppColors.red.dark,
        }}
        {...(item && {
          icon: [AppImages.Products.delete],
          onRightIconPress: () => deleteCat(),
        })}
      />
      <ScrollView
        style={{ marginHorizontal: AppHorizontalMargin }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ height: normalized(20) }} />

        {/* Category Input */}
        <Text style={styles.heading}>Category Name</Text>
        <CustomInput value={category} setValue={setCategory} />
        <View style={{ height: normalized(10) }} />
        <Text
          style={{
            ...styles.heading,
            alignSelf: "flex-end",
            paddingRight: normalized(15),
          }}
        >
          کیٹگری کا نام
        </Text>
        <CustomInput
          isRtl={true}
          value={RtlCategory}
          setValue={setRtlCategory}
        />

        {/* Sub-Category Inputs */}

        {subCategories.map((sub, index) => (
          <View key={sub.id} style={{ marginTop: normalized(10) }}>
            <Text style={styles.heading}>Sub-Category {index + 1}</Text>
            <View style={styles.subCatCont}>
              <View style={{ flex: 1 }}>
                <CustomInput
                  value={sub.name}
                  setValue={(val: string) => updateSubCategory(sub.id, val)}
                />
              </View>
              <TouchableOpacity
                style={styles.closeImgCont}
                onPress={() => removeSubCategory(sub.id)}
              >
                <Image source={AppImages.Home.close} style={styles.closeImg} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {rtlSubCategories.map((sub, index) => (
          <View key={sub.id} style={{ marginTop: normalized(10) }}>
            <Text style={{ ...styles.heading, alignSelf: "flex-end" }}>
              سبکیٹگری کا نام {"  "}
              {index + 1}{" "}
            </Text>
            <View
              style={{ ...styles.subCatCont, flexDirection: "row-reverse" }}
            >
              <View style={{ flex: 1 }}>
                <CustomInput
                  isRtl={true}
                  value={sub.name}
                  setValue={(val: string) => updateRtlSubCategory(sub.id, val)}
                />
              </View>
              <TouchableOpacity
                style={styles.closeImgCont}
                onPress={() => removeSubCategory(sub.id)}
              >
                <Image source={AppImages.Home.close} style={styles.closeImg} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.addButton}
          onPress={addSubCategory}
        >
          <Text style={styles.addButtonText}>+ Add Sub-Category</Text>
        </TouchableOpacity>

        <FilledButton
          label={item ? "Update " : "Publish"}
          onPress={handlePublish}
        />
      </ScrollView>
    </View>
  );
};

export default AddCategoryScreen;

const styles = StyleSheet.create({
  heading: {
    fontSize: normalized(14),
    fontFamily: AppFonts.PoppinsMedium,
    color: AppColors.black.black,
    marginBottom: normalized(10),
  },
  addButton: {
    marginTop: normalized(10),
    padding: normalized(10),
    backgroundColor: AppColors.themeColor.dark,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: normalized(14),
    fontFamily: AppFonts.PoppinsMedium,
  },
  closeImg: {
    width: normalized(14),
    height: normalized(14),
    resizeMode: "contain",
    tintColor: AppColors.red.dark,
  },
  closeImgCont: {
    width: normalized(26),
    height: normalized(26),
    borderRadius: normalized(30),
    borderWidth: 1,
    borderColor: AppColors.red.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  subCatCont: {
    flexDirection: "row",
    gap: normalized(10),
    alignItems: "center",
  },
});
