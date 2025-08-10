import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
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
import { useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import FilledButton from "../../../Components/CustomButton/FilledButton";
import PaymentMethodModal from "../Components/PaymentMethodModal";
import { Routes } from "../../../../Utils/Routes";

const DeliveryScreen = (props: ScreenProps) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const userData = selector?.userData;
  const deliveryDetails = selector?.userData?.deliveryDetails;
  const isRtl = selector?.isRtl;

  const [countryValues, setCountryValues] = useState<any>({
    code: "+92",
    flag: "pk",
    name: "Pakistan",
  });
  const [firstName, setFirstName] = useState<string>(
    deliveryDetails?.firstName ?? ""
  );
  const [lastName, setLastName] = useState<string>(
    deliveryDetails?.lastName ?? ""
  );
  const [address, setAddress] = useState(deliveryDetails?.address ?? "");
  const [city, setCity] = useState(deliveryDetails?.city ?? "");
  const [postalCode, setPostalCode] = useState(
    deliveryDetails?.postalCode ?? ""
  );
  const lastNameRef = useRef();
  const addressRef = useRef();
  const cityRef = useRef();
  const postalCodeRef = useRef();
  const [isChecked, setIsChecked] = useState(false);
  const [isShowPaymentModal, setIsShowPaymentModal] = useState(false);

  ///error------->
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [checkError, setCheckError] = useState<any>("");
  const [cityError, setCityError] = useState("");

  ////////

  const focusNextField = (inputRef: any) => {
    if (inputRef?.current) {
      inputRef?.current?.focus();
    }
  };

  const onNext = () => {
    let isFormValid = true;

    if (!firstName) {
      setFirstNameError("Please Enter first Name");
      isFormValid = false;
    }
    if (!lastName) {
      setLastNameError("Please Enter last Name");
      isFormValid = false;
    }
    if (!address) {
      setAddressError("Please Enter first Name");
      isFormValid = false;
    }
    if (!city) {
      setCityError("Please Enter last Name");
      isFormValid = false;
    }

    if (!isFormValid) {
      return;
    }

    setIsShowPaymentModal(true);
  };

  const onContinue = (paymentMethod: any) => {
    const payload = {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      postalCode: postalCode ? postalCode : "",
    };
    props?.navigation?.navigate(Routes.Home.PaymentMethodScreen, {
      deliveryDetails: payload,
      paymentMethod: paymentMethod,
      orderDetails: props?.route?.params?.orderDetails,
    });
  };

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <CustomHeader
        onPress={() => props?.navigation?.goBack()}
        Text={isRtl ? "ترسیل" : "Delivery"}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, marginHorizontal: AppHorizontalMargin }}
      >
        <View style={{ marginTop: normalized(10) }} />

        <View
          style={[
            styles.topContainer,
            {
              flexDirection: isRtl ? "row-reverse" : "row",
            },
          ]}
        >
          <View style={styles.inputCont}>
            <Text
              style={[
                styles.inputText,
                { textAlign: isRtl ? "right" : "left" },
              ]}
            >
              {isRtl ? "پہلا نام" : "First Name"}
            </Text>
            <CustomInput
              onSubmitEditing={() => focusNextField(lastNameRef)}
              placeHold={isRtl ? "پہلا نام" : "First Name"}
              placeHolderColor={AppColors.grey.greyLevel4}
              value={firstName}
              setValue={(val: string) => {
                setFirstName(val);
                setFirstNameError("");
              }}
              keyboardType="default"
              errorMsg={firstNameError}
            />
          </View>
          <View style={styles.inputCont}>
            <Text
              style={[
                styles.inputText,
                { textAlign: isRtl ? "right" : "left" },
              ]}
            >
              {isRtl ? "آخری نام" : "Last Name"}
            </Text>
            <CustomInput
              ref={lastNameRef}
              onSubmitEditing={() => focusNextField(addressRef)}
              placeHold={isRtl ? "آخری نام" : "Last Name"}
              placeHolderColor={AppColors.grey.greyLevel4}
              value={lastName}
              setValue={(val: string) => {
                setLastName(val);
                setLastNameError("");
              }}
              keyboardType="default"
              errorMsg={lastNameError}
            />
          </View>
        </View>

        <View style={styles.inputCont}>
          <Text
            style={[styles.inputText, { textAlign: isRtl ? "right" : "left" }]}
          >
            {isRtl ? "ای میل" : "Email"}
          </Text>
          <CustomInput
            placeHold={isRtl ? "ای میل پتہ" : "Email Address"}
            placeHolderColor={AppColors.grey.greyLevel4}
            value={userData?.email}
            isEditable={false}
            keyboardType="default"
          />
        </View>

        <View style={styles.inputCont}>
          <Text
            style={[styles.inputText, { textAlign: isRtl ? "right" : "left" }]}
          >
            {isRtl ? "پتہ" : "Address"}
          </Text>
          <CustomInput
            ref={addressRef}
            onSubmitEditing={() => focusNextField(cityRef)}
            placeHold={isRtl ? "ترسیل کا پتہ" : "Delivery Address"}
            placeHolderColor={AppColors.grey.greyLevel4}
            isMultiLine={true}
            value={address}
            setValue={(val: string) => {
              setAddress(val);
              setAddressError("");
            }}
            keyboardType="default"
            errorMsg={addressError}
          />
        </View>

        <View style={styles.topContainer}>
          <View style={styles.inputCont}>
            <Text
              style={[
                styles.inputText,
                { textAlign: isRtl ? "right" : "left" },
              ]}
            >
              {isRtl ? "شہر" : "City"}
            </Text>
            <CustomInput
              onSubmitEditing={() => focusNextField(postalCodeRef)}
              placeHold={isRtl ? "شہر کا نام" : "City Name"}
              placeHolderColor={AppColors.grey.greyLevel4}
              value={city}
              setValue={(val: string) => {
                setCity(val);
                setCityError("");
              }}
              keyboardType="default"
              errorMsg={cityError}
            />
          </View>

          <View style={styles.inputCont}>
            <Text
              style={[
                styles.inputText,
                { textAlign: isRtl ? "right" : "left" },
              ]}
            >
              {isRtl ? "ڈاک کا کوڈ (اختیاری)" : "Postal Code (Optional)"}
            </Text>
            <CustomInput
              ref={postalCodeRef}
              placeHold={isRtl ? "ڈاک کوڈ" : "Postal Code"}
              placeHolderColor={AppColors.grey.greyLevel4}
              value={postalCode}
              setValue={(val: string) => {
                setPostalCode(val);
              }}
              keyboardType="default"
            />
          </View>
        </View>

        <View style={styles.inputCont}>
          <Text
            style={[styles.inputText, { textAlign: isRtl ? "right" : "left" }]}
          >
            {isRtl ? "ملک / علاقہ" : "Country / Region"}
          </Text>
          <CustomInput
            placeHold=""
            placeHolderColor={AppColors.grey.greyLevel4}
            value="Pakistan"
            isEditable={false}
            keyboardType="default"
          />
        </View>

        <View
          style={[
            styles.termCont,
            {
              flexDirection: isRtl ? "row-reverse" : "row",
            },
          ]}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              setIsChecked(!isChecked);
              setCheckError("");
            }}
          >
            <View
              style={{
                ...styles.checkCont,
                borderColor: AppColors.grey.greyLevel9,
                backgroundColor: checkError
                  ? AppColors.red.pink
                  : AppColors.white.white,
              }}
            >
              {isChecked && (
                <Image
                  source={AppImages.Home.tick}
                  resizeMode="contain"
                  style={{
                    height: normalized(12),
                    width: normalized(12),
                  }}
                  tintColor={AppColors.themeColor.dark}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
          <Text
            style={[styles.termsTxt, { textAlign: isRtl ? "right" : "left" }]}
          >
            {isRtl
              ? "اگلی بار کے لیے یہ معلومات محفوظ کریں۔"
              : "Save this information for next time."}
          </Text>
        </View>

        <FilledButton
          label={isRtl ? "اگلا" : "Next"}
          onPress={() => {
            onNext();
          }}
        />
      </ScrollView>

      <PaymentMethodModal
        isVisible={isShowPaymentModal}
        onClose={() => {
          setIsShowPaymentModal(false);
        }}
        onContinue={(val: any) => {
          setIsShowPaymentModal(false);
          setTimeout(() => {
            onContinue(val);
          }, 400);
        }}
      />
    </View>
  );
};

export default DeliveryScreen;

const styles = StyleSheet.create({
  inputText: {
    fontSize: normalized(14),
    color: AppColors.black.Level7,
    marginBottom: normalized(5),
    fontFamily: AppFonts.PoppinsSemiBold,
    fontWeight: "500",
  },
  topContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
  },
  inputCont: {
    marginTop: normalized(10),
    flex: 1,
  },
  termCont: {
    marginTop: normalized(20),
    alignItems: "center",
    gap: normalized(10),
  },
  checkCont: {
    borderRadius: normalized(5),
    height: normalized(20),
    width: normalized(20),
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  termsTxt: {
    fontSize: normalized(14),
    color: AppColors.black.black,
    marginStart: normalized(10),
  },
});
