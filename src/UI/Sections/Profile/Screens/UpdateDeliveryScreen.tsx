import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  normalized,
  ScreenProps,
} from "../../../../Utils/AppConstants";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import FilledButton from "../../../Components/CustomButton/FilledButton";

const UpdateDeliveryScreen = (props: ScreenProps) => {
  const item = props?.route?.params?.item;
  const [house, setHouse] = useState<any>(item?.house || "");
  const [street, setStreet] = useState<any>(item?.street || "");
  const [area, setArea] = useState<any>(item?.Area || "");
  const [city, setCity] = useState<any>(item?.City || "");
  const [completeAddress, setCompleteAddress] = useState<any>(
    item?.general || ""
  );

  const focusNextField = (inputRef: any) => {
    if (inputRef?.current) {
      inputRef?.current?.focus();
    }
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
        title={"Update Delivery Address"}
      />
      <ScrollView style={styles.mainCont}>
        <View style={{ height: normalized(20) }} />
        <Text style={styles.head}>House Number</Text>
        <CustomInput
          //   onSubmitEditing={() => focusNextField()}
          placeHolderColor={AppColors.grey.greyLevel4}
          setValue={(val: string) => {
            setHouse(val);
          }}
          keyboardType={"default"}
          value={house}
        />
        <Text style={styles.head}>Street Number</Text>
        <CustomInput
          //   onSubmitEditing={() => focusNextField()}
          placeHolderColor={AppColors.grey.greyLevel4}
          setValue={(val: string) => {
            setStreet(val);
          }}
          keyboardType={"default"}
          value={street}
        />

        <Text style={styles.head}>Area</Text>
        <CustomInput
          //   onSubmitEditing={() => focusNextField()}
          placeHolderColor={AppColors.grey.greyLevel4}
          setValue={(val: string) => {
            setHouse(val);
          }}
          keyboardType={"default"}
          value={area}
        />

        <Text style={styles.head}>City</Text>
        <CustomInput
          //   onSubmitEditing={() => focusNextField()}
          placeHolderColor={AppColors.grey.greyLevel4}
          setValue={(val: string) => {
            setCity(val);
          }}
          keyboardType={"default"}
          value={city}
        />

        <Text style={styles.head}>Complete Address</Text>
        <CustomInput
          //   onSubmitEditing={() => focusNextField()}
          placeHolderColor={AppColors.grey.greyLevel4}
          setValue={(val: string) => {
            setCompleteAddress(val);
          }}
          keyboardType={"default"}
          value={completeAddress}
        />

        <FilledButton label={"Update Address"} />
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
