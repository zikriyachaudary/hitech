import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Modal from "react-native-modal";
import {
  AppColors,
  AppImages,
  normalized,
  ScreenSize,
} from "../../../../Utils/AppConstants";
import { useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import FilledButton from "../../../Components/CustomButton/FilledButton";

const PaymentMethodModal = (props: any) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;
  const [selectedType, setSelectedType] = useState<any>({});
  const list = [
    {
      id: 1,
      name: "JazzCash",
      urdu: "جاز کیش",
      image: AppImages.payments.jazzcash,
    },
    {
      id: 2,
      name: "EasyPaisa",
      urdu: "ایزی پیسہ",
      image: AppImages.payments.easypaisa,
    },
    {
      id: 3,
      name: "Credit / Debit Card",
      urdu: "کریڈٹ / ڈیبٹ کارڈ",
      image: AppImages.payments.card,
    },
  ];

  return (
    <Modal
      onBackdropPress={() => props?.onClose()}
      onBackButtonPress={() => props?.onClose()}
      isVisible={props?.isVisible}
      swipeDirection="down"
      scrollOffset={25}
      onSwipeComplete={() => {
        props?.onClose();
      }}
      animationIn="bounceInUp"
      animationOut="bounceOutDown"
      animationInTiming={900}
      animationOutTiming={500}
      backdropTransitionInTiming={1000}
      backdropTransitionOutTiming={500}
      style={{
        justifyContent: "flex-end",
        margin: 0,
        alignItems: "center",
        width: "100%",
        paddingTop: "50%",
      }}
      scrollOffsetMax={ScreenSize.height * 0.8}
      propagateSwipe={true}
    >
      <View style={styles.mainCont}>
        <View style={styles.bar} />
        <View
          style={[
            styles.paymentMethods,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          {list?.map((item, index) => {
            const isSelected = item?.id == selectedType?.id;
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedType(item);
                }}
                style={[
                  styles.methodItemCont,
                  {
                    borderColor: isSelected
                      ? AppColors.green.dark
                      : AppColors.grey.greyLevel0,
                    backgroundColor: isSelected
                      ? AppColors.green.light
                      : AppColors.white.white,
                  },
                ]}
              >
                <Image source={item?.image} style={styles.bankImg} />
                <Text>{isRtl ? item?.urdu : item?.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FilledButton
          label={isRtl ? "جاری رکھیں" : "Continue"}
          isDisable={selectedType ? false : true}
          onPress={() => {
            console.log("selectedType --->>>   ", selectedType);

            props?.onContinue(selectedType);
            setSelectedType(null);
          }}
        />
      </View>
    </Modal>
  );
};

export default PaymentMethodModal;

const styles = StyleSheet.create({
  mainCont: {
    backgroundColor: AppColors.white.white,
    borderTopLeftRadius: normalized(20),
    borderTopRightRadius: normalized(20),
    width: "100%",
    paddingVertical: normalized(10),
  },
  bar: {
    height: normalized(8),
    width: normalized(40),
    alignSelf: "center",
    marginBottom: normalized(5),
    backgroundColor: AppColors.themeColor.dark,
    borderRadius: normalized(50),
  },
  paymentMethods: {
    alignItems: "center",
    justifyContent: "center",
    gap: normalized(15),
    marginVertical: normalized(15),
    flexWrap: "wrap",
  },
  methodItemCont: {
    borderRadius: normalized(10),
    borderWidth: 2,
    backgroundColor: AppColors.white.white,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: normalized(10),
    paddingVertical: normalized(10),
  },
  bankImg: {
    width: normalized(35),
    height: normalized(35),
    resizeMode: "contain",
    margin: normalized(8),
  },
});
