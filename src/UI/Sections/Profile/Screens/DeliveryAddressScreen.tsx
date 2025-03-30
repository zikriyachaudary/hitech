import {
  FlatList,
  Image,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
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
import AddressItem from "../Components/AddressItem";
import { Routes } from "../../../../Utils/Routes";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import { useIsFocused } from "@react-navigation/native";
import {
  addAddressReq,
  fetchAddressReq,
} from "../../../../Network/Services/AddressServices";
import { setIsLoader } from "../../../../Redux/Reducers/AppReducers";

const DeliveryAddressScreen = (props: ScreenProps) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;
  const userData = selector?.userData;

  const dispatch = useDispatch();
  const [addressList, setAddressList] = useState([]);

  const changeDefaultAddress = async (index: number, item: any) => {
    dispatch(setIsLoader(true));

    const updatedList = addressList.map((item: any, i: any) => ({
      ...item,
      isDefault: i === index,
    }));

    addressList.map(
      async (item: any, i: any) =>
        await addAddressReq(
          userData?.userId,
          { ...item, isDefault: i == index },
          true,
          (resp: any) => {}
        )
    );

    setAddressList(updatedList);
    dispatch(setIsLoader(false));
  };

  const isFocused = useIsFocused();

  const fetchAddress = async () => {
    addressList?.length == 0 && dispatch(setIsLoader(true));
    await fetchAddressReq(userData?.userId, (resp: any) => {
      if (resp?.status) {
        setAddressList(resp?.data);
      } else {
        setAddressList([]);
      }
    });
    dispatch(setIsLoader(false));
  };

  useEffect(() => {
    if (isFocused) {
      fetchAddress();
    }
  }, [isFocused]);

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <CustomHeader
        onPress={() => props?.navigation?.goBack()}
        title={isRtl ? "ڈلیوری ایڈریس" : "Delivery Address"}
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
          props?.navigation?.navigate(Routes.Home.UpdateDelivery);
        }}
      />
      {addressList?.length > 0 ? (
        <FlatList
          data={addressList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: normalized(40) }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <AddressItem
                item={item}
                changeDefaultAddress={() => {
                  if (props?.route?.params?.fromCartScreen) {
                    props?.navigation?.navigate(Routes.Home.cartScreen, {
                      address: item,
                    });
                  } else {
                    changeDefaultAddress(index, item);
                  }
                }}
                onEdit={(item: any) => {
                  props?.navigation?.navigate(Routes.Home.UpdateDelivery, {
                    item: item,
                  });
                }}
              />
            );
          }}
        />
      ) : (
        <View style={styles.emptyListCont}>
          <Text style={[styles.emptyTxt]}>
            {isRtl
              ? "ابھی تک کوئی پتہ شامل نہیں کیا گیا۔ نیا پتہ شامل کرنے اور مطلوبہ تفصیلات مکمل کرنے کے لیے اوپر بائیں کونے میں موجود بٹن کو دبائیں۔"
              : "No address added yet. Tap the button in the top right corner to add a new address and complete the required details."}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyListCont: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: AppHorizontalMargin,
  },
  emptyTxt: {
    textAlign: "center",
    fontSize: normalized(14),
    fontFamily: AppFonts.PoppinsMedium,
    color: AppColors.black.black,
  },
});

export default DeliveryAddressScreen;
