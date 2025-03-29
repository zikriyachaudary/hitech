import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  AppImages,
  normalized,
  ScreenProps,
} from "../../../../Utils/AppConstants";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import FilledButton from "../../../Components/CustomButton/FilledButton";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import {
  setIsLoader,
  setShowToast,
  setUserData,
} from "../../../../Redux/Reducers/AppReducers";
import { AppStrings } from "../../../../Utils/AppStrings";
import CommonDataManager from "../../../../Utils/CommonManager";
import {
  addAddressReq,
  deleteAddressReq,
} from "../../../../Network/Services/AddressServices";

const UpdateDeliveryScreen = (props: ScreenProps) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;
  const dispatch = useDispatch();

  const item = props?.route?.params?.item;
  const [house, setHouse] = useState<any>(item?.house || "");
  const [street, setStreet] = useState<any>(item?.street || "");
  const [area, setArea] = useState<any>(item?.area || "");
  const [city, setCity] = useState<any>(item?.city || "");
  const [completeAddress, setCompleteAddress] = useState<any>(
    item?.address || ""
  );

  ///////  Ref
  const streetRef = useRef();
  const areaRef = useRef();
  const cityRef = useRef();
  const addressRef = useRef();

  ///////  Error ----->
  const [houseError, setHouseError] = useState("");
  const [streetError, setStreetError] = useState("");
  const [areaError, setAreaError] = useState("");
  const [cityError, setCityError] = useState("");
  const [addressError, setAddressError] = useState("");

  ////////////////////////

  const focusNextField = (inputRef: any) => {
    if (inputRef?.current) {
      inputRef?.current?.focus();
    }
  };

  const onAddAddress = async () => {
    let isFormValid = true;

    if (!house) {
      setHouseError(isRtl ? "مکان نمبر درج کریں۔" : "Enter House No.");
      isFormValid = false;
    }
    if (!street) {
      setStreetError(isRtl ? "گلی نمبر درج کریں۔" : "Enter Street No.");
      isFormValid = false;
    }
    if (!area) {
      setAreaError(isRtl ? "اپنا علاقہ درج کریں۔" : "Enter your area");
      isFormValid = false;
    }
    if (!city) {
      setCityError(isRtl ? "اپنا شہر درج کریں۔" : "Enter your City");
      isFormValid = false;
    }
    if (!completeAddress) {
      setAddressError(
        isRtl ? "اپنا مکمل پتہ درج کریں۔" : "Enter your Complete Address"
      );
      isFormValid = false;
    }
    if (!isFormValid) {
      return;
    }
    dispatch(setIsLoader(true));
    const address = {
      house: house,
      street: street,
      area: area,
      city: city,
      address: completeAddress,
      id: item ? item?.id : CommonDataManager.getSharedInstance().makeid(6),
    };
    addAddressReq(
      selector?.userData?.userId,
      address,
      item ? true : false,
      (resp: any) => {
        if (resp?.status) {
          dispatch(
            setShowToast({
              type: AppStrings.ToastType.success,
              message: item ? "Address Updated" : "Address Added",
            })
          );
          console.log("resp --->>>  ", resp);
          props?.navigation?.goBack();
          dispatch(setIsLoader(false));
        } else {
          dispatch(
            setShowToast({
              type: AppStrings.ToastType.error,
              message: resp?.message,
            })
          );
          dispatch(setIsLoader(false));
        }
      }
    );
  };

  const onDeleteAdd = async () => {
    dispatch(setIsLoader(true));
    deleteAddressReq(selector?.userData?.userId, item?.id, (resp: any) => {
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
            message: resp?.message,
          })
        );
        dispatch(setIsLoader(false));
      }
    });
  };

  return (
    <View
      style={{
        ...AppStyles.MainStyle,
      }}
    >
      <SafeAreaView />
      <CustomHeader
        onPress={() => props?.navigation?.goBack()}
        title={
          item
            ? isRtl
              ? "ڈلیوری ایڈریس اپ ڈیٹ کریں"
              : "Update Delivery Address"
            : isRtl
            ? "ڈلیوری ایڈریس شامل کریں"
            : "Add Delivery Address"
        }
        {...(item
          ? {
              icon: [AppImages.Products.delete],
              onRightIconPress: () => {
                // Handle delete action here
              },
              rightIconCont: {
                // backgroundColor: "green",
              },
            }
          : {})}
        onRightIconPress={() => onDeleteAdd()}
      />

      <ScrollView style={styles.mainCont}>
        <View style={{ height: normalized(20) }} />
        <Text style={[styles.head, { textAlign: isRtl ? "right" : "left" }]}>
          {isRtl ? "مکان نمبر" : "House Number"}
        </Text>
        <CustomInput
          onSubmitEditing={() => focusNextField(streetRef)}
          placeHolderColor={AppColors.grey.greyLevel4}
          setValue={(val: string) => {
            setHouse(val);
            setHouseError("");
          }}
          keyboardType={"default"}
          value={house}
          errorMsg={houseError}
        />

        <Text style={[styles.head, { textAlign: isRtl ? "right" : "left" }]}>
          {isRtl ? "گلی نمبر" : "Street Number"}
        </Text>
        <CustomInput
          onSubmitEditing={() => focusNextField(areaRef)}
          placeHolderColor={AppColors.grey.greyLevel4}
          setValue={(val: string) => {
            setStreet(val);
            setStreetError("");
          }}
          keyboardType={"default"}
          value={street}
          errorMsg={streetError}
        />

        <Text style={[styles.head, { textAlign: isRtl ? "right" : "left" }]}>
          {isRtl ? "علاقہ" : "Area"}
        </Text>
        <CustomInput
          onSubmitEditing={() => focusNextField(cityRef)}
          placeHolderColor={AppColors.grey.greyLevel4}
          setValue={(val: string) => {
            setArea(val);
            setAreaError("");
          }}
          keyboardType={"default"}
          value={area}
          errorMsg={areaError}
        />

        <Text style={[styles.head, { textAlign: isRtl ? "right" : "left" }]}>
          {isRtl ? "شہر" : "City"}
        </Text>
        <CustomInput
          onSubmitEditing={() => focusNextField(addressRef)}
          placeHolderColor={AppColors.grey.greyLevel4}
          setValue={(val: string) => {
            setCity(val);
            setCityError("");
          }}
          keyboardType={"default"}
          value={city}
          errorMsg={cityError}
        />

        <Text style={[styles.head, { textAlign: isRtl ? "right" : "left" }]}>
          {isRtl ? "مکمل پتہ" : "Complete Address"}
        </Text>
        <CustomInput
          placeHolderColor={AppColors.grey.greyLevel4}
          setValue={(val: string) => {
            setCompleteAddress(val);
            setAddressError("");
          }}
          keyboardType={"default"}
          value={completeAddress}
          container={{ height: normalized(120) }}
          isMultiLine={true}
          textInputStyle={{
            textAlignVertical: "top",
            height: normalized(120),
            textAlign: isRtl ? "right" : "left",
          }}
          maxLength={1000}
          errorMsg={addressError}
        />

        <FilledButton
          onPress={() => onAddAddress()}
          label={
            isRtl
              ? item
                ? "پتہ اپ ڈیٹ کریں"
                : "پتہ شامل کریں"
              : item
              ? "Update Address"
              : "Add Address"
          }
        />
      </ScrollView>
    </View>
  );
};

export default UpdateDeliveryScreen;

const styles = StyleSheet.create({
  mainCont: {
    paddingHorizontal: AppHorizontalMargin,
  },
  head: {
    fontSize: normalized(16),
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsMedium,
    marginVertical: normalized(10),
  },
});
