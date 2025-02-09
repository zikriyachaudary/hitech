import {
  FlatList,
  Image,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
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
import AddressItem from "../Components/AddressItem";
import { Routes } from "../../../../Utils/Routes";
import { useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";

const DeliveryAddressScreen = (props: ScreenProps) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const userData = selector?.userData || null;

  const [addressList, setAddressList] = useState([]);
  const changeDefaultAddress = (index: number) => {
    const updatedList = addressList.map((item: any, i: any) => ({
      ...item,
      isDefault: i === index,
    }));
    setAddressList(updatedList);
  };

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <CustomHeader
        onPress={() => props?.navigation?.goBack()}
        title={"Delivery Address"}
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
                  changeDefaultAddress(index);
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
          <Text style={styles.emptyTxt}>
            No address added yet. Tap the button in the top right corner to add
            a new address and complete the required details.
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
