import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  AppColors,
  AppFonts,
  AppImages,
  normalized,
  ScreenSize,
} from "../../../../Utils/AppConstants";
import FilledButton from "../../../Components/CustomButton/FilledButton";
import { Dropdown } from "react-native-element-dropdown";

const CategoryModal = (props: any) => {
  const data = [
    { label: "Item 1", value: "1" },
    { label: "Item 2", value: "2" },
    { label: "Item 3", value: "3" },
    { label: "Item 4", value: "4" },
    { label: "Item 5", value: "5" },
    { label: "Item 6", value: "6" },
    { label: "Item 7", value: "7" },
    { label: "Item 8", value: "8" },
  ];

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.outerContainer}>
        <View style={styles.transparentBg} />
        <View style={styles.innerCont}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.closeCont}
            onPress={() => props?.onClose()}
          >
            <Image source={AppImages.Home.close} style={styles.close} />
          </TouchableOpacity>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            containerStyle={{
              borderRadius: normalized(20),
            }}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            showsVerticalScrollIndicator={false}
            iconStyle={styles.iconStyle}
            data={data}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Select Category" : "..."}
            searchPlaceholder="Search..."
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setValue(item.value);
              setIsFocus(false);
            }}
          />

          <Dropdown
            style={[styles.subdropdown, isFocus && { borderColor: "blue" }]}
            containerStyle={{
              borderRadius: normalized(20),
            }}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            showsVerticalScrollIndicator={false}
            iconStyle={styles.iconStyle}
            data={data}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Select Sub-Category" : "..."}
            searchPlaceholder="Search..."
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setValue(item.value);
              setIsFocus(false);
            }}
          />

          <View style={styles.btnCont}>
            <FilledButton
              label={"Apply"}
              isDisable={true}
              mainContainer={{
                width: normalized(120),
              }}
              onPress={() => {
                props?.onClose();
              }}
            />

            <FilledButton
              label={"Clear Filter"}
              mainContainer={{
                width: normalized(120),
              }}
              onPress={() => {
                props?.onClose();
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CategoryModal;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: "center",
  },
  transparentBg: {
    backgroundColor: "rgba(0,0,0,0.4)",
    ...StyleSheet.absoluteFillObject,
  },
  innerCont: {
    backgroundColor: AppColors.white.white,
    width: "90%",
    borderRadius: normalized(20),
    alignSelf: "center",
  },

  dropdown: {
    height: normalized(50),
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: normalized(10),
    paddingHorizontal: normalized(10),
    marginVertical: normalized(20),
    marginHorizontal: normalized(20),
    marginTop: normalized(60),
  },
  subdropdown: {
    height: normalized(50),
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: normalized(10),
    paddingHorizontal: normalized(10),
    marginVertical: normalized(20),
    marginHorizontal: normalized(20),
  },
  placeholderStyle: {
    fontSize: normalized(16),
    fontFamily: AppFonts.PoppinsRegular,
  },
  selectedTextStyle: {
    fontSize: normalized(14),
    fontFamily: AppFonts.PoppinsRegular,
  },
  iconStyle: {
    width: normalized(30),
    height: normalized(30),
    tintColor: AppColors.black.black,
  },
  inputSearchStyle: {
    height: normalized(45),
    fontSize: normalized(14),
    borderRadius: normalized(8),
  },
  btnCont: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  close: {
    width: normalized(17),
    height: normalized(17),
    resizeMode: "contain",
    tintColor: AppColors.themeColor.dark,
  },
  closeCont: {
    width: normalized(35),
    height: normalized(35),
    borderWidth: 1,
    borderColor: AppColors.themeColor.dark,
    borderRadius: normalized(35 / 2),
    alignItems: "center",
    justifyContent: "center",
    padding: normalized(5),
    left: normalized(10),
    top: normalized(10),
    position: "absolute",
  },
});
